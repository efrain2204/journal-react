import {createSlice} from "@reduxjs/toolkit";
import {addDoc, collection, deleteDoc, doc, updateDoc} from "firebase/firestore";
import {db} from "../firebase/firebase-config";
import {loadNotes} from "../helpers/loadNotes";
import Swal from "sweetalert2";
import {fileUpload} from "../helpers/fileUpload";

const initialState ={
  notes: [],
  active: null
}

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers:{
    notesActive(state, action){
      return{
        ...state,
        active: {
          ...action.payload
        }
      }
    },
    notesAddNew(state, action){
      return {
        ...state,
        notes : [action.payload, ...state.notes]
      }
    },
    notesLoad(state, action){
      return{
        ...state,
        notes:[...action.payload]
      }
    },
    notesUpdated(state, action){
      return {
        ...state,
        notes: state.notes.map(
          note => note.id === action.payload.id
            ? action.payload
            : note
        )
      }
    },
    notesDelete(state, action){
      return {
        ...state,
        active: null,
        notes: state.notes.filter(note => note.id !== action.payload)
      }
    },
    notesLogoutCleaning(state, action){
      return {
        ...state,
        notes: [],
        active: null
      }
    }
  }
});

export const startNewNote = () => {
  return async (dispatch, getState ) => {
    const { uid } = getState().auth;
    const newNote = {
      title: '',
      body: '',
      date: new Date().getTime()
    }
    const docRef = await addDoc(collection(db,`${ uid }/journal/notes`),newNote);

    dispatch( notesActive({...newNote, ...{id:docRef.id}} ));
    dispatch( notesAddNew( {...{id:docRef.id}, ...newNote}));
  }
}

export const startLoadingNotes =  (uid) => {
  return async (dispatch) =>{
    const notes = await loadNotes(uid);
    dispatch(notesLoad(notes));
  }
}

export const startSaveNote = ( note )=>{
  return async (dispatch, getState)=>{
    const { uid } = getState().auth;

    if(!note.url){
      delete note.url;
    }
    const noteToFileStore = {...note};
    delete noteToFileStore.id;

    await updateDoc(doc(db, `${ uid }/journal/notes/${note.id}`), noteToFileStore);
    dispatch(notesUpdated({id:note.id, ...noteToFileStore}));
    dispatch(startLoadingNotes(uid));
    Swal.fire('Saved', note.title,'success');
  }
}

// Asincrono
export const startUploading = (file) =>{
  return async(dispatch, getState)=>{
    const {active:activeNote } = getState().notes;

    Swal.fire({
      title: 'Uploading...',
      text:'Please wait...',
      allowOutsideClick:false,
      showCancelButton: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      }
    });

    const fileUrl = await fileUpload(file);
    dispatch(startSaveNote({...activeNote,url:fileUrl}));
    Swal.close();
  }
}

// tarea asincrona
export const startDeleting = (id)=>{
  return async (dispatch, getState) =>{
    const { uid } = getState().auth;
    await deleteDoc(doc(db, `${uid}/journal/notes/${id}`));
    dispatch(notesDelete(id));
  }
}

export const {
  notesActive,
  notesAddNew,
  notesDelete,
  notesLoad,
  notesLogoutCleaning,
  notesUpdated} = notesSlice.actions;
export default notesSlice.reducer;
