const { analyzeExpenses, askFinancialAssistant , streamFinancialAssistant } = require("../services/financeAIService");

 const chatWithAI = async ( req , res ) => {
    try {
        const { message } = req.body;

        if( !message || !message.trim()) {
            return res.status(400).json({
                success:false,
                message:"Message is required."
            })
        }

         const response = await askFinancialAssistant( req.user.id,message);

         return res.status(200).json({
            success: true,
            response
        });



    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong."
        });
    }
};

const analyzeExpenseController = async (req, res) => {
    try {

        const response = await analyzeExpenses(req.user.id);

        res.status(200).json({
            success: true,
            analysis: response,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

 const streamChatWithAI = async (req, res) => {
     try {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const {message} = req.body;

   if (!message) {
    res.status(400).json({ success: false, error: "Message is required" });
    return;
  }

  const stream = await streamFinancialAssistant(
    req.user.id,
    message
);

for await (const chunk of stream) {
   const text = chunk.text;

if (text) {
    res.write(`data: ${text}\n\n`);
}
}

res.write("event: end\n");
res.write("data: done\n\n");

res.end();
     } catch (error) {
        console.error(error);

res.write(`event: error\n`);
res.write(`data: Something went wrong\n\n`);

res.end();}

     }


module.exports = {chatWithAI,
    analyzeExpenseController,
    streamChatWithAI
}