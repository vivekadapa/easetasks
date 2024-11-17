import { Request, Response } from "express"
import { prisma } from "../utils/dbConnect"

export const createBoard = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const { title, columns } = req.body;
    try {
        const board = await prisma.board.create({
            data: {
                title,
                //@ts-ignore
                owner: { connect: { id: req.user.id } },
                columns: {
                    create: columns,
                },
            },
            include: {
                columns: {
                    include: {
                        cards: {
                            include: {
                                subtasks: true
                            }
                        }
                    }
                }
            }
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
                columns: {
                    include: {
                        cards: {
                            include: {
                                subtasks: true
                            }
                        }
                    }
                }
            }
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

        await Promise.all(
            columns.map(async (c: any) => {
                if (c?.id) {
                    // Update column
                    await prisma.column.update({
                        where: { id: c?.id },
                        data: { title: c.title }
                    });
                } else {
                    // Create new column
                    await prisma.column.create({
                        data: {
                            title: c.title,
                            order: c.order,
                            boardId: id,
                        }
                    });
                }
            })
        );

        const updatedBoard = await prisma.board.findUnique({
            where: { id },
            include: {
                columns: {
                    include: {
                        cards: {
                            include: {
                                subtasks: true
                            }
                        }
                    }
                }
            }
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