import React, { useEffect } from "react";
import { Route, Routes, Navigate, useParams } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Login from "./components/common/Login";
import Signup from "./components/common/Signup";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth, getProfile } from "./slice/authSlice";
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
import ContestPage from "../src/pages/ContestPage";
import ContestDetail from "./components/Admin/contest/ContestDetail";
import ContestDetails from "./components/contest/ContestDetails";
import ContestProblemSolve from "./components/contest/ContestProblemSolve";
import ContestLeaderboard from "./components/contest/ContestLeaderboard";
import PlaylistDetail from "./components/common/PlaylistDetail";
import DashboardPage from "./components/Dashboards/DashboardPage";
import UserProfile from "./pages/UserProfile";
import DiscussPage from "./pages/DiscussPage";
import DiscussionDetail from "./pages/DiscussionDetail";
import { ContestProvider } from "./context/ContestContext";
import DSAVisualizerPage from "./pages/DSAVisualizerPage";
import EmailVerification from "./components/common/EmailVerification"; // Import EmailVerification

const ContestLeaderboardWrapper = () => {
  const { contestId } = useParams();
  return <ContestLeaderboard contestId={contestId} isContestActive={true} />;
};

const App = () => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth())
      .unwrap()
      .then(() => {
        dispatch(getProfile());
      })
      .catch(() => {
        // handle error if needed
      });
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
        <ContestProvider>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-email" element={<EmailVerification />} /> {/* New route for email verification */}
            <Route
              path="/dashboard"
              element={
                isAuthenticated && user?.emailVerified ? (
                  <DashboardPage />
                ) : (
                  <Navigate to={isAuthenticated ? "/verify-email" : "/login"} />
                )
              }
            />
            <Route
              path="/interview"
              element={
                isAuthenticated && user?.emailVerified ? (
                  <Interview />
                ) : (
                  <Navigate to={isAuthenticated ? "/verify-email" : "/login"} />
                )
              }
            />
            <Route
              path="/problems"
              element={
                isAuthenticated && user?.emailVerified ? (
                  <Problem />
                ) : (
                  <Navigate to={isAuthenticated ? "/verify-email" : "/login"} />
                )
              }
            />
            <Route
              path="/playlists/:id"
              element={
                isAuthenticated && user?.emailVerified ? (
                  <PlaylistDetail />
                ) : (
                  <Navigate to={isAuthenticated ? "/verify-email" : "/login"} />
                )
              }
            />
            <Route path="/problem/:problemId" element={<ProblemSolve />} />
            <Route
              path="/admin"
              element={
                isAuthenticated && user?.role === "admin" && user?.emailVerified ? (
                  <AdminPage />
                ) : (
                  <Navigate to={isAuthenticated ? "/verify-email" : "/login"} />
                )
              }
            />
            <Route
              path="/admin/create"
              element={
                isAuthenticated && user?.role === "admin" && user?.emailVerified ? (
                  <CreateProblem />
                ) : (
                  <Navigate to={isAuthenticated ? "/verify-email" : "/login"} />
                )
              }
            />
            <Route
              path="/admin/update"
              element={
                isAuthenticated && user?.role === "admin" && user?.emailVerified ? (
                  <UpdateProblem />
                ) : (
                  <Navigate to={isAuthenticated ? "/verify-email" : "/login"} />
                )
              }
            />
            <Route
              path="/admin/delete"
              element={
                isAuthenticated && user?.role === "admin" && user?.emailVerified ? (
                  <DeleteProblem />
                ) : (
                  <Navigate to={isAuthenticated ? "/verify-email" : "/login"} />
                )
              }
            />
            <Route
              path="/admin/users"
              element={
                isAuthenticated && user?.role === "admin" && user?.emailVerified ? (
                  <UserManagement />
                ) : (
                  <Navigate to={isAuthenticated ? "/verify-email" : "/login"} />
                )
              }
            />
            <Route
              path="/admin/analytics"
              element={
                isAuthenticated && user?.role === "admin" && user?.emailVerified ? (
                  <PlatformAnalytics />
                ) : (
                  <Navigate to={isAuthenticated ? "/verify-email" : "/login"} />
                )
              }
            />
            <Route
              path="/admin/video"
              element={
                isAuthenticated && user?.role === "admin" && user?.emailVerified ? (
                  <ManageVideo />
                ) : (
                  <Navigate to={isAuthenticated ? "/verify-email" : "/login"} />
                )
              }
            />
            <Route
              path="/admin/contest"
              element={
                isAuthenticated && user?.role === "admin" && user?.emailVerified ? (
                  <AdminContest />
                ) : (
                  <Navigate to={isAuthenticated ? "/verify-email" : "/login"} />
                )
              }
            />
            <Route
              path="/contest"
              element={
                isAuthenticated && user?.emailVerified ? (
                  <ContestPage />
                ) : (
                  <Navigate to={isAuthenticated ? "/verify-email" : "/login"} />
                )
              }
            />
            <Route
              path="/contest/:contestId"
              element={
                isAuthenticated && user?.emailVerified ? (
                  <ContestDetails />
                ) : (
                  <Navigate to={isAuthenticated ? "/verify-email" : "/login"} />
                )
              }
            />
            <Route
              path="/admin/contest/:id"
              element={
                isAuthenticated && user?.role === "admin" && user?.emailVerified ? (
                  <ContestDetail />
                ) : (
                  <Navigate to={isAuthenticated ? "/verify-email" : "/login"} />
                )
              }
            />
            <Route
              path="/contest/:contestId/problem/:problemId"
              element={
                isAuthenticated && user?.emailVerified ? (
                  <ContestProblemSolve />
                ) : (
                  <Navigate to={isAuthenticated ? "/verify-email" : "/login"} />
                )
              }
            />
            <Route
              path="/contest/:contestId/leaderboard"
              element={
                isAuthenticated && user?.emailVerified ? (
                  <ContestLeaderboardWrapper />
                ) : (
                  <Navigate to={isAuthenticated ? "/verify-email" : "/login"} />
                )
              }
            />
            <Route
              path="/admin/upload/:problemId"
              element={
                isAuthenticated && user?.role === "admin" && user?.emailVerified ? (
                  <UploadVideo />
                ) : (
                  <Navigate to={isAuthenticated ? "/verify-email" : "/login"} />
                )
              }
            />
            <Route
              path="/premium"
              element={
                isAuthenticated && user?.emailVerified ? (
                  <Premium />
                ) : (
                  <Navigate to={isAuthenticated ? "/verify-email" : "/login"} />
                )
              }
            />
            <Route
              path="/profile"
              element={
                isAuthenticated && user?.emailVerified ? (
                  <UserProfile />
                ) : (
                  <Navigate to={isAuthenticated ? "/verify-email" : "/login"} />
                )
              }
            />
            <Route
              path="/discuss"
              element={
                isAuthenticated && user?.emailVerified ? (
                  <DiscussPage />
                ) : (
                  <Navigate to={isAuthenticated ? "/verify-email" : "/login"} />
                )
              }
            />
            <Route
              path="/discuss/:discussionId"
              element={
                isAuthenticated && user?.emailVerified ? (
                  <DiscussionDetail />
                ) : (
                  <Navigate to={isAuthenticated ? "/verify-email" : "/login"} />
                )
              }
            />
            <Route
              path="/visualizer"
              element={
                isAuthenticated && user?.emailVerified ? (
                  <DSAVisualizerPage />
                ) : (
                  <Navigate to={isAuthenticated ? "/verify-email" : "/login"} />
                )
              }
            />
          </Routes>
        </ContestProvider>
      </div>
    </>
  );
};

export default App;
