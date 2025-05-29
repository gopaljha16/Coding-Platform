import React, { useEffect } from 'react'
import { Route, Routes , Navigate } from 'react-router'
import Homepage from './pages/Homepage'
import Login from './components/common/Login'
import Signup from './components/common/Signup'
import { useDispatch , useSelector } from 'react-redux'
import { checkAuth } from './slice/authSlice'
import Problem from './pages/Problem'
import Navbar from './components/common/Navbar'
import CodeEditor from './components/common/CodeEditor'
import AdminDashboard from './components/Dashboards/AdminDashboard'


const App = () => {

  // authenticated when the user opens website then first authentication doing
  const {isAuthenticated , loading , user} = useSelector((state) => state.auth)
  const dispatch = useDispatch();

  

  useEffect(() =>{
   dispatch(checkAuth());
  },[dispatch])


  
   if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }


  return (
    <div>
     
      <Routes>
        <Route path='/' element={isAuthenticated ? <Homepage/> : <Navigate to="/signup"></Navigate>}/>
        <Route path='/login' element={isAuthenticated ? <Navigate to="/"></Navigate> : <Login/> }/>
        <Route path='/signup' element={isAuthenticated ? <Navigate to="/"></Navigate> : <Signup/>} />
        <Route path='/problems' element={isAuthenticated ? <Problem></Problem> : <Navigate to="/signup"></Navigate>} />
        <Route path='/codeEditor' element={isAuthenticated ? <CodeEditor/> : <Navigate to="/login"></Navigate>} />
        <Route
        path='/admin'
        element={isAuthenticated && user?.role==="admin" ? <AdminDashboard/> : <Navigate to="/login"></Navigate>}
        ></Route>
      </Routes>
    </div>
  )
}

export default App