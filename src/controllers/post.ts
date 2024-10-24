'use server'

import prisma from "@/libs/prisma";
import pusher from "@/libs/pusher";

export async function getPosts() {
    return prisma.post.findMany({
        orderBy: {
            createdAt: "desc",
        },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    image: true,
                }
            }
        }
    });
}

export async function createPost(user: string, content: string) {
    if (!content || content.trim() === '' || !user || user.trim() === '') {
        return;
    }

    const post = await prisma.post.create({
        data: {
            content,
            user: {
                connect: {
                    email: user,
                },
            },
        },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    image: true,
                }
            },
        },
    });

    await pusher.trigger('posts', 'new-post', post);

    return post;
}