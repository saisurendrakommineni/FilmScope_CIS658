import { useState, useContext,useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaTrash } from "react-icons/fa";

import styles from "../CSS/AddMovie.module.css"

const initialIndustries = ["Hollywood", "Tollywood","Bollywood"];


function AddMovie() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext); 

    const [industries, setIndustries] = useState(initialIndustries);
    const [customIndustry, setCustomIndustry] = useState("");

    const [movie, setMovie] = useState({
        name: "",
        industry: industries[0],
        director: "",
        actor: "",
        budget:"",
        boxOfficeGross: "",
        year: "",
        genre: "",
        image: "",
        castAndCrew: [],
        description: ""
    });
    useEffect(() => {
      const fetchIndustries = async () => {
        try {
          const response = await fetch("https://filmscope-cis658.onrender.com/api/movies/all");
          const data = await response.json();
          const uniqueIndustries = [...new Set(data.map(movie => movie.industry))];
          setIndustries([...initialIndustries, ...uniqueIndustries.filter(ind => !initialIndustries.includes(ind))]);
        } catch (error) {
          console.error("Error fetching industries:", error);
        }
      };
    
      fetchIndustries();
    }, []);

    const [castMember, setCastMember] = useState({ role: "", name: "" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMovie({ ...movie, [name]: value });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setMovie({ ...movie, image: reader.result }); // convert image to Base64
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddCastMember = () => {
        if (castMember.role && castMember.name) {
            setMovie((prevMovie) => ({...prevMovie, castAndCrew: [...prevMovie.castAndCrew, castMember],}));
            setCastMember({ role: "", name: "" }); 
        } else {
            alert("Please provide both role and name for cast member.");
        }
    };

    const handleRemoveCastMember = (indexToRemove) => {
        setMovie((prevMovie) => ({ ...prevMovie, castAndCrew: prevMovie.castAndCrew.filter((_, index) => index !== indexToRemove)}));
    };

    const handleAddMovie = async () => {
        if (!user || user.role !== "admin") {
            alert("Unauthorized: Only admins can add movies.");
            return;
        }

        const token = localStorage.getItem("token");  

        if (!token) {
            alert("Unauthorized: Please log in again.");
            return;
        }

        const finalIndustry = movie.industry === "Custom" ? customIndustry.trim() : movie.industry;

        if (!movie.name.trim()) {
          alert("Movie Name is required.");
          return;
        }
        if (!finalIndustry) {
          alert("Industry is required.");
          return;
        }
        if (!movie.year || isNaN(movie.year)) {
          alert(" Year is required (e.g. 2020).");
          return;
        }
        if (!movie.director.trim()) {
          alert("Director name is required.");
          return;
        }
        if (!movie.actor.trim()) {
          alert("Lead Actor name is required.");
          return;
        }
        if (!movie.budget.trim()) {
          alert("Budget is required.");
          return;
        }
        if (!movie.boxOfficeGross.trim()) {
          alert("BoxOfficeGross is required.");
          return;
        }
        if (!movie.genre.trim()) {
          alert("Genre is required.");
          return;
        }
        if (!movie.description.trim()) {
          alert("Description is required.");
          return;
        }
       


        const newMovie = {  ...movie,  industry: finalIndustry,  castAndCrew: movie.castAndCrew || [] };
        try 
        {
            const response = await fetch("https://filmscope-cis658.onrender.com/api/movies/add", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`  
                },
                body: JSON.stringify(newMovie),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Movie added successfully!");
                navigate("/movies");
            } else {
                alert(data.message || "Failed to add movie.");
            }
        } 
        catch (error) 
        {
            console.error("Error adding movie:", error);
            alert("Server error.");
        }
    };
    const handleRemoveImage = () => {
      setMovie((prev) => ({ ...prev, image: "" }));
    };
    

    return (
    <div className={styles.Container}>
      <h1 className={styles.Title}>ADD MOVIE</h1>

      <div className={styles.RowGroup}>
        <div className={styles.FormItem}>
          <label className={styles.LabelTag}>Movie Name</label>
          <input className={styles.InputTag} type="text" name="name" placeholder="Movie Name" onChange={handleChange} required />
        </div>

        <div className={styles.FormItem}>
          <label className={styles.LabelTag}>Industry</label>
          <select className={styles.SelectTag} name="industry" onChange={handleChange} value={movie.industry}>
            {industries.map((industry) => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
            <option value="Custom">Custom (Add New Industry)</option>
          </select>
        </div>

        {movie.industry === "Custom" && (
          <div className={styles.FormItem}>
            <label className={styles.LabelTag}>New Industry Name</label>
            <input className={styles.InputTag} type="text"placeholder="Enter New Industry Name" value={customIndustry}
              onChange={(e) => setCustomIndustry(e.target.value)}required/>
          </div>
        )}

        <div className={styles.FormItem}>
          <label className={styles.LabelTag}>Year</label>
          <input className={styles.InputTag} type="number" name="year" placeholder="Year" onChange={handleChange} required />
        </div>
      </div>

      <div className={styles.RowGroup}>
        <div className={styles.FormItem}>
          <label className={styles.LabelTag}>Director</label>
          <input className={styles.InputTag} type="text" name="director" placeholder="Director" onChange={handleChange} required />
        </div>

        <div className={styles.FormItem}>
          <label className={styles.LabelTag}>Lead Actor</label>
          <input className={styles.InputTag} type="text" name="actor" placeholder="Lead Actor" onChange={handleChange} required />
        </div>

        <div className={styles.FormItem}>
          <label className={styles.LabelTag}>Budget</label>
          <input className={styles.InputTag} type="text" name="budget" placeholder="Budget" onChange={handleChange} />
        </div>

        <div className={styles.FormItem}>
          <label className={styles.LabelTag}>Box Office Gross</label>
          <input className={styles.InputTag} type="text" name="boxOfficeGross" placeholder="Box Office Gross" onChange={handleChange} />
        </div>
        </div>
        <div className={styles.RowGroup1}>
          <div className={styles.FormItem}>
            <label className={styles.LabelTag}>Genre</label>
            <input className={styles.InputTag} type="text" name="genre" placeholder="Genre" onChange={handleChange} required />
          </div>
        
          <div className={styles.FormItem}>
          <label className={styles.LabelTag}>Upload Poster</label>
          <input className={styles.FileTag} type="file" accept="image/*" onChange={handleImageUpload} required />
          {movie.image && (
         <div className={styles.ImagePreview}>
           <img src={movie.image} alt="Preview" />
         <button type="button" className={styles.RemoveImageBtn} onClick={handleRemoveImage}>Remove </button>
        </div>
        )}

        </div>
      </div>

      <div className={styles.FormItem}>
        <label className={styles.LabelTag}>Description</label>
        <textarea className={styles.TextareaTag} name="description" placeholder="Enter movie description" onChange={handleChange} required/>
      </div>

     

      <h3 className={styles.Subtitle}>Add Cast & Crew Members</h3>
      <div className={styles.CastCrewContainer}>
        <input className={styles.InputTag} type="text" placeholder="e.g. Main Actor" value={castMember.role}
         onChange={(e) => setCastMember({ ...castMember, role: e.target.value })}/>
        <input className={styles.InputTag} type="text" placeholder="e.g. NTR as Devara" value={castMember.name}
         onChange={(e) => setCastMember({ ...castMember, name: e.target.value })}/>
        <button type="button" className={styles.ActionBtn} onClick={handleAddCastMember}>Add Cast Member</button>
      </div>

      <ul className={styles.CastList}>
        {movie.castAndCrew.map((member, index) => (
          <li key={index}>
            {member.role}: {member.name}
            {/* <button type="button" className={styles.RemoveBtn} onClick={() => handleRemoveCastMember(index)}>Remove</button> */}
            <FaTrash style={{ cursor: "pointer", marginLeft: "10px", color: "red" }} onClick={() => handleRemoveCastMember(index)}/>
          </li>
        ))}
      </ul>
      <div className={styles.Btns}>
        <button className={styles.SaveBtn} onClick={handleAddMovie}>Add Movie</button>
        <button className={styles.CancelBtn} onClick={() => navigate("/movies")}>Cancel</button>
      </div>
    </div>
  );
}

export default AddMovie;

