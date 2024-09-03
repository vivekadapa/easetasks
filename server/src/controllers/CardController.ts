import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createCard = async (req: Request, res: Response) => {
    console.log(req.body)
    try {
        const { title, description, order, priority, columnId, subtasks } = req.body;
        if (!columnId) {
            return res.status(400).json({ error: 'columnId is required' });
        }
        const card = await prisma.card.create({
            //@ts-ignore
            data: {
                title,
                content: description,
                priority: priority,
                columnId: columnId,
                subtasks: {
                    create: subtasks.map((s: any) => {
                        return {
                            title: s
                        }
                    })
                }
            }
        });

        const allCards = await prisma.card.findMany({
            where: {
                columnId: columnId
            },
            include: {
                subtasks: true
            },
            // orderBy: {
            //     order: 'asc'
            // }
        });

        res.status(201).json(allCards);
    } catch (error) {
        console.error("Error creating card:", error);
        res.status(500).json({ error: 'Failed to create card' });
    }
};
