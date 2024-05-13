import React, { useState} from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

function Login() {
  // Initialize state variables for ID, password, and user type
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('agency'); // Default value is 'agency'
  const navigate=useNavigate()

  // Function to handle form submission
  const handleSubmit = async(e) => {
    e.preventDefault();
    
    // You can access the state variables (id, password, userType) here
    // For example, you can send them to a server for authentication

    console.log('ID:', id);
    console.log('Password:', password);
    console.log('User Type:', userType);

    const response = await axios.post('http://localhost:5000/login',{
        id:id,
        password:password,
        role:userType
    });
    const userId=response.data.id
    const role=response.data.role
    if(response.data.status==='success' ){
      if(response.data.role==='user')
        navigate(`/requestPage/${role}/${userId}`)
      else
        navigate(`/waitingPage/${role}/${userId}`)
    }else{
        navigate('/register')
    }

  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="id">ID:</label>
          <input
            type="text"
            id="id"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="userType">User Type:</label>
          <select
            id="userType"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
          >
            <option value="agency">Agency</option>
            <option value="user">User</option>
          </select>
        </div>
        <div>
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
}

export default Login;
