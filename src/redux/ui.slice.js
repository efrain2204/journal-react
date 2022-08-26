import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  loading:false,
  msgError:null
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers:{
    uiSetError(state, action){
      return{
        ...state,
        msgError: action.payload
      }
    },
    uiRemoveError(state, action){
      return {
        ...state,
        msgError: null
      }
    },
    uiStartLoading(state, action){
      return {
        ...state,
        loading: true
      }
    },
    uiFinishLoading(state, action){
      return {
        ...state,
        loading: false
      }
    }
  }
});

export const {
  uiFinishLoading,
  uiRemoveError,
  uiSetError,
  uiStartLoading} = uiSlice.actions;

export default uiSlice.reducer;
