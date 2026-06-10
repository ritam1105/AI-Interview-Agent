import { signInWithPopup } from 'firebase/auth'
import React, { useState, useEffect } from 'react'
import { auth, provider } from '../utils/firebase'
import {ServerUrl } from '../App'
import axios from 'axios'
import { setUserData } from '../redux/userSlice'
import { useDispatch } from 'react-redux'

function Auth({ isModel = false }) {
  const dispatch = useDispatch()

  const handleGoogleAuth = async () => {
    try {
      const response = await signInWithPopup(auth, provider)
      let User = response.user
      let name = User.displayName
      let email = User.email
      const result = await axios.post(
        ServerUrl + "/api/auth/google",
        { name, email },
        { withCredentials: true }
      )
      dispatch(setUserData(result.data))
    } catch (error) {
      console.log(error)
      dispatch(setUserData(null))
    }
  }

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div
      className={`w-full ${
        isModel
          ? 'py-4'
          : 'min-h-screen bg-[#f3f3f3] flex items-center justify-center px-6 py-20'
      }`}
    >
      {/* Card */}
      <div
        className={`w-full max-w-md p-10 rounded-[28px] bg-white shadow-[0_8px_40px_rgba(0,0,0,0.10),0_1px_4px_rgba(0,0,0,0.06)] text-center transition-all duration-500 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-7">
          <div className="w-9.5 h-9.5 rounded-[10px] bg-black flex items-center justify-center shrink-0">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="7" r="3.5" fill="white" opacity="0.95" />
              <path
                d="M3 18c0-3.866 3.134-7 7-7s7 3.134 7 7"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="text-[16px] font-bold text-black tracking-tight">
            AI Interviewer
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-[28px] font-bold text-black mb-2.5 tracking-tight leading-tight">
          Continue with
        </h1>

        {/* Highlight pill */}
        <div className="inline-flex items-center gap-2 bg-green-100 rounded-full px-4 py-1.5 mb-5">
          <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
          <span className="text-[17px] font-bold text-green-700 tracking-tight">
            AI Smart Interview
          </span>
        </div>

        {/* Subtext */}
        <p className="text-[14px] text-gray-500 leading-relaxed mb-8 px-2">
          Sign in to start AI-powered mock interviews, track your progress, and
          unlock detailed performance insights.
        </p>

        {/* Button */}
        <button
          onClick={handleGoogleAuth}
          className="w-full flex items-center justify-center gap-3 py-3.5 px-5 rounded-full bg-black text-white text-[15px] font-semibold tracking-tight cursor-pointer transition-all duration-200 hover:bg-gray-800 hover:-translate-y-px shadow-[0_2px_8px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)]"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M17.64 9.205c0-.638-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
              fill="#4285F4"
            />
            <path
              d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
              fill="#34A853"
            />
            <path
              d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
              fill="#FBBC05"
            />
            <path
              d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>

        {/* Footer */}
        <p className="mt-5 text-[12px] text-gray-400 leading-relaxed">
          By continuing, you agree to our{' '}
          <span className="text-gray-600 underline underline-offset-2 cursor-pointer">
            Terms
          </span>{' '}
          &{' '}
          <span className="text-gray-600 underline underline-offset-2 cursor-pointer">
            Privacy Policy
          </span>
        </p>
      </div>
    </div>
  )
}

export default Auth