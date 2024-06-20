import { RequestHandler } from 'express';
import { expressjwt } from 'express-jwt';
import dotenv from 'dotenv';

dotenv.config();

const authMiddleware: RequestHandler = expressjwt({
   secret: process.env.JWT_SECRET!,
   algorithms: ['HS256'],
   requestProperty: 'user', // Attach decoded token to req.user
});

export default authMiddleware;

