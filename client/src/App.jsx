import React from 'react'
import Home from './pages/Home';
import Auth from './pages/Auth';
import { Routes, Route } from 'react-router-dom'; 

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/auth' element={<Auth/>}/>
    </Routes>
  )

}

export default App