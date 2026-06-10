import express from "express"
import { analyzeResume , generateQuestion , finishInterview, submitAnswer} from "../controller/interviewController.js"
import { upload } from "../middleware/multer.js"
import isAuth  from "../middleware/isAuth.js"
const interviewRouter=express.Router()

interviewRouter.post("/resume",isAuth,upload.single("resume"),analyzeResume)
interviewRouter.post("/generate-questions",isAuth,generateQuestion);
interviewRouter.post("/submit-answers",isAuth,submitAnswer);
interviewRouter.post("/finish",isAuth,finishInterview);

export default interviewRouter