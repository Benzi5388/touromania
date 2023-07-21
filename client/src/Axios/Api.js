import axios from 'axios'
const API = axios.create({ baseURL: 'https://touromania.unitedwestand.online', withCredentials:true}); 

export default  API