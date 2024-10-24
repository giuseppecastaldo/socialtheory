'use server'

import prisma from '@/libs/prisma';
import { customAlphabet, urlAlphabet } from 'nanoid'
import ms from "ms";

export async function generateToken(purpose: string, payload: any | undefined, expiresIn?: string | undefined) {
    const nanoid = customAlphabet(urlAlphabet, 30)
    let expiresAt = undefined;

    if (expiresIn) {
        expiresAt = new Date(Date.now() + ms(expiresIn));
    }
    
    const opaqueToken = await prisma.opaqueToken.create({
        data: {
            token: nanoid(),
            payload,
            expiresAt, 
            purpose
        }
    });

    return opaqueToken.token;
}

export async function verifyToken(purpose: string, token: string) {
    const opaqueToken = await prisma.opaqueToken.findUnique({
        where: {
            token: token, 
            purpose
        }
    });

    if (opaqueToken && (!opaqueToken.expiresAt || opaqueToken.expiresAt > new Date())) {
        return opaqueToken.payload;
    }

    return false;
}
