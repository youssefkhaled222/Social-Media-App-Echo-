import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Home from './components/Home/Home'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import Notfound from './components/Notfound/Notfound'
import Profile from './components/Profile/Profile'
import CounterContextProvider from './context/CounterContext'
import {HeroUIProvider} from "@heroui/react";
import AuthContextProvider from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import AuthProtectedRoute from './components/ProtectedRoute/AuthProtectedRoute'
import {QueryClient , QueryClientProvider} from "@tanstack/react-query"
import PostDetails from './components/PostDetails/PostDetails'
import { ToastContainer } from 'react-toastify'
import DetectOffline from './components/DetectOffline/DetectOffline'
import {useNetworkState} from 'react-use'


const router=createBrowserRouter([
  {path : "" , element : <Layout /> , children : [
    {index : true , element : <ProtectedRoute> <Home/> </ProtectedRoute>},
    {path : "home" , element : <ProtectedRoute> <Home/> </ProtectedRoute>},
    {path : "postdetails/:id" , element : <ProtectedRoute> <PostDetails/> </ProtectedRoute>},
    {path : "profile" , element : <ProtectedRoute> <Profile/> </ProtectedRoute>},
    {path : "login" , element : <AuthProtectedRoute> <Login /> </AuthProtectedRoute>},
    {path : "register" , element :<AuthProtectedRoute> <Register /> </AuthProtectedRoute>},
    {path : "*" , element : <Notfound />},
  ]},
  
  
])

const query = new QueryClient();

export default function App() {

      const {online} = useNetworkState()

  return(
    <>
    {!online && <DetectOffline/>}
    <QueryClientProvider client={query}>
    <AuthContextProvider>
     <HeroUIProvider>
      <CounterContextProvider>
        <RouterProvider router={router}></RouterProvider>
      </CounterContextProvider>
      <ToastContainer/>
     </HeroUIProvider>
    </AuthContextProvider>
    </QueryClientProvider>
    </>
  );

}
