import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ILoginResponse } from './authInterface'; // আপনার প্রজেক্টের ইন্টারফেস অনুযায়ী ঠিক আছে
import config from '../../config';
import { User } from '../user/userModel'; // আপনার ইউজার মডেলের পাথ অনুযায়ী ঠিক আছে

// ১. ইউজার লগইন সার্ভিস
const loginUser = async (payload: any): Promise<ILoginResponse> => {
    const user = await User.findOne({ email: payload.email }).select('+password');
    if (!user) throw new Error('User not found!');

    const isPasswordMatched = await bcrypt.compare(payload.password, user.password!);
    if (!isPasswordMatched) throw new Error('Password incorrect!');

    const jwtPayload = { email: user.email, role: user.role };

    // ক্লিন টোকেন জেনারেশন লজিক
    const accessToken = jwt.sign(
        jwtPayload,
        config.jwt.access_secret as string,
        { expiresIn: config.jwt.access_expires_in as jwt.SignOptions['expiresIn'] }
    );

    const refreshToken = jwt.sign(
        jwtPayload,
        config.jwt.refresh_secret as string,
        { expiresIn: config.jwt.refresh_expires_in as jwt.SignOptions['expiresIn'] }
    );

    return { accessToken, refreshToken };
};

// ২. রিফ্রেশ টোকেন দিয়ে নতুন অ্যাক্সেস টোকেন তৈরি
const refreshToken = async (token: string) => {
    const verifiedToken = jwt.verify(token, config.jwt.refresh_secret as string) as any;

    const user = await User.findOne({ email: verifiedToken.email });
    if (!user) throw new Error('User does not exist!');

    const accessToken = jwt.sign(
        { email: user.email, role: user.role },
        config.jwt.access_secret as string,
        { expiresIn: config.jwt.access_expires_in as jwt.SignOptions['expiresIn'] }
    );

    return { accessToken };
};

// ৩. পাসওয়ার্ড পরিবর্তনের সার্ভিস
const changePassword = async (userEmail: string, payload: any) => {
    const user = await User.findOne({ email: userEmail }).select('+password');
    if (!user) throw new Error('User not found!');

    const isPasswordMatched = await bcrypt.compare(payload.oldPassword, user.password!);
    if (!isPasswordMatched) throw new Error('Old password is incorrect!');

    // নতুন পাসওয়ার্ড সেট করা (আপনার ইউজার মডেলের pre-save হুক এটিকে অটো হ্যাশ করে নেবে)
    user.password = payload.newPassword;
    await user.save();
};

const profile = async (userEmail: string) => {
    const user = await User.findOne({ email: userEmail });
    if (!user) throw new Error('User not found!');
    return user;
};

export const AuthService = {
    loginUser,
    refreshToken,
    changePassword,
    profile,
};