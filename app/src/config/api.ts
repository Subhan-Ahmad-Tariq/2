const API_URL = 'http://192.168.10.12:5000/api'; // Use your local server IP

export const endpoints = {
  login: `${API_URL}/auth/login`,
  register: `${API_URL}/auth/register`,
  device: `${API_URL}/devices`, // Fixed path (was `/device`)
  sync: `${API_URL}/sync`,
};

export default API_URL;
