require("dotenv").config();
const app = require("./src/app")
const connectToDB = require("./src/config/database")
const http = require("http");

const server = http.createServer(app);

const {Server} = require("socket.io");

const io = new Server(server , {
      cors: {
        origin: "http://139.84.163.56",
        credentials: true,
    },
});

app.set("io", io);

const PORT = process.env.PORT
 connectToDB();


server.listen(PORT, () =>{
    console.log(`server is running on port ${PORT}`)
})

io.on("connection", (socket) => {

    console.log("User Connected:", socket.id);
        
    setTimeout(() => {
        socket.emit("welcome", {
            message:"Welcome to SpendWise AI 🚀",
        })
    }, 5000);
        
   

    socket.on("disconnect", () => {

        console.log("User Disconnected:", socket.id);

    });

});

{/*  
    app.listen(PORT, () =>{
    console.log(`server is running on port ${PORT}`)
})  
     */}