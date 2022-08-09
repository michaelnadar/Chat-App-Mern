const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const messageRoute =require("./routes/messageRoute");
const socket = require("socket.io");
require("dotenv").config();
const router = require("./routes/userRoutes");
app.use(cors());
app.use(express.json());
app.use("/api/auth",router);
app.use("/api/messages",messageRoute);

mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("DB connected successfully");
}).catch((err)=>{
   console.log(err.message);
});
const server =  app.listen(process.env.PORT,()=>{
    console.log(`Server connected successfully on Port  ${process.env.PORT}.`);
});

const io = socket(server,{
    cors:{
       origin:"http://localhost:3000",
        Credential:true,     
    }}
    );

    global.onlineUsers = new Map();
   io.on("connection",(socket)=>{
    global.chatSocket = socket;
    socket.on("add-user",(userId)=>{
        onlineUsers.set(userId,socket.id);
    });
    socket.on("send-msg",(data)=>{
        const sendUserSocket = onlineUsers.get(data.to);
        if(sendUserSocket){
            socket.to(sendUserSocket).emit("msg-receive",data.message);
        }
       });
      


});

  