import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import './login.scss';
import newRequest from "../../utils/newRequest";
import { useLanguage } from "../../contexts/LanguageContext";
import { getTranslation } from "../../translations/translations";
const Login = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)

    const navigate=useNavigate();
    const { currentLanguage } = useLanguage();

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            const res=await newRequest.post('/auth/login',{username,password});
            localStorage.setItem("currentUser",JSON.stringify(res.data));
            navigate('/');
        } catch (err) {
            setError(err.response.data);
        }

    }
    return (
        <div className="login">
            <form onSubmit={handleSubmit}>
                <h1>{getTranslation('login.title', currentLanguage)}</h1>
                <label htmlFor="">{getTranslation('login.username', currentLanguage)}</label>
                <input
                    type="text"
                    name="username"
                    placeholder="johndoe"
                    onChange={e => setUsername(e.target.value)}
                />
                <label htmlFor="">{getTranslation('login.password', currentLanguage)}</label>
                <input
                    type="password"
                    name="password"
                    onChange={e => setPassword(e.target.value)}
                />
                <button type="submit">{getTranslation('login.submit', currentLanguage)}</button>
                { error && error}
            </form>
        </div>
    );
}
export default Login;