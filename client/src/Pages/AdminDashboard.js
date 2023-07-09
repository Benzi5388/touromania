import React, { useEffect, useState, useRef} from 'react';

import AdminHeader from '../Components/AdminHeader';
import { Chart, BarController, CategoryScale, LinearScale } from 'chart.js';
import axios from 'axios'

function AdminDashboard() {
  const [tourData, setTourData] = useState([]);
  const [userData, setUserData] = useState([]);
  const chartRef = useRef(null);

  const fetchChartData = async () => {
    try {
      // Fetch tour count
      const response = await axios.get('http://localhost:5000/admin/tour-count');
      const tourCount = response.data.count;

      // Fetch user count
      const user_count = await axios.get('http://localhost:5000/admin/user-count');
      const userCount = user_count.data.count;

      // Update the state with the fetched data
      setTourData(tourCount);
      setUserData(userCount);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, []);
 
  
  useEffect(() => {
    if (tourData.length > 0 && userData.length > 0) {
      // Prepare tour data for the chart
      const tourLabels = tourData.map((entry) => entry.month);
      const tourCounts = tourData.map((entry) => entry.count);

      // Prepare user data for the chart
      const userLabels = userData.map((entry) => entry.month);
      const userCounts = userData.map((entry) => entry.count);

      // Register required Chart.js components
      Chart.register(BarController, CategoryScale, LinearScale);

      // Create the chart
      const ctx = chartRef.current.getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: tourLabels,
          datasets: [
            {
              label: 'Number of Tours',
              data: tourCounts,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
            {
              label: 'Number of Users',
              data: userCounts,
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              max: Math.max(...tourCounts, ...userCounts) + 5,
            },
          },
        },
      });
    }
  }, [tourData, userData]);

  return (
    <>
      <AdminHeader />
      <div>
        <h3>Tours Added Monthly</h3>
        <canvas ref={chartRef}></canvas>
      </div>
    </>
  );
}

export default AdminDashboard;
