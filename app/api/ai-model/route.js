import { QUESTION_GENERATION_PROMPT } from "@/constants/prompt";
import OpenAI from "openai";

export async function POST(request) {
    try {
        const { jobPosition, jobDescription, duration, interviewTypes } = await request.json();

        // Validate required fields
        if (!jobPosition || !jobDescription || !duration || !interviewTypes) {
            return new Response(
                JSON.stringify({ error: "Missing required fields" }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        const PROMPT = QUESTION_GENERATION_PROMPT
            .replace("{{jobTitle}}", jobPosition)
            .replace("{{jobDescription}}", jobDescription)
            .replace("{{duration}}", duration)
            .replace("{{interviewTypes}}", Array.isArray(interviewTypes) ? interviewTypes.join(", ") : interviewTypes);

        console.log("Generated prompt:", PROMPT);

        const openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.OPENROUTER_API_KEY,
        });

        const completion = await openai.chat.completions.create({
            model: "openrouter/cypher-alpha:free",
            messages: [
                {
                    role: "user",
                    content: PROMPT
                },
            ],
            temperature: 0.7,
            max_tokens: 2000,
        });

        const responseContent = completion.choices[0].message.content;
        console.log("AI response:", responseContent);

        // Try to extract and validate JSON from the response
        let extractedJSON = responseContent;

        // Remove markdown code blocks if present
        const jsonMatch = responseContent.match(/```json\n?([\s\S]*?)\n?```/);
        if (jsonMatch) {
            extractedJSON = jsonMatch[1];
        }

        // Validate that we can parse the JSON
        let parsedQuestions;
        try {
            parsedQuestions = JSON.parse(extractedJSON);
        } catch (parseError) {
            console.error("Failed to parse AI response as JSON:", parseError);
            return new Response(
                JSON.stringify({
                    error: "AI response format error",
                    details: "Unable to parse questions from AI response"
                }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        // Return the original response for the frontend to handle
        return new Response(
            JSON.stringify({
                role: "assistant",
                content: responseContent
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );

    } catch (error) {
        console.error("AI model API error:", error);

        return new Response(
            JSON.stringify({
                error: "Failed to generate interview questions",
                details: error.message
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}