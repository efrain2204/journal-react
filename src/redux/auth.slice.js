import {createSlice} from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from "firebase/auth";
import Swal from "sweetalert2";
import {notesLogoutCleaning} from "./notes.slice";
import {uiFinishLoading, uiStartLoading} from "./ui.slice";

const initialState = {};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers:{
    login(state,action){
      return {
        uid: action.payload.uid,
        name: action.payload.displayName,
      }
    },
    logout(state, action){
      return {}
    }
  }
})

export const startLogout = () =>{
  return async (dispatch) =>{
    const auth = getAuth();
    await signOut(auth).then(() => {
      dispatch( logout() );
      dispatch (notesLogoutCleaning());
    }).catch((error) => {
      console.log(error)
    });
  }
}

export const startRegisterWithEmailPasswordName = (email, password, name)=>{
  return (dispatch) =>{
    const auth = getAuth();
    createUserWithEmailAndPassword(auth,email, password)
      .then( async ({user}) => {
        await updateProfile(user, {
          displayName: name
        });
        dispatch(login({uid:user.uid,displayName:user.displayName} ));
      })
      .catch( e=>{
        Swal.fire('Error', e.message,'error');
      })
  }
}

export const startLoginEmailPassword = (email,password) => {
  return (dispatch) => {
    dispatch(uiStartLoading());

    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then( (userCredential) => {
        const {uid,displayName} = userCredential.user;
        dispatch(login({uid,displayName}) );

        dispatch(uiFinishLoading());
      })
      .catch(e =>{
        dispatch(uiFinishLoading());
        Swal.fire('Error', e.message,'error');
      });
  }
}

export const {login, logout} = authSlice.actions;

export default authSlice.reducer;
