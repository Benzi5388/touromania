import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { addMessage, getMessages } from "../Redux/api";
import { getUser } from "../Redux/api";
import "./ChatBox.css";
import { format } from "timeago.js";
import { FaPaperPlane } from "react-icons/fa";
import chatbox from '../Assets/chatbox';
import Lottie from "lottie-react";
import {useSelector, useDispatch} from 'react-redux'
import { saveUserData } from "../Redux/Features/authSlice";


const ChatBox = (props) => {
    console.log(props)
    const { chats, currentUser, setSendMessage, receivedMessage } = props;

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch()
    const user = useSelector((state) => (state.auth.user))
    console.log(user, "user details from chatbox page");
    const handleChange = (e) => {
        setNewMessage(e.target.value)
    }

    useEffect(() => {
        if (chats) {
            const userId = chats?.members?.find((id) => id !== currentUser);
            console.log(userId)
            console.log(chats , "1234");
            console.log(userId, "user idddddddddd");

            const getUserData = async () => {
                try {
                    const data = await getUser(user.id);
                    console.log(data, "get user data");
                } catch (error) {
                    console.log(error);
                }
            };

            if (chats) getUserData();
        }
    }, [currentUser, chats]);


    // fetch messages
    useEffect(() => {
        if (chats) {
            const fetchMessages = async () => {
                try {
                    const { data } = await getMessages(chats._id);
                    console.log(data, "messsssages");
                    setMessages(data);
                    setIsLoading(false);
                    dispatch(saveUserData(user))
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
        if (!newMessage) return
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
                            <span><h3>Messages</h3></span>

                        </div>
                        {/* chat-body */}
                        <div className="chat-body" >
                            {messages && messages.map((message) => (
                                <>
                                    <div
                                        ref={scroll}
                                        className={`message ${message.senderId === currentUser ? "own" : ""}`}
                                        style={{
                                            background:
                                                message.senderId === currentUser ? "linear-gradient(98.63deg, #24e4f0 0%, #358ff9 100%)" : "linear-gradient(98.63deg, #24e4f0 0%, #358ff9 100%)",
                                            color: message.senderId === currentUser ? "#fff" : "#fff"
                                        }}
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

                            <button  onClick={handleSend} style={{ border: "none" ,padding:"0px"}}>
                                <i className="fas fa-arrow-right-from-bracket" style={{ fontSize: "40px",color:"#EF9CAA", backgroundColor:"#fff" }}></i>
                            </button>
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
                    <span className="chatbox-empty-message" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '20px', marginBottom: '10px', marginTop: "700px", fontWeight: "bold" }}>Tap on a chat to start a conversation...</div>
                            <div style={{ width: '500px', height: '500px' }}>
                                <Lottie animationData={chatbox} />
                            </div>
                        </div>
                    </span>
                )}
            </div>
        </>
    );
};

export default ChatBox;