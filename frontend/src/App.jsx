import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router";
import Homepage from "./pages/Homepage";
import Login from "./components/common/Login";
import Signup from "./components/common/Signup";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./slice/authSlice";
import Problem from "./pages/Problem";
import ProblemSolve from "./pages/ProblemSolve";
import AdminPage from "./pages/AdminPage";
import CreateProblem from "./components/Admin/CreateProblem";
import UpdateProblem from "./components/Admin/UpdateProblem";
import DeleteProblem from "./components/Admin/DeleteProblem";
import UserManagement from "./components/Admin/UserManagement";
import PlatformAnalytics from "./components/Admin/PlatformAnalytics";
import ManageVideo from "./components/Admin/ManageVideo";
import UploadVideo from "./components/Admin/UploadVideo";
import Premium from "./components/common/Premium";
import Interview from "./pages/Interview";
import Explore from "./pages/Explore";
import AdminContest from "./components/Admin/contest/AdminContest";
import ContestPage  from "../src/pages/ContestPage"
import ContestDetail from "./components/Admin/contest/ContestDetail";
import PlaylistDetail from "./components/common/PlaylistDetail";


const App = () => {

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
          <Route path="/explore" element={<Explore/>}/>
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
             <Route
            path="/playlists/:id"
            element={
              isAuthenticated ? (
                <PlaylistDetail/>
              ) : (
                <Navigate to="/login"></Navigate>
              )
            }
          />
          <Route path="/problem/:problemId" element={<ProblemSolve />} />
          <Route
            path="/admin"
            element={
              isAuthenticated && user?.role === "admin" ? (
                <AdminPage />
              ) : (
                <Navigate to="/login"></Navigate>
              )
            }
          ></Route>
          <Route
            path="/admin/create"
            element={
              isAuthenticated && user?.role === "admin" ? (
                <CreateProblem />
              ) : (
                <Navigate to="/login"></Navigate>
              )
            }
          ></Route>
          <Route
            path="/admin/update"
            element={
              isAuthenticated && user?.role === "admin" ? (
                <UpdateProblem />
              ) : (
                <Navigate to="/login"></Navigate>
              )
            }
          ></Route>
          <Route
            path="/admin/delete"
            element={
              isAuthenticated && user?.role === "admin" ? (
                <DeleteProblem />
              ) : (
                <Navigate to="/login"></Navigate>
              )
            }
          ></Route>
          <Route
            path="/admin/users"
            element={
              isAuthenticated && user?.role === "admin" ? (
                <UserManagement />
              ) : (
                <Navigate to="/login"></Navigate>
              )
            }
          ></Route>
          <Route
            path="/admin/analytics"
            element={
              isAuthenticated && user?.role === "admin" ? (
                <PlatformAnalytics />
              ) : (
                <Navigate to="/login"></Navigate>
              )
            }
          ></Route>
          <Route
            path="/admin/video"
            element={
              isAuthenticated && user?.role === "admin" ? (
                <ManageVideo />
              ) : (
                <Navigate to="/login"></Navigate>
              )
            }
          ></Route>
          <Route
            path="/admin/contest"
            element={
              isAuthenticated && user?.role === "admin" ? (
                <AdminContest />
              ) : (
                <Navigate to="/login"></Navigate>
              )
            }
          ></Route>
          <Route
            path="/contest"
            element={
              isAuthenticated ?  (
                <ContestPage />
              ) : (
                <Navigate to="/login"></Navigate>
              )
            }
          ></Route>
            <Route
            path="/contest/:id"
            element={
              isAuthenticated ?  (
                <ContestDetail />
              ) : (
                <Navigate to="/login"></Navigate>
              )
            }
          ></Route>
           <Route
            path="/contest/:id/:problemId"
            element={
              isAuthenticated ?  (
                <ProblemSolve />
              ) : (
                <Navigate to="/login"></Navigate>
              )
            }
          ></Route>
          <Route
            path="/admin/upload/:problemId"
            element={
              isAuthenticated && user?.role === "admin" ? (
                <UploadVideo />
              ) : (
                <Navigate to="/login"></Navigate>
              )
            }
          ></Route>
          <Route
            path="/premium"
            element={
              isAuthenticated ? <Premium /> : <Navigate to="/login"></Navigate>
            }
          ></Route>
        <Route path="/interview" element={isAuthenticated ? <Interview/> : <Navigate to="/login"></Navigate>} ></Route>
        </Routes>
      </div>
    </>
  );
};

export default App;
