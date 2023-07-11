import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { addMessage, getMessages } from "../Redux/api";
import { getUser } from "../Redux/api";
import "./ChatBox.css";
import { format } from "timeago.js";
import InputEmoji from 'react-input-emoji'

const ChatBox = (props) => {
    console.log(props)
    const { chats, currentUser, setSendMessage, receivedMessage } =props;

    // console.log(chats, "2222222222");

    const [userData, setUserData] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const user = JSON.parse(localStorage.getItem('user'));
    const handleChange = (e) => {
        setNewMessage(e.target.value)
    }

    // console.log(user, "999999");

    // fetching data for header
useEffect(() => {
// console.log("this is use effect from",chats);
  if (chats) {
    const userId = chats?.members?.find((id) => id !== currentUser);
    // console.log(userId)
    // console.log(chats , "1234");
    // console.log(userId, "user idddddddddd");

    const getUserData = async () => {
      try {
        const data = await getUser(user.id);
        console.log(data, "get user data");
        setUserData(data);
      } catch (error) {
        console.log(error);
      }
    };

    if(chats) getUserData();
  }
}, [currentUser, chats]);


    // fetch messages
    useEffect(() => {
        if(chats){
            const fetchMessages = async () => {
                try {
                    const { data } = await getMessages(chats._id);
                    console.log(data, "messsssages");
                    setMessages(data);
                } catch (error) {
                    console.log(error);
                }
            };
    
            if (chats !== null) fetchMessages();

        }
      
    }, [chats]);


    // Always scroll to last Message
    useEffect(() => {
        scroll.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages])



    // Send Message
    const handleSend = async (e) => {
        e.preventDefault()
        if(!newMessage) return
        const message = {
            senderId: currentUser,
            text: newMessage,
            chatId: chats._id,
        }
        const receiverId = chats.members.find((id) => id !== currentUser);
        // send message to socket server
        setSendMessage({ ...message, receiverId })
        // send message to database
        try {
            const { data } = await addMessage(message);
            setMessages([...messages, data]);
            setNewMessage("");
        }
        catch
        {
            console.log("error")
        }
    }

    // Receive Message from parent component
    useEffect(() => {
        console.log("Message Arrived: ", receivedMessage)
        if (receivedMessage !== null && receivedMessage.chatId === chats._id) {
            setMessages([...messages, receivedMessage]);
        }

    }, [receivedMessage])



    const scroll = useRef();
    const imageRef = useRef();
    return (
        <>
            <div className="ChatBox-container">
                {chats ? (
                    <>
                        {/* chat-header */}
                        <div className="chat-header">
                            <div className="follower">
                                <div>
                                    <img
                                        src={'/profilepic.jpg' }
                                        alt="Profile"
                                        className="followerImage"
                                        style={{ width: "50px", height: "50px" }}
                                    />
                                    <div className="name" style={{ fontSize: "0.9rem" }}>
                                        <span>
                                            {userData?.name}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <hr
                                style={{
                                    width: "95%",
                                    border: "0.1px solid #ececec",
                                    marginTop: "20px",
                                }}
                            />
                        </div>
                        {/* chat-body */}
                        <div className="chat-body" >
                            { messages && messages.map((message) => (
                                <>
                                    <div ref={scroll}
                                        className={
                                            message.senderId === currentUser
                                                ? "message own"
                                                : "message"
                                        }
                                    >
                                        <span>{message.text}</span>{" "}
                                        <span>{format(message.createdAt)}</span>
                                    </div>
                                </>
                            ))}
                        </div>
                        {/* chat-sender */}
                        <div className="chat-sender">
                            {/* <div onClick={() => imageRef.current.click()}>+</div> */}
                            {/* <InputEmoji
                                value={newMessage}
                                onChange={handleChange}
                            /> */}
                            <textarea type="text" value={newMessage} onChange={handleChange} />
                            <button className="send-button button" onClick={handleSend}>Send</button>
                            <input
                                type="file"
                                name=""
                                id=""
                                style={{ display: "none" }}
                                ref={imageRef}
                            />
                        </div>{" "}
                    </>
                ) : (
                    <span className="chatbox-empty-message">
                        Tap on a chat to start conversation...
                    </span>
                )}
            </div>
        </>
    );
};

export default ChatBox;