import React, { useState, useEffect } from "react";
import { BarChart, XAxis, YAxis, Tooltip, Legend, PieChart, Bar, Pie } from "recharts";
import axios from "axios";
import AdminHeader from "../Components/AdminHeader";

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
      setUserCount(response.data.totalCount);
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
      setTourCount(response.data.totalCount);
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
    { name: "Non-Premium", Users: nonPremuimCount },
  ];


  return (
    <>
      <AdminHeader />
      <div style={{ textAlign: "center" }}>
        <h1 style={{ marginTop: "70px" }}>Dashboard</h1>
        <div className="App">
          <div style={{ display: "flex" }}>
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
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
