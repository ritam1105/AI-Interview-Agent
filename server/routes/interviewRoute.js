import express from "express"
import { analyzeResume } from "../controller/interviewController"
import { upload } from "../middleware/multer"

const interviewRouter=express.Router()

interviewRouter.post("/resume",isAuth,upload.single("resume"),analyzeResume)

export default interviewRouter