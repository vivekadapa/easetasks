import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";



const prisma = new PrismaClient();


export const createColumn = async (req: Request, res: Response) => {
    try {
        const { title, order, boardId } = req.body;
        const newColumn = await prisma.column.create({
            data: {
                title,
                order,
                boardId
            }
        });
        res.status(201).json(newColumn);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create column' });
    }
};


export const getColumnsByBoardId = async (req: Request, res: Response) => {
    console.log(req.params.boardId)
    try {
        const { boardId } = req.params;
        const columns = await prisma.column.findMany({
            where: { boardId },
            include: {
                cards: true
            }
        });
        res.status(200).json(columns);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch columns' });
    }
};

export const updateColumnsById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, order } = req.body;
        const updatedColumn = await prisma.column.update({
            where: { id },
            data: { title, order }
        });
        res.status(200).json(updatedColumn);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update column' });
    }
};


// export const 

