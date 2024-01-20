import express from "express";
import { Server } from "socket.io";
import {createServer} from "http";
import cors from "cors";

const PORT = 3000;

const app = express();
const server = createServer(app); //http default server
const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  
  app.use(
    cors({
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    })
  );
io.on("connection", (socket)=>{
    console.log("Socket connected");
    console.log(`Socket id: ${socket.id}`)
    // socket.emit("welcome", `Welcome ${socket.id} to the server`);
    //socket.broadcast.emit("welcome", `Welcome ${socket.id} to the server`);
    socket.on("message", ({ room, message }) => {
        console.log({ room, message });
        socket.to(room).emit("receive-message", message);
      });
    
    socket.on("join-room", (room) => {
        socket.join(room);
        console.log(`User joined room ${room}`);
      });

    socket.on("disconnect", ()=>{
        console.log(`User ${socket.id} disconnected`)
    })
})


server.listen(PORT, ()=>{
    console.log(`Server up on port ${PORT}`)
})