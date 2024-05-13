// src/App.js
import React, { useEffect, useState } from 'react';
import NavigationMenu from './NavigationMenu';
import PageContent from './PageContent';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';


function OnMission() {
  const [selectedHeading, setSelectedHeading] = useState('');
  const location=useLocation()
  const navigate=useNavigate()
  const missionId=(location.pathname.split('/'))[3]
  const agencyId=(location.pathname.split('/'))[4]
  const role=(location.pathname.split('/'))[2]
  const [peopleLocation,setPeopleLocation]=useState([])

  useEffect(()=>{
    const fetchPeoples = async() => {
      const res=await axios.post('http://localhost:5000/getPeoples',{
        missionId:missionId
      })
      if(res.data.status==='success'){
        console.log("success");;
        setPeopleLocation((res.data.locations))
        console.log(peopleLocation);
      }else{
        alert('no one assigned to this project')
      }
    }
    fetchPeoples()
  },[])

  const handleHeadingSelect = (selectedHeading) => {
    setSelectedHeading(selectedHeading);
  };

  return (
    <div className="App">
      <h1>Navigation Menu</h1>
      <div className="content">
        <NavigationMenu onSelectHeading={handleHeadingSelect} />
        <PageContent selectedHeading={selectedHeading} peopleLocation={peopleLocation} userId={agencyId}/>
      </div>
    </div>
  );
}

export default OnMission;
