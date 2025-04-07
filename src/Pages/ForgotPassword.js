import { useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "../CSS/CreateAccount.module.css";


function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [emailExists, setEmailExists] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const checkEmailExists = async () => {
        setMessage('');
        setEmailExists(false);

        if (!email.trim()) {
            setMessage('Please enter an email address.');
            return;
        }

        setLoading(true);
        try 
        {
            const response = await fetch('http://localhost:5000/api/auth/check-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim() })
            });

            const data = await response.json();

            if (response.status === 404) {
                setMessage('Email not found in system.');
            } else if (response.ok) {
                setEmailExists(true);
                setMessage('');
            } else {
                setMessage(data.message || 'Something went wrong.');
            }
        } 
        catch (error) 
        {
            setMessage('Failed to connect to server.');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordReset = async () => {
        if (!newPassword.trim()) {
            setMessage('Please enter a new password.');
            return;
        }

        setLoading(true);
        try 
        {
            const response = await fetch('http://localhost:5000/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email: email.trim(), 
                    newPassword: newPassword.trim() 
                })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Password updated successfully. Please login with your new password.');
                setEmail('');
                setNewPassword('');
                setEmailExists(false);
                setTimeout(() => navigate('/'), 2000);
            } else {
                setMessage(data.message || 'Something went wrong.');
            }
        } 
        catch (error) 
        {
            setMessage('Failed to connect to server.');
        } finally {
            setLoading(false);
        }
    };

return (
    <div className={styles.Wrapper}>
    <div className={styles.Container}>
        <h1 className={styles.TitleTag}>Forgot Password</h1>

        <div className={styles.FormItem}>
            <label className={styles.LabelTag}>Enter Email to Check</label>
            <input className={styles.InputTag} type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
        </div>

        {!emailExists && (
            <div className={styles.ButtonGroup}>
                <button className={styles.ButtonTag} onClick={checkEmailExists} disabled={loading}> {loading ? 'Checking' : 'Submit'}
                </button>
            </div>
        )}

        {emailExists && (
            <>
                <div className={styles.FormItem}>
                    <label className={styles.LabelTag}>New Password</label>
                    <input className={styles.InputTag} type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} disabled={loading} />
                </div>
                <div className={styles.ButtonGroup}>
                    <button className={styles.ButtonTag} onClick={handlePasswordReset} disabled={loading}>{loading ? 'Resetting' : 'Set New Password'}</button>
                </div>
            </>
        )}

        {message && (
            <p className={message.includes("success") ? styles.SuccessMsg : styles.FieldError}> {message}</p>
        )}

        <div className={styles.ButtonGroup}>
            <button className={`${styles.ButtonTag} ${styles.SecondaryButton}`} onClick={() => navigate(`/`)} >Back to Login </button>
        </div>
    </div>
    </div>
);
}

export default ForgotPassword;