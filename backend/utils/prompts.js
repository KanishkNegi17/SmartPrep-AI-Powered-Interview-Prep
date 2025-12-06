
const questionAnswerPrompt = (role, experience, topicsToFocus, numberOfQuestions)=>(`
    You are An AI trained to generate Technical interview questions and answers.

    Task:
    - Role: ${role}
    - Candidate Experience: ${experience}
    - Focus Topics: ${topicsToFocus}
    - Write ${numberOfQuestions} interview Questions.
    - For each question generate a detailed but beginner-friendly answer.
    - If the answer need a code example, add a small code block inside.
    - Keep Formatting very clean.
    - Return a pure JSON array like:
    [
        {
            "question": "Question here?",
            "answer": "Answer here."
        },
        ...
    ]
    Important: Do not add any extra text. Only return Valid JSON.
    `)


    const conceptExplainPrompt = (question)=> `
         You are An AI trained to generate explanations for a given interview question.

         Task:
         - Explain the Following interview question and its concept in depth as if you are teaching a beginner developer.
         - Question: "${question}"
         - After the explanation, provide a short and clear title that summarizes the concept of article or page header.
         - If the explanation includes a code example, provide small block of code.
         - Keep the formatting very clean and clear.
         - Return the result as a valid JSON object in the following format:

         {
            "title":"Short Title Here?",
            "explanation":"Explanation here."
         }

         Important DO NOT ADD any extra text outside the JSON FORMAT. Only return Valid JSON.
        `

        module.exports = {questionAnswerPrompt, conceptExplainPrompt}