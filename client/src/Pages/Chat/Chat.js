import React, { useRef, useState } from "react";
import ChatBox from "../../Components/ChatBox";
import Conversation from "../../Components/Conversation";
// import LogoSearch from "../../Components/LogoSearch";
// import NavIcons from "../../Components/Navicons";
import "./Chat.css";
import { useEffect } from "react";
import { userChats } from "../../Redux/api";
import { io } from "socket.io-client";
import Header from "../../Components/Header";

const Chat = () => {
  const socket = useRef();
  // const user = useSelector((state) => (state.auth.user))
  //  console.log(user, "user details");
   const user = JSON.parse(localStorage.getItem('user'));
  const [chats, setChats] = useState([]);

  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);

 useEffect(() => {
  //  console.log("HELLOOOOO "+onlineUsers, currentChat, sendMessage, receivedMessage);
 }, [onlineUsers, sendMessage, receivedMessage])
 


  // Get the chat in chat section
  useEffect(() => {
    const getChats = async () => {
      try {
        const mainUser = await JSON.parse(localStorage.getItem('user'));
        console.log(mainUser, "Maindkksjdksjdkjskd")
        const { data } = await userChats(mainUser.id);

        setChats(data);
        
      } catch (error) {
        console.log(error);
      }
    };
    getChats();
  }, []);

  useEffect(() => {
    // console.log("Chats from outside",chats);
  }, [chats]);
  

  // Connect to Socket.io
  useEffect(() => {
    socket.current = io("ws://localhost:8800");
    socket.current.emit("new-user-add", user.id);
    socket.current.on("get-users", (users) => {
      setOnlineUsers(users);
    });
  }, []);

  // Send Message to socket server
  useEffect(() => {
    if (sendMessage!==null) {
      socket.current.emit("send-message", sendMessage);
    }
  }, [sendMessage]);


  // Get the message from socket server
  useEffect(() => {
    socket.current.on("recieve-message", (data) => {
      setReceivedMessage(data);
    }

    );
  }, []);

  if (!user) {
    return <div>Loading...</div>; // or render a placeholder component
  }


  const checkOnlineStatus = (chats) => {
    try{
      const chatMember = chats?.members?.find((member) => member !== user.id);
    const online = onlineUsers.find((user) => user.userId === chatMember);
    return online ? true : false;
    }catch(err){
      console.log(err)
    }
  };
  
  // console.log(currentChat, "current chat");
  return (
    <>
    <Header/>
    <div className="Chat">
      {/* Left Side */}
      <div className="Left-side-chat">
        {/* <LogoSearch /> */}
        <div className="Chat-container">
          <h2>Chats</h2>
          <div className="Chat-list">
            {chats.map((chat) => (
              <div
                onClick={() => {
                  console.log(chat);
                  setCurrentChat(chat);
                }}
              >
               {user && <Conversation
                  data={chat}
                  currentUser={user.id}
                  online={checkOnlineStatus(chat)}
                />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side */}

      <div className="Right-side-chat">
        <div style={{ width: "20rem", alignSelf: "flex-end" }}>
          {/* <NavIcons /> */}
        </div>
       {user && <ChatBox
           chats={currentChat}
          currentUser={user.id}
          setSendMessage={setSendMessage}
          receivedMessage={receivedMessage}
        />}
      </div>
    </div>
    </>
  );
};

export default Chat;