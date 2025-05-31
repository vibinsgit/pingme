import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";


export const testing = (req, res) => {
    res.send("Hello world!, Testing route from auth...");
}

export const signup = async (req, res) => {
    const {fullName, email, password} = req.body;

    try {
        if(!fullName || !email || !password) {
            return res.status(400).json({
                message: "All fields are required."
            });
        }

        if(password.length < 6) {
            return res.status(400).json({
                message: "Password must be atleast 6 characters."
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email format."
            });
        }       

        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({
                message: "Email already exists, Please use different email."
            });
        }

        const idIndex = Math.floor(Math.random() * 100 + 1); //Generate a num between 1 - 100
        const randomAvatar = `https://avatar.iran.liara.run/public/${idIndex}.png`;

        const newUser = await User.create({
            fullName,
            email,
            password,
            profilePic: randomAvatar,
        });

        try {
            await upsertStreamUser({
                id: newUser._id,
                name: fullName,
                image: newUser.profilePic || "",
            });
            console.log(`Stream user is created for ${newUser.fullName}`);

        } catch (error) {
            console.log("Error in creating Stream user: ", error);
        }

        const token = jwt.sign(
            { userId: newUser._id },
            process.env.JWT_SECRET_KEY, 
            { expiresIn: "7d" }
        );

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, //7d
            httpOnly: true, //prevent XSS attacks
            sameSite: "strict", //prevent CSRF attacks
            secure: process.env.NODE_ENV === "production",
        });

        return res.status(201).json({
            success: true,
            user: newUser
        });

    } catch (error) {
        console.log("Error in signup controller ", error);
        return res.status(500).json({
            message: "Internal Server Error at signup controller."
        });
    }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(400).json({
                message : "All fields are required."
            });
        }

        const user = await User.findOne({ email });

        if(!user) {
            return re.status(401).json({
                message: "Invalid email or password."
            });
        }

        const isPasswordCorrect = await user.matchPassword(password);

        if(!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET_KEY, 
            { expiresIn: "7d" }
        );

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, //7d
            httpOnly: true, //prevent XSS attacks
            sameSite: "strict", //prevent CSRF attacks
            secure: process.env.NODE_ENV === "production",
        });

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        console.log("Error in login controller ", error);
        return res.status(500).json({
            message: "Internal Server Error at login controller"
        });
    }
}

export const logout = (req, res) => {
    res.clearCookie("jwt");
    return res.status(200).json({
        success: true,
        message: "Logout Successfull."
    });
}

export const onboard = async (req, res) => {
    console.log("User Detail getting from onboard [By protect Route] : " , req.user);

    try {
        const userId = req.user._id;

        const {fullName, bio, nativeLanguage, learningLanguage, location} = req.body;

        if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
            return res.status(400).json({
                message: "All fields are required.",
                missingFields: [
                    !fullName && "fullName",
                    !bio && "bio",
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && "location"
                ].filter(Boolean),
            });
        }

        // const updatedUser = await User.findByIdAndUpdate(userId, {
        //     fullName,
        //     bio,
        //     nativeLanguage,
        //     learningLanguage,
        //     location,
        //     isOnboarded: true
        // });

        const updatedUser = await User.findByIdAndUpdate(userId, {
            ...req.body,
            isOnboarded: true
        }, { new: true });
        //{ new: true } => If you set new: true, findOneAndUpdate() will instead give you the object after update was applied

        if(!updatedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        try {
            await upsertStreamUser({
                id: updatedUser._id.toString(),
                name: updatedUser.fullName,
                image: updatedUser.profilePic || "",
            });

            console.log(`Stream user updated after onboarding for ${updatedUser.fullName}`);

        } catch (error) {
            console.log("Error in updating stream user during onboarding ", error.message);
        }

        return res.status(200).json({
            success: true,
            user: updatedUser
        });

    } catch (error) {
        console.log("Error in onboarding route ", error);
        return res.status(500).json({
            message: "Internal server error at onboard."
        });
    }
}

export const me = (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    });
}

