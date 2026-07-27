import { useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";
import ChatWindow from "../components/ChatWindow";
import ChatInput from "../components/ChatInput";
import SuggestedQuestions from "../components/SuggestedQuestions";

import { sendMessageStream } from "../services/aiService";

import {
    Bot,
    Sparkles,
    TrendingUp,
    PiggyBank,
    BarChart3,
    RotateCcw,
    Target,
} from "lucide-react";

const defaultMessage = [
    {
        sender: "ai",
        message:
            "👋 Hello! I'm your AI Financial Assistant.\n\nI can help you analyze expenses, identify spending habits, suggest savings, create budgets, and answer finance-related questions.",
    },
];

const AIAssistant = () => {

    const [messages, setMessages] = useState(defaultMessage);

    const [loading, setLoading] = useState(false);

    const resetChat = () => {

        setMessages(defaultMessage);

    };

    const handleSendMessage = async (userMessage) => {

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


    <div className="fixed inset-0 -z-10 overflow-hidden">

        <div className="absolute top-0 left-20 w-[350px] h-[350px] bg-indigo-300 opacity-20 blur-[150px] rounded-full"></div>

        <div className="absolute bottom-20 right-20 w-[350px] h-[350px] bg-cyan-300 opacity-20 blur-[150px] rounded-full"></div>

        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-purple-300 opacity-10 blur-[150px] rounded-full"></div>

    </div>


            <div className="max-w-7xl mx-auto space-y-8">

                {/* Hero */}

                <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 p-8 shadow-2xl text-white">

                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-8">

                        <div className="flex items-center gap-5">

                            <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-lg flex items-center justify-center">

                                <Bot size={42} />

                            </div>

                            <div>

                                <h1 className="text-4xl font-bold">

                                    AI Financial Assistant

                                </h1>

                                <p className="mt-3 text-indigo-100 text-lg">

                                    Your intelligent finance companion for smarter spending, budgeting and savings.

                                </p>

                            </div>

                        </div>

                        <button

                            onClick={resetChat}

                            className="flex items-center justify-center gap-3 bg-white/20 hover:bg-white/30 transition-all px-6 py-4 rounded-2xl backdrop-blur-lg"

                        >

                            <RotateCcw size={20} />

                            New Chat

                        </button>

                    </div>

                </div>

               

                                {/* ================= Suggested Questions ================= */}

                <div className="bg-white rounded-3xl shadow-lg p-6">

                    <div className="flex items-center gap-3 mb-5">

                        <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center">

                            <Sparkles
                                className="text-indigo-600"
                                size={22}
                            />

                        </div>

                        <div>

                            <h2 className="text-xl font-bold text-slate-800">

                                Quick Questions

                            </h2>

                            <p className="text-gray-500 text-sm">

                                Start a conversation instantly with one click.

                            </p>

                        </div>

                    </div>

                    <SuggestedQuestions
                        onSelect={handleSendMessage}
                    />

                </div>

                {/* ================= Chat Section ================= */}

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

                    {/* Chat Header */}

                    <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-indigo-50 px-6 py-5">

                        <div className="flex items-center justify-between">

                            <div className="flex items-center gap-4">

                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg">

                                    <Bot size={24} />

                                </div>

                                <div>

                                    <h2 className="font-bold text-slate-800">

                                        SpendWise AI

                                    </h2>

                                    <p className="text-sm text-green-600 flex items-center gap-2">

                                        <span className="w-2 h-2 rounded-full bg-green-500"></span>

                                        Online • Streaming Enabled

                                    </p>

                                </div>

                            </div>

                            <div className="hidden md:flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium">

                                🤖 AI Powered

                            </div>

                        </div>

                    </div>

                    {/* Chat Body */}

                    <div
                        className="
                            bg-slate-50
                            h-[500px]
                            overflow-y-auto
                            px-6
                            py-6
                        "
                    >

                        <ChatWindow
                            messages={messages}
                            loading={loading}
                        />

                    </div>

                    {/* Chat Footer */}

                    <div className="border-t border-slate-200 bg-white p-5">

                        <ChatInput
                            onSend={handleSendMessage}
                            loading={loading}
                        />

                    </div>

                </div>
                 
  {/* Feature Cards */}

                <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">

                    <div className="bg-white rounded-3xl shadow-lg p-6">

                        <BarChart3 className="text-indigo-600"/>

                        <h2 className="font-bold mt-4">

                            Expense Analysis

                        </h2>

                        <p className="text-sm text-gray-500 mt-2">

                            Understand where your money goes.

                        </p>

                    </div>

                    <div className="bg-white rounded-3xl shadow-lg p-6">

                        <PiggyBank className="text-green-600"/>

                        <h2 className="font-bold mt-4">

                            Saving Tips

                        </h2>

                        <p className="text-sm text-gray-500 mt-2">

                            Smart suggestions to save more.

                        </p>

                    </div>

                    <div className="bg-white rounded-3xl shadow-lg p-6">

                        <TrendingUp className="text-red-600"/>

                        <h2 className="font-bold mt-4">

                            Spending Trends

                        </h2>

                        <p className="text-sm text-gray-500 mt-2">

                            Discover your financial habits.

                        </p>

                    </div>

                    <div className="bg-white rounded-3xl shadow-lg p-6">

                        <Sparkles className="text-purple-600"/>

                        <h2 className="font-bold mt-4">

                            Budget Planner

                        </h2>

                        <p className="text-sm text-gray-500 mt-2">

                            Build smarter monthly budgets.

                        </p>

                    </div>

                </div>
                                {/* ================= AI Tips ================= */}

                <div className="grid md:grid-cols-3 gap-6">

                    <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300">

                        <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center">

                            <BarChart3
                                className="text-indigo-600"
                                size={26}
                            />

                        </div>

                        <h2 className="font-bold text-lg mt-5">

                            Smart Analysis

                        </h2>

                        <p className="text-gray-500 mt-3">

                            Get AI-powered insights about your spending habits
                            and identify unnecessary expenses instantly.

                        </p>

                    </div>

                    <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300">

                        <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">

                            <PiggyBank
                                className="text-green-600"
                                size={26}
                            />

                        </div>

                        <h2 className="font-bold text-lg mt-5">

                            Save More

                        </h2>

                        <p className="text-gray-500 mt-3">

                            Receive personalized saving strategies based on
                            your monthly expenses and spending behaviour.

                        </p>

                    </div>

                    <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300">

                        <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center">

                            <Target
                                className="text-purple-600"
                                size={26}
                            />

                        </div>

                        <h2 className="font-bold text-lg mt-5">

                            Budget Planning

                        </h2>

                        <p className="text-gray-500 mt-3">

                            Create realistic monthly budgets and stay on track
                            with AI recommendations.

                        </p>

                    </div>

                </div>

                {/* Footer */}

                <div className="text-center py-6">

                    <p className="text-gray-500">

                        Powered by

                        <span className="font-semibold text-indigo-600 ml-2">

                            SpendWise AI

                        </span>

                    </p>

                    <p className="text-sm text-gray-400 mt-2">

                        Personalized Financial Intelligence • Secure • Fast •
                        Real-time Streaming

                    </p>

                </div>

            </div>

        </DashboardLayout>

    );

};

export default AIAssistant;