import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import styles from "../CSS/AddMovie.module.css";
import { FaTrash } from "react-icons/fa";

const initialIndustries = ["Hollywood", "Tollywood", "Bollywood"];

function EditMovie() {
    const { movieId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);  
    const [updatedMovie, setUpdatedMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [castMember, setCastMember] = useState({ role: "", name: "" });
    const [industries, setIndustries] = useState(initialIndustries);

    useEffect(() => {
      const fetchIndustries = async () => {
        try {
          const response = await fetch("https://filmscope-cis658.onrender.com/api/movies/all");
          const data = await response.json();
          const uniqueIndustries = [...new Set(data.map(movie => movie.industry))];
          setIndustries([
            ...initialIndustries,
            ...uniqueIndustries.filter(ind => !initialIndustries.includes(ind)),
          ]);
        } catch (error) {
          console.error("Error fetching industries:", error);
        }
      };
    
      fetchIndustries();
    }, []);
    
    useEffect(() => {
        if (!user || user.role !== "admin") {
            navigate("/movies");
            return;
        }
    }, [user, navigate]);

    useEffect(() => {
        if (!movieId) {
            setError("Invalid Movie ID");
            setLoading(false);
            return;
        }

        fetch(`https://filmscope-cis658.onrender.com/api/movies/${movieId}`)
            .then((response) => response.json())
            .then((data) => {
                if (!data || data.message === "Movie not found") {
                    setError("Movie not found.");
                } else {
                    setUpdatedMovie({
                        ...data,
                        castAndCrew: data.castAndCrew || [], 
                    });
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching movie details:", error);
                setError("Error fetching movie details.");
                setLoading(false);
            });
    }, [movieId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!updatedMovie) return <p>Movie not found.</p>;

    const handleChange = (e) => {
        setUpdatedMovie({ ...updatedMovie, [e.target.name]: e.target.value });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUpdatedMovie({ ...updatedMovie, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddCastMember = () => {
        if (castMember.role && castMember.name) {
            setUpdatedMovie({
                ...updatedMovie,
                castAndCrew: [...updatedMovie.castAndCrew, castMember]
            });
            setCastMember({ role: "", name: "" });
        } else {
            alert("Please provide both role and name for cast member.");
        }
    };

    const handleRemoveCastMember = (indexToRemove) => {
        setUpdatedMovie({
            ...updatedMovie,
            castAndCrew: updatedMovie.castAndCrew.filter((_, index) => index !== indexToRemove)
        });
    };

    const handleUpdateMovie = async () => {
      const finalIndustry = updatedMovie.industry;

      if (!updatedMovie.name.trim()) {
        alert("Movie Name is required.");
        return;
      }
      if (!finalIndustry) {
        alert("Industry is required.");
        return;
      }
      if (!updatedMovie.year || isNaN(updatedMovie.year)) {
        alert(" Year is required (e.g. 2020).");
        return;
      }
      if (!updatedMovie.director.trim()) {
        alert("Director name is required.");
        return;
      }
      if (!updatedMovie.actor.trim()) {
        alert("Lead Actor name is required.");
        return;
      }
      if (!updatedMovie.budget.trim()) {
        alert("Budget is required.");
        return;
      }
      if (!updatedMovie.boxOfficeGross.trim()) {
        alert("BoxOfficeGross is required.");
        return;
      }
      if (!updatedMovie.genre.trim()) {
        alert("Genre is required.");
        return;
      }
      if (!updatedMovie.description.trim()) {
        alert("Description is required.");
        return;
      }
      
      

        const token = localStorage.getItem("token"); 
        if (!token) {
            alert("Unauthorized: Please log in again.");
            return;
        }

        try {
            const response = await fetch(`https://filmscope-cis658.onrender.com/api/movies/update/${movieId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`  
                },
                body: JSON.stringify({ ...updatedMovie, industry: finalIndustry }),
            });

            if (response.ok) {
                alert("Movie updated successfully!");
                navigate(`/movie-details/${movieId}`);
            } else {
                alert("Failed to update movie.");
            }
        } catch (error) {
            console.error("Error updating movie:", error);
            alert("Server error.");
        }
    };

    return (
        <div className={styles.Container}>
          <h1 className={styles.Title}>Edit Movie</h1>

        <div className={styles.RowGroup}>
          <div className={styles.FormItem}>
            <label className={styles.LabelTag}>Movie Name</label>
            <input className={styles.InputTag} type="text"name="name" value={updatedMovie.name} onChange={handleChange}/>
          </div>

          <div className={styles.FormItem}>
            <label className={styles.LabelTag}>Industry</label>
            <select className={styles.SelectTag} name="industry" value={updatedMovie.industry}onChange={handleChange}>
              {industries.map((industry) => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>


          <div className={styles.FormItem}>
            <label className={styles.LabelTag}>Year</label>
            <input className={styles.InputTag} type="number" name="year" value={updatedMovie.year} onChange={handleChange} />
          </div>
        </div>

        <div className={styles.RowGroup}>
          <div className={styles.FormItem}>
            <label className={styles.LabelTag}>Director</label>
            <input className={styles.InputTag} type="text" name="director" value={updatedMovie.director} onChange={handleChange}/>
          </div>

          <div className={styles.FormItem}>
            <label className={styles.LabelTag}>Lead Actor</label>
            <input className={styles.InputTag} type="text" name="actor" value={updatedMovie.actor} onChange={handleChange}/>
          </div>

          <div className={styles.FormItem}>
            <label className={styles.LabelTag}>Budget</label>
            <input className={styles.InputTag} type="text" name="budget" value={updatedMovie.budget} onChange={handleChange}/>
          </div>

          <div className={styles.FormItem}>
            <label className={styles.LabelTag}>Box Office Gross</label>
            <input className={styles.InputTag} type="text" name="boxOfficeGross" value={updatedMovie.boxOfficeGross} onChange={handleChange}/>
          </div>
          </div>
          <div className={styles.RowGroup1}>
          <div className={styles.FormItem}>
            <label className={styles.LabelTag}>Genre</label>
            <input className={styles.InputTag} type="text" name="genre" value={updatedMovie.genre} onChange={handleChange}/>
          </div>

          <div className={styles.FormItem}>
          <label className={styles.LabelTag}>Upload Poster</label>
          <input className={styles.FileTag} type="file" accept="image/*" onChange={handleImageUpload}/>
          {updatedMovie.image && (
            <div className={styles.ImagePreview}>
              <img src={updatedMovie.image} alt="Movie" />
            </div>
          )}
        </div>
        </div>

        <div className={styles.FormItem}>
          <label className={styles.LabelTag}>Description</label>
          <textarea className={styles.TextareaTag} name="description" value={updatedMovie.description} onChange={handleChange}/>
        </div>

        

        <h3 className={styles.Subtitle}>Edit Cast & Crew Members</h3>
        <div className={styles.CastCrewContainer}>
          <input className={styles.InputTag} type="text" placeholder="e.g. Main Actor" value={castMember.role}
          onChange={(e) => setCastMember({ ...castMember, role: e.target.value })}/>

          <input className={styles.InputTag} type="text" placeholder="e.g. NTR as Devara" value={castMember.name}
            onChange={(e) => setCastMember({ ...castMember, name: e.target.value })}/>
          <button type="button" className={styles.ActionBtn} onClick={handleAddCastMember}>Add Cast Member
          </button>
        </div>

        <ul className={styles.CastList}>
          {updatedMovie.castAndCrew.map((member, index) => (
            <li key={index}>
              {member.role}: {member.name}
              {/* <button type="button"className={styles.RemoveBtn}onClick={() => handleRemoveCastMember(index)}>Remove</button> */}
              <FaTrash style={{ cursor: "pointer", marginLeft: "10px", color: "red" }} onClick={() => handleRemoveCastMember(index)}/>
              
            </li>
          ))}
        </ul>
        <div className={styles.Btns}>
        <button className={styles.SaveBtn} onClick={handleUpdateMovie}>Update Movie </button>
        <button className={styles.CancelBtn} onClick={() => navigate(`/movie-details/${movieId}`)}> Cancel</button>
        </div>
      </div>
    );
  }

  export default EditMovie;
