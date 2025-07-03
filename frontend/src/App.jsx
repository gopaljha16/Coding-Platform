import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router";
import Homepage from "./pages/Homepage";
import Login from "./components/common/Login";
import Signup from "./components/common/Signup";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./slice/authSlice";
import Problem from "./pages/Problem";
import ProblemSolve from "./pages/ProblemSolve";
// import AdminDashboard from "./components/Dashboards/AdminDashboard"
import AdminPage from "./pages/AdminPage";
import CreateProblem from "./components/Admin/CreateProblem";
import UpdateProblem from "./components/Admin/UpdateProblem";

const App = ({ children, className = "" }) => {
  // authenticated when the user opens website then first authentication doing
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

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
          <Route
        path='/admin'
        element={isAuthenticated && user?.role==="admin" ? <AdminPage/> : <Navigate to="/login"></Navigate>}
        ></Route>
        <Route
        path='/admin/create'
        element={isAuthenticated && user?.role==="admin" ? <CreateProblem/> : <Navigate to="/login"></Navigate>}
        ></Route>
        <Route
        path='/admin/update'
        element={isAuthenticated && user?.role==="admin" ? <UpdateProblem/> : <Navigate to="/login"></Navigate>}
        ></Route>
        </Routes>
      </div>
    </>
  );
};

export default App;
