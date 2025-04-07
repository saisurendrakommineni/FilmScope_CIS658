import { useParams, useNavigate,useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import styles from "../CSS/AddActorDetails.module.css"


function EditDirectorDetails() {
    const { director, detailIndex } = useParams();
    const directorName = decodeURIComponent(director);
    const index = parseInt(detailIndex, 10);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext); 
    const location = useLocation();
        const movie = location.state?.movie;

    const [detail, setDetail] = useState({ label: "", value: "" });

    useEffect(() => {
        if (!user || user.role !== "admin") {
            alert("Access denied. Only admins can edit director details.");
            navigate(`/director-details/${encodeURIComponent(directorName)}`);
            return;
        }

        fetch(`http://localhost:5000/api/directors/${directorName}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.details && data.details[index]) {
                    setDetail(data.details[index]);
                } else {
                    alert("Detail not found!");
                    navigate(`/director-details/${encodeURIComponent(directorName)}`);
                }
            })
            .catch((error) => {
                console.error("Error fetching director details:", error);
                alert("Error fetching director details.");
                navigate(`/director-details/${encodeURIComponent(directorName)}`);
            });
    }, [directorName, index, navigate, user]);

    const handleUpdateDetail = async () => {
        if (!detail.label || !detail.value) {
            alert("Please provide both label and value.");
            return;
        }

        try 
        {
            const response = await fetch(`http://localhost:5000/api/directors/update/${directorName}/${index}`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user?.token}` 
                },
                body: JSON.stringify(detail),
            });

            if (response.ok) {
                alert("Director detail updated successfully!");
                navigate(`/director-details/${encodeURIComponent(directorName)}`,{ state: { movie } });
            } else {
                const data = await response.json();
                alert(`Failed to update director detail: ${data.message}`);
            }
        } 
        catch (error) 
        {
            console.error("Error updating director detail:", error);
            alert("Server error.");
        }
    };

    return (
        <div className={styles.Wrapper}>
        <div className={styles.MainDivTag}>
            <h1 className={styles.h1Tag}>Edit Detail for {directorName}</h1>
            <div className={styles.Detail}>
                <label className={styles.LabelTag}>Enter Label: </label>
                <input type="text" className={styles.InputTag} value={detail.label} onChange={(e) => setDetail({ ...detail, label: e.target.value })}/>
            </div>
            <div className={styles.Detail}>
                <label className={styles.LabelTag}>Enter Value: </label>
                <input type="text" className={styles.InputTag} value={detail.value} onChange={(e) => setDetail({ ...detail, value: e.target.value })}/>
            </div>
            <div>
                <button className={styles.SaveBtn} onClick={handleUpdateDetail}>Update Detail</button>
                <button className={styles.CancelBtn} onClick={() => navigate(`/director-details/${encodeURIComponent(directorName)}`,{ state: { movie } })}>Cancel</button>
            </div>
        </div>
        </div>
    );
}

export default EditDirectorDetails;
