import { Request, Response } from "express";
import { prisma } from "../utils/dbConnect";

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
                order,
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
            orderBy: {
                order: 'asc'
            }
        });

        res.status(201).json(allCards);
    } catch (error) {
        console.error("Error creating card:", error);
        res.status(500).json({ error: 'Failed to create card' });
    }
};

// export const updateCard = async (req: Request, res: Response) => {
//     try {
//         const { id } = req.params; // Get the card ID from the request parameters
//         const { priority, columnId, subtasks } = req.body; // Get the updated data from the request body

//         const card = await prisma.card.findUnique({
//             where: { id: id },
//             include: { subtasks: true },
//         });

//         if (!card) {
//             return res.status(404).json({ error: 'Card not found' });
//         }



//         const updatedCard = await prisma.card.update({
//             where: { id: id },
//             data: {
//                 priority: priority || card.priority,
//                 columnId: columnId || card.columnId,
//                 subtasks: {
//                     deleteMany: { parentCardId: id },
//                     create: subtasks || [],
//                 },
//             },
//         });
//         console.log(updatedCard);
//         return res.json(updatedCard);
//     } catch (error) {
//         console.error("Error updating card:", error);
//         return res.status(500).json({ error: 'An error occurred while updating the card' });
//     }
// };



export const updateCard = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { priority, columnId, subtasks } = req.body;

        if (subtasks) {
            const oldSubtasks = subtasks.filter((s: any) => s.id)
            oldSubtasks.map(async (o: any) => {
                await prisma.subcard.update({
                    where: {
                        id: o.id
                    },
                    data: {
                        // parentCardId: id,
                        title: o.title,
                        isComplete: o.isComplete
                    }
                })
            })
            const newSubtasks = subtasks.filter((s: any) => !s.id)
            console.log(newSubtasks)
            let updateNew = null;
            if (newSubtasks.length > 0) {
                newSubtasks.map((n: any) => {
                    return { ...n, parentCardId: id }
                })
                updateNew = await prisma.user.createMany({
                    data: newSubtasks
                })
            }
        }


        const updatedCard = await prisma.card.update({
            where: {
                id
            },
            data: {
                ...(priority !== undefined && { priority: priority }),
                columnId: columnId
            }
        })

        return res.status(200).json(updatedCard);
    } catch (error) {
        console.error("Error updating card:", error);
        return res.status(500).json({ error: 'An error occurred while updating the card' });
    }
}



export const deleteCard = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.card.delete({
            where: { id }
        })
        res.status(204).json({
            message: "Successfully Deleted Card"
        })
    } catch (error) {
        console.error("Error deleting card:", error);
        res.status(500).json({ error: "Failed to delete card" });
    }
}