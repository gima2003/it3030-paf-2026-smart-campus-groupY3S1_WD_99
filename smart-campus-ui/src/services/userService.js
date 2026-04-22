import axios from 'axios';

const API_URL = 'http://localhost:8081/api/admin/users';

export const createUser = async (userData) => {
  try {
    const response = await axios.post(API_URL, userData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      const data = error.response.data;
      if (typeof data === 'string') {
        throw new Error(data);
      } else if (data.errors && Array.isArray(data.errors)) {
        const errorMsgs = data.errors.map(err => err.defaultMessage);
        throw new Error(errorMsgs.join(", "));
      } else if (data.message) {
        throw new Error(data.message);
      } else {
        throw new Error(JSON.stringify(data));
      }
    }
    throw new Error('Failed to create user.');
  }
};

export const getAllUsers = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch users.');
    }
};

export const getUserStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/stats`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch statistics.');
  }
};

export const updateUserStatus = async (id, isActive) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}/status`, { isActive });
    return response.data;
  } catch (error) {
    throw new Error('Failed to update user status.');
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to delete user.');
  }
};

export const updateProfile = async (profileData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put('http://localhost:8081/api/users/profile', profileData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) throw new Error(error.response.data);
    throw new Error('Failed to update profile.');
  }
};

export const updateUserByAdmin = async (id, adminData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, adminData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) throw new Error(error.response.data);
    throw new Error('Failed to update user.');
  }
};
