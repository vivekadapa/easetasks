import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient()


export const editSubCardStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { completed } = req.body;

        const updatedSubcard = await prisma.subcard.update({
            where: { id },
            data: {
                isComplete: completed,
            },
        });

        res.status(200).json(updatedSubcard);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};