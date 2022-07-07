import React from 'react';
import {startSaveNote, startUploading} from "../../actions/notes";
import {useDispatch, useSelector} from "react-redux";
import moment from "moment";

const NotesAppBar = () => {
  const dispatch = useDispatch();
  let date = moment(new Date().getTime());
  const {active} = useSelector(state => state.notes);
  const handleSave = () => {
    dispatch(startSaveNote( active ));
  }

  const handlePictureClick = () => {
    document.querySelector('#fileSelector').click();
  }
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log(file)
    if (file){
      dispatch(startUploading(file));
    }
  }

  return (
    <div className="notes__appbar">
      <span>{date.format('MMMM Do YYYY')}</span>
      <input
        id='fileSelector'
        type='file'
        name='file'
        style={{display:'none'}}
        onChange={handleFileChange}
      />
      <div>
        <button
          className="btn"
          onClick={handlePictureClick}
        >
          Picture
        </button>

        <button
          className="btn"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default NotesAppBar;
