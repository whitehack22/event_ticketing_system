import { Request, Response } from "express";
import * as userService from "./user.service";
import bcrypt from "bcryptjs";
import "dotenv/config"
import jwt from "jsonwebtoken";
import { sendEmail } from "../mailer/mailer";

// get all users
export const getAllUsersController = async (_req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers()
    res.status(200).json({ data: users })
    return;
  } catch (error: any) {
    console.error("Error fetching users:", error)
    res.status(500).json({ error: error.message || "Internal Server Error" })
    return;
  }
};

//get user by ID controller
export const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
       res.status(400).json({ message: "Invalid ID" });
      return;
    }

    const user = await userService.getUserById(id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return; 
    }

    res.status(200).json({ data: user });

    return;
  } catch (error: any) {
     res.status(500).json({ error: error.message })
    return;
  }
};

//Create a user controller
export const createUserController = async (req: Request, res: Response) => {
  try {

    const user = req.body;
    const password = user.password;
    const hashedPassword = await bcrypt.hashSync(password, 10)
    user.password = hashedPassword

// Generate a 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationCode = verificationCode;
    user.isVerified = false;

    const createUser = await userService.createUser(req.body);

    if (!createUser) {
      res.status(400).json({ message: "User not created" });
      return;
    }
    try {
       await sendEmail(
                user.email,
                "Verify your account",
                `Hello ${user.lastName}, your verification code is: ${verificationCode}`,
                `<div>
                <h2>Hello ${user.lastName},</h2>
                <p>Your verification code is: <strong>${verificationCode}</strong></p>
                 <p>Enter this code to verify your account.</p>
                </div>`
            );
    } catch (emailError) {
      console.error("Failed to send registration email:", emailError);
    }
    res.status(201).json({ message: "User created. Verification code sent to email." });
    return;
  } catch (error: any) {
    console.error("Error creating user:", error);
     res.status(500).json({ error: error.message || "Internal Server Error" });
    return;
  }
};

//Verify user controller
export const verifyUserController = async (req: Request, res: Response) => {
   const { email, code } = req.body;
   try {
     const user = await userService.getUserByEmailService(email);
     if (!user) {
          res.status(404).json({ message: "User not found" });
          return;
        }

        if (user.verificationCode === code) {
            await userService.verifyUserService(email);
          
           // Send verification success email
          try {
             await sendEmail(
                    user.email,
                    "Account Verified Successfully",
                    `Hello ${user.lastName}, your account has been verified. You can now log in and use all features.`,
                    `<div>
                    <h2>Hello ${user.lastName},</h2>
                    <p>Your account has been <strong>successfully verified</strong>!</p>
                     <p>You can now log in and enjoy our services.</p>
                     </div>`
                )
          } catch ( error: any ) {
             console.error("Failed to send verification success email:", error);
          }
          res.status(200).json({ message: "User verified successfully" })
          return;
      } else {
          res.status(400).json({ message: "Invalid verification code" })
          return;
        }

   } catch (error: any) {
      res.status(500).json({ error: error.message })
      return;
   }
}



//Update user controller
export const updateUserController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    const user = await userService.getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const updated = await userService.updateUser(id, req.body);
    res.status(200).json({ message: "User updated successfully", user: updated });
    return;
  } catch (error: any) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
    return;
  }
};

//Delete user controller
export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    await userService.deleteUser(id);
    res.status(204).send();
    return;
  } catch (error: any) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
    return;
  }
};

// login user controller
export const loginUserController = async (req: Request, res: Response) => {
  
  try {
       const user = req.body;

        // check if the user exist
        const userExist = await userService.userLoginService(user)
        if (!userExist) {
            return res.status(404).json({ message: "User not found" });
        }

        // verify the password 
        const userMatch = await bcrypt.compareSync(user.password, userExist.password)
        if (!userMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // create a payload
        const payload = {
            sub: userExist.userID,
            user_id: userExist.userID,
            first_name: userExist.firstName,
            last_name: userExist.lastName,
            role: userExist.role,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24
        }

        //generate the JWT token
        const secret = process.env.JWT_SECRET as string
        if (!secret) {
            throw new Error("JWT_SECRET is not defined in the environment variables");
        }
        const token = jwt.sign(payload, secret)

         // return the token with user info
        return res.status(200).json({
            message: "Login successfull",
            token,
            user: {
                user_id: userExist.userID,
                first_name: userExist.firstName,
                last_name: userExist.lastName,
                email: userExist.email,
                contactPhone: userExist.contactPhone,
                address: userExist.address,
                role: userExist.role,
                createdAt: userExist.createdAt,
                updatedAt: userExist.updatedAt
            }
        })
  }  catch (error: any) {
        return res.status(500).json({ error: error.message });
    
  }
};


