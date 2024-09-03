import { PrismaClient } from "@prisma/client"
import { Request, Response } from "express"

const prisma = new PrismaClient()

export const createBoard = async (req: Request, res: Response) => {

    const { title, userId, columns } = req.body;
    console.log(req.body)
    try {
        const board = await prisma.board.create({
            data: {
                title,
                owner: { connect: { id: userId } },
                columns: {
                    create: columns,
                },
            },
        });
        res.status(201).json(board);
    } catch (error) {
        console.error("Error creating board:", error);
        res.status(500).json({ error: "Failed to create board" });
    }
};


export const getBoards = async (req: Request, res: Response) => {
    try {
        const boards = await prisma.board.findMany({
            where: {
                ownerId: req.params.userId,
            },
            include: {
                owner: true,
                columns: true,
                Invitation: true,
            },
        });
        res.status(200).json(boards);
    } catch (error) {
        console.error("Error fetching boards:", error);
        res.status(500).json({ error: "Failed to fetch boards" });
    }
};

export const getBoardById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const board = await prisma.board.findUnique({
            where: { id },
            include: {
                owner: true,
                columns: true,
                Invitation: true,
            },
        });

        if (!board) {
            return res.status(404).json({ error: "Board not found" });
        }

        res.status(200).json(board);
    } catch (error) {
        console.error("Error fetching board:", error);
        res.status(500).json({ error: "Failed to fetch board" });
    }
};

export const updateBoard = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, columns } = req.body;

    try {

        const board = await prisma.board.update({
            where: { id },
            data: { title },
            include: { columns: true }
        });

        const existingColumns = board.columns;

        if (existingColumns.length >= columns.length) {
            for (let i = 0; i < columns.length; i++) {
                await prisma.column.update({
                    where: { id: existingColumns[i].id },
                    data: { title: columns[i].title }
                });
            }
            for (let i = columns.length; i < existingColumns.length; i++) {
                await prisma.column.delete({
                    where: { id: existingColumns[i].id }
                });
            }
        } else {
            for (let i = 0; i < existingColumns.length; i++) {
                await prisma.column.update({
                    where: { id: existingColumns[i].id },
                    data: { title: columns[i].title }
                });
            }
            // Create new columns
            for (let i = existingColumns.length; i < columns.length; i++) {
                await prisma.column.create({
                    data: {
                        title: columns[i].title,
                        order: columns[i].order,
                        boardId: id,
                    }
                });
            }
        }
        const updatedBoard = await prisma.board.update({
            where: { id },
            data: { title },
            include: { columns: true }
        });

        res.status(200).json(updatedBoard);
    } catch (error) {
        console.error("Error updating board:", error);
        res.status(500).json({ error: "Failed to update board" });
    }
};


export const deleteBoard = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await prisma.board.delete({
            where: { id },
        });
        res.status(204).json({
            message: "successfully deleted board"
        });
    } catch (error) {
        console.error("Error deleting board:", error);
        res.status(500).json({ error: "Failed to delete board" });
    }
};