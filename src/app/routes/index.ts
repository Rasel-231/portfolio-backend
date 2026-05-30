import express from 'express';
import { AuthRoutes } from '../modules/auth/authRoutes';
import { UserRoutes } from '../modules/user/userRoutes';
import { settingsRoutes } from '../modules/setting/settingRoutes';
import assistantRoutes from '../modules/assistant/assistantRoutes';
import { messageRoutes } from '../modules/message/messageRoutes';




const router = express.Router();

const moduleRoutes = [
    { path: '/auth', route: AuthRoutes },
    { path: '/users', route: UserRoutes },
    { path: '/settings', route: settingsRoutes },
    { path: '/assistant', route: assistantRoutes },
    { path: '/messages', route: messageRoutes }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;