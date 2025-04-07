import { useParams, useNavigate,useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import styles from "../CSS/AddActorDetails.module.css"


function AddDirectorDetails() {
    const { director } = useParams();
    const directorName = decodeURIComponent(director);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext); 
    const location = useLocation();
    const movie = location.state?.movie;

    const [newDetail, setNewDetail] = useState({ label: "", value: "" });

    useEffect(() => {
        if (!user || user.role !== "admin") {
            alert("Access denied. Only admins can add director details.");
            navigate(`/director-details/${encodeURIComponent(directorName)}`);
        }
    }, [directorName, navigate, user]);

    const handleAddDetail = async () => {
        if (!newDetail.label || !newDetail.value) {
            alert("Please provide both label and value.");
            return;
        }

        const detailToAdd = { name: directorName, details: [newDetail] };

        try 
        {
            const response = await fetch("http://localhost:5000/api/directors/add", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user?.token}` 
                },
                body: JSON.stringify(detailToAdd),
            });

            if (response.ok) {
                alert("Director detail added successfully!");
                navigate(`/director-details/${encodeURIComponent(directorName)}`, { state: { movie } });
            } else {
                const data = await response.json();
                alert(`Failed to add director detail: ${data.message}`);
            }
        } 
        catch (error) 
        {
            console.error("Error adding director detail:", error);
            alert("Server error.");
        }
    };

    return (
        <div className={styles.Wrapper}>
        <div className={styles.MainDivTag}>
            <h1 className={styles.h1Tag}>Add Detail for {directorName}</h1>
            <div className={styles.Detail}>
                <label className={styles.LabelTag}>Enter Label: </label>
                <input className={styles.InputTag} type="text" placeholder="e.g. Total Movies" value={newDetail.label}
                onChange={(e) => setNewDetail({ ...newDetail, label: e.target.value })}/>
            </div>
            <div className={styles.Detail}>
                <label className={styles.LabelTag}>Enter Value: </label>
                <input className={styles.InputTag} type="text" placeholder="e.g. 15 Movies" value={newDetail.value}
                onChange={(e) => setNewDetail({ ...newDetail, value: e.target.value })} />
            </div>

            <div>
                <button className={styles.SaveBtn} onClick={handleAddDetail}>Save Detail</button>
                <button className={styles.CancelBtn} onClick={() => navigate(`/director-details/${encodeURIComponent(directorName)}`, { state: { movie } })}>Cancel</button>
            </div>
        </div>
        </div>
    );
}

export default AddDirectorDetails;


