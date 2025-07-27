import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useSelector, useDispatch } from "react-redux";
import { registerUser } from "../../slice/authSlice";
import { toast } from "react-toastify";
import { EyeOff, Eye, ArrowLeft } from "lucide-react";

// Zod schema without confirmPassword
const loginSchema = z.object({
  firstName:z.string().min(2, "Name should contain at least greater than 3 characters"),
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password should contain at least 8 characters"),
  confirmPassword:z.string().min(8, "Password should contain at least 8 characters"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const Signup = () => {
  const [showPassword, setShowpassword] = useState(false);
  const [showConfirmPassword , setShowConfirmPassword] = useState(false);
  const dispatch = useDispatch();
  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);


  const onSubmit = async (data) => {
    try {
      const res = await dispatch(registerUser(data));
      if (res?.meta?.requestStatus === "fulfilled") {
        toast.success("Logged In Successfully");
      } else {
        toast.error("Something went wrong");
      }
    } catch (err) {
      toast.error("Failed to Login");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative">
      {/* Background gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.1),transparent_50%)]"></div>

      {/* Back to Home button */}
      <NavLink to="/">
        <button className="absolute top-6 left-6 hover:text-orange-400 flex items-center text-gray-400 htransition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </button>
      </NavLink>

      <form  className="relative w-full max-w-md"  onSubmit={handleSubmit(onSubmit)} >
   {/* Sign up container */}
      <div className="relative w-full max-w-md">
        {/* Orange accent line at top */}
        <div className="h-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-t-2xl"></div>

        {/* Main login card */}
        <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-b-2xl p-8 shadow-2xl">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-6"></div>

          {/* Welcome text */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-gray-400">Join Codexa for Coding Challenges</p>
          </div>

          {/* Google Sign In Button */}
          <button className="w-full bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-white py-3 px-4 rounded-xl mb-6 flex items-center justify-center transition-all duration-200">
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </button>

          {/* Divider */}
          <div className="flex items-center mb-6">
            <div className="flex-1 border-t border-slate-700"></div>
            <span className="px-4 text-sm text-gray-400">
              or continue with email
            </span>
            <div className="flex-1 border-t border-slate-700"></div>
          </div>


          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
               Name
              </label>
              <input
                className="w-full bg-slate-700/50 border border-slate-600 text-white placeholder-gray-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                {...register("firstName")}
                placeholder="JhonDoe"
              />
              {errors.firstName && (
                <span className="text-red-400 text-sm mt-1 block">
                  {errors.firstName.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                className="w-full bg-slate-700/50 border border-slate-600 text-white placeholder-gray-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                {...register("emailId")}
                placeholder="name@company.com"
              />
              {errors.emailId && (
                <span className="text-red-400 text-sm mt-1 block">
                  {errors.emailId.message}
                </span>
              )}
            </div>

            {/* Password field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-300">
                  Password
                </label>
            
              </div>
              <div className="relative">
                <input
                  className="w-full bg-slate-700/50 border border-slate-600 text-white placeholder-gray-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 pr-12"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  onClick={() => setShowpassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="text-red-400 text-sm mt-1 block">
                  {errors.password.message}
                </span>
              )}
            </div>

              <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-300">
                  Confirm Password
                </label>
              </div>
              <div className="relative">
                <input
                  className="w-full bg-slate-700/50 border border-slate-600 text-white placeholder-gray-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 pr-12"
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="text-red-400 text-sm mt-1 block">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </div>

         
          <p className="mt-8 text-center text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-orange-400 hover:text-orange-300 font-semibold transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
      </form>

   
    </div>
  );
};

export default Signup;
