import express from "express"
import { analyzeResume , generateQuestion , finishInterview, submitAnswer, getMyInterviews, getInterviewReport} from "../controller/interviewController.js"
import { upload } from "../middleware/multer.js"
import isAuth  from "../middleware/isAuth.js"
const interviewRouter=express.Router()

interviewRouter.post("/resume",isAuth,upload.single("resume"),analyzeResume)
interviewRouter.post("/generate-questions",isAuth,generateQuestion);
interviewRouter.post("/submit-answer",isAuth,submitAnswer);
interviewRouter.post("/finish",isAuth,finishInterview);

interviewRouter.get("/get-interview",isAuth,getMyInterviews)
interviewRouter.get("/report/:id",isAuth,getInterviewReport)

export default interviewRouter