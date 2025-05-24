import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router'
import Homepage from './pages/Homepage'
import Login from './components/common/Login'
import Signup from './components/common/Signup'
import { useDispatch , useSelector } from 'react-redux'
import { checkAuth } from './slice/authSlice'


const App = () => {

  // authenticated when the user opens website then first authentication doing
  const {isAuthenticated} = useSelector((state) => state.auth)
  const dispatch = useDispatch();


  useEffect(() =>{
   dispatch(checkAuth());
  },[])

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