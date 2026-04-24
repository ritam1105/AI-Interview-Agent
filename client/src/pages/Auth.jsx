import { signInWithPopup } from 'firebase/auth'
import React, { useState, useEffect } from 'react'
import { auth, provider } from '../utils/firebase'
import { serverUrl } from '../App'
import axios from 'axios'
import { setUserData } from '../redux/userSlice'
import { useDispatch } from 'react-redux'
function Auth({isModel=false}) {
  const dispatch=useDispatch()

  const handleGoogleAuth=async ()=>{
    try {
      const response=await signInWithPopup(auth, provider)
      let User=response.user
      let name=User.displayName
      let email=User.email
      const result=await axios.post(serverUrl+"/api/auth/google" ,{name,email}, {withCredentials:true})
      dispatch(setUserData(result.data))

    } catch (error) {
      console.log(error)
      dispatch(setUserData(null))
    }
  }


  const [mounted, setMounted] = useState(false)
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      background: '#f0f0f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: "'DM Sans', sans-serif",
    }}>

      {/* Card */}
      <div style={{
        width: '100%',
        maxWidth: 420,
        padding: '44px 40px 40px',
        borderRadius: 28,
        background: '#ffffff',
        boxShadow: '0 8px 40px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)',
        textAlign: 'center',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      }}>

        {/* Logo row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          marginBottom: 28,
        }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: '#111111',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="7" r="3.5" fill="white" opacity="0.95"/>
              <path d="M3 18c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{
            fontSize: 16,
            fontWeight: 700,
            color: '#111111',
            letterSpacing: '-0.02em',
          }}>
            AI Interviewer
          </span>
        </div>

        {/* Heading */}
        <h1 style={{
          fontSize: 28,
          fontWeight: 700,
          color: '#111111',
          margin: '0 0 10px',
          letterSpacing: '-0.03em',
          lineHeight: 1.2,
        }}>
          Continue with
        </h1>

        {/* Highlighted pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 7,
          background: '#dcfce7',
          borderRadius: 999,
          padding: '7px 18px',
          marginBottom: 20,
        }}>
          <span style={{ fontSize: 16 }}>✳️</span>
          <span style={{
            fontSize: 18,
            fontWeight: 700,
            color: '#15803d',
            letterSpacing: '-0.02em',
          }}>
            AI Smart Interview
          </span>
        </div>

        {/* Subtext */}
        <p style={{
          fontSize: 14,
          color: '#6b7280',
          lineHeight: 1.65,
          margin: '0 0 32px',
          padding: '0 8px',
        }}>
          Sign in to start AI-powered mock interviews, track your progress, and unlock detailed performance insights.
        </p>

        {/* Google Button */}
        <button
        onClick={handleGoogleAuth}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            padding: '14px 20px',
            borderRadius: 999,
            border: 'none',
            background: hovering ? '#222222' : '#111111',
            color: '#ffffff',
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: '-0.01em',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            transform: hovering ? 'translateY(-1px)' : 'translateY(0)',
            boxShadow: hovering ? '0 6px 20px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.15)',
            outline: 'none',
          }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.205c0-.638-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        {/* Footer */}
        <p style={{
          marginTop: 20,
          fontSize: 12,
          color: '#9ca3af',
          lineHeight: 1.6,
        }}>
          By continuing, you agree to our{' '}
          <span style={{ color: '#4b5563', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 2 }}>
            Terms
          </span>{' '}
          &{' '}
          <span style={{ color: '#4b5563', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 2 }}>
            Privacy Policy
          </span>
        </p>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
      `}</style>
    </div>
  )
}

export default Auth