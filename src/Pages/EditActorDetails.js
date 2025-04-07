import { useParams, useNavigate,useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import styles from "../CSS/AddActorDetails.module.css"


function EditActorDetails() {
    const { actor, detailIndex } = useParams();
    const actorName = decodeURIComponent(actor);
    const index = parseInt(detailIndex, 10);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext); 
    const location = useLocation();
        const movie = location.state?.movie;

    const [detail, setDetail] = useState({ label: "", value: "" });

    useEffect(() => {
        if (!user || user.role !== "admin") {
            alert("Access denied. Only admins can edit actor details.");
            navigate(`/actor-details/${encodeURIComponent(actorName)}`);
            return;
        }

        fetch(`http://localhost:5000/api/actors/${actorName}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.details && data.details[index]) {
                    setDetail(data.details[index]);
                } else {
                    alert("Detail not found!");
                    navigate(`/actor-details/${encodeURIComponent(actorName)}`);
                }
            })
            .catch((error) => {
                console.error("Error fetching actor details:", error);
                alert("Error fetching actor details.");
                navigate(`/actor-details/${encodeURIComponent(actorName)}`);
            });
    }, [actorName, index, navigate, user]);

    const handleUpdateDetail = async () => {
        if (!detail.label || !detail.value) {
            alert("Please provide both label and value.");
            return;
        }

        try 
        {
            const response = await fetch(`http://localhost:5000/api/actors/update/${actorName}/${index}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user?.token}` 
                },
                body: JSON.stringify(detail),
            });

            if (response.ok) {
                alert("Actor detail updated successfully!");
                navigate(`/actor-details/${encodeURIComponent(actorName)}`, { state: { movie } });
            } else {
                const data = await response.json();
                alert(`Failed to update actor detail: ${data.message}`);
            }
        } 
        catch (error) 
        {
            console.error("Error updating actor detail:", error);
            alert("Server error.");
        }
    };

    return (
        <div className={styles.Wrapper}>
        <div className={styles.MainDivTag}>
            <h1 className={styles.h1Tag}>Edit Detail for {actorName}</h1>
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
                <button className={styles.CancelBtn} onClick={() => navigate(`/actor-details/${encodeURIComponent(actorName)}`,{ state: { movie } })}>Cancel</button>
            </div>
        </div>
        </div>
    );
}

export default EditActorDetails;
