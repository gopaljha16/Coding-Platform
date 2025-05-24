import React, { useEffect } from 'react'
import { Route, Routes , Navigate } from 'react-router'
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
  },[dispatch])

  return (
    <div>
      <Routes>
        <Route path='/' element={isAuthenticated ? <Homepage/> : <Navigate to="/signup"></Navigate>}/>
        <Route path='/login' element={isAuthenticated ? <Navigate to="/"></Navigate> : <Login/> }/>
        <Route path='/signup' element={isAuthenticated ? <Navigate to="/"></Navigate> : <Signup/>} />
      </Routes>
    </div>
  )
}

export default App