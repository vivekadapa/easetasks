import { Request, Response } from "express";
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { prisma } from '../utils/dbConnect';
import jwt from 'jsonwebtoken'

const userSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});



// export const Register = async (req: Request, res: Response) => {

//     try {
//         const { email, password } = userSchema.parse(req.body);

//         const existingUser = await prisma.user.findUnique({ where: { email } });
//         if (existingUser) {
//             return res.status(400).json({ message: 'User already exists' });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);
//         const user = await prisma.user.create({
//             data: { email, password: hashedPassword },
//         });

//         const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || '');
//         res.status(201).json({ token });
//     } catch (error) {
//         if (error instanceof z.ZodError) {
//             return res.status(400).json({ errors: error.errors });
//         }
//         console.log(error)
//         res.status(500).json({ message: 'Server error' });
//     }
// }


// export const Login = async (req: Request, res: Response) => {
//     try {
//         const { email, password } = userSchema.parse(req.body);

//         const user = await prisma.user.findUnique({ where: { email } });
//         if (!user) {
//             return res.status(400).json({ message: 'Invalid credentials' });
//         }

//         const validPassword = await bcrypt.compare(password, user.password);
//         if (!validPassword) {
//             return res.status(400).json({ message: 'Invalid credentials' });
//         }

//         const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || '');
//         res.json({ token });
//     } catch (error) {
//         console.log(error)
//         if (error instanceof z.ZodError) {
//             return res.status(400).json({ errors: error.errors });
//         }
//         res.status(500).json({ message: 'Server error' });
//     }
// }


export const refresh = async (req: Request, res: Response) => {
    console.log(req.user);
    if (req.user) {
        const user = await prisma.user.findUnique({
            //@ts-ignore
            where: { id: req.user?.id },
            include: {
                boards: true
            }
        })
        if (user) {
            return res.json({ data: user })
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    }
    return res.status(401).json({ message: 'Unauthorized' });
}

export const logout = async (req: Request, res: Response) => {
    // res.clearCookie('guest');
    req.logout((err) => {
        if (err) {
            console.error('Error logging out:', err);
            res.status(500).json({ error: 'Failed to log out' });
        } else {
            // res.clearCookie('jwt');
            res.status(200).json({ message: 'Logged out successfully' });
        }
    });
}
export const verify = async (req: Request, res: Response) => {
    //@ts-ignore
    jwt.verify(req.token, process.env.JWT_SECRET || '', async (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            try {
                const user = await prisma.user.findUnique({
                    where: { id: authData?.userId },
                    select: {
                        id: true,
                        email: true,
                        createdAt: true,
                        updatedAt: true,
                        boards: {
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
                        },
                    }
                });
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                res.json({ data: user });
            } catch (error) {
                console.log(error)
                res.status(500).json({ message: 'Server error' });
            }
        }
    });
}
