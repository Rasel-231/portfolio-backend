import { IUser } from "./userInterface";
import { User } from "./userModel";
const createUserIntoDB = async (payload: IUser): Promise<IUser> => {
    const isUserExists = await User.findOne({ email: payload.email });
    if (isUserExists) {
        throw new Error('This email is already registered!');
    }

    const result = await User.create(payload);
    const userObject = result.toObject();
    delete userObject.password;

    return userObject;
};

export const UserServices = {
    createUserIntoDB,
};