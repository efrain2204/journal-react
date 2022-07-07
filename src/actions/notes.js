import {collection, addDoc,doc, updateDoc,deleteDoc} from "firebase/firestore";
import {types} from "../types/types";
import {db} from "../firebase/firebase-config";
import {loadNotes} from "../helpers/loadNotes";
import {fileUpload} from "../helpers/fileUpload";
import Swal from "sweetalert2";

export const startNewNote = () => {
  return async (dispatch, getState ) => {
    const { uid } = getState().auth;
    const newNote = {
      title: '',
      body: '',
      date: new Date().getTime()
    }
    const docRef = await addDoc(collection(db,`${ uid }/journal/notes`),newNote);
    console.log(docRef);
    dispatch( activeNote(docRef.id,newNote) );
    dispatch( addNewNote(docRef.id, newNote));
  }
}

export const addNewNote = (id, note) => ({
  type: types.notesAddNew,
  payload:{
    id, ...note
  }
})

export const activeNote = (id, note) => ({
  type: types.notesActive,
  payload:{
    id,
    ...note
  }
});

export const startLoadingNotes =  (uid) => {
  return async (dispatch) =>{
    const notes = await loadNotes(uid);
    dispatch(setNotes(notes));
  }
}

export const setNotes = (notes) => ({
  type: types.notesLoad,
  payload: notes
})

export const startSaveNote = ( note )=>{
  return async (dispatch, getState)=>{
    const { uid } = getState().auth;

    if(!note.url){
      delete note.url;
    }

    const noteToFileStore = {...note};
    delete noteToFileStore.id;

    await updateDoc(doc(db, `${ uid }/journal/notes/${note.id}`), noteToFileStore);
    dispatch(refreshNote(note.id, noteToFileStore));
    // dispatch(startLoadingNotes(uid));
    Swal.fire('Saved', note.title,'success');
  }
}

export const refreshNote = ( id, note ) => ({
 type: types.notesUpdated,
 payload:{
   id,
   note:{
     id,
     ...note
   }
 }
})

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
    activeNote.url = fileUrl
    dispatch(startSaveNote(activeNote));
    Swal.close();
  }
}

// tarea asincrona
export const startDeleting = (id)=>{
  return async (dispatch, getState) =>{

    const { uid } = getState().auth;
    await deleteDoc(doc(db, `${uid}/journal/notes/${id}`));
    dispatch(deleteNote(id));
  }
}

// Modifica el store
export const deleteNote = (id)=>({
  type: types.notesDelete,
  payload: id
})

export const noteLogout = () => ({
  type: types.notesLogoutCleaning
})
