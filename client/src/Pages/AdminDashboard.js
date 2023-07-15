import React, { useState, useEffect } from "react";
import { BarChart, XAxis, YAxis, Tooltip, Legend, PieChart, Bar, Pie } from "recharts";
import axios from "axios";
import AdminHeader from "../Components/AdminHeader";
import Footer from "../Components/Footer";

const AdminDashboard = () => {
  const [tourCount, setTourCount] = useState(0);
  const [privateCount, setPrivateCount] = useState(0);
  const [publicCount, setPublicCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [isPremiuimCount, setIsPremiuimCount] = useState(0);
  const [nonPremuimCount, setnonPremuimCount] = useState(0);

  const fetchTourData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/admin/tour-count");
      setTourCount(response.data.totalCount);
      setPrivateCount(response.data.privateCount);
      setPublicCount(response.data.publicCount);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/admin/user-count");
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
    fetchTourData();
    fetchUserData()
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
      <h1 style={{ marginTop: "70px" }}>Dashboard</h1>
      <div className="d-flex me-4" >
        <div className="bg-light rounded d-flex align-items-center p-4" >
          <i className="fa fa-chart-line fa-3x text-primary"></i>
          <div className="ms-3">
            <p className="mb-2">Total Tours</p>
            <h6 className="mb-0">{tourCount}</h6>
          </div>
        </div>
        <div className="bg-light rounded d-flex align-items-center p-4" style={{marginLeft:"12px"}}>
          <i className="fa fa-chart-line fa-3x text-primary"></i>
          <div className="ms-3">
            <p className="mb-2">Total Users</p>
            <h6 className="mb-0">{userCount}</h6>
          </div>
        </div>
      </div>
      <div style={{ textAlign: "center", display: "flex" , marginTop:"20px"}}>
        <div style={{ flex: 1 }}>
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
            <Bar
              dataKey="Tours"
              fill="#8884d8"
              background={{ fill: "#eee" }}
            />
          </BarChart>
        </div>
        <div style={{ flex: 1 }}>
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
    </>
  );
};

export default AdminDashboard;
