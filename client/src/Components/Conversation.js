import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getUser } from "../Redux/api";


const Conversation = (props) => {
  const { chats, data, currentUser, online }= props;
    // console.log(data, "data");
    // console.log(chats, "ctasssssssssssssss");
    // console.log(currentUser, "currentUser");
    // console.log(online, "online");
    const user = JSON.parse(localStorage.getItem('user'));
  const [userData, setUserData] = useState(null)
  const dispatch = useDispatch()

  useEffect(()=> {
    
   
    const userId = data.members.find((userId) => userId !== currentUser);
  

    const getUserData = async ()=> {
          const response =await getUser(userId)
          setUserData(response.data)
          console.log(response.data, "the user dataaaaa");
         dispatch({type:"SAVE_USER", data:data})
    }

    getUserData();
  }, [])
  return (
    <>
      <div className="follower conversation">
        <div>
          {online && <div className="online-dot"></div>}
          <img
            src={"/profilepic.jpg"}
            alt="Profile"
            className="followerImage"
            style={{ width: "50px", height: "50px" }}
          />
          <div className="name" style={{fontSize: '0.8rem'}}>
            <span>{userData?.name}</span>
            <span style={{color: online?"#51e200":""}}>{online? "Online" : "Offline"}</span>
          </div>
        </div>
      </div>
      <hr style={{ width: "85%", border: "0.1px solid #ececec" }} />
    </>
  );
};

export default Conversation;