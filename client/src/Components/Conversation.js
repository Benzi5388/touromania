import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getUser } from "../Redux/api";
import '../Pages/Chat/Chat.css'
import Lottie from "lottie-react";
import chaticon from '../Assets/chaticon.json'


const Conversation = (props) => {
  const { data, currentUser, online }= props;
  const [userData, setUserData] = useState(null)
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch()

  useEffect(()=> {
    const userId = data.members.find((userId) => userId !== currentUser);
    const getUserData = async ()=> {
          const response =await getUser(userId)
          setUserData(response.data)
         setIsLoading(false)
          console.log(response.data, "the user dataaaaa");
    }
    getUserData();
  }, [])

  return (
    <>
      <div className="follower conversation">
        <div className="user-container">
          {online && <div className="online-dot"></div>}
          <i style={{fontSize:"50px"}} class="fas fa-circle-user"></i>
          <div className="name-container">
            <div className="name" style={{ fontWeight: "bold" }}>
              {userData?.name}
            </div>
            <div className="status" style={{ color: online ? "#51e200" : "" }}>
              {online ? "Online" : "Offline"}
            </div>
          </div>
        </div>
      </div>
      <hr style={{ width: "85%", border: "0.1px solid #ececec" }} />
    </>
  );
};

export default Conversation;