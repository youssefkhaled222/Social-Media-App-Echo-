import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as zod from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async'

const schema = zod.object({
  name: zod.string().min(3, "minimum length is 3 chars").max(15, "maximum length is 15 chars").nonempty("name is required"),
  username: zod.string().min(3, "minimum length is 3 chars").max(15, "maximum length is 15 chars").nonempty("username is required"),
  email: zod.email().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "email is invalid").nonempty("email is required"),
  dateOfBirth: zod.string().refine((date) => {
    const userDate = new Date(date);
    const currentDate = new Date();
    if (currentDate.getFullYear() - userDate.getFullYear() >= 10) {
      return true
    } else {
      return false
    }
  }, "invalid date"),
  gender: zod.enum(["male", "female"]),
  password: zod.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, "password should contain at least 1 special char , 1 number , 1 capital char , 1 small char and minimum length is 8 chars").nonempty("password is required"),
  rePassword: zod.string().nonempty("rePassword is required")
}).refine((object) => {
  if (object.password === object.rePassword) {
    return true
  } else {
    return false
  }
}, { error: "password and repassword do not match !", path: ["rePassword"] })

export default function Register() {
  const navigate = useNavigate()
  const [apiError, setapiError] = useState(null)
  const [isLoading, setisLoading] = useState(false)

  const form = useForm({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      dateOfBirth: "",
      gender: "",
      password: "",
      rePassword: "",
    },
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const { register, handleSubmit, setError, getValues, watch, formState } = form;

  function handleRegister(data) {
    setisLoading(true)
    console.log(data);

    axios.post(`https://route-posts.routemisr.com/users/signup`, data)
      .then((res) => {
        if (res.data.success) {
          navigate("/login");
        }
      })
      .catch((err) => {
        setapiError(err.response?.data?.message || "Something went wrong");
        setisLoading(false);
      });
  }

  return (
    <>
      <Helmet>
        <title>Register</title>
      </Helmet>

      <section className="flex min-h-[80vh] items-center justify-center">
        <div className="w-full max-w-2xl rounded-[2rem] bg-white/80 p-8 shadow-2xl ring-1 ring-slate-200 backdrop-blur-sm md:p-10">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-500">
              Echo
            </p>
            <h1 className="mt-3 text-4xl font-black text-slate-800">Register Now</h1>
            <p className="mt-2 text-sm text-slate-500">
              Create your account and start sharing your world.
            </p>
          </div>

          {apiError && (
            <p className="mx-auto mb-5 rounded-2xl border border-red-200 bg-red-50 p-3 text-center font-semibold text-red-600 shadow-sm">
              {apiError}
            </p>
          )}

          <form onSubmit={handleSubmit(handleRegister)} className="space-y-5">
            <div>
              <input {...register("name")} type="text" id="name" className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100" placeholder="Enter Your Name" />
              {formState.errors.name && (<p className="mt-2 rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-500">{formState.errors.name?.message}</p>)}
            </div>

            <div>
              <input {...register("username")} type="text" id="username" className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100" placeholder="Enter Your Username" />
              {formState.errors.username && (
                <p className="mt-2 rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-500">
                  {formState.errors.username?.message}
                </p>
              )}
            </div>

            <div>
              <input {...register("email")} type="email" id="email" className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100" placeholder="Enter Your Email" />
              {formState.errors.email && (
                <p className="mt-2 rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-500">
                  {formState.errors.email?.message}
                </p>
              )}
            </div>

            <div>
              <input {...register("dateOfBirth")} type="date" id="dateOfBirth" className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100" />
              {formState.errors.dateOfBirth && (
                <p className="mt-2 rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-500">
                  {formState.errors.dateOfBirth?.message}
                </p>
              )}
            </div>

            <div className="flex gap-6 rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
              <div className="flex items-center">
                <input {...register("gender")} id="male" type="radio" defaultValue="male" className="mr-2" defaultChecked />
                <label htmlFor="male" className="text-sm font-medium text-slate-700">
                  Male
                </label>
              </div>

              <div className="flex items-center">
                <input {...register("gender")} id="female" type="radio" defaultValue="female" className="mr-2" defaultChecked />
                <label htmlFor="female" className="text-sm font-medium text-slate-700">
                  Female
                </label>
              </div>
            </div>

            <div>
              <input {...register("password")} type="password" id="password" className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100" placeholder="Enter Your Password" />
              {formState.errors.password && (
                <p className="mt-2 rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-500">
                  {formState.errors.password?.message}
                </p>
              )}
            </div>

            <div>
              <input {...register("rePassword")} type="password" id="rePassword" className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100" placeholder="Confirm Your Password" />
              {formState.errors.rePassword && (
                <p className="mt-2 rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-500">
                  {formState.errors.rePassword?.message}
                </p>
              )}
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="w-full cursor-pointer rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-200"
            >
              {isLoading ? "Loading..." : "Register"}
            </button>
          </form>
        </div>
      </section>
    </>
  )
}