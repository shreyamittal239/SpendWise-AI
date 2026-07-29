import { io } from "socket.io-client";

const SOCKET_URL =
    import.meta.env.VITE_API_URL || "http://localhost:3000";

const socket = io(SOCKET_URL, {
    withCredentials: true,
});

socket.on("connect", () => {
    console.log("✅ Connected:", socket.id);
});
socket.onAny((event, ...args) => {
    console.log("📨 Event:", event, args);
});

socket.on("disconnect", () => {
    console.log("❌ Disconnected");
});


export default socket;