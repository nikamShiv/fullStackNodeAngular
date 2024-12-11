
import { z } from "zod";
import { User } from "../models/User"


export const getUserByEmail = async (email: string) => {
    return User.findOne({
        where: {
            email
        }
    })
}

export const addUser = async (email: string, password: string, name: string): Promise<User> => {
    const user = new User();

    user.email = email;
    user.password = password;
    user.name = name;

    return user.save();
}

export const updateUser = async ({ name,password, status, id }: {
    name?: string,
    password?: string,
    status?: "active" | "pending",
    id: number
}) => {
    const user = await User.findByPk(id);
    if (!user) {
        throw new Error("User not found")
    }

    if(name){
        user.name=name;
    }
    if(status){
        user.status=status;
    }
    if(password){
        user.password=password;
    }

    return user.save();
};


