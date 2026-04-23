import User from "../models/userModel.js"


export const getCurrentUser=async (req,res)=>{
    try {
        const userId=req.userId
        const user=await User.findById(userId)
        if(!user){
            return res.status(404).json({massage:"User does not found"})
        }
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({massage:`Failed to get User:${error}`})
    }
}