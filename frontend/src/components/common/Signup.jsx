import React from "react";
import { useForm, useFormState } from "react-hook-form";

const Signup = () => {
  const { register ,  handleSubmit , formState: { errors }} = useForm();

  const submittedData = (data) =>{
    console.log(data);
    console.log(errors)
  }

  return (
    <>
    <form onSubmit={handleSubmit(submittedData)} className="flex flex-col gap-10 justify-center h-screen items-center ">
       <input className="input" {...register('firstName' ,{ required: true })} placeholder="Enter your firstname" />
       <input  className="input" {...register("email"  ,{ required: true })} placeholder="Enter your email"/>
       <input  className="input" type="password" {...register("password"  ,{ required: true })} placeholder="Enter your password"/>
      <button   type="submit" className="btn btn-primary">Submit</button>
    </form>
    </>
  );
};

export default Signup;
