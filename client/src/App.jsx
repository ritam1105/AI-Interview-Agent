import React, { useEffect } from 'react'
import Home from './pages/Home';
import Auth from './pages/Auth';
import InterviewPage from './pages/InterviewPage';
import { Routes, Route } from 'react-router-dom'; 
import axios from 'axios';
import { setUserData } from './redux/userSlice';
import { useDispatch } from 'react-redux';
import Pricing from './pages/Pricing';
import InterviewHistory from './pages/InterviewHistory';
import InterviewReport from './pages/InterviewReport';


export const ServerUrl="https://ai-interview-agent-11b2.onrender.com"

function App() {
  const dispatch=useDispatch()
  useEffect(()=>{
    const getUser=async()=>{
      try {
        const result= await axios.get(ServerUrl+"/api/user/current-user", {withCredentials:true})
        dispatch(setUserData(result.data));
      } catch (error) {
        console.log(error)
        dispatch(setUserData(null))
      }
    }
    getUser()
  },[dispatch]) 
  return (
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/auth' element={<Auth/>}/>
      <Route path='/interview' element={<InterviewPage/>}/>
      <Route path='/history' element={<InterviewHistory/>}/>
      <Route path='/pricing' element={<Pricing/>}/>
      <Route path='/report/:id' element={<InterviewReport/>}/>
    </Routes>
  )

}

export default App
