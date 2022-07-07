import React, {useEffect, useState} from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route, Navigate,
} from "react-router-dom";
import AuthRouter from "./AuthRouter";
import JournalScreen from "../components/journal/JournalScreen";

import {onAuthStateChanged} from "firebase/auth";
import {auth} from "../firebase/firebase-config";
import {useDispatch} from "react-redux";
import {login} from "../actions/auth";
import {PrivateRoute} from "./PrivateRoute";
import {PublicRoute} from "./PublicRoute";
import {startLoadingNotes} from "../actions/notes";

const AppRouter = () => {
  const dispatch = useDispatch();
  const [checking, setChecking] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Verificar el usuario actual
  useEffect(()=>{
    onAuthStateChanged(auth,async (user) =>{
      if (user?.uid){
        dispatch(login(user.uid, user.displayName));
        setIsLoggedIn(true);

        // Cargamos las notas
        dispatch( startLoadingNotes(user.uid) );

      }else{
        setIsLoggedIn(false);
      }
      setChecking(false);
    })
  },[dispatch, setChecking,setIsLoggedIn])

  if(checking){
    return (
      <h1>Please wait...</h1>
    );
  }

  return (
    // basename='/journal-react'
    <Router basename='/journal-react'>
      <Routes>
        <Route path='auth/*' element={
          <PublicRoute isLoggedIn={isLoggedIn}>
            <AuthRouter/>
          </PublicRoute>
        }/>

        <Route path='/' element={
          <PrivateRoute isLoggedIn={isLoggedIn}>
            <JournalScreen/>
          </PrivateRoute>
        }/>

      <Route path='/*' element={
        <Navigate to="/"/>}/>
    </Routes>

    </Router>
  );
};

export default AppRouter;
