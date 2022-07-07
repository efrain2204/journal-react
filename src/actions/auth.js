import Swal from 'sweetalert2'
import {types} from "../types/types";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut
} from "firebase/auth";
import {finishLoading, startLoading} from "./ui";
import {noteLogout} from "./notes";


export const startLoginEmailPassword = (email,password) => {
  return (dispatch) => {
    dispatch(startLoading());

    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then( (userCredential) => {
        const {uid,displayName} = userCredential.user;
        dispatch(login(uid,displayName) );

        dispatch(finishLoading());
      })
      .catch(e =>{
        dispatch(finishLoading());
        Swal.fire('Error', e.message,'error');
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
        dispatch(login(user.uid, user.displayName));
      })
      .catch( e=>{
        Swal.fire('Error', e.message,'error');
      })
  }
}

export const login = (uid, displayName) => ({
    type: types.login,
    payload: {
      uid,
      displayName,
    }
  })

export const startLogout = () =>{
  return async (dispatch) =>{
    const auth = getAuth();
    await signOut(auth).then(() => {

      dispatch( logout() );
      dispatch (noteLogout());

    }).catch((error) => {
      console.log(error)
    });
  }
}

export const logout = () => ({
  type: types.logout
})
