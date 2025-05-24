import React, { useEffect } from "react";
import { useSelector , useDispatch  } from "react-redux";
import { logutUser } from "../../slice/authSlice";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";


const Navbar = () => {
 
    const dispatch = useDispatch();
    const {isAuthenticated , loading , error} = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() =>{
       if(isAuthenticated==false){
         navigate("/login");
       }
    },[])

    const logout = ( ) =>{
     dispatch(logutUser())
     navigate("/login");
     toast.info("Logout Successfully");
    }

  return (
    <div className="flex justify-between w-full p-10">
      <div>Home</div>
      <button onClick={logout} className="btn btn-primary">Logout</button>
    </div>
  );
};

export default Navbar;
