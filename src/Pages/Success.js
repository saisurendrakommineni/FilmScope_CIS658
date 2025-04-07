import { useNavigate } from "react-router-dom";
import styles from "../CSS/CreateAccount.module.css";

function Success() {
  const navigate = useNavigate();

  return (
    <div className={styles.Container}>
      <h1 className={`${styles.TitleTag} ${styles.SuccessAnimation}`}>
        Account Created Successfully!!
      </h1>
      <div className={styles.ButtonGroup}>
        <button className={`${styles.ButtonTag} ${styles.SecondaryButton}`} onClick={() => navigate(`/`)}>Back to Login</button>
      </div>
    </div>
  );
}

export default Success;
