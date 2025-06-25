import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import authService from "./appwrite/auth"
import { login, logout } from "./store/authSlice"
import { Footer, Header } from './components'
import { Outlet } from 'react-router-dom'

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    authService.getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({ userData }))
        } else {
          dispatch(logout())
        }
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-green-50">
        <div className="text-center">
          <div className="relative">
            {/* Premium loading spinner */}
            <div className="w-16 h-16 border-4 border-emerald-100 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-green-700">
              Loading Narrativ
            </h3>
            <p className="text-gray-500 text-sm mt-1">Preparing your premium experience...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50">
      <Header />
      
      {/* Main content area with sidebar spacing */}
      <main className="md:ml-64 transition-all duration-300">
        <div className="min-h-screen pt-16 md:pt-0">
          <Outlet />
        </div>
      </main>
      
      {/* Footer with sidebar spacing */}
      {/* <footer className="md:ml-64 transition-all duration-300">
        <Footer />
      </footer> */}
    </div>
  )
}

export default App