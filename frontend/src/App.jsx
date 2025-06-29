import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router";
import Homepage from "./pages/Homepage";
import Login from "./components/common/Login";
import Signup from "./components/common/Signup";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./slice/authSlice";
import Problem from "./pages/Problem";
import ProblemSolve from "./pages/ProblemSolve";

const App = ({ children, className = "" }) => {
  // authenticated when the user opens website then first authentication doing
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [stars, setStars] = useState([]);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate random stars
    const generateStars = () => {
      const newStars = [];
      for (let i = 0; i < 50; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.8 + 0.2,
          animationDelay: Math.random() * 4,
          animationDuration: Math.random() * 3 + 2,
        });
      }
      setStars(newStars);
    };

    // Generate floating particles
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 20; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 6 + 2,
          color: i % 3 === 0 ? "#f59e0b" : i % 3 === 1 ? "#ef4444" : "#8b5cf6",
          animationDelay: Math.random() * 5,
          animationDuration: Math.random() * 8 + 6,
          direction: Math.random() > 0.5 ? 1 : -1,
        });
      }
      setParticles(newParticles);
    };

    generateStars();
    generateParticles();
  }, []);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/problems"
            element={
              isAuthenticated ? (
                <Problem></Problem>
              ) : (
                <Navigate to="/login"></Navigate>
              )
            }
          />
          <Route path="/problem/:problemId" element={<ProblemSolve />} />
          {/* <Route
        path='/admin'
        element={isAuthenticated && user?.role==="admin" ? <AdminDashboard/> : <Navigate to="/login"></Navigate>}
        ></Route> */}
        </Routes>
      </div>
    </>
  );
};

export default App;
