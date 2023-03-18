import { compose, createStore } from "redux";
import reducers from "./store/index";

const enhancers = compose(
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const store = createStore(reducers, enhancers);
export default store;
