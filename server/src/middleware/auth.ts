import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  username: string;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // TODO: verify the token exists and add the user data to the request object
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    const secretKey = process.env.JWT_SECRET_KEY || '';

    jwt.verify(token, secretKey, (err, decodedToken) => {
      if (err) {
        return res.sendStatus(403); // Send forbidden status if the token is invalid
      }
      // Attach the user information (decodedToken) to the request object
      // Cast decodedToken as JwtPayload to ensure correct type
      req.user = decodedToken as JwtPayload;

      return next(); // Call the next middleware function
    });
  } else {
    res.sendStatus(401); // Send unauthorized status if no authorization header is present
  }
};