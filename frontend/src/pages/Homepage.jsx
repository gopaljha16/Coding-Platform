import React from 'react'
import Navbar from '../components/common/Navbar'
import { useSelector ,useDispatch } from 'react-redux'


const Homepage = () => {

   const dispatch = useDispatch()
   const {isAuthenticated , user } = useSelector((state) => state.auth);

  

  return (
    <>
      <Navbar/>
    <div>Homepage</div>
    </>
   
  )
}

export default Homepage