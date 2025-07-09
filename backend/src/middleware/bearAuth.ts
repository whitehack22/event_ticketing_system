import jwt, { decode } from "jsonwebtoken"
import "dotenv/config"
import { Request, Response, NextFunction } from "express";

// middleware to check if the customer is loggedin
//  export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
//    const authHeader = req.headers.authorization

//      if (!authHeader || !authHeader.startsWith("Bearer ")) {
//         res.status(401).json({ message: "Unauthorized" });
//         return;

//     }
//      const token = authHeader.split(" ")[1]
     
//      try {
//         const decode = jwt.verify(token, process.env.JWT_SECRET as string);
//         // attching user info
//         //  req.customer = decode;
//         (req as any).customer = decode;
//         next()
//      } catch (error) {
//        res.status(401).json({ message: "Invalid Token" }); 
//      }
//  } 

// Impelementing a middleware to check user roles
export const checkRoles = (requiredRole: "admin" | "user" | "both") => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const token = authHeader.split(" ")[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
            (req as any).user = decoded;

            // check for roles
            if (
                typeof decoded === "object" && // Ensure decoded is an object
                decoded !== null && //Ensure decoded is not null 
                "role" in decoded //Ensure the decoded token has a role property
            ) { // check if decoded is an object and has a role property
                if (requiredRole === "both") {
                    if (decoded.role === "admin" || decoded.role === "user") { // if the decoded role is admin or user, then allow access
                        next();
                        return;
                    }
                } // if the required role is both, then allow access to admin and user
                else if (decoded.role === requiredRole) { // if the decoded role is the same as the required role, then allow access
                    next();
                    return;
                }
                res.status(401).json({ message: "Unauthorized" });
                return;
            } else { //happens when the decoded token is not an object or does not have a role property
                res.status(401).json({ message: "Invalid Token Payload" })
                return
            }

        } catch (error) {
            res.status(401).json({ message: "Invalid Token" });
            return
        }

    }
}

export const adminRoleAuth = checkRoles("admin")
export const userRoleAuth = checkRoles("user")
export const bothRoleAuth = checkRoles("both")