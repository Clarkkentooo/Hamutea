import { useState, useEffect } from 'react';
import Icon from '@components/common/Icon';
import { SearchInput } from "@components/common/input";

function UserList() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [activeFilter, setActiveFilter] = useState('customer');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });

  useEffect(() => {
    fetchUsers();
  }, []);
  
  useEffect(() => {
    if (users.length > 0) {
      filterUsers(activeFilter, searchQuery);
    }
  }, [users, activeFilter, searchQuery]);
  
  // Make sure search works across all user types
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // If searching while in a specific filter, consider showing all results
    if (e.target.value && activeFilter !== 'all') {
      // Optional: uncomment to automatically switch to "all" filter when searching
      // setActiveFilter('all');
    }
  };

  const filterUsers = (filter, query = '') => {
    let result = users;
    
    // Apply role filter
    if (filter === 'customer') {
      result = result.filter(user => user.role === 'user');
    } else if (filter === 'admin') {
      result = result.filter(user => user.role === 'admin');
    }
    
    // Apply search query
    if (query) {
      const lowerQuery = query.toLowerCase();
      result = result.filter(user => 
        user.name.toLowerCase().includes(lowerQuery) ||
        user.email.toLowerCase().includes(lowerQuery)
      );
    }
    
    setFilteredUsers(result);
  };
  
  // Debug function to check search functionality
  useEffect(() => {
    console.log("Search query:", searchQuery);
  }, [searchQuery]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch('http://localhost:5000/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Store all users
        setUsers(data.data);
        
        // Apply initial filtering (default to showing customers)
        if (searchQuery) {
          // If there's already a search query, apply it with the current filter
          filterUsers(activeFilter, searchQuery, data.data);
        } else {
          // Otherwise just filter by role
          setFilteredUsers(data.data.filter(user => 
            activeFilter === 'all' ? true : 
            activeFilter === 'admin' ? user.role === 'admin' : 
            user.role === 'user'
          ));
        }
      } else {
        setError(data.message || 'Failed to fetch users');
      }
    } catch (err) {
      setError('Error connecting to the server');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = (user) => {
    setEditMode(true);
    setEditUserId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // Don't populate password for security
      role: user.role
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('adminToken');
      
      if (editMode) {
        // Update existing user
        const response = await fetch(`http://localhost:5000/api/users/${editUserId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            role: formData.role,
            // Only include password if it was provided
            ...(formData.password ? { password: formData.password } : {})
          })
        });
        
        const data = await response.json();
        
        if (data.success) {
          setUsers(users.map(user => user.id === editUserId ? { ...user, ...data.data } : user));
          setShowModal(false);
          resetForm();
        } else {
          alert(data.message || 'Failed to update user');
        }
      } else {
        // Create new user
        const response = await fetch('http://localhost:5000/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
          setUsers([...users, data.data]);
          setShowModal(false);
          resetForm();
        } else {
          alert(data.message || 'Failed to create user');
        }
      }
    } catch (err) {
      alert(editMode ? 'Error updating user' : 'Error creating user');
      console.error(err);
    }
  };
  
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'user'
    });
    setEditMode(false);
    setEditUserId(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUsers(users.filter(user => user.id !== id));
      } else {
        alert(data.message || 'Failed to delete user');
      }
    } catch (err) {
      alert('Error deleting user');
      console.error(err);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <button 
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-hamutea-red hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Icon name="Plus" className="w-5 h-5" />
          Add User
        </button>
      </div>
      
      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="w-full md:w-1/3">
            <SearchInput 
              placeholder="Search by name or email..." 
              onChange={handleSearch}
            />
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => {
                setActiveFilter('customer');
                // Keep search query when changing filter
                if (searchQuery) filterUsers('customer', searchQuery);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${activeFilter === 'customer' 
                ? 'bg-green-500 text-white' 
                : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
            >
              Customers
            </button>
            <button 
              onClick={() => {
                setActiveFilter('admin');
                // Keep search query when changing filter
                if (searchQuery) filterUsers('admin', searchQuery);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${activeFilter === 'admin' 
                ? 'bg-purple-500 text-white' 
                : 'bg-purple-100 text-purple-800 hover:bg-purple-200'}`}
            >
              Admins
            </button>
            <button 
              onClick={() => {
                setActiveFilter('all');
                // Keep search query when changing filter
                if (searchQuery) filterUsers('all', searchQuery);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${activeFilter === 'all' 
                ? 'bg-hamutea-red text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              All Users
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading users...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    {users.length === 0 ? 'No users found' : `No ${activeFilter !== 'all' ? activeFilter : ''} users found`}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role === 'user' ? 'Customer' : 'Admin'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(user.created_at)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Icon name="Edit" className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Icon name="Trash" className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{editMode ? 'Edit User' : 'Add New User'}</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <Icon name="X" className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name*
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hamutea-red"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email*
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hamutea-red"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password{editMode ? ' (leave blank to keep current)' : '*'}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required={!editMode}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hamutea-red"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hamutea-red"
                >
                  <option value="user">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-hamutea-red hover:bg-red-700 text-white rounded-md"
                >
                  {editMode ? 'Save Changes' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserList;