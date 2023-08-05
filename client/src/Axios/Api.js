import axios from 'axios'
const API = axios.create({ baseURL: process.env.REACT_APP_CLIENT_URL, withCredentials:true}); 
// const API = axios.create({baseURL:'http://localhost:5000', withCredentials:true })
export default  API