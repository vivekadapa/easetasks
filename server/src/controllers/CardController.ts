import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createCard = async (req: Request, res: Response) => {
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

export const updateCard = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // Get the card ID from the request parameters
        const { priority, columnId, subtasks } = req.body; // Get the updated data from the request body

        const card = await prisma.card.findUnique({
            where: { id: id },
            include: { subtasks: true },
        });

        if (!card) {
            return res.status(404).json({ error: 'Card not found' });
        }

        // Update the card with the provided data
        const updatedCard = await prisma.card.update({
            where: { id: id },
            data: {
                priority: priority || card.priority, // Update priority if provided
                columnId: columnId || card.columnId, // Update column ID (status) if provided
                subtasks: {
                    // If subtasks are provided, update them
                    deleteMany: { parentCardId: id }, // Delete existing subtasks for the card
                    create: subtasks || [], // Create new subtasks
                },
            },
        });

        return res.json(updatedCard);
    } catch (error) {
        console.error("Error updating card:", error);
        return res.status(500).json({ error: 'An error occurred while updating the card' });
    }
};