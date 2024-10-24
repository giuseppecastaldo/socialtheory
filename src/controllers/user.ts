'use server'

import PasswordValidator from 'password-validator';
import prisma from "@/libs/prisma";
import { hashSync } from "bcryptjs";
import { z } from 'zod';
import {uploadFile} from "@/libs/s3";
import {randomUUID} from "node:crypto";

const passwordSchema = new PasswordValidator();
passwordSchema
    .is().min(8)
    .is().max(100)
    .has().uppercase()
    .has().lowercase()
    .has().digits()
    .has().not().spaces()
    .has().symbols();

const createUserSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string(),
    password2: z.string(),
}).refine(data => data.password === data.password2, {
    message: "Passwords do not match",
    path: ["password2"],
});

export async function createUser(name: string, email: string, password: string, password2: string) {
    const validationResult = createUserSchema.safeParse({ name, email, password, password2 });
    if (!validationResult.success) {
        return {
            error: validationResult.error.errors.map(err => err.message).join(', '),
        };
    }

    if (!passwordSchema.validate(password)) {
        return {
            error: 'Password does not meet the requirements: at least 8 characters long, no more than 100 characters, at least one uppercase letter, one lowercase letter, one digit, one symbol, and no spaces',
        };
    }

    try {
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashSync(password),
            },
            select: {
                id: true,
                name: true,
                email: true
            }
        });
        return { user };
    } catch (err) {
        return {
            error: 'An error occurred while creating the user',
        };
    }
}

export async function getUserByEmail(email: string | undefined | null) {
    return prisma.user.findUnique({
        where: {
            email: email as string
        },
        select: {
            id: true,
            name: true,
            email: true,
            image: true
        }
    });
}

export async function updateUser(id: string, name: string | null, email: string, image: string) {
    function decodeBase64ToBuffer(base64: string): Buffer {
        const matches = base64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
            throw new Error('Formato Base64 non valido');
        }

        return Buffer.from(matches[2], 'base64');
    }

    const imageBuffer = decodeBase64ToBuffer(image);


    const fileName = id + randomUUID() + '.jpg';
    await uploadFile(imageBuffer, 'image/jpeg', fileName);

    return prisma.user.update({
        where: {
            id
        },
        data: {
            name,
            email,
            image: process.env.R2_PUBLIC_ENDPOINT + fileName
        },
        select: {
            id: true,
            name: true,
            email: true,
            image: true
        }
    });
}