import {
  SET_SIDEBAR
} from "./SidebarAction";

const initialState = {
  sidebarShow: false,
  sidebarUnfoldable: false,
}

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case SET_SIDEBAR:
      return {...state, ...rest }
    default:
      return state
  }
}

export default changeState