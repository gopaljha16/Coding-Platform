import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logutUser } from "../../slice/authSlice";
import { useNavigate, Link, NavLink } from "react-router";
import { toast } from "react-toastify";
import AdminDashboard from "../Dashboards/AdminDashboard";



const Navbar = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsopen] = useState(false);
  const { isAuthenticated, loading, error, user } = useSelector(
    (state) => state.auth
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated == false) {
      navigate("/login");
    }
  }, []);

  const logout = () => {
    dispatch(logutUser());
    navigate("/login");
    toast.info("Logout Successfully");
  };

  return (
    <div className="flex justify-between h-[70px] w-full py-10 px-5  bg-gray-800 border-b-1 border-gray-400">
      <div>
        <nav className="flex items-center justify-center gap-10">
          <div>Logo</div>
          <div>
            <Link to="/explore">Explore</Link>
          </div>
          <div>
            <Link to="/problems">Problems</Link>
          </div>
          <div>
            <Link to="/contest">Contest</Link>
          </div>
          <div>
            <Link to="/discuss">Discuss</Link>
          </div>
          <div>
            <Link to="/interview">Interview</Link>
          </div>
          <div>
            <Link to="/store">Store</Link>
          </div>
          <div>
            <Link to="/codeEditor">Code Editor</Link>
          </div>
        </nav>
      </div>


      <div className="flex gap-4">
        {/* dashboard */}
        {
           user?.role==="admin"? <NavLink to="/admin"><button className="mt-[-10px] bg-blue-600 p-2 text-white rounded-md cursor-pointer ">Dashboard</button></NavLink>  : ""
         }

        <div className="flex flex-col gap-2 relative cursor-pointer">
          <button
            onClick={() => setIsopen(!isOpen)}
            className=" cursor-pointer"
          >
            {user?.firstName}
          </button>

          {/* drop down showing logut */}
          {isOpen && (
            <>
              <div className="absolute mt-10 ml-[-20px] cursor-pointer">
                <button
                  className="btn btn-warning text-white font-semibold cursor-pointer "
                  onClick={logout}
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
