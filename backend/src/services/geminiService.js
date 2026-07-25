const {GoogleGenAI} = require("@google/genai")

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
})
 
 const generateAIResponse = async (prompt) => {
    try {
   const response = await ai.models.generateContent({
    model: "models/gemini-3.5-flash",
    contents: prompt,
}); 
return response.text;
}  catch(error) {
   console.error("Gemini Error:" , error);
   throw new Error("Failed to generate AI response")
    
}
};

const generateAIResponseStream = async (prompt) => {
    try {
        const stream = await ai.models.generateContentStream({
            model: "models/gemini-3.5-flash",         contents: prompt,
        });
        return stream;
    } catch (error) {
        console.error("Gemini Error:", error);
        throw new Error("Failed to generate AI response");
    }
};


module.exports = { generateAIResponse , generateAIResponseStream };