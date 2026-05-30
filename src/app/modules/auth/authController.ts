import { Request, Response } from 'express';
import catchAsync from '../../shared/catchAsync';
import config from '../../config';
import { AuthService } from './authService';
import sendResponse from '../../shared/sendReponse';

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.loginUser(req.body);

    res.cookie('refreshToken', result.refreshToken, {
        secure: true,
        httpOnly: true,
        sameSite: 'none',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie('accessToken', result.accessToken, {
        secure: true,
        httpOnly: false,
        sameSite: 'none',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'User logged in successfully!',
        data: { accessToken: result.accessToken },
    });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken || req.headers.refresh_token;
    const result = await AuthService.refreshToken(token);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Access token generated successfully!',
        data: result,
    });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
    const user = req.user!;
    await AuthService.changePassword(user.email, req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Password changed successfully!',
    });
});

const logoutUser = catchAsync(async (req: Request, res: Response) => {
    res.clearCookie('refreshToken', {
        secure: config.env === 'production',
        httpOnly: true,
    });

    res.clearCookie('accessToken', {
        secure: config.env === 'production',
        httpOnly: false,
        path: '/',
    });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Logged out successfully!',
    });
});

const profile = catchAsync(async (req: Request, res: Response) => {
    const user = req.user!;
    console.log("user", user)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Profile retrieved successfully!',
        data: user,
    });
});

export const AuthController = {
    loginUser,
    profile,
    refreshToken,
    changePassword,
    logoutUser,
};