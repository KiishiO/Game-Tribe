import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from './AdminSidebar';
import { adminService } from '../../services/api';
import '../../styles/Admin.css';

const AdminUsers = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!currentUser?.isAdmin) {
      navigate('/');
      return;
    }

    fetchUsers();
  }, [currentUser, navigate]);

  const fetchUsers = async () => {
    try {
      console.log('Fetching users...');
      const data = await adminService.getAllUsers();
      console.log('Users data received:', data);
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId, updates) => {
    try {
      const updatedUser = await adminService.updateUser(userId, updates);
      setUsers(users.map(user => 
        user._id === userId ? updatedUser : user
      ));
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // New function to handle user deletion
  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminService.deleteUser(userId);
        setUsers(users.filter(user => user._id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const filteredUsers = users.filter(user =>
    user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="admin-container">
      <AdminSidebar activeTab="users" />
      
      <main className="admin-content">
        <h1 className="admin-title">User Management</h1>
        
        <div className="admin-controls">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-search"
          />
        </div>

        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Name</th>
                <th>Email</th>
                <th>Admin</th>
                <th>Delete User</th>
                <th>Member Since</th>
                <th>Orders</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user._id}>
                  <td>
                    <img 
                      src={user.profileImage} 
                      alt={user.displayName}
                      className="user-avatar-small"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/assets/myotherimages/player_01.jpg';
                      }}
                    />
                  </td>
                  <td>{user.displayName}</td>
                  <td>{user.email}</td>
                  <td>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={user.isAdmin || false}
                        onChange={(e) => updateUserStatus(user._id, { 
                          isAdmin: e.target.checked 
                        })}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </td>
                  <td>
                    <button 
                      className="btn-delete"
                      onClick={() => deleteUser(user._id)}
                      style={{
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        padding: '5px 10px',
                        borderRadius: '5px',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </td>
                  <td>{new Date(user.memberSince || user.createdAt).toLocaleDateString()}</td>
                  <td>{user.orders?.length || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminUsers;