import React, { useState } from "react";
import './resgister.scss';
import upload from "../../utils/upload";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { getTranslation } from "../../translations/translations";
const Register = () => {
  const [file, setFile] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    img: "",
    country: "",
    isSeller: false,
    desc: ""
  })

  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();

  const handlechange = (e) => {
    setUser(prev => {
      return { ...prev, [e.target.name]: e.target.value };
    })
  }

  const handleSeller = (e) => {
    setUser(prev => {
      return { ...prev, isSeller: e.target.checked };
    })
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    
    let url = "";
    if (file) {
      try {
        url = await upload(file);
      } catch (err) {
        setSubmitError(err?.response?.data?.error?.message || err?.message || "Image upload failed");
        return;
      }
    }
    try {
      await newRequest.post('/auth/register', {
        ...user,
        img: url
      });
      navigate('/login', { state: { fromRegister: true } })
    } catch (error) {
      console.log(error);
      setSubmitError(error?.response?.data?.message || "Registration failed");
    }
  }


  return (
    <div className="register">
      <form onSubmit={handleSubmit} >
        <div className="left">
          <h1>{getTranslation('register.title', currentLanguage)}</h1>
          <label htmlFor="">{getTranslation('register.username', currentLanguage)}</label>
          <input
            name="username"
            type="text"
            placeholder="johndoe"
            onChange={handlechange}
          />
          <label htmlFor="">{getTranslation('register.email', currentLanguage)}</label>
          <input
            name="email"
            type="email"
            placeholder="email"
            onChange={handlechange}
          />
          <label htmlFor="">{getTranslation('register.password', currentLanguage)}</label>
          <input
            name="password"
            type="password"
            onChange={handlechange}
          />
          <label htmlFor="">{getTranslation('register.profilePicture', currentLanguage)}</label>
          <input
            type="file"
            onChange={e => {
              setFile(e.target.files[0]);
            }}
          />
          <label htmlFor="">{getTranslation('register.country', currentLanguage)}</label>
          <input
            name="country"
            type="text"
            placeholder="Usa"
            onChange={handlechange}
          />
          <button type="submit">{getTranslation('register.submit', currentLanguage)}</button>
          {submitError && <p style={{color:'red', marginTop: '8px'}}>{submitError}</p>}
        </div>
        <div className="right">
          <h1>{getTranslation('register.sellerTitle', currentLanguage)}</h1>
          <div className="toggle">
            <label htmlFor="">{getTranslation('register.sellerToggle', currentLanguage)}</label>
            <label className="switch">
              <input type="checkbox"
                onChange={handleSeller} />
              <span className="slider round"></span>
            </label>
          </div>
          <label htmlFor="">{getTranslation('register.phone', currentLanguage)}</label>
          <input
            name="phone"
            type="text"
            placeholder="+1 234 567 89"
            onChange={handlechange}
          />
          <label htmlFor="">{getTranslation('register.description', currentLanguage)}</label>
          <textarea
            placeholder={getTranslation('register.descriptionPlaceholder', currentLanguage)}
            name="desc"
            id=""
            cols="30"
            rows="10"
            onChange={handlechange}
          ></textarea>
        </div>
      </form>
    </div>
  );
}
export default Register;