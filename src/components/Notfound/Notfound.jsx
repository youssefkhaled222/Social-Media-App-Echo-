import React from "react";
import { Helmet } from 'react-helmet-async'
import { Link } from "react-router-dom";
import { Button } from "@heroui/react";

export default function Notfound() {
  return (
    <>
      <Helmet>
        <title>Page Not Found</title>
      </Helmet>

      <div className="flex min-h-[70vh] flex-col items-center justify-center rounded-[2rem] bg-white/70 px-6 py-16 text-center shadow-xl ring-1 ring-slate-200 backdrop-blur-sm">
        <div className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-sky-500">
          Echo
        </div>

        <h1 className="text-8xl font-black text-slate-800">404</h1>

        <h2 className="mt-4 text-2xl font-bold text-slate-700">
          Oops! Page not found
        </h2>

        <p className="mt-3 max-w-md text-slate-500">
          The page you are looking for might have been removed, renamed,
          or is temporarily unavailable.
        </p>

        <Link to="/home">
          <Button color="primary" className="mt-8 px-6 font-semibold shadow-md">
            Go Back Home
          </Button>
        </Link>
      </div>
    </>
  );
}