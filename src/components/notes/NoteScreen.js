import React, {useEffect, useRef} from 'react';
import NotesAppBar from "./NotesAppBar";
import {useDispatch, useSelector} from "react-redux";
import {useForm} from "../../hooks/useForm";
import {notesActive, startDeleting} from "../../redux/notes.slice";

const NoteScreen = () => {
  const dispatch = useDispatch();
  const {active:note} = useSelector(state => state.notes);
  const [formValues, handleInputChange, reset] = useForm(note);
  const {body, title, id} = formValues;

  const activeId = useRef(note.id);

  useEffect(()=>{
    if(note.id !== activeId.current){
      reset(note);
      activeId.current = note.id;
    }
  },[note,reset]);

  useEffect(()=>{
    dispatch(notesActive(formValues));
  },[formValues,dispatch])

  const handleDelete = () => {
    dispatch(startDeleting(id));
    // dispatch(startDeleting(activeId));
  }
  return (
    <div className='notes__main-content'>
      <NotesAppBar />

      <div className="notes__content">
        <input
          type="text"
          placeholder="Some awesome title"
          className="notes__title-input"
          autoComplete="off"
          name='title'
          value={title}
          onChange={handleInputChange}
        />

        <textarea
          placeholder="What happened today"
          className="notes__textarea"
          name='body'
          value={body}
          onChange={handleInputChange}
        ></textarea>

        {
          note.url
          &&
            (<div className="notes__image">
              <img
                src={note.url}
                alt="imagen"
              />
            </div>)

        }


      </div>

      <button
        className='btn btn-danger'
        onClick={handleDelete}
      >
        Delete
      </button>

    </div>
  );
};

export default NoteScreen;
