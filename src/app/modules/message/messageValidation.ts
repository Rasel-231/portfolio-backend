import { z } from 'zod';

export const messageValidationSchema = z.object({
    body: z.object({
        name: z.string().min(2, "Name is required"),
        email: z.string().email("Invalid email address"),
        subject: z.string().min(3, "Subject too short"),
        message: z.string().min(10, "Message must be at least 10 chars")
    })
});