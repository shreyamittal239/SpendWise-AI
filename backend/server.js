
require("dotenv").config();

const app = require("./src/app");
const connectToDB = require("./src/config/database");
const http = require("http");
const { Server } = require("socket.io");
const { corsOptions } = require("./src/config/cors");

const server = http.createServer(app);

const io = new Server(server, {
    cors: corsOptions
});

app.set("io", io);

const PORT = process.env.PORT || 5000;

connectToDB();

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    setTimeout(() => {
        socket.emit("welcome", {
            message: "Welcome to SpendWise AI 🚀"
        });
    }, 5000);

    socket.on("disconnect", () => {
        console.log("User Disconnected:", socket.id);
    });
});
