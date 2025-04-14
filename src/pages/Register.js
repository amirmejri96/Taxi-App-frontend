import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register } from '../redux/actions/authActions';
import LoadingSpinner from '../components/common/LoadingSpinner';
import '../assets/css/register.css';

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, isLoading, error, user } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user', // Valeur par défaut
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(register(formData)).unwrap();
        } catch (err) {
            console.error('Erreur lors de l’inscription:', err);
        }
    };

    useEffect(() => {
        if (isAuthenticated && user) {
            if (user.role === 'admin') {
                navigate('/admin');
            } else if (user.role === 'transport') {
                navigate('/transport');
            } else {
                navigate('/user');
            }
        }
    }, [isAuthenticated, user, navigate]);

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="register-container">
            <h2>Inscription</h2>
            <form onSubmit={handleSubmit} className="register-form">
                <div className="form-group">
                    <label htmlFor="name">Nom</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Mot de passe</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="role">Rôle</label>
                    <select id="role" name="role" value={formData.role} onChange={handleChange}>
                        <option value="user">Utilisateur</option>
                        <option value="transport">Transporteur</option>
                        <option value="admin">Administrateur</option>
                    </select>
                </div>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? <LoadingSpinner size="small" color="#fff" /> : 'S’inscrire'}
                </button>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
};

export default Register;