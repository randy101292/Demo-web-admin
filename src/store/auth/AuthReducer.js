import { SET_LOGIN, SET_LOGOUT } from "./AuthAction";

const initialState = {
  id: "",
  name: "",
  token: "",
  roles: "",
  permissions: [],
};

const authState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case SET_LOGIN:
      return { ...state, ...rest };
    case SET_LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default authState;
