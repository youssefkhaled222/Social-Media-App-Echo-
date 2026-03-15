import React from 'react'

export default function DetectOffline() {
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
        <div className="rounded-3xl border border-slate-700 bg-slate-900 px-8 py-10 text-center text-white shadow-2xl">
          <h1 className="text-3xl font-extrabold">You are offline now</h1>
          <p className="mt-3 text-sm text-slate-300">
            Check your internet connection and try again.
          </p>
        </div>
      </div>
    </>
  )
}