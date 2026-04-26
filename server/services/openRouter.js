import axios from "axios"

export const askAi = async (massage) => {
    try {
        if (!massage || !Array.isArray(massage) || massage.length == 0) {
            throw new error("The massage array is empty");
        }
        const response = await axios.post("https://openrouter.ai/api/v1/chat/completions",
            {
                model: "openai/gpt-4o-mini",
                messages: messages,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                },
            })

        const content = response?.data?.choices?.[0]?.massage?.content;
        if (!content || !content.trim()) {
            throw new error("AI return empty Response")
        }
        return content
    } catch (error) {
        console.log("OpenRouter Error:", error.response?.data || error.massage)
        throw new Error("OpenRouter API error");

    }
}