import { useState } from "react";
import SuggestedQuestions from "../components/SuggestedQuestions";
import DashboardLayout from '../layouts/DashboardLayout'
import ChatWindow from "../components/ChatWindow";
import ChatInput from "../components/ChatInput";

import { sendMessageStream } from "../services/aiService";

const AIAssistant = () => {


    const [messages, setMessages] = useState([
        {
            sender: "ai",
            message:
                "Hello! I'm your AI Financial Assistant. Ask me anything about your expenses, spending habits, or savings.",
        },
    ]);

    const [loading, setLoading] = useState(false);

   const handleSendMessage = async (userMessage) => {

    // Add user message
    setMessages((prev) => [
        ...prev,
        {
            sender: "user",
            message: userMessage,
        },
         {
            sender: "ai",
            message: "",
        },
    ]);

    // Add an empty AI message immediately
    
       
    

    setLoading(true);

    try {

        await sendMessageStream(
            userMessage,

            (chunk) => {

                setMessages((prev) => {

                    const updated = [...prev];

                    updated[updated.length - 1] = {
                        ...updated[updated.length - 1],
                        message:
                            updated[updated.length - 1].message + chunk,
                    };

                    return updated;

                });

            }

        );

    } catch (error) {

        console.error(error);

        setMessages((prev) => {

            const updated = [...prev];

            updated[updated.length - 1] = {

                sender: "ai",

                message:
                    "Something went wrong while contacting the AI.",

            };

            return updated;

        });

    } finally {

        setLoading(false);

    }

};

    return (

        <DashboardLayout>

            <div className="max-w-5xl mx-auto py-8">

                <div className="bg-white rounded-2xl shadow-lg p-6">

                    <h1 className="text-3xl font-bold mb-2">

                        AI Financial Assistant

                    </h1>

                    <p className="text-gray-500 mb-6">

                        Ask anything about your expenses, spending habits,
                        savings, or financial insights.

                    </p>

                    <ChatWindow messages={messages} loading={loading} />

                    <SuggestedQuestions
                   onSelect={handleSendMessage}
/>


                    <ChatInput
                        onSend={handleSendMessage}
                        loading={loading}
                    />

                </div>

            </div>

        </DashboardLayout>

    );

};

export default AIAssistant;