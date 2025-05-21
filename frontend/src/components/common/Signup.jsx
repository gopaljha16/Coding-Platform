import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router";
import { z } from "zod";

// Zod schema without confirmPassword
const signupSchema = z.object({
  firstName: z.string().min(3, "Minimum Length should be greater than 3"),
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password should contain at least 8 characters"),
});

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  const submittedData = (data) => {
    console.log(data);
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
          onSubmit={handleSubmit(submittedData)}
          className="flex flex-col  justify-center"
        >
          <input
            className="input bg-white text-black border border-gray-700 w-[300px] p-2 rounded mt-3"
            {...register("firstName")}
            placeholder="Enter your firstname"
          />
          {errors.firstName && (
            <span className="text-red-600 text-sm text-left">{errors.firstName.message}</span>
          )}

          <input
            className="input bg-white text-black border border-gray-700 w-[300px] p-2 rounded  mt-4"
            {...register("emailId")}
            placeholder="Enter your email"
          />
          {errors.emailId && (
            <span className="text-red-600 text-sm text-left">{errors.emailId.message}</span>
          )}

          <input
            className="input bg-white text-black border border-gray-700 w-[300px] p-2 rounded  mt-4"
            type="password"
            {...register("password")}
            placeholder="Enter your password"
          />
          {errors.password && (
            <span className="text-red-600 text-sm text-left">{errors.password.message}</span>
          )}

          <button
            type="submit"
            className="btn bg-[#4b4c4d] font-semibold text-white w-[300px] py-2 rounded  mt-4"
          >
            Sign Up
          </button>
        </form>

        <div className="text-center text-gray-600 mt-2">
          Have an account?{" "}
          <Link className="text-gray-900 " to="/login">
            Sign In
          </Link>
        </div>

        <div className="mt-4 text-center text-gray-600">
          <p>or you can sign in with</p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
