import React, { useEffect, useState } from "react";
import "./signup.css";
import eyeOpen from '../../assets/eyeOpen.png'
import eyeClose from '../../assets/eyeClose.png'
import google from '../../assets/google.png'
import useSignup from "../../hooks/useSignup";
import useNotify from "../../hooks/useNotify";
import { useNavigate } from "react-router-dom";
import useLogin from "../../hooks/useLogin";
import { useAuthContext } from "../../hooks/useAuthContext";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google"; 

function Signup({ onClick }) {
  const [isSg, setIsSg] = useState(false);
  const [isOpen, setIsOpen] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signup, error, isLoading } = useSignup();
  const { login, error2, isLoading2 } = useLogin();
  const { notify } = useNotify();
  const navigate = useNavigate();

  
  const {user, dispatch} = useAuthContext()

  // Separate error states for email and password
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');

    if (!username || !email || !password) {
      return;
    }

    await signup(username, email, password, "User");
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');

    if (!email || !password) {
      return;
    }

    await login(email, password);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await fetch('https://backend.freshimeat.in/users/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Google login failed');
      }
      //console.log('Google login successfull:', data);
      notify('Signed up successfully', 'success')
      // Save user data and navigate
      localStorage.setItem('user', JSON.stringify(data));
      dispatch({ type: 'LOGIN', payload: data });
      setTimeout(() => {
        navigate('/');
        
      }, 500);
    } catch (err) {
      notify('Error while signup', "error")
      console.error('Google login error:', err.message);
    }
  };

  const handleGoogleError = () => {
    //console.log("Google sign-in error");
  };

  useEffect(() => {
    if (error === false) {
      //console.log("Successfully signed up");
      notify('Signed up successfully', 'success')
      setTimeout(() => {
        if(user?.userType === "User")
        {
          navigate('/');
        }else{
          navigate('/admin');
        }
      }, 500);
    } else if (error) {
      if (error.includes("email") || error.includes("Email")) {
        setEmailError(error);
      } else if (error.includes("password") || error.includes("Password")) {
        setPasswordError(error);
      }
    }
  }, [error, user]);

  useEffect(() => {
    if (error2 === false) {
      //console.log("Successfully logged in");
      notify('Logged in successfully', 'success')
      setTimeout(() => {
        navigate('/');
        
      }, 500);
      
    } else if (error2) {
      if (error2.includes("email")) {
        setEmailError(error2);
      } else if (error2.includes("password")) {
        setPasswordError(error2);
      }
    }
  }, [error2]);


  return (
    <div className="signInMain" onClick={onClick}>
        {/* Sign In Form */}
        <form className={`sg ${!isSg? "sgTop": "sgBottom"}`} onSubmit={handleSignIn}>
            <h1>Sign In</h1>
            <div className="sgInput">
                <div className="pass">
                    <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
                </div>
                {emailError && <p className="error">*{emailError}</p>}
            </div>
            <div className="sgInput">
                <div className="pass">
                    <input type={isOpen ? "text" : "password"} placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required/>
                    {isOpen ? <img src={eyeOpen} alt="eye" onClick={()=>setIsOpen(false)} /> : 
                    <img src={eyeClose} alt="eye" onClick={()=>setIsOpen(true)} />}
                </div>
                {passwordError && <p className="error">*{passwordError}</p>}
            </div>
            <div className="sig">
                <button type="submit">Sign In</button>
                <div className="google-signup-button">
          <GoogleOAuthProvider clientId="328812640603-179dlp268a73oihjvct4f5cpnjlulns4.apps.googleusercontent.com">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="filled_blue"
              shape="pill"
              text="continue_with"
              size="large"
            />
          </GoogleOAuthProvider>
        </div>
                {/* <button type="button">
                    <img src={google} alt="google" />
                    Continue with Google
                </button> */}
            </div>
            <p>Don't have an account? <span className="spantype" onClick={()=>setIsSg(true)}>Sign Up</span></p>  
        </form>

        {/* Sign Up Form */}
        <form className={`sg ${isSg? "sgTop": "sgBottom"}`} onSubmit={handleSignUp}>
            <h1>Sign Up</h1>
            <div className="sgInput">
                <div className="pass">
                    <input type="text" placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)} required/>
                </div>
            </div>
            <div className="sgInput">
                <div className="pass">
                    <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
                </div>
                {emailError && <p className="error">*{emailError}</p>}
            </div>
            <div className="sgInput">
                <div className="pass">
                    <input type={isOpen ? "text" : "password"} placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required/>
                    {isOpen ? <img src={eyeOpen} alt="eye" onClick={()=>setIsOpen(false)} /> : 
                    <img src={eyeClose} alt="eye" onClick={()=>setIsOpen(true)} />}
                </div>
                {passwordError && <p className="error">*{passwordError}</p>}
            </div>
            <div className="sig">
                <button type="submit">Sign Up</button>
                <div className="google-signup-button">
                <GoogleOAuthProvider clientId="328812640603-179dlp268a73oihjvct4f5cpnjlulns4.apps.googleusercontent.com">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="filled_blue"
              shape="pill"
              text="continue_with"
              size="large"
            />
          </GoogleOAuthProvider>
        </div>
                {/* <button type="button">
                    <img src={google} alt="google" />
                    Continue with Google
                </button> */}
            </div>
            <p>Already have an account? <span className="spantype" onClick={()=>setIsSg(false)}>Sign In</span></p>  
        </form>
    </div>
  );
}

export default Signup;
