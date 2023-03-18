import adminRoutes from "src/routes/admin";
import { SET_MENU } from "./MenuAction";

const initialState = {
  menus: adminRoutes,
};

const authState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case SET_MENU:
      return { ...state, ...rest };
    default:
      return state;
  }
};

export default authState;
