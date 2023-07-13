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
import { MDBDropdown, MDBDropdownMenu, MDBDropdownToggle, MDBDropdownItem } from 'mdb-react-ui-kit';
import { saveUserData  } from '../../Redux/Features/authSlice';
import axios from 'axios';
import { useDispatch } from "react-redux";
import '../../Redux/api';
import Swal from 'sweetalert2'

const Chat = () => {
  const socket = useRef();
  const dispatch = useDispatch
  // const user = useSelector((state) => (state.auth.user))
  //  console.log(user, "user details");
   const user = JSON.parse(localStorage.getItem('user'));
  const [chats, setChats] = useState([]);

  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);
  const[users, setUsers] = useState([])

 useEffect(() => {
  //  console.log("HELLOOOOO "+onlineUsers, currentChat, sendMessage, receivedMessage);
 }, [onlineUsers, sendMessage, receivedMessage])
 


  // Get the chat in chat section
  useEffect(() => {
    const getChats = async () => {
      try {
        const mainUser = await JSON.parse(localStorage.getItem('user'));
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
  

  const handleSearch = async (searchQuery) => {
    try {
      const response = await axios.get(`http://localhost:5000/chat/?search=${searchQuery}`);
      const users = response.data.users;
  
      const buttons = users.map((user, index) => {
        return {
          text: user.name,
          value: user._id,
        };
      });
  
      Swal.fire({
        title: 'Users',
        icon: 'info',
        showCloseButton: true,
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        allowOutsideClick: false, // Prevent closing Swal when clicking outside
        html: getButtonsHtml(buttons),
        showConfirmButton: false,
      });
  
      // Add event listeners to the custom buttons
      const buttonElements = document.getElementsByClassName('swal2-radio');
      for (let i = 0; i < buttonElements.length; i++) {
        buttonElements[i].addEventListener('click', (event) => {
          // Check if the event is already handled
          if (event.defaultPrevented) {
            return;
          }
  
          // Prevent further event handling
          event.preventDefault();
  
          const selectedUserId = buttonElements[i].querySelector('input[type="radio"]').value;
          const selectedUser = users.find(user => user._id === selectedUserId);
  
          const chatData = {
            senderId: user.id, // Replace with actual sender ID
            receiverId: selectedUser._id,
          };
          
          axios.post('http://localhost:5000/chat/', chatData)
            .then((response) => {
              // Chat created successfully
              console.log('Chat created:', response.data);
              const newChat = response.data;

          // Update the chat list with the new chat
          setChats(prevChats => [...prevChats, newChat]);
  
              // Perform any additional actions or UI updates as needed
            })
            .catch((error) => {
              // Error occurred while creating chat
              console.error('Error creating chat:', error);
  
              // Display an error message or handle the error as required
            });
  
          Swal.close();
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  // Helper function to generate HTML for the custom buttons
  const getButtonsHtml = (buttons) => {
    const buttonsHtml = buttons.map((button) => {
      return `
        <label class="swal2-radio" style="display: inline-block; margin-right: 10px;">
          <input type="radio" name="user" value="${button.value}">
          <span>${button.text}</span>
        </label>
      `;
    }).join('');
  
    return `
      <div style="text-align: left;">
        ${buttonsHtml}
      </div>
    `;
  };
  
  
  
  
  
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
      <Header handleSearch={handleSearch} />
      <div className="Chat">
        {/* Left Side */}
        <div className="Left-side-chat">
          {/* <LogoSearch /> */}
          <div className="Chat-container">
            <h2>Chats</h2>
            <hr />
            <div className="Chat-list">
              {chats.length === 0 ? (
                <>
                  <h5>No Chats Found!!</h5>
                  <h6>Search for a user to start chatting</h6>
                </>
              ) : (
                <div className="Conversation-list">
                  {chats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => {
                        console.log(chat);
                        setCurrentChat(chat);
                      }}
                    >
                      {user && (
                        <Conversation
                          data={chat}
                          currentUser={user.id}
                          online={checkOnlineStatus(chat)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
  
        {/* Right Side */}
        <div className="Right-side-chat">
          <div className="Right-side-content">
            <div style={{ width: "20rem" }}>
              {/* <NavIcons /> */}
            </div>
            {user && (
              <ChatBox
                chats={currentChat}
                currentUser={user.id}
                setSendMessage={setSendMessage}
                receivedMessage={receivedMessage}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
  
  
  
};

export default Chat;