import { LOGIN, LOGOUT } from '../actions/types';

const initialState = {
  user: null,
  isLoggedIn: false,
  isDbLocal: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN: {
      console.log('REDUTORA >>>>>', user);
      
      return {
        ...state,
        user: action.user,
        isLoggedIn: true
      };
    };
    case LOGOUT:
      return {
        ...state,
        user: null,
        isLoggedIn: false
      };
    default:
      return state;
  }
};
