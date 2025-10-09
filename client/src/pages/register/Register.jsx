import React, { useEffect, useState } from "react";
import './register.scss';
import upload from "../../utils/upload";
import newRequest from "../../utils/newRequest";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { getTranslation } from "../../translations/translations";
import { motion, AnimatePresence } from 'framer-motion';

// Animation variants
const formVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const sectionVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const inputVariants = {
  focus: {
    scale: 1.02,
    transition: { duration: 0.2 }
  }
};

const buttonVariants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: { duration: 0.2 }
  },
  tap: { scale: 0.95 }
};

const errorVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { 
    opacity: 1, 
    height: "auto",
    transition: { duration: 0.3 }
  }
};

// Use solid colors only; gradients are not animatable in Framer Motion
const toggleVariants = {
  off: { backgroundColor: "rgba(255, 255, 255, 0.2)" },
  on: { backgroundColor: "#00f2fe" }
};

const Register = () => {
  const [file, setFile] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    img: "",
    country: "",
    isSeller: false,
    desc: "",
    phone: ""
  });

  const navigate = useNavigate();
  const { search } = useLocation();
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    const params = new URLSearchParams(search);
    if (params.get('seller') === '1') {
      setUser(prev => ({ ...prev, isSeller: true }));
    }
  }, [search]);

  const handleChange = (e) => {
    setUser(prev => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleSeller = (e) => {
    const nextChecked = typeof e?.target?.checked === 'boolean' ? e.target.checked : !user.isSeller;
    setUser(prev => ({ ...prev, isSeller: nextChecked }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setIsLoading(true);

    let url = "";
    if (file) {
      try {
        url = await upload(file);
      } catch (err) {
        setSubmitError(err?.response?.data?.error?.message || err?.message || "Image upload failed");
        setIsLoading(false);
        return;
      }
    }

    try {
      await newRequest.post('/auth/register', {
        ...user,
        img: url
      });
      navigate('/login', { state: { fromRegister: true } });
    } catch (error) {
      console.log(error);
      setSubmitError(error?.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register">
      <motion.form 
        onSubmit={handleSubmit}
        variants={formVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {/* Left Section - Basic Info */}
        <motion.div 
          className="left stagger-children"
          variants={sectionVariants}
        >
          <motion.h1 variants={sectionVariants}>
            {getTranslation('register.title', currentLanguage)}
          </motion.h1>

          <motion.div variants={sectionVariants}>
            <label htmlFor="username">
              {getTranslation('register.username', currentLanguage)}
            </label>
            <motion.div className="input-group">
              <motion.input
                id="username"
                name="username"
                type="text"
                placeholder="johndoe"
                value={user.username}
                onChange={handleChange}
                required
                variants={inputVariants}
                whileFocus="focus"
                disabled={isLoading}
              />
              <span className="input-icon">👤</span>
            </motion.div>
          </motion.div>

          <motion.div variants={sectionVariants}>
            <label htmlFor="email">
              {getTranslation('register.email', currentLanguage)}
            </label>
            <motion.div className="input-group">
              <motion.input
                id="email"
                name="email"
                type="email"
                placeholder="email@example.com"
                value={user.email}
                onChange={handleChange}
                required
                variants={inputVariants}
                whileFocus="focus"
                disabled={isLoading}
              />
              <span className="input-icon">📧</span>
            </motion.div>
          </motion.div>

          <motion.div variants={sectionVariants}>
            <label htmlFor="password">
              {getTranslation('register.password', currentLanguage)}
            </label>
            <motion.div className="input-group">
              <motion.input
                id="password"
                name="password"
                type="password"
                value={user.password}
                onChange={handleChange}
                required
                variants={inputVariants}
                whileFocus="focus"
                disabled={isLoading}
              />
              <span className="input-icon">🔒</span>
            </motion.div>
          </motion.div>

          <motion.div variants={sectionVariants}>
            <label htmlFor="profilePicture">
              {getTranslation('register.profilePicture', currentLanguage)}
            </label>
            <motion.div className="file-upload">
              <input
                type="file"
                id="profilePicture"
                onChange={handleFileChange}
                disabled={isLoading}
              />
              <AnimatePresence>
                {file && (
                  <motion.div 
                    className="file-preview"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <span>📷</span>
                    <span>{file.name}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>

          <motion.div variants={sectionVariants}>
            <label htmlFor="country">
              {getTranslation('register.country', currentLanguage)}
            </label>
            <motion.div className="input-group">
              <motion.input
                id="country"
                name="country"
                type="text"
                placeholder="United States"
                value={user.country}
                onChange={handleChange}
                required
                variants={inputVariants}
                whileFocus="focus"
                disabled={isLoading}
              />
              <span className="input-icon">🌎</span>
            </motion.div>
          </motion.div>

          <motion.button 
            type="submit"
            variants={buttonVariants}
            whileHover={!isLoading ? "hover" : ""}
            whileTap={!isLoading ? "tap" : ""}
            disabled={isLoading}
          >
            {isLoading ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                ⏳
              </motion.span>
            ) : (
              getTranslation('register.submit', currentLanguage)
            )}
          </motion.button>

          <AnimatePresence>
            {submitError && (
              <motion.div 
                className="error-message"
                variants={errorVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {submitError}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Right Section - Seller Info */}
        <motion.div 
          className="right stagger-children"
          variants={sectionVariants}
        >
          <motion.h1 variants={sectionVariants}>
            {getTranslation('register.sellerTitle', currentLanguage)}
          </motion.h1>

          <motion.div 
            className="toggle"
            variants={sectionVariants}
            whileHover={{ scale: 1.02 }}
          >
            <label htmlFor="sellerToggle">
              {getTranslation('register.sellerToggle', currentLanguage)}
            </label>
            <motion.label 
              className="switch"
              animate={user.isSeller ? "on" : "off"}
              variants={toggleVariants}
            >
              <input 
                type="checkbox"
                id="sellerToggle"
                checked={user.isSeller}
                onChange={handleSeller}
                disabled={isLoading}
              />
              <span className="slider"></span>
            </motion.label>
          </motion.div>

          <AnimatePresence>
            {user.isSeller && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div variants={sectionVariants}>
                  <label htmlFor="phone">
                    {getTranslation('register.phone', currentLanguage)}
                  </label>
                  <motion.div className="input-group">
                    <motion.input
                      id="phone"
                      name="phone"
                      type="text"
                      placeholder="+1 234 567 89"
                      value={user.phone}
                      onChange={handleChange}
                      variants={inputVariants}
                      whileFocus="focus"
                      disabled={isLoading}
                    />
                    <span className="input-icon">📞</span>
                  </motion.div>
                </motion.div>

                <motion.div variants={sectionVariants}>
                  <label htmlFor="desc">Description</label>
                  <motion.textarea
                    id="desc"
                    name="desc"
                    placeholder="Tell us about yourself and your services..."
                    value={user.desc}
                    onChange={handleChange}
                    rows="4"
                    variants={inputVariants}
                    whileFocus="focus"
                    disabled={isLoading}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div 
            className="form-divider"
            variants={sectionVariants}
          >
            <span>Already have an account?</span>
          </motion.div>

          <motion.div variants={sectionVariants}>
            <motion.a 
              href="/login"
              style={{
                display: 'block',
                textAlign: 'center',
                color: '#60a5fa',
                textDecoration: 'none',
                fontWeight: '600',
                padding: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                transition: 'all 0.3s ease'
              }}
              whileHover={{ 
                scale: 1.05,
                borderColor: 'var(--border-glow)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              Sign In
            </motion.a>
          </motion.div>
        </motion.div>
      </motion.form>
    </div>
  );
};

export default Register;