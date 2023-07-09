const io = require("socket.io")(8800, {
    cors: {
      origin: "http://localhost:3000",
    },
  });
  
  let activeUsers = [];
  
  io.on("connection", (socket) => {
    // add new user
    socket.on("new-user-add", (newUserId) => {
      if (!activeUsers.some((user) => user.userId === newUserId)) {
        activeUsers.push({ userId: newUserId, socketId: socket.id });
      }
      io.emit("get-users", activeUsers);
      console.log("user connected", activeUsers); // Log activeUsers after a new user is added
    });
  
    socket.on("disconnect", () => {
      activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
      console.log("user disconnected", activeUsers);
    });
  });
  