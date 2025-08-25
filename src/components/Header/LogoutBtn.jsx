import React from 'react'
import { useDispatch } from 'react-redux'
import authService from "../../appwrite/auth"
import {logout} from '../../store/authSlice'

function LogoutBtn({ className = '', ...props }) {
    const dispatch = useDispatch();
    const logoutHandler = () => {
        authService.logout().then(() => {
            dispatch(logout())
        })
    }
    return (
        <button
            onClick={logoutHandler}
            className={`inline-block px-6 py-2 duration-200 hover:bg-red-500/20 hover:text-red-400 bg-card text-foreground border border-border hover:border-red-500/30 rounded-lg transition-all font-medium doto-button ${className}`}
            {...props}
        > 
            Logout
        </button>
    )
}

export default LogoutBtn
