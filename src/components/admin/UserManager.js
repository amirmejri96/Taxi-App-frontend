import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, updateUser } from '../../redux/actions/authActions';
import LoadingSpinner from '../common/LoadingSpinner';
import '../../assets/css/userManager.css';

const UserManager = () => {
    const dispatch = useDispatch();
    const { users, isLoading, error } = useSelector((state) => state.auth);

    const [editUser, setEditUser] = useState(null);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const handleEdit = (user) => {
        setEditUser({ ...user });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(updateUser({ id: editUser._id, userData: editUser })).unwrap();
            setEditUser(null);
        } catch (err) {
            console.error('Erreur lors de la mise à jour:', err);
        }
    };

    if (isLoading) return <LoadingSpinner />;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="user-manager-container">
            <h2>Gestion des utilisateurs</h2>
            {users.length === 0 ? (
                <p>Aucun utilisateur disponible.</p>
            ) : (
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Email</th>
                            <th>Rôle</th>
                            <th>Téléphone</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>{user.phone || '-'}</td>
                                <td>
                                    <button onClick={() => handleEdit(user)}>Modifier</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {editUser && (
                <div className="edit-user-form">
                    <h3>Modifier l'utilisateur</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Nom</label>
                            <input
                                type="text"
                                name="name"
                                value={editUser.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={editUser.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Rôle</label>
                            <select name="role" value={editUser.role} onChange={handleChange}>
                                <option value="user">Utilisateur</option>
                                <option value="transport">Transporteur</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Téléphone</label>
                            <input
                                type="text"
                                name="phone"
                                value={editUser.phone || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <button type="submit" disabled={isLoading}>
                            Enregistrer
                        </button>
                        <button type="button" onClick={() => setEditUser(null)}>
                            Annuler
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default UserManager;