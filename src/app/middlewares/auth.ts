import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload | null;
        }
    }
}

const auth = (...requiredRoles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization;
            const tokenFromCookie = req.cookies?.accessToken;

            const finalToken = token?.startsWith('Bearer ') ? token.split(' ')[1] : token || tokenFromCookie;


            if (!finalToken) {
                throw new Error('You are not authorized! Token missing.');
            }

            let verifiedUser: JwtPayload;
            try {
                verifiedUser = jwt.verify(finalToken, config.jwt.access_secret as string) as JwtPayload;
            } catch (err) {
                throw new Error('Forbidden! Invalid or Expired Token.');
            }

            req.user = verifiedUser;


            if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
                throw new Error('Forbidden! You do not have permission.');
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

export default auth;