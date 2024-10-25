'use server'

import PasswordValidator from 'password-validator';
import prisma from "@/libs/prisma";
import {compareSync, hashSync} from "bcryptjs";
import {z} from 'zod';
import {uploadFile} from "@/libs/s3";
import {randomUUID} from "node:crypto";
import {getTranslations} from 'next-intl/server';

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
    name: z.string().min(1, 'nameRequired'),
    email: z.string().email('invalidEmail'),
    password: z.string(),
    password2: z.string(),
}).refine(data => data.password === data.password2, {
    message: 'passwordsDoNotMatch',
    path: ["password2"],
});

export async function createUser(name: string, email: string, password: string, password2: string) {
    const t = await getTranslations('Profile');

    const validationResult = createUserSchema.safeParse({name, email, password, password2});
    if (!validationResult.success) {
        return {
            error: validationResult.error.errors.map(err => t(err.message)).join(', '),
        };
    }

    if (!passwordSchema.validate(password)) {
        return {
            error: t('passwordRequirements'),
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
        return {user};
    } catch (err) {
        return {
            error: t('userCreationError'),
        };
    }
}

export async function getUserById(id: string) {
    return prisma.user.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            name: true,
            email: true,
            image: true
        }
    });
}

export async function updateUser(id: string, name: string | null, email: string, image: string | null) {
    const t = await getTranslations('Profile');

    function decodeBase64ToBuffer(base64: string): Buffer {
        const matches = base64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
            throw new Error(t('invalidBase64'));
        }

        return Buffer.from(matches[2], 'base64');
    }

    if (!name || !email) {
        return {
            error: t('nameEmailRequired'),
        };
    }

    let imageUrl = undefined;
    if (image) {
        const fileName = id + randomUUID() + '.jpg';
        const imageBuffer = decodeBase64ToBuffer(image);
        await uploadFile(imageBuffer, 'image/jpeg', fileName);
        imageUrl = process.env.R2_PUBLIC_ENDPOINT + fileName;
    }

    try {
        const user = await prisma.user.update({
            where: {
                id
            },
            data: {
                name,
                email,
                image: imageUrl
            },
            select: {
                id: true,
                name: true,
                email: true,
                image: true
            }
        });

        return {user};
    } catch (err) {
        return {
            error: t('userUpdateError'),
        };
    }
}

export async function updatePassword(id: string, oldPassword: string, password: string, password2: string) {
    const t = await getTranslations('Profile');

    if (!oldPassword || !password || !password2) {
        return {
            error: t('allFieldsRequired'),
        };
    }

    const user = await prisma.user.findUnique({
        where: {
            id,
        },
    });

    if (!user || !(compareSync(oldPassword, user.password!))) {
        return {
            error: t('invalidCredentials'),
        };
    }

    if (password !== password2) {
        return {
            error: t('passwordsDoNotMatch'),
        };
    }

    if (!passwordSchema.validate(password)) {
        return {
            error: t('passwordRequirements'),
        };
    }

    try {
        const user = await prisma.user.update({
            where: {
                id
            },
            data: {
                password: hashSync(password)
            },
            select: {
                id: true,
                name: true,
                email: true,
                image: true
            }
        });

        return {user};
    } catch (err) {
        return {
            error: t('passwordUpdateError'),
        }
    }

}

export async function deleteUser(id: string) {
    return prisma.user.delete({
        where: {
            id
        }
    });
}