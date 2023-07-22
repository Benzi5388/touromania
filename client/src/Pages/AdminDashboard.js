import React, { useState, useEffect } from "react";
import { BarChart, XAxis, YAxis, Tooltip, Legend, PieChart, Bar, Pie } from "recharts";
import axios from "axios";
import AdminHeader from "../Components/AdminHeader";
import { dispatch, useDispatch, useSelector } from "react-redux";
import { setUser } from "../Redux/Features/adminSlice";
import { Navigate, useNavigate } from "react-router-dom";
import API from '../Axios/Api'

const AdminDashboard = () => {
  const [tourCount, setTourCount] = useState(0);
  const [privateCount, setPrivateCount] = useState(0);
  const [publicCount, setPublicCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [isPremiuimCount, setIsPremiuimCount] = useState(0);
  const [nonPremuimCount, setnonPremuimCount] = useState(0);
  const user = useSelector((state) => (state.admin.user))
  const navigate = useNavigate()
  // console.log(user,"userrr");
  // useEffect(()=>{
  //   console.log("inside useffect", user)
  //   if(user.login==false){
  //     console.log("inside login condition")
  //     navigate("/adminLogin")
  //   }
  // },[user])
 
  const dispatch = useDispatch()

  const fetchTourData = async () => {
    try {
      const response = await API.get("/admin/tour-count");
      setTourCount(response.data.totalCount);
      setPrivateCount(response.data.privateCount);
      setPublicCount(response.data.publicCount);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await API.get("/admin/user-count");
      console.log(response.data.totalCount);
      console.log(response.data.premiumCount);
      setUserCount(response.data.totalCount);
      setIsPremiuimCount(response.data.premiumCount);
      setnonPremuimCount(response.data.nonPremiumCount);
    } catch (error) {
      console.error(error);
    }
  };

  
  useEffect(() => {
    // Check if the user is logged in before making API requests
    if (user) {
      fetchTourData();
      fetchUserData();
      // navigate('/AdminDashboard')
    }
  }, []);
  

  const tourData = [
    { name: "Public", Tours: publicCount },
    { name: "Private", Tours: privateCount },
  ];

  const userData = [
    { name: "Premium", Users: isPremiuimCount },
    { name: "Non-Premium users", Users: nonPremuimCount },
  ];


  return (
    <>
    <AdminHeader />
    {user.login==false && <Navigate to="/adminLogin"/>}
    <div className="container" style={{marginTop:"70px"}}>
      <h1 className="mt-4" >Dashboard {user?.login==false && "hgsajahs"}</h1>
      <div className="row justify-content-center mt-4">
        <div className="col-12 col-sm-6 col-md-4 mb-3">
          <div className="bg-light rounded d-flex align-items-center p-4">
            <i className="fa fa-chart-line fa-3x text-primary"></i>
            <div className="ms-3">
              <p className="mb-2">Total Tours</p>
              <h6 className="mb-0">{tourCount}</h6>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-4 mb-3">
          <div className="bg-light rounded d-flex align-items-center p-4">
            <i className="fa fa-chart-line fa-3x text-primary"></i>
            <div className="ms-3">
              <p className="mb-2">Total Users</p>
              <h6 className="mb-0">{userCount}</h6>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 mb-3">
          <div className="p-3 bg-light rounded">
            <BarChart
              width={500}
              height={500}
              data={tourData}
              margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
              barSize={20}
            >
              <XAxis dataKey="name" />
              <Tooltip />
              <Legend />
              <Bar dataKey="Tours" fill="#8884d8" background={{ fill: "#eee" }} />
            </BarChart>
          </div>
        </div>
        <div className="col-12 col-md-6 mb-3">
          <div className="p-3 bg-light rounded">
            <PieChart width={500} height={500}>
              <Pie
                dataKey="Users"
                data={userData}
                cx={200}
                cy={200}
                outerRadius={80}
                fill="#8884d8"
                label
              />
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default AdminDashboard;
