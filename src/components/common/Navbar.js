import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/actions/authActions'; // Corrigé : import depuis authActions.js
import '../../assets/css/navbar.css';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    const handleLogout = async () => {
        try {
            await dispatch(logout()).unwrap();
            navigate('/login');
        } catch (err) {
            console.error('Erreur lors de la déconnexion:', err);
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/"><h2>DHC Transport</h2></Link>
            </div>
            <ul className="navbar-links">
                {isAuthenticated ? (
                    <>
                        <li>
                            <Link to={user?.role === 'admin' ? '/admin' : user?.role === 'transport' ? '/transport' : '/user'}>
                                Tableau de bord
                            </Link>
                        </li>
                        <li>
                            <Link to="/user/profile">Profil</Link>
                        </li>
                        <li>
                            <button onClick={handleLogout} className="logout-button">
                                Déconnexion
                            </button>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link to="/login">Connexion</Link>
                        </li>
                        <li>
                            <Link to="/register">Inscription</Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;