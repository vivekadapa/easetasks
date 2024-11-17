import { prisma } from "./dbConnect";
import jwt from 'jsonwebtoken';

export const fetchBoard = async (token: string) => {

    const authData = jwt.verify(token, process.env.JWT_SECRET || '')
    const boards = await prisma.board.findMany({
        where: {
            //@ts-ignore
            ownerId: authData?.userId,
        },
        include: {
            owner: false,
            columns: {
                include: {
                    cards: true
                }
            },
            Invitation: true,
        },
    });
    return boards;

}
