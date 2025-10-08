import axios from "axios";

// Use env-based API URL in production; default to local during dev
const apiBaseUrl = process.env.REACT_APP_API_URL || "/api/";

const newRequest = axios.create({
    baseURL: apiBaseUrl,
    withCredentials: true,
});

export default newRequest;