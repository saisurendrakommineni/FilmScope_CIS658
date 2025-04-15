import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import styles from "../CSS/CreateAccount.module.css";

function CreateAccount() {
    const navigate = useNavigate();
    const { loginUser } = useContext(AuthContext);

    const [Firstname, setFirstName] = useState('');
    const [Lastname, setLastName] = useState('');
    const [Email, setEmail] = useState({ value: '', isTouched: false });
    const [Password, setPassword] = useState({ value: '', isTouched: false });
    const [Repassword, setRepassword] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [error, setError] = useState('');

    const isValidEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|mail\.gvsu\.edu)$/;
        return emailRegex.test(email);
    };

    const isPasswordStrong = (password) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (password.length < minLength) return `Password should be at least ${minLength} characters long`;
        if (!hasUpperCase) return "Password should contain at least one uppercase letter";
        if (!hasLowerCase) return "Password should contain at least one lowercase letter";  
        if (!hasNumber) return "Password should contain at least one number";
        if (!hasSpecialChar) return "Password should contain at least one special character";
        return null;
    };

    const validateField = (field, value) => {
        let error = '';
        switch (field) {
            case 'Firstname':
                if (!value.trim()) error = 'First name is required';
                break;
            case 'Lastname':
                if (!value.trim()) error = 'Last name is required';
                break;
            case 'Email':
                if (!value.trim() || !isValidEmail(value)) error = 'Enter a valid email';
                break;
            case 'Password':
                error = isPasswordStrong(value);
                break;
            case 'Repassword':
                if (value !== Password.value) error = 'Passwords do not match';
                break;
            default:
                break;
        }
        return error;
    };

    const handleBlur = (field, value) => {
        const error = validateField(field, value);
        setFormErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
    };

    const validateForm = () => {
        const errors = {
            Firstname: validateField('Firstname', Firstname),
            Lastname: validateField('Lastname', Lastname),
            Email: validateField('Email', Email.value),
            Password: validateField('Password', Password.value),
            Repassword: validateField('Repassword', Repassword),
        };
        setFormErrors(errors);
        return !Object.values(errors).some((error) => error);
    };

    const handleAccountCreation = async (event) => {
        event.preventDefault();

        if (validateForm()) {
            try {
                const response = await fetch('https://filmscope-cis658.onrender.com/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        firstName: Firstname,
                        lastName: Lastname,
                        email: Email.value,
                        password: Password.value
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    loginUser(data.token);  
                    navigate(`/success`)
                } else {
                    setError(data.message || 'Error creating account');
                }
            } catch (error) {
                setError('Failed to connect to server');
            }
        }
    };

    return (
        <div className={styles.Wrapper}>
              <div className={styles.Container}>
                  <form onSubmit={handleAccountCreation}>
                    <h1 className={styles.TitleTag}>CREATE ACCOUNT</h1>

                    <div className={styles.FormItem}>
                      <label htmlFor="for_firstname" className={styles.LabelTag}>FirstName<sup className={styles.RequiredStar}>*</sup></label>
                      <input className={styles.InputTag} type="text" id="for_firstname" value={Firstname}
                        onChange={(e) => setFirstName(e.target.value)} onBlur={() => handleBlur('Firstname', Firstname)}/>
                       {formErrors.Firstname && <p className={styles.FieldError}>{formErrors.Firstname}</p>}
                    </div>

                    <div className={styles.FormItem}>
                      <label htmlFor="for_lastname" className={styles.LabelTag}>LastName<sup className={styles.RequiredStar}>*</sup></label>
                      <input className={styles.InputTag} type="text" id="for_lastname" value={Lastname}
                       onChange={(e) => setLastName(e.target.value)} onBlur={() => handleBlur('Lastname', Lastname)}/>
                      {formErrors.Lastname && <p className={styles.FieldError}>{formErrors.Lastname}</p>}
                    </div>

                    <div className={styles.FormItem}>
                      <label htmlFor="for_email" className={styles.LabelTag}>Email<sup className={styles.RequiredStar}>*</sup></label>
                      <input className={styles.InputTag} type="text" id="for_email" value={Email.value}
                       onChange={(e) => setEmail({ ...Email, value: e.target.value })} onBlur={() => handleBlur('Email', Email.value)}/>
                      {formErrors.Email && <p className={styles.FieldError}>{formErrors.Email}</p>}
                    </div>

                    <div className={styles.FormItem}>
                      <label htmlFor="for_password" className={styles.LabelTag}>Password<sup className={styles.RequiredStar}>*</sup></label>
                      <input className={styles.InputTag} type="password" id="for_password" value={Password.value}
                       onChange={(e) => setPassword({ ...Password, value: e.target.value })} onBlur={() => handleBlur('Password', Password.value)}/>
                      {formErrors.Password && <p className={styles.FieldError}>{formErrors.Password}</p>}
                    </div>

                    <div className={styles.FormItem}>
                      <label htmlFor="for_re-enterpassword" className={styles.LabelTag}>Re-enter Password<sup className={styles.RequiredStar}>*</sup></label>
                      <input className={styles.InputTag} type="password" id="for_re-enterpassword" value={Repassword}
                       onChange={(e) => setRepassword(e.target.value)} onBlur={() => handleBlur('Repassword', Repassword)}/>
                      {formErrors.Repassword && <p className={styles.FieldError}>{formErrors.Repassword}</p>}
                    </div>

                    {error && <div className={styles.ErrorBox}>{error}</div>}

                    <div className={styles.ButtonGroup}>
                      <button type="submit" className={styles.ButtonTag}>Create Account</button>
                      <button type="button" className={`${styles.ButtonTag} ${styles.SecondaryButton}`}onClick={() => navigate(`/`)}>
                        Back to Login
                      </button>
                    </div>
                  </form>
                </div>
                </div>
         )}
export default CreateAccount;

