import prisma from "@/libs/prisma"
import { hashSync } from "bcryptjs"

async function main() {
    await prisma.user.upsert({
        where: {
            email: 'foo@example.com'
        },
        update: {
            email: 'foo@example.com',
            name: "John",
            password: hashSync('foo'),
        },
        create: {
            email: 'foo@example.com',
            name: "John",
            password: hashSync('foo')
        }
    })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })