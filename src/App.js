// installtion packages
// npm install react-icons
//npm install react-rating
//npm install react-select
//npm install cypress --save-dev
//npm install --save-dev eslint-plugin-cypress --legacy-peer-deps


import { Route, Routes, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import bgImage from './assets/background_image.png'
import styles from './CSS/AppBackground.module.css';

import Login from './Pages/LoginPage';
import Movies from './Pages/Movies';
import CreateAccount from './Pages/CreateAccount';
import ForgotPassword from './Pages/ForgotPassword';
import MovieDetails from './Pages/MovieDetails';
import Success from './Pages/Success';
import DirectorDetails from './Pages/DirectorDetails';
import ActorDetails from './Pages/ActorDetails';
import Favorites from './Pages/Favorites';
import AddMovie from './Pages/AddMovie';
import EditMovie from './Pages/EditMovie';
import Header from './Pages/Header';
import AddActorDetails from './Pages/AddActorDetails';
import EditActorDetails from './Pages/EditActorDetails';
import AddDirectorDetails from './Pages/AddDirectorDetails';
import EditDirectorDetails from './Pages/EditDirectorDetails';

function App() {
    const { user } = useContext(AuthContext);
    const location = useLocation();
    // const [isGuest, setIsGuest] = useState(false);


    // useEffect(() => {
        
    //     setIsGuest(localStorage.getItem("role") === "guest");
    // }, [user]); 
    const { isGuest } = useContext(AuthContext);


    const hideHeaderPages = ["/", "/success", "/forgot-password", "/create-account"];

    return (
    <div className={styles.Maindiv} style={{ backgroundImage: `url(${bgImage})` }}>            
    {!hideHeaderPages.includes(location.pathname) && (user || isGuest) && <Header />}

            <div className={styles.innerContent}>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/create-account" element={<CreateAccount />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/success" element={<Success />} />

                    <Route path="/movies" element={<Movies />} />
                    <Route path="/movie-details/:movieId" element={<MovieDetails />} />
                    <Route path="/director-details/:director" element={<DirectorDetails />} />
                    <Route path="/actor-details/:actor" element={<ActorDetails />} />

                    <Route path="/favorites" element={user ? <Favorites /> : <Login />} />
                    <Route path="/add-movie" element={user?.role === 'admin' ? <AddMovie /> : <Login />} />
                    <Route path="/edit-movie/:movieId" element={user?.role === 'admin' ? <EditMovie /> : <Login />} />
                    <Route path="/add-actor-details/:actor" element={user?.role === 'admin' ? <AddActorDetails /> : <Login />} />
                    <Route path="/edit-actor-details/:actor/:detailIndex" element={user?.role === 'admin' ? <EditActorDetails /> : <Login />} />
                    <Route path="/add-director-details/:director" element={user?.role === 'admin' ? <AddDirectorDetails /> : <Login />} />
                    <Route path="/edit-director-details/:director/:detailIndex" element={user?.role === 'admin' ? <EditDirectorDetails /> : <Login />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;




