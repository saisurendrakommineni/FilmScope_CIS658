
import { useParams, useNavigate,useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import styles from "../CSS/AddActorDetails.module.css"

function AddActorDetails() {
    const { actor } = useParams();
    const actorName = decodeURIComponent(actor);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext); 
    const location = useLocation();
    const movie = location.state?.movie;

    const [newDetail, setNewDetail] = useState({ label: "", value: "" });

    useEffect(() => {
        if (!user || user.role !== "admin") {
            navigate(`/actor-details/${encodeURIComponent(actorName)}`);
        }
    }, [actorName, navigate, user]);

    const handleAddDetail = async () => {
        if (!newDetail.label || !newDetail.value) {
            alert("Please provide both label and value.");
            return;
        }
    
        console.log("user context:", user);  
        if (!user || !user.token) {
            alert("No authentication token found. Please log in again.");
            return;
        }
    
        const detailToAdd = { name: actorName, details: [newDetail] };
    
        // console.log("sending request with token:", user.token); 
    
        try 
        {
            const response = await fetch("https://filmscope-cis658.onrender.com/api/actors/add", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}` 
                },
                body: JSON.stringify(detailToAdd),
            });
    
            if (response.ok) {
                alert("Actor detail added successfully!");
                navigate(`/actor-details/${encodeURIComponent(actorName)}`, { state: { movie } });
            } else {
                const data = await response.json();
                alert(`Failed to add actor detail: ${data.message}`);
            }
        } 
        catch (error) 
        {
            console.error("Error adding actor detail:", error);
            alert("Server error.");
        }
    };
    
    
    return (
        <div className={styles.Wrapper}>
        <div className={styles.MainDivTag}>
            <h1 className={styles.h1Tag}>Add Detail for {actorName}</h1>
            <div className={styles.Detail}>
                <label className={styles.LabelTag}>Enter Label: </label>
                <input type="text" className={styles.InputTag} placeholder= "e.g. No of Movies" value={newDetail.label} 
                 onChange={(e) => setNewDetail({ ...newDetail, label: e.target.value })}/>
            </div>
            <div className={styles.Detail}>
                <label className={styles.LabelTag}>Enter Value: </label>
                <input className={styles.InputTag} type="text" placeholder="e.g. 42 Movies"value={newDetail.value}
                onChange={(e) => setNewDetail({ ...newDetail, value: e.target.value })}
                />
            </div>
            <div>
                <button className={styles.SaveBtn} onClick={handleAddDetail}>Save Detail</button>
                <button className={styles.CancelBtn} onClick={() => navigate(`/actor-details/${encodeURIComponent(actorName)}`, { state: { movie } })}>Cancel</button>
            </div>
        </div>
        </div>
    );
}

export default AddActorDetails;



