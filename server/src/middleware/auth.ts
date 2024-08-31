import { Request, Response, NextFunction } from "express";


interface CustomRequest extends Request {
    token?: string;
}


const verifyToken = (req: CustomRequest, res: Response, next: NextFunction) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
};

export default verifyToken


