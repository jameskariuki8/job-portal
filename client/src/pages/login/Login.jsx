import React, { useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import './login.scss';
import newRequest from "../../utils/newRequest";
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

const Login = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const navigate = useNavigate();
    const location = useLocation();
    const { currentLanguage } = useLanguage();

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError(null);
            
            const res = await newRequest.post('/auth/login', { username, password });
            localStorage.setItem("currentUser", JSON.stringify(res.data));
            
            const fromRegister = Boolean(location.state && location.state.fromRegister);
            if (fromRegister) {
                navigate(`/profile/${res.data._id}`);
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data || 'An error occurred during login');
        } finally {
            setIsLoading(false);
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    return (
        <div className="login">
            <motion.form 
                onSubmit={handleSubmit}
                variants={formVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
            >
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    {getTranslation('login.title', currentLanguage)}
                </motion.h1>
                
                <motion.p 
                    className="form-subtitle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    Welcome back! Please sign in to your account.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <label htmlFor="username">
                        {getTranslation('login.username', currentLanguage)}
                    </label>
                    <motion.div className="input-group">
                        <motion.input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="johndoe"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                            variants={inputVariants}
                            whileFocus="focus"
                            disabled={isLoading}
                        />
                        <span className="input-icon">👤</span>
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <label htmlFor="password">
                        {getTranslation('login.password', currentLanguage)}
                    </label>
                    <motion.div className="input-group">
                        <motion.input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            variants={inputVariants}
                            whileFocus="focus"
                            disabled={isLoading}
                        />
                        <button 
                            type="button"
                            className="password-toggle"
                            onClick={togglePasswordVisibility}
                            disabled={isLoading}
                        >
                            {showPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
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
                            getTranslation('login.submit', currentLanguage)
                        )}
                    </motion.button>
                </motion.div>

                <AnimatePresence>
                    {error && (
                        <motion.div 
                            className="error-message"
                            variants={errorVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div 
                    className="form-footer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    Don't have an account?{' '}
                    <motion.a 
                        href="/register"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Sign up
                    </motion.a>
                </motion.div>

                
            </motion.form>
        </div>
    );
}

export default Login;