import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'


export default function AuthProtectedRoute({children}) {
  
      if(!localStorage.getItem("userToken")){
          return <>
          {children}
          </>
          
      }
      else{
          return <Navigate to ="/home" />
      }
}
