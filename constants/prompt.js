export const QUESTION_GENERATION_PROMPT = `
You are an expert technical interviewer.
Based on the following inputs, generate a well-structured list of high-quality interview questions:

Job Title: {{jobTitle}}
Job Description: {{jobDescription}}
Interview Duration: {{duration}}
Interview Type: {{interviewTypes}}

🎯 Your task:
- Analyze the job description to identify key responsibilities, required skills, and expected experience.
- Generate a list of interview questions depends on interview duration
- Adjust the number and depth of questions to match the interview duration.
- Ensure the questions match the tone and structure of a real-life {{interviewTypes}} interview.

🔧 IMPORTANT: Format your response as valid JSON only. Do not include any markdown formatting or additional text.

Expected JSON format:
{
  "interviewQuestions": [
    {
      "question": "Your question here",
      "type": "Technical"
    },
    {
      "question": "Your question here", 
      "type": "Behavioral"
    }
  ]
}

Valid question types: "Technical", "Behavioral", "Experience", "Problem Solving", "Leadership"

🎯 The goal is to create a structured, relevant, and time-optimized interview plan for a {{jobTitle}} role.
`;


export const FEEDBACK_PROMPT = `{{conversation}}
Depends on this Interview Conversation between assistant and user,
Give me feedback for user interview. Give me rating out of 10 for technical Skills,
Communication, Problem Solving, Experince. Also give me summery in 3 lines 
about the interview and one line to let me know whether is recommanded 
for hire or not with msg. Give me response in JSON format
{
    feedback:{
        rating:{
            techicalSkills:5,
            communication:6,
            problemSolving:4,
            experince:7
        },
        summery:<in 3 Line>,
        Recommendation:"",
        RecommendationMsg:""
    }
}
`