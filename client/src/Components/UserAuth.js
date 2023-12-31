import React, { useEffect } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { saveUserData } from "../Redux/Features/authSlice";
import API from '../Axios/Api'

export default function UserAuth() {
  const [searchParams, setSearchParams] = useSearchParams();
  console.log(searchParams);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    (async function () {
      const token = searchParams.get("token");
      const { data } = await API.get("/users/google/verify?token=" + token
      );
      if (!data.err) {
        localStorage.setItem('user', token);
        dispatch(saveUserData({ token, ...data.user }));
        navigate("/");
      } else {
        navigate("/login");
      }
    })();
  }, []);
  return (
   <h1>loading</h1>
  );
}