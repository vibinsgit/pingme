import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
   fullName: {
    type: String,
    required: true
   },
   email: {
    type: String,
    required: true,
    unique: true,
   },
   password: {
    type: String,
    required: true,
    minlength: 6,
   },
   bio: {
    type: String,
    default: "",
   },
   profilePic: {
    type: String,
    default: "",
   },
   nativeLanguage: {
    type: String,
    default: "",
   },
   learningLanguage: {
    type: String,
    default: "",
   },
   location: {
    type: String,
    default: "",
   },
   isOnboarded: {
    type: Boolean,
    default: false,
   },

   friends: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
   ]

}, {timestamps: true});
//timestamps: true => gives a createdAt, updatedAt


//prehook - used to hash a password
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        //this.password means current user
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    const isPasswordCorrect = await bcrypt.compare(enteredPassword, this.password);
    return isPasswordCorrect;
}

const User = mongoose.model("User", userSchema);

export default User;