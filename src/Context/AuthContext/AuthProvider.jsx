import React, { useEffect, useState } from 'react';
import AuthContext from './AuthContext';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { auth } from '../../Firebase/firebase.init';

const googleProvider=new GoogleAuthProvider()

const AuthProvider = ({children}) => {
    const [user,setUser]=useState(null);
    const [loading,setLoading]=useState(true);
    // Register
    const registerUser=(email,password)=>{
        setLoading(true);
        return createUserWithEmailAndPassword(auth,email,password)
    }
    // login
    const loginUser=(email,password)=>{
        setLoading(true);
        return signInWithEmailAndPassword(auth,email,password)
    }
    // google
    const googleLogin=()=>{
        setLoading(true);
        return signInWithPopup(auth,googleProvider)
    }
    // logout
    const logOut=()=>{
        setLoading(true)
        return signOut(auth);
    }
    // update profile
    const updateUserProfile=(profile)=>{
        return updateProfile(auth.currentUser,profile)
    }
    // observer
    useEffect(()=>{
        const unsubscribe=onAuthStateChanged(auth,(currentUser)=>{
           setUser(currentUser); 
           setLoading(false)
           console.log('user :',currentUser)
        })
        return ()=>unsubscribe();
    },[])

    const authData={
        user,
        setUser,
        loading,
        setLoading,
        registerUser,
        loginUser,
        googleLogin,
        logOut,
        updateUserProfile
    }
    return (
        <div>
            <AuthContext value={authData}>
                {
                    children
                }
            </AuthContext>
        </div>
    );
};

export default AuthProvider;