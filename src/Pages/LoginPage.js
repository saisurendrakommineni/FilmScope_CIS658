import { useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import styles from '../CSS/LoginPage.module.css';

function Login() {
    const navigate = useNavigate();
    const { loginUser,loginGuest } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isTouched, setIsTouched] = useState({ username: false, password: false });
    const [formErrors, setFormErrors] = useState({});
    const [error, setError] = useState("");
    const [selectedRole, setSelectedRole] = useState("user");


    const validateField = (field, value) => {
        return !value.trim() ? `${field} is required` : '';
    };

    const handleBlur = (field) => {
        setIsTouched((prev) => ({ ...prev, [field]: true }));
        setFormErrors((prevErrors) => ({
            ...prevErrors,
            [field]: validateField(field, field === 'username' ? username : password)
        }));
    };

    const handleLogin = async (selectedRole) => {
        // if (selectedRole === "guest") {
        //     localStorage.setItem("role", "guest");
        //     navigate("/movies");
        //     return;
        // }
        if (selectedRole === "guest") {
          loginGuest(); 
          navigate("/movies");
          return;
      }
      
    
        const payload = { email: username.trim(), password: password.trim(), role: selectedRole }; 
    
        try {
            const response = await fetch("https://filmscope-cis658.onrender.com/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
    
            const data = await response.json();
    
            if (response.ok && data.token) {
                if (data.user.role !== selectedRole) {  
                    setError(`Incorrect role! You are registered as ${data.user.role.toUpperCase()}.`);
                    return;
                }
                loginUser(data.token, data.user.role);  
                navigate("/movies");
            } else {
                setError(data.message || "Login failed");
            }
        } catch (error) {
            setError("Failed to connect to server");
        }
    };
    
    
    
 return (
<div className={styles.Wrapper}>
          <div className={styles.Container}>
            <div className={styles.Tabs}>
            <button   data-testid="user-tab" className={`${styles.TabButton} ${selectedRole === "user" ? styles.TabButtonActive : ""}`}onClick={() => setSelectedRole("user")}>
              User Login
            </button>
            <button className={`${styles.TabButton} ${selectedRole === "admin" ? styles.TabButtonActive : ""}`} onClick={() => setSelectedRole("admin")}>
              Admin Login
            </button>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            <div className={styles.FormGroup}>
              <label className={styles.LabelTag} htmlFor="for_username">Username</label>
              <input data-testid="username-input" className={styles.InputTag} type="text" id="for_username" value={username} onChange={(e) => setUsername(e.target.value)}
                onBlur={() => handleBlur("username")}/>
              {isTouched.username && formErrors.username && (
              <p className={styles.Error}>{formErrors.username}</p>
              )}
            </div>

            <div className={styles.FormGroup}>
              <label className={styles.LabelTag} htmlFor="for_password">Password</label>
              <input data-testid="password-input" className={styles.InputTag} type="password" id="for_password" value={password} onChange={(e) => setPassword(e.target.value)}
                onBlur={() => handleBlur("password")}/>
              {isTouched.password && formErrors.password && (
              <p className={styles.Error}>{formErrors.password}</p>
              )}
            </div>

            {error && <p className={styles.Error}>{error}</p>}

            <div className={styles.LoginButtons}>
              {selectedRole === "user" && (
                <button data-testid="login-user-button" type="button" className={styles.ButtonTag} onClick={() => handleLogin("user")}> Login as User
                </button>
              )}
              {selectedRole === "admin" && (
                <button type="button" className={styles.ButtonTag} onClick={() => handleLogin("admin")}> Login as Admin</button>
              )}
              <button type="button" className={styles.ButtonTag} onClick={() => handleLogin("guest")}> Continue as Guest</button>
            </div>

            <div className={styles.LinkRow}>
              <button type="button" className={styles.LinkButton}onClick={() => navigate("/forgot-password")}>Forgot Password?</button>
              <button type="button" className={styles.LinkButton}onClick={() => navigate("/create-account")}> Create Account</button>
            </div>
          </form>
        </div>
        </div>

    );}
export default Login;
