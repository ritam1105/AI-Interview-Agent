import React, { useEffect } from 'react'
import Home from './pages/Home';
import Auth from './pages/Auth';
import { Routes, Route } from 'react-router-dom'; 
import axios from 'axios';
import { setUserData } from './redux/userSlice';
import { useDispatch } from 'react-redux';

export const serverUrl="http://localhost:8000"

function App() {
  const dispatch=useDispatch()
  useEffect(()=>{
    const getUser=async()=>{
      try {
        const result= await axios.get(serverUrl+"/api/user/current-user", {withCredentials:true})
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
    </Routes>
  )

}

export default App