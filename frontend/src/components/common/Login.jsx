import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link  , useNavigate} from "react-router";
import { z } from "zod";
import { useSelector , useDispatch } from "react-redux";
import { loginUser } from "../../slice/authSlice";
import { toast } from "react-toastify";

// Zod schema without confirmPassword
const loginSchema = z.object({
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password should contain at least 8 characters"),
});

const Login = () => {

   const dispatch = useDispatch();
   const {isAuthenticated , loading , error} = useSelector((state) => state.auth);
   const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  useEffect(() =>{
    if(isAuthenticated){
      navigate("/");
    }
  },[isAuthenticated,navigate])

  const onSubmit = (data) => {
   dispatch(loginUser(data));
   toast.success("Logged In Successfully")
  };

  return (
    <div className="bg-[#ECEFF1] flex h-screen w-full items-center justify-center">
      <div className="h-auto py-10 flex w-[500px] items-center justify-center flex-col gap-6 bg-white shadow-3xl rounded-lg">
        <img
          src="https://leetcode.com/static/webpack_bundles/images/logo.c36eaf5e6.svg"
          alt="Logo"
          className="w-32"
        />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col  justify-center"
        >
          <input
            className="input bg-white text-black border border-gray-700 w-[300px] p-2 rounded  mt-4"
            {...register("emailId")}
            placeholder="Enter your email"
          />
          {errors.emailId && (
            <span className="text-red-600 text-sm text-left">
              {errors.emailId.message}
            </span>
          )}

          <input
            className="input bg-white text-black border border-gray-700 w-[300px] p-2 rounded  mt-4"
            type="password"
            {...register("password")}
            placeholder="Enter your password"
          />
          {errors.password && (
            <span className="text-red-600 text-sm text-left">
              {errors.password.message}
            </span>
          )}

          <button
            type="submit"
            className="btn bg-[#4b4c4d] font-semibold text-white w-[300px] py-2 rounded  mt-4"
          >
            Sign In
          </button>
        </form>

        <div className="text-center flex justify-between w-[300px] text-gray-600 mt-2">
          <p>
            <Link to="/forgotpassword"> Forgot Password?</Link>
          </p>

          <Link className="text-gray-900 " to="/signup">
            Sign Up
          </Link>
        </div>

        <div className="mt-4 text-center text-gray-600">
          <p>or you can sign in with</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
