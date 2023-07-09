import React, { useEffect, useRef, useState } from 'react'
import { MDBCard, MDBCardBody, MDBContainer, MDBRow, MDBTypography, MDBIcon, MDBCardHeader, MDBBtn, MDBInput, MDBCol } from 'mdb-react-ui-kit';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Header from '../../Components/Header';
import moment from 'moment';
import {io} from 'socket.io-client';

const Chat = () => {

    const [chats, setChats] = useState([])
    const user = useSelector((state) => (state.auth.user))
    const [isLoading, setIsLoading] = useState(true);
    const [otherUser, setOtheruser] = useState('');
    const [messageText, setMessageText] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [newMessages, setnewMessages] = useState('');
    const [onlineUsers, setOnlineUsers] = useState([]);


    const socket = useRef

    useEffect(() => {
        socket.current = io('http://localhost:8800');
        if (user) {
          socket.current.emit('new-user-add', user.id);
        }
        socket.current.on('get-users', (users) => {
          setOnlineUsers(users);
        });
      }, [user]);

      useEffect(() => {
        console.log(onlineUsers, "onnnnnnnnnnn");
      }, [onlineUsers]);

    useEffect(() => {
        const getChats = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/chat/${user.id}`);
                console.log(response.data, "dddddddd");
                setChats(response.data)
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        }
        getChats();
    }, [user]);

    const getOtherPersonName = async (members) => {
        const otherPersonId = members.find((member) => member !== user.id);
        try {
            const response = await axios.get(`http://localhost:5000/chat/user/${otherPersonId}`);
            console.log(response.data);
            setOtheruser(response.data);
        } catch (err) {
            console.error(err);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (chats.length > 0) {
            getOtherPersonName(chats[0].members);
        }
    }, [chats, user]);

    const getMessages = async (chatId) => {
        try {
            const response = await axios.get(`http://localhost:5000/message/${chatId}`);
            console.log(response.data[0].text, "my messages");
            setMessageText(response.data[0].text)
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        chats.forEach((chat) => {
            getMessages(chat._id);
        });
    }, [chats]);

    useEffect(() => {
        if (selectedChat) {
            getMessages(selectedChat._id);
        }
    }, [selectedChat]);

    const handleChange = (e) => {
        setnewMessages(e.target.value);
      }

      const handleSend = async (e) =>{
        e.preventDefault();
        const message = {
            senderId : user.id,
            text: newMessages,
            chatId: chats[0]._id,
        }
           
        try{
            const response = await axios.post("http://localhost:5000/message/", message)
            console.log(response.data, "new");
            setnewMessages('');
        }
        catch(err){
            console.log(err);
        }
      }

    return (
        <>
            <Header />
            <MDBContainer fluid className="py-5" style={{ backgroundColor: "#eee", marginTop: "70px" }}>
                <MDBRow>
                    <MDBCol md="6" lg="5" xl="4" className="mb-4 mb-md-0">
                        <h5 className="font-weight-bold mb-3 text-center text-lg-start">
                            Chats
                        </h5>

                        <MDBCard>
                            <MDBCardBody>
                                <MDBTypography listUnStyled className="mb-0">
                                    {isLoading ? (
                                        <div>Loading chats...</div>
                                    ) : (
                                        chats.map((chat) => (
                                            <li
                                                key={chat._id}
                                                className="p-2 border-bottom"
                                                style={{ backgroundColor: "#eee" }}
                                            >
                                                <a href="#!" className="d-flex justify-content-between">
                                                    <div className="d-flex flex-row">
                                                        <img
                                                            src='/profilepic.jpg'
                                                            alt="avatar"
                                                            className="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
                                                            width="60"
                                                        />
                                                        <div className="pt-1">
                                                            <p className="fw-bold mb-0">{otherUser.name}</p>
                                                            <p className="small text-muted">
                                                                {messageText}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="pt-1">
                                                        <p className="small text-muted mb-1">{moment(chat.createdAt).fromNow()}</p>
                                                        <span className="badge bg-danger float-end">{chat.unread}</span>
                                                    </div>
                                                </a>
                                            </li>
                                        ))
                                    )}
                                </MDBTypography>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                    <MDBCol md="6" lg="7" xl="8">
                        <MDBTypography listUnStyled>
                            <li className="d-flex justify-content-between mb-4">
                                <img
                                    src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-6.webp"
                                    alt="avatar"
                                    className="rounded-circle d-flex align-self-start me-3 shadow-1-strong"
                                    width="60"
                                />
                                <MDBCard>
                                    <MDBCardHeader className="d-flex justify-content-between p-3">
                                        <p className="fw-bold mb-0">Brad Pitt</p>
                                        <p className="text-muted small mb-0">
                                            <MDBIcon far icon="clock" /> 12 mins ago
                                        </p>
                                    </MDBCardHeader>
                                    <MDBCardBody>
                                        <p className="mb-0">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                                            do eiusmod tempor incididunt ut labore et dolore magna
                                            aliqua.
                                        </p>
                                    </MDBCardBody>
                                </MDBCard>
                            </li>
                            <li class="d-flex justify-content-between mb-4">
                                <MDBCard className="w-100">
                                    <MDBCardHeader className="d-flex justify-content-between p-3">
                                        <p class="fw-bold mb-0">Lara Croft</p>
                                        <p class="text-muted small mb-0">
                                            <MDBIcon far icon="clock" /> 13 mins ago
                                        </p>
                                    </MDBCardHeader>
                                    <MDBCardBody>
                                        <p className="mb-0">
                                            Sed ut perspiciatis unde omnis iste natus error sit
                                            voluptatem accusantium doloremque laudantium.
                                        </p>
                                    </MDBCardBody>
                                </MDBCard>
                                <img
                                    src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-5.webp"
                                    alt="avatar"
                                    className="rounded-circle d-flex align-self-start ms-3 shadow-1-strong"
                                    width="60"
                                />
                            </li>
                            <li className="d-flex justify-content-between mb-4">
                                <img
                                    src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-6.webp"
                                    alt="avatar"
                                    className="rounded-circle d-flex align-self-start me-3 shadow-1-strong"
                                    width="60"
                                />
                                <MDBCard>
                                    <MDBCardHeader className="d-flex justify-content-between p-3">
                                        <p className="fw-bold mb-0">Brad Pitt</p>
                                        <p className="text-muted small mb-0">
                                            <MDBIcon far icon="clock" /> 10 mins ago
                                        </p>
                                    </MDBCardHeader>
                                    <MDBCardBody>
                                        <p className="mb-0">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                                            do eiusmod tempor incididunt ut labore et dolore magna
                                            aliqua.
                                        </p>
                                    </MDBCardBody>
                                </MDBCard>
                            </li>
                            <li className="bg-white mb-3">
                                <div className="text-muted d-flex justify-content-start align-items-center pe-3 pt-3 mt-2">
                                    <img
                                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                                        alt="avatar 3"
                                        style={{ width: "40px", height: "100%" }}
                                    />
                                    <input
                                        type="text"
                                        className="form-control form-control-lg"
                                        id="exampleFormControlInput2"
                                        placeholder="Type message"
                                        value={newMessages}
                                        onChange={handleChange}
                                    />
                                    <button className="ms-1 btn btn-primary" onClick={handleSend}>
                                        Send
                                    </button>
                                    <a className="ms-1 text-muted" href="#!">
                                        <MDBIcon fas icon="paperclip" />
                                    </a>
                                    <a className="ms-3 text-muted" href="#!">
                                        <MDBIcon fas icon="smile" />
                                    </a>
                                    <a className="ms-3" href="#!">
                                        <MDBIcon fas icon="paper-plane" />
                                    </a>
                                </div>
                            </li>
                        </MDBTypography>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </>
    );
}

export default Chat
