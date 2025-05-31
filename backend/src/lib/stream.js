import {StreamChat} from "stream-chat";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.STEAM_API_KEY;
const apiSecret = process.env.STEAM_SECRET_KEY;

if(!apiKey || !apiSecret) {
    console.error("Stream API key or Secret is missing...");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

//create a new user in stream platform
export const upsertStreamUser = async (userData) => {
    try {
        await streamClient.upsertUsers([userData]);
        return userData;
    } catch (error) {
        console.error("Error in upserting in stream user : ", error);
    }
};

export const generateStreamToken = (userId) => {
    try {
        const userIdStr = userId.toString();

        return streamClient.createToken(userIdStr);
    } catch (error) {
        console.error("Error generating stream token: ", error);
    }
};
