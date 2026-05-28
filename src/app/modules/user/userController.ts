// src/app/modules/user/user.controller.ts

import { Request, Response } from 'express';
import { UserServices } from './userService';


const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userData = req.body;
        const result = await UserServices.createUserIntoDB(userData);

        res.status(201).json({
            success: true,
            message: 'User created successfully!',
            data: result,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to create user!',
        });
    }
};

export const UserController = {
    createUser,
};