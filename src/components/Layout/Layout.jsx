import React from 'react'
import MyNavBar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <>
      <MyNavBar />

      <main className="w-[94%] md:w-[88%] xl:w-[80%] mx-auto px-2 sm:px-4 py-6 min-h-screen">
        <Outlet />
      </main>

      <Footer />
    </>
  )
}