import { io } from "socket.io-client";
import backendUrl from "./backendConfig";

const socket = io(backendUrl, {
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