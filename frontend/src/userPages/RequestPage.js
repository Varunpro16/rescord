import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function RequestPage() {
  // State to track the selected option
  const [selectedOption, setSelectedOption] = useState(null);
  const navigate=useNavigate()
  const location=useLocation()
  const id=(location.pathname.split('/'))[3]
  const role=(location.pathname.split('/'))[2]
  // Define the style for the selected and unselected options
  const optionStyle = {
    border: '2px solid #333',
    padding: '20px',
    margin: '10px',
    cursor: 'pointer',
    backgroundColor: '#fff',
  };

  const selectedOptionStyle = {
    ...optionStyle,
    backgroundColor: '#4CAF50', // Green background for the selected option
    color: '#fff', // White text for the selected option
  };

  // Handle click events for each option
  const handleOptionClick = (option) => {
    setSelectedOption(option);

    // Perform actions based on the selected option
    if (option === 'text') {
      // Handle text option
      navigate(`/textRequest/${role}/${id}`)
    } else if (option === 'voice') {
      // Handle voice option
      navigate('/voiceRequest')
    } else if (option === 'sos') {
      // Handle SOS option
      navigate('/sosRequest')
    }
  };

  return (
    <div className="App">
      <h1>Select an Option</h1>
      <div
        style={selectedOption === 'text' ? selectedOptionStyle : optionStyle}
        onClick={() => handleOptionClick('text')}
      >
        <h2>Text</h2>
        <p>Choose this option for text input.</p>
      </div>
      <div
        style={selectedOption === 'voice' ? selectedOptionStyle : optionStyle}
        onClick={() => handleOptionClick('voice')}
      >
        <h2>Voice Recognition</h2>
        <p>Choose this option for voice input.</p>
      </div>
      <div
        style={selectedOption === 'sos' ? selectedOptionStyle : optionStyle}
        onClick={() => handleOptionClick('sos')}
      >
        <h2>SOS Emergency</h2>
        <p>Choose this option for emergency assistance.</p>
      </div>
    </div>
  );
}

export default RequestPage;
