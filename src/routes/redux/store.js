import { applyMiddleware, compose, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import logger from "redux-logger";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";
import rootReducer from "src/store/index";

const APP_ZONE = process.env.REACT_APP_MODE_TYPE;

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const middlewares =
  APP_ZONE === "demo"
    ? compose(applyMiddleware(thunk))
    : compose(composeWithDevTools(applyMiddleware(thunk, logger)));

// const store = createStore(changeState)
// export default store

const store = createStore(persistedReducer, middlewares);

export default store;
