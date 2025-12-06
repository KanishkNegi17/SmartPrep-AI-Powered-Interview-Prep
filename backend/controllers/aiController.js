const {GoogleGenAI} = require('@google/genai')
const {conceptExplainPrompt, questionAnswerPrompt} = require("../utils/prompts")

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY})

//@desc generate Interview Questions
//@route POST /api/ai/generate-questions
//@access Private
const generateInterviewQuestions = async (req,res)=>{
    try {
        const {role, experience, topicsToFocus, numberOfQuestions} = req.body
        
        if(!role || !experience || !topicsToFocus || !numberOfQuestions){
            return res.status(400).json({message: "Missing Required Fields"})
        }

        const prompt = questionAnswerPrompt(role, experience, topicsToFocus, numberOfQuestions)

        const response = await ai.models.generateContent({
            model:"gemini-2.0-flash-lite",
            contents:  prompt,
        })

        let rawText = response.text

        //Clean IT remove ```JSON and ```
        const cleanedText = rawText.replace(/^```json\s*/, "") //remove starting ```
        .replace(/```$/, "") // remove ending ```
        .trim() //remove extra spaces

        //Now Safe To Parse
        const data = JSON.parse(cleanedText)

        res.status(200).json({data}) 
    } catch (error) {
        res.status(500).json({message: "Failed to generate Questions", error: error.message,})
    }
}

//@desc generate Explain Questions
//@route POST /api/ai/generate-explanation
//@access Private
const generateConceptExplanation = async (req,res)=>{
    try {
        const {question} = req.body

        if(!question){
            return res.status(400).json({message:"Missing Required Fields"})
        }

        const prompt = conceptExplainPrompt(question)

        const response = await ai.models.generateContent({
            model:"gemini-2.0-flash-lite",
            contents: prompt,
        })

        let rawText = response.text

        //Clean IT remove ```JSON and ```
        const cleanedText = rawText.replace(/^```json\s*/, "") //remove starting ```
        .replace(/```$/, "") // remove ending ```
        .trim() //remove extra spaces

        //Now Safe To Parse
        const data = JSON.parse(cleanedText)

        res.status(200).json({data}) 
    } catch (error) {
        res.status(500).json({message: "Failed to generate Questions", error: error.message,})
    }
}

module.exports = {generateInterviewQuestions, generateConceptExplanation}