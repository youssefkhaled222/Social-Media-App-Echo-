import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as zod from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Helmet } from 'react-helmet-async'

const schema = zod.object({
  email: zod.email().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "email is invalid").nonempty("email is required"),
  password: zod.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, "password should contain at least 1 special char , 1 number , 1 capital char , 1 small char and minimum length is 8 chars").nonempty("password is required"),
})

export default function Login() {
  const navigate = useNavigate()
  const [apiError, setapiError] = useState(null)
  const [isLoading, setisLoading] = useState(false)
  const { userLogin, setuserLogin } = useContext(AuthContext)

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const { register, handleSubmit, setError, getValues, watch, formState } = form;

  function handleLogin(data) {
    setisLoading(true)

    axios.post(`https://route-posts.routemisr.com/users/signin`, data)
      .then((res) => {
        if (res.data.success) {
          localStorage.setItem("userToken", res.data.data.token);
          setuserLogin(res.data.data.token)
          navigate("/");
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
        <title>Login</title>
      </Helmet>

      <section className="flex min-h-[80vh] items-center justify-center">
        <div className="w-full max-w-xl rounded-[2rem] bg-white/80 p-8 shadow-2xl ring-1 ring-slate-200 backdrop-blur-sm md:p-10">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-500">
              Echo
            </p>
            <h1 className="mt-3 text-4xl font-black text-slate-800">Login Now</h1>
            <p className="mt-2 text-sm text-slate-500">
              Welcome back. Sign in to continue your journey.
            </p>
          </div>

          {apiError && (
            <p className="mx-auto mb-5 rounded-2xl border border-red-200 bg-red-50 p-3 text-center font-semibold text-red-600 shadow-sm">
              {apiError}
            </p>
          )}

          <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
            <div className="relative z-0 w-full group">
              <input {...register("email")} type="email" id="email" className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100" placeholder="Enter Your Email" />
              {formState.errors.email && (
                <p className="mt-2 rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-500">
                  {formState.errors.email?.message}
                </p>
              )}
            </div>

            <div className="relative z-0 w-full group">
              <input {...register("password")} type="password" id="password" className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100" placeholder="Enter Your Password" />
              {formState.errors.password && (
                <p className="mt-2 rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-500">
                  {formState.errors.password?.message}
                </p>
              )}
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="w-full cursor-pointer rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-200"
            >
              {isLoading ? "Loading..." : "Login"}
            </button>
          </form>
        </div>
      </section>
    </>
  )
}