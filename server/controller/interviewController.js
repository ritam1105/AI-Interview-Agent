import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { askAi } from "../services/openRouter.js";

export const analyzeResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Resume required" });
        }

        const filepath = req.file.path;

        const fileBuffer = await fs.promises.readFile(filepath);
        const uint8Array = new Uint8Array(fileBuffer);

        const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;

        let resumeText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const strings = content.items.map(item => item.str).join(" ");
            resumeText += strings + "\n";
        }
        resumeText = resumeText.replace(/\s+/g, " ").trim();
        const messages = [
            {
                role: "system",
                content: `
Extract structured data from resume.

Return strictly JSON:

{
  "role": "string",
  "experience": "string",
  "projects": ["project1", "project2"],
  "skills": ["skill1", "skill2"]
}
    `
            },
            {
                role: "user",
                content: resumeText
            }
        ];
        const aiResponse = await askAi(messages)
        const parsed = JSON.parse(aiResponse)
        fs.unlinkSync(filepath)

        res.json({
            role: parsed.role,
            experience: parsed.experience,
            projects: parsed.projects,
            skills: parsed.skills,
            resumeText
        });

    } catch (error) {
        console.error(error);
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: `Error occurred while analyzing resume: ${error}` })
    }
};

export const generateQuestion = async (req, res) => {
    try {
        const { role, experience, mode, resumeText, projects, skills } = req.body

        role = role?.trim();
        experience = experience?.trim();
        mode = mode?.trim();

        if (!role || !experience || !mode) {
            return res.status(400).json({ message: "Role, Experience and Mode are required." })
        }

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." })
        }
        if (user.credits < 50) {
            return res.status(404).json({ message: "Minimum 50 credits required." })
        }

        const projectText = Array.isArray(projects) && projects.length ? projects.join(", ") : "None";

        const skillsText = Array.isArray(skills) && skills.length ? skills.join(", ") : "None";

        const safeResume = resumeText?.trim() || "None";

        const userPrompt = `
            Role:${role}
            Experience:${experience}
            InterviewMode:${mode}
            Projects:${projectText}
            Skills:${skillText},
            Resume:${safeResume}
            `;

        if (!userPrompt.trim()) {
            return res.status(400).json({
                message: "Prompt content is empty."
            });
        }

        const messages = [
            {
                role: "system",
                content: `
You are a real human interviewer conducting a professional interview.

Speak in simple, natural English as if you are directly talking to the candidate.

Generate exactly 5 interview questions.

Strict Rules:
- Each question must contain between 15 and 25 words.
- Each question must be a single complete sentence.
- DO NOT number them.
- DO NOT add explanations.
- DO NOT add extra text before or after.
- One question per line only.
- Keep language simple and conversational.
- Questions must feel practical and realistic.

Difficulty progression:
Question 1 → easy
Question 2 → easy
Question 3 → medium
Question 4 → medium
Question 5 → hard

Make questions based on the candidate's role, experience, interviewMode,
projects, skills, and resume details.
`
            },

            {
                role: "user",
                content: userPrompt
            }
        ];
        const aiResponse = await askAi(messages)
        if (!aiResponse || !aiResponse.trim()) {
            return res.status(500).json({
                message: "AI returned empty response."
            });
        }

        const questionsArray = aiResponse
            .split("\n")
            .map(q => q.trim())
            .filter(q => q.length > 0)
            .slice(0, 5);

        if (questionsArray.length === 0) {
            return res.status(500).json({
                message: "AI failed to generate questions."
            });
        }
        user.credits -= 50;
        await user.save();
        const interview = await Interview.create({
            userId: req.userId,
            role,
            experience,
            mode,
            resumeText: safeResume,
            questions: questionsArray.map((q, index) => ({
                question: q,
                difficulty: ["Easy", "Easy", "Medium", "Medium", "Hard"][index],
                timeLimit: [60, 60, 90, 90, 120][index]
            }))
        })
        res.json({
            interviewId: interview._id,
            creditsLeft: user.credits,
            userName: user.name,
            questions: interview.questions
        })
    } catch (error) {
        return res.status(500).json({ message: `Error occurred while creating interview: ${error}` });
    }
}

export const submitAnswer = async (req, res) => {
    try {
        const { interviewId, questionIndex, answer, timeTaken } = req.body

        const interview = await Interview.findById(interviewId)
        const question = interview.questions[questionIndex]

        // If no answer
        if (!answer) {
            question.score = 0;
            question.feedback = "You did not submit an answer.";
            question.answer = "";

            await interview.save();

            return res.json({
                feedback: question.feedback
            });
        }

        // If time exceeded
        if (timeTaken > question.timeLimit) {
            question.score = 0;
            question.feedback = "Time limit exceeded. Answer not evaluated.";
            question.answer = answer;

            await interview.save();

            return res.json({
                feedback: question.feedback
            });
        }

        const messages = [
            {
                role: "system",
                content: `
You are a professional human interviewer evaluating a candidate's answer in a
real interview.

Evaluate naturally and fairly, like a real person would.

Score the answer in these areas (0 to 10):

1. Confidence → Does the answer sound clear, confident, and well-presented?
2. Communication → Is the language simple, clear, and easy to understand?
3. Correctness → Is the answer accurate, relevant, and complete?

Rules:
- Be realistic and unbiased.
- Do not give random high scores.
- If the answer is weak, score low.
- If the answer is strong and detailed, score high.
- Consider clarity, structure, and relevance.

Feedback Rules:
- Write natural human feedback.
- 10 to 15 words only.
- Sound like real interview feedback.
- Can suggest improvement if needed.
- Do NOT repeat the question.
- Do NOT explain scoring.
- Keep tone professional and honest.

Return ONLY valid JSON in this format:

{
    "confidence": number,
    "communication": number,
    "correctness": number,
    "finalScore": number,
    "feedback": "short human feedback"
}
`
            },
            {
                role: "user",
                content: `
Question: ${question.question}
Answer: ${answer}
`
            }
        ];
        const airiResponse = await askAi(messages)
        const parsed=JSON.parse(airiResponse)
        question.answer = answer;
        question.confidence = parsed.confidence;
        question.communication = parsed.communication;
        question.correctness = parsed.correctness;
        question.score = parsed.finalScore;
        question.feedback = parsed.feedback;
        await interview.save();
        return res.status(200).json({feedback: parsed.feedback})
    } catch (error) {
        return res.status(500).json({ message: `Error occurred while evaluating answer: ${error}` });
    }
}

