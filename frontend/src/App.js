import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './auth/Login';
import Register from './auth/Register';
import RequestPage from './userPages/RequestPage';
import TextInput from './userPages/TextInput';
import VoiceRecognition from './userPages/VoiceRecognition';
import SosEmergency from './userPages/SosEmergency';
import OnMission from './userPages/OnMission'
import WaitingPage from './userPages/WaitingPage';
import ShowMap from './userPages/ShowMap';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/login' element={<Login />}/>
        <Route path='/register' element={<Register />}/>
        <Route path='/requestPage/:role/:id' element={<RequestPage />}/>
        <Route path='/waitingPage/:role/:id' element={<WaitingPage />}/>
        <Route path='/textRequest/:role/:id' element={<TextInput />}/>
        <Route path='/voiceRequest' element={<VoiceRecognition />}/>
        <Route path='/sosRequest' element={<SosEmergency />}/>
        <Route path='/onMission/:role/:id/:id1' element={<OnMission />}/>
        <Route path='/map' element={<ShowMap />}/>
      </Routes>
    </div>
  );
}

export default App;
