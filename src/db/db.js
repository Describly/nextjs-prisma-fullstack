import { PrismaClient } from "@prisma/client";

const prisma = {
    instance: new PrismaClient()
}

Object.freeze(prisma)

export default prisma.instance