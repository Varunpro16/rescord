import React, { useState, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import io from 'socket.io-client'
import { GeocoderAutocomplete } from '@geoapify/geocoder-autocomplete';
import axios from 'axios'
const socket = io('http://localhost:5000', { withCredentials: true });

function TextInput() {

  useEffect(() => {
    const autocomplete = new GeocoderAutocomplete(
      document.getElementById("autocomplete"), 
      'de684c33daa441bc9e3ae6b6580d11c7', 
      { /* Geocoder options */ }
    );
    
    autocomplete.on('select', (location) => {
      // check selected location here 
      setLocationInput(location.geometry.coordinates);
      console.log(location.geometry.coordinates);
    });

    autocomplete.on('suggestions', (suggestions) => {
      // process suggestions here
      console.log(suggestions);
    });
  }, []); // Empty dependency array to ensure this effect runs once


  const [currentLocation, setCurrentLocation] = useState(null);
  const [inputNone,setInputNone]=useState({
    display:'none'
  })
  // State to track the selected div
  const [selectedDiv, setSelectedDiv] = useState(null);
  // State to track the selected location option
  const [selectedLocationOption, setSelectedLocationOption] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const location=useLocation()
  const navigate=useNavigate()
  const id=(location.pathname.split('/'))[3]
  const role=(location.pathname.split('/'))[2]

  // Define the style for the selected and unselected divs
  const divStyle = {
    border: '2px solid #333',
    padding: '5px',
    margin: '5px',
    cursor: 'pointer',
    backgroundColor: '#fff',
  };

  const selectedDivStyle = {
    ...divStyle,
    backgroundColor: '#4CAF50', // Green background for the selected div
    color: '#fff', // White text for the selected div
  };

  // Handle click events for each div
  const handleDivClick = (div) => {
    setSelectedDiv(div);
  };



  // Handle location option change
  const handleLocationOptionChange = (event) => {
    if(event.target.value==='access'){
      setInputNone({
        display:'none'
      })
    }else if(event.target.value==='enter'){
      setInputNone({
        display:'block'
      })
    }
    setSelectedLocationOption(event.target.value);
  };
  const handleSubmit = async (e) => {
    if(locationInput && selectedDiv){
      console.log("loc: ",locationInput);
      console.log("div: ",selectedDiv);
      const res =await axios.post('http://localhost:5000/requestSubmit',{
        location:locationInput,
        issueType:selectedDiv,
        id:id
      })
      if(res.data.status==="success"){
        navigate(`/onMission/${role}/${res.data.missionId}/${id}`)
      }else{
        alert('Error Occured Resubmit')
        window.location.reload();
      }
    }else if(selectedDiv){
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          setLocationInput({ latitude, longitude });
        });
      } else {
        alert('Geolocation is not supported in this browser.');
      }
    }
  }
  return (
    <div className="App">
      <h1>Select a Div</h1>
      <div
        style={selectedDiv === 'flood' ? selectedDivStyle : divStyle}
        onClick={() => handleDivClick('flood')}
      >
       Flood
      </div>
      <div
        style={selectedDiv === 'earthquake' ? selectedDivStyle : divStyle}
        onClick={() => handleDivClick('earthquake')}
      >
        Earthquake
      </div>
      <div
        style={selectedDiv === 'tsunami' ? selectedDivStyle : divStyle}
        onClick={() => handleDivClick('tsunami')}
      >
        Tsunami
      </div>
      <div
        style={selectedDiv === 'avalanche' ? selectedDivStyle : divStyle}
        onClick={() => handleDivClick('avalanche')}
      >
        Avalanche
      </div>
      <div
        style={selectedDiv === 'landslide' ? selectedDivStyle : divStyle}
        onClick={() => handleDivClick('landslide')}
      >
        Landslide
      </div>
      <div
        style={selectedDiv === 'fire' ? selectedDivStyle : divStyle}
        onClick={() => handleDivClick('fire')}
      >
        Fire
      </div>

      {/* Options for accessing or entering location */}
      <h2>Select an Option</h2>
      <div>
        <label>
          <input
            type="radio"
            name="locationOption"
            value="access"
            onChange={handleLocationOptionChange}
          />{' '}
          Access Current Location
        </label>
      </div>
      <div>
        <label>
          <input
            type="radio"
            name="locationOption"
            value="enter"
            onChange={handleLocationOptionChange}
          />{' '}
          Enter Location
        </label>
      </div>
      <div id="autocomplete" class="autocomplete-container" style={inputNone}></div>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default TextInput
