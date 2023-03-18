import { combineReducers } from "redux";
import authReducer from "./auth/AuthReducer";
import menuReducer from "./menus/MenuReducer";
import sidebarReducer from "./sidebar/SidebarReducer";

const rootReducer = combineReducers({
  // Define a top-level state field named `todos`, handled by `todosReducer`
  sidebar: sidebarReducer,
  auth: authReducer,
  menu: menuReducer,
});

export default rootReducer;
