
import { useParams, useNavigate,useLocation } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import styles from "../CSS/ActorDetails.module.css";


function DirectorDetails() {
    const { director } = useParams();
    const directorName = decodeURIComponent(director);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext); 

    const [details, setDetails] = useState([]);
    const [loading, setLoading] = useState(true);

    const location = useLocation();
    const movie = location.state?.movie;

    useEffect(() => {
        fetch(`https://filmscope-cis658.onrender.com/api/directors/${directorName}`)
            .then((response) => response.json())
            .then((data) => {
                setDetails(data.details || []);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching director details:", error);
                setLoading(false);
            });
    }, [directorName]);

    const handleRemoveDetail = async (index) => {
        if (!user || user.role !== "admin") {
            alert("Access denied. Only admins can delete details.");
            return;
        }

        try 
        {
            const response = await fetch(`https://filmscope-cis658.onrender.com/api/directors/delete-detail/${directorName}/${index}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${user?.token}` } 
            });

            if (response.ok) {
                setDetails(details.filter((_, i) => i !== index));
            } else {
                const data = await response.json();
                alert(`Failed to delete detail: ${data.message}`);
            }
        } 
        catch (error) 
        {
            console.error("Error deleting detail:", error);
        }
    };

    if (loading) return <p>Loading... Please Wait</p>;

    return (
        <div className={styles.Wrapper}>
            <button className={styles.backBtn} onClick={() => navigate(`/movie-details/${movie._id}`, { state: { movie } })}>Back</button>

        <div className={styles.Container}>
           <div className={styles.header}>
                <h1 className={styles.Title}>Director Profile : {directorName}</h1>
          </div>
            
    
            {details.length > 0 ? (
                <table className={styles.Table}>
                    <thead>
                        <tr>
                            <th>Label</th>
                            <th>Value</th>
                            {user?.role === "admin" && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {details.map((detail, index) => (
                            <tr key={index}>
                                <td><em>{detail.label}</em></td>
                                <td>{detail.value}</td>
                                {user?.role === "admin" && (
                                    <td>
                                        <button className={styles.ActionBtn}
                                        onClick={() => navigate(`/edit-director-details/${directorName}/${index}`,{ state: { movie } })}>Edit</button>
                                        <button className={`${styles.ActionBtn} ${styles.RemoveBtn}`} onClick={() => handleRemoveDetail(index)}> Remove</button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No details available.</p>
            )}
    
            {user?.role === "admin" && (
                <button className={styles.AddBtn}
                onClick={() => navigate(`/add-director-details/${directorName}`, { state: { movie } })}>Add Details</button>
            )}
        </div>
        </div>

    );
    
}

export default DirectorDetails;
