// import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
// // import {authReducer} from "../reducers/authReducer";
// import {uiReducer} from "../reducers/uiReducer";
// import {notesReducer} from "../reducers/notesReducer";
// // import thunk from 'redux-thunk'
//
// const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
//
// const reducers = combineReducers({
//   auth: authReducer,
//   ui: uiReducer,
//   notes: notesReducer
// });
//
// export const store = createStore(
//   reducers,
//   composeEnhancers(
//     applyMiddleware(thunk)
//   )
// );

import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./auth.slice";
import notesReducer from "./notes.slice";
import uiReducer from './ui.slice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    notes: notesReducer,
    ui: uiReducer,
  }
})

export default store;
