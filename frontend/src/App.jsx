import React from 'react'
import { Route, Routes } from 'react-router'
import Homepage from './pages/Homepage'
import Login from './components/common/Login'
import Signup from './components/common/Signup'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Homepage/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>} />
      </Routes>
    </div>
  )
}

export default App