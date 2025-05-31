import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";


export const testing = (req, res) => {
    res.send("Hello world!, Testing route from user...");
}

//To test
export const getRecommendedUsers = async (req, res) => {
    try {
        //const currentUserId = req.user.id; it also works
        const currentUserId = req.user._id;
        const currentUser = req.user;

        const recommendedUsers = await User.find({
            $and: [
                { _id: {$ne: currentUserId} }, //exclude current user
                { _id: {$nin: currentUser.friends} }, //exclude the current user's friends
                {isOnboarded: true}
            ],
        });

        res.status(200).json(
            recommendedUsers
        );

    } catch (error) {
        console.log("Error in getRecommendedUsers controller ", error.message);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

export const getMyFriends = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        .select("friends")
        .populate("friends", "fullName profilePic nativeLanguage learningLanguage");

        res.status(200).json(
            user.friends
        );
    } catch (error) {
        console.error("Error in getMyFriends controller", error.message);
        res.status(500).json({
            message: "Internal Server Error at get my friends."
        });
    }
}

export const sendFriendRequest = async (req, res) => {
    try {
        const myId = req.user.id;
        const { id: recipientId } = req.params;

        //Preventing sending request to myself
        if(myId == recipientId) {
            return res.status(400).json({
                message: "You can't send friend request to yourself."
            });
        }

        const recipient = await User.findById(recipientId);

        if(!recipient) {
            return res.status(404).json({
                message: "Recipient is not found"
            });
        }

        //Checking if user is already my friend
        if(recipient.friends.includes(myId)) {
            return res.status(400).json({
                message: "You are already friend with this user."
            });
        }

        const existingRequest = await FriendRequest.findOne({
            $or: [
                {sender: myId, recipient: recipientId},
                {sender: recipientId, recipient: myId}
            ],
        });

        if(existingRequest) {
            return res.status(400).json({
                message: "A friend request already exists between you and this user."
            });
        }

        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId,
        });

        res.status(201).json(friendRequest);

    } catch (error) {
        console.error("Error in sendRequest controller ", error.message);
        res.status(500).json({
            message: "Internal Server Error at sendFriendRequest"
        });
    }
}

export const acceptFriendRequest = async (req, res) => {
    try {
        const { id: requestId } = req.params;

        const friendRequest = await FriendRequest.findById(requestId);

        if(!friendRequest) {
            return res.status(404).json({
                message: "Friend request not found."
            });
        }

        //Verify the current user is the recipient
        if(friendRequest.recipient.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You are not authorized to accept this request"
            });
        }

        friendRequest.status = "accepted";
        await friendRequest.save();

        //adding each other as a friends in an array
        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { friends: friendRequest.recipient },
        });

        await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet: { friends: friendRequest.sender },
        });

        res.status(200).json({
            message: "Friend Request accepted"
        });

    } catch (error) {
        console.log("Error in acceptFriendRequest controller : ", error.message);
        res.status(500).json({
            message: "Internal Server Error at acceptFeiendRequest"
        });
    }
}

export const getFriendRequests = async (req, res) => {
    try {
        const incommingReqs = await FriendRequest.find({
            recipient: req.user.id,
            status: "pending",
        }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");

        const acceptedReqs = await FriendRequest.find({
            sender: req.user.id,
            status: "accepted",
        }).populate("recipient", "fullName profilePic");

        res.status(200).json({ incommingReqs, acceptedReqs });

    } catch (error) {
        console.log("Error in getFriendRequests controller ", error.message);
        res.status(500).json({
            message: "Internal Server Error at getFriendRequests controller"
        });
    }
}

export const getOutgoingFriendReqs = async (req, res) => {
    try {
        const outgoingRequests = await FriendRequest.find({
            sender: req.user.id,
            status: "pending",
        }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");

        res.status(200).json(outgoingRequests);

    } catch (error) {
        console.log("Error in getOutgoingFriendReqs controller ", error.message);
        res.status(500).json({
            message: "Internal Server Error at getOutgoingFriendReqs"
        });
    }
}