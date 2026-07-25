import api from "./api";

export const sendMessage = async (message) => {

    const response = await api.post("/ai/chat", {
        message,
    });
     console.log("AI Response:", response.data);

    return response.data;
};
  export const analyzeExpenses = async () => {

    const response = await api.post("/ai/analyze");

    return response.data;
};

export const sendMessageStream = async (message, onChunk) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
        "http://localhost:3000/api/ai/chat/stream",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                message,
            }),
        }
    );

    if (!response.ok) {
        throw new Error("Streaming failed");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let buffer = "";

    while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const events = buffer.split("\n\n");
        buffer = events.pop() || "";

        for (const event of events) {
            const lines = event.split("\n");

            for (const line of lines) {
                if (line.startsWith("data: ")) {
                    const text = line.replace("data: ", "");

                    if (text !== "done") {
                        onChunk(text);
                    }
                }
            }
        }
    }
};
