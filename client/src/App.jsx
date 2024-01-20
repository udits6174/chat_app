import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import {
  Box,
  Grid,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo } from "react";

function App() {
  const socket = useMemo(() => io("http://localhost:3000", {}), []);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketID, setSocketId] = useState("");
  const [roomName, setRoomName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  };

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  };
  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id);
      setSocketId(socket.id);
    });
    // socket.on("welcome", (msg)=>{
    //   console.log(msg);
    // })
    socket.on("receive-message", (data) => {
      console.log(data);
      setMessages((messages) => [...messages, data]);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh", // This makes sure the Box takes up the full viewport height
          width: "100%", // This makes sure the Box takes up the full viewport width
          backgroundColor: "#f5f5f5", // This is the background color of the body
        }}
      >
        <Container
          maxWidth="sm"
          sx={{
            padding: "2em",
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
          }}
        >
          <Box sx={{ height: 50 }} />
          <Typography
            variant="h6"
            component="div"
            gutterBottom
            sx={{ marginBottom: "1em" }}
          >
            Private Id: {socketID}
          </Typography>

          <form onSubmit={joinRoomHandler}>
            <Typography variant="h6" gutterBottom>
              Join Room
            </Typography>
            <Grid
              container
              spacing={1}
              alignItems="flex-end"
              sx={{ marginTop: "1em" }}
            >
              <Grid item xs={5}>
                <TextField
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  id="outlined-basic"
                  label="Room Name"
                  variant="outlined"
                  sx={{ marginBottom: "1em" }}
                />
              </Grid>
              <Grid item xs={2}>
                <Button type="submit" variant="contained" color="primary">
                  Join
                </Button>
              </Grid>
            </Grid>
          </form>

          <form onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom sx={{ marginTop: '2em' }}>
              Enter id/room and Chat!
            </Typography>
            <Grid container spacing={1} alignItems="flex-end">
              <Grid item xs={5}>
                <TextField
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  id="outlined-basic"
                  label="Message"
                  variant="outlined"
                  sx={{ marginBottom: "1em" }}
                />
                <TextField
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  id="outlined-basic"
                  label="Room"
                  variant="outlined"
                  sx={{ marginBottom: "1em" }}
                />
              </Grid>
              <Grid item xs={2}>
                <Button type="submit" variant="contained" color="primary">
                  Send
                </Button>
              </Grid>
            </Grid>
          </form>

          <Stack sx={{ marginTop: "1em" }}>
            {messages.map((m, i) => (
              <Typography
                key={i}
                variant="h6"
                component="div"
                gutterBottom
                sx={{
                  backgroundColor: "#cfe8fc",
                  padding: "1em",
                  borderRadius: "8px",
                }}
              >
                {m}
              </Typography>
            ))}
          </Stack>
        </Container>
      </Box>
    </>
  );
}

export default App;
