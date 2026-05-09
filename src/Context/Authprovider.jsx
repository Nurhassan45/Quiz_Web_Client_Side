import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { auth } from '../Firebase/firebase.config';
import { AuthContext } from './Authcontext';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Authprovider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const googleProvider = new GoogleAuthProvider();
    
    //signup 
    const createUser = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password)
    }
    //sign in 
    const signIn = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password)
    }
    //update profule 
    const updateUserProfile = (displayname) => {
        return updateProfile(auth.currentUser, displayname)
    }
    //sign in with google
    const googleLogin = () => {

        signInWithPopup(auth, googleProvider).then(res => {
            if (res.user.accessToken) {
                Swal.fire({
                    title: "SuccessFully Login",
                    icon: "success",
                    draggable: true
                });
               
            }
        }).then(err => console.log('error', err))
    }
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, res => {
            setUser(res);
            setLoading(false);
        })
        return () => unsubscribe;
    }, [])

    const userInfo = {
        createUser,
        signIn,
        updateUserProfile,
        user,
        setUser,
        loading,
        setLoading,
        googleLogin
    }
    return (
        <AuthContext value={userInfo}>
            {children}
        </AuthContext>
    )
};

export default Authprovider;