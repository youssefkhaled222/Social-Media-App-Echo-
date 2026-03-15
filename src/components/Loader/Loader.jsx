import React from 'react'
import { BallTriangle } from 'react-loader-spinner';

export default function Loader() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <BallTriangle
        height={100}
        width={100}
        radius={5}
        color="#0ea5e9"
        ariaLabel="ball-triangle-loading"
        visible={true}
      />
      <p className="text-sm font-medium text-slate-500">Loading Echo...</p>
    </div>
  )
}