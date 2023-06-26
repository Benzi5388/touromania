import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTour , updateTour, setTours} from '../Redux/Features/tourSlice';
import { MDBTable, MDBTableBody, MDBTableHead , MDBSpinner, MDBSwitch} from 'mdb-react-ui-kit';
import { Link, useNavigate } from 'react-router-dom';
import AdminHeader from '../Components/AdminHeader';
import { setUser } from '../Redux/Features/adminSlice';



function Users() {
  const dispatch = useDispatch();
  const { tours, loading } = useSelector((state) => state.tour);
  const user = useSelector((state) => state.auth.user);
  const [isLoading, setIsLoading] = useState(true);
  const admin = useSelector((state) => state.admin.user);
const navigate = useNavigate();

useEffect(() => {
  const admin = JSON.parse(localStorage.getItem('admin'));
  if (!admin) {
    navigate('/adminLogin'); // Navigate to the admin login route
  } else {
    dispatch(setUser(admin)); // Update the admin state in Redux store
  }
}, [dispatch, navigate]);


  if (isLoading || loading) {
    return (
      <>
        <div style={{ margin: "auto", paddingTop: "200px", textAlign: "center" }}>
          <MDBSpinner grow size='big' />
        </div>
      </>
    );
  }

  const handleToggleStatus = (tourId) => {
    const selectedTour = tours.find((item) => item._id === tourId);
    const updatedTourData = {
      ...selectedTour,
      listed: !selectedTour.listed,
    };
    // Dispatch the updateTour action with the updatedTourData
    dispatch(updateTour(tourId, updatedTourData));
  };
  
  

  const excerpt = (str) => {
    if (str.length > 60) {
      str = str.substring(0, 45) + "...";
    }
    return str;
  };

  const imageUrl = `http://localhost:5000/uploads/`;
  return (
    <>
    <AdminHeader/>
    <table className="table align-middle ps-5 pe-5  bg-white" style={{fontSize:"20px"}}>
      <thead className="bg-light">
        <tr>
          <th>Name</th>
          <th>Title</th>
          <th>Description</th>
          <th>Image</th>
          <th>Listing</th>
        </tr>
      </thead>
      <tbody>
      {tours.map((item, index) => (
        <tr key={index} {...item}>
          <td>
             <p className="fw-bold mb-1">{item.name}</p>
          </td>
          <td>
            <p className="fw-normal mb-1">{item.title}</p>
          </td>
          <td>
          <p className="text-muted mb-0">{excerpt(item.description)}
          <Link to={`/adminhome/${item._id}`}>Read More</Link>
          </p>
          </td>
          <div>
          <img
                src={imageUrl + item.image}
                alt=""
                style={{ width: "45px", height: "45px" }}
                className="rounded-circle"
              />
              </div>
              <td>
              <MDBSwitch
  checked={item.listed}
  onChange={() => handleToggleStatus(item._id)}
  className={item.listed ? 'text-success' : 'text-secondary'}
  label={item.listed ? 'Listed' : 'Unlisted'}
  id={`toggleSwitch-${item._id}`}
/>



                </td>
        </tr>
      ))}
    </tbody>
    </table>
  </>
  
  );
}

export default Users;
