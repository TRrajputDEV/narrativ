import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as authLogin } from '../store/authSlice'
import { Button, Input } from './index'
import authService from '../appwrite/auth'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'

function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const login = async (data) => {
        setError("")
        setIsLoading(true)
        try {
            const session = await authService.login(data)
            if (session) {
                const userData = await authService.getCurrentUser()
                if (userData) dispatch(authLogin(userData));
                navigate("/")
            }
        } catch (error) {
            setError(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                {/* Decorative header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 w-12 h-12 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-2xl">N</span>
                            </div>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-white">Welcome back to Narrativ</h2>
                    <p className="text-blue-100 mt-2">Sign in to continue your journey</p>
                </div>
                
                <div className="p-8">
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-red-700">{error}</span>
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit(login)} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Email address
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                className={`w-full ${errors.email ? 'border-red-300' : 'border-gray-300'}`}
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                                        message: "Please enter a valid email"
                                    }
                                })}
                            />
                            {errors.email && (
                                <p className="mt-1.5 text-sm text-red-600 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {errors.email.message}
                                </p>
                            )}
                        </div>
                        
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                {/* <Link 
                                    to="/forgot-password" 
                                    className="text-sm font-medium text-blue-600 hover:text-blue-500 hover:underline"
                                >
                                    Forgot password?
                                </Link> */}
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                className={`w-full ${errors.password ? 'border-red-300' : 'border-gray-300'}`}
                                {...register("password", {
                                    required: "Password is required"
                                })}
                            />
                            {errors.password && (
                                <p className="mt-1.5 text-sm text-red-600 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {errors.password.message}
                                </p>
                            )}
                        </div>
                        
                        <Button
                            type="submit"
                            className="w-full py-3.5 text-base font-medium rounded-xl shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            bgColor="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </div>
                            ) : (
                                "Sign in to your account"
                            )}
                        </Button>
                    </form>
                    
                    <div className="mt-6 flex items-center">
                        <div className="border-t border-gray-200 flex-grow"></div>
                        <span className="mx-4 text-sm text-gray-500">or continue with</span>
                        <div className="border-t border-gray-200 flex-grow"></div>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <button 
                            type="button"
                            className="w-full inline-flex justify-center items-center gap-2 py-2.5 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <svg className="w-5 h-5 text-[#4285F4]" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
                            </svg>
                            Google
                        </button>
                        <button 
                            type="button"
                            className="w-full inline-flex justify-center items-center gap-2 py-2.5 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <svg className="w-5 h-5 text-[#1877F2]" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"/>
                            </svg>
                            Facebook
                        </button>
                    </div>
                    
                    <p className="mt-8 text-center text-sm text-gray-600">
                        Don't have an account?&nbsp;
                        <Link
                            to="/signup"
                            className="font-semibold text-blue-600 hover:text-blue-500 hover:underline transition-colors"
                        >
                            Create one now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login