import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate  } from "react-router";
import { z } from "zod";
import { useSelector , useDispatch } from "react-redux";
import { registerUser } from "../../slice/authSlice";
import { toast } from "react-toastify";

// Zod schema
const signupSchema = z.object({
  firstName: z.string().min(3, "Minimum Length should be greater than 3"),
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password should contain at least 8 characters"),
});

const Signup = () => {


   const dispatch = useDispatch();
   const {isAuthenticated , loading , error } = useSelector((state) => state.auth);
   const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });
  

  // if(loading)
  //   return (<div>Data is Loading....</div>)

  // if(error)
  //   reutrn (<div>Error Occured</div>)

  useEffect(() =>{
    if(isAuthenticated){
      navigate("/");
    }
  },[isAuthenticated , navigate])


  const onSubmit = (data) => {
    dispatch(registerUser(data));
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
          className="flex flex-col justify-center"
        >
          <input
            className="input bg-white text-black border border-gray-700 w-[300px] p-2 rounded mt-3"
            {...register("firstName")}
            placeholder="Enter your firstname"
          />
          {errors.firstName && (
            <span className="text-red-600 text-sm text-left">
              {errors.firstName.message}
            </span>
          )}

          <input
            className="input bg-white text-black border border-gray-700 w-[300px] p-2 rounded mt-4"
            {...register("emailId")}
            placeholder="Enter your email"
          />
          {errors.emailId && (
            <span className="text-red-600 text-sm text-left">
              {errors.emailId.message}
            </span>
          )}

          <input
            className="input bg-white text-black border border-gray-700 w-[300px] p-2 rounded mt-4"
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
            className="btn bg-[#4b4c4d] font-semibold text-white w-[300px] py-2 rounded mt-4"
          >
            Sign Up
          </button>
        </form>

        <div className="text-center text-gray-600 mt-2">
          Have an account?{" "}
          <Link className="text-gray-900 underline" to="/login">
            Sign In
          </Link>
        </div>

        <div className="mt-4 text-center text-gray-600">
          <p>or you can sign in with</p>
          <div div className="flex gap-4 justify-center mt-2 cursor-pointer ">
            <div>
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32">
              <path d="M23.75,16A7.7446,7.7446,0,0,1,8.7177,18.6259L4.2849,22.1721A13.244,13.244,0,0,0,29.25,16" fill="#00ac47" />
              <path d="M23.75,16a7.7387,7.7387,0,0,1-3.2516,6.2987l4.3824,3.5059A13.2042,13.2042,0,0,0,29.25,16" fill="#4285f4" />
              <path d="M8.25,16a7.698,7.698,0,0,1,.4677-2.6259L4.2849,9.8279a13.177,13.177,0,0,0,0,12.3442l4.4328-3.5462A7.698,7.698,0,0,1,8.25,16Z" fill="#ffba00" />
              <path d="M16,8.25a7.699,7.699,0,0,1,4.558,1.4958l4.06-3.7893A13.2152,13.2152,0,0,0,4.2849,9.8279l4.4328,3.5462A7.756,7.756,0,0,1,16,8.25Z" fill="#ea4435" />
              <path d="M29.25,15v1L27,19.5H16.5V14H28.25A1,1,0,0,1,29.25,15Z" fill="#4285f4" />
            </svg>
            </div>
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  fill="#1877F2"
                  d="M15 8a7 7 0 00-7-7 7 7 0 00-1.094 13.915v-4.892H5.13V8h1.777V6.458c0-1.754 1.045-2.724 2.644-2.724.766 0 1.567.137 1.567.137v1.723h-.883c-.87 0-1.14.54-1.14 1.093V8h1.941l-.31 2.023H9.094v4.892A7.001 7.001 0 0015 8z"
                />
                <path
                  fill="#ffffff"
                  d="M10.725 10.023L11.035 8H9.094V6.687c0-.553.27-1.093 1.14-1.093h.883V3.87s-.801-.137-1.567-.137c-1.6 0-2.644.97-2.644 2.724V8H5.13v2.023h1.777v4.892a7.037 7.037 0 002.188 0v-4.892h1.63z"
                />
              </svg>
            </div>

            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#000000"
                width="24"
                height="24"
                viewBox="0 0 32 32"
              >
                <path d="M16,2a14,14,0,0,0-4.43,27.28c.7.13,1-.3,1-.67s0-1.21,0-2.38c-3.89.84-4.71-1.88-4.71-1.88A3.71,3.71,0,0,0,6.24,22.3c-1.27-.86.1-.85.1-.85A2.94,2.94,0,0,1,8.48,22.9a3,3,0,0,0,4.08,1.16,2.93,2.93,0,0,1,.88-1.87c-3.1-.36-6.37-1.56-6.37-6.92a5.4,5.4,0,0,1,1.44-3.76,5,5,0,0,1,.14-3.7s1.17-.38,3.85,1.43a13.3,13.3,0,0,1,7,0c2.67-1.81,3.84-1.43,3.84-1.43a5,5,0,0,1,.14,3.7,5.4,5.4,0,0,1,1.44,3.76c0,5.38-3.27,6.56-6.39,6.91a3.33,3.33,0,0,1,.95,2.59c0,1.87,0,3.38,0,3.84s.25.81,1,.67A14,14,0,0,0,16,2Z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
