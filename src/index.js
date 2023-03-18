import "core-js";
import "react-app-polyfill/stable";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
//import store from './store'
import { HashRouter } from "react-router-dom";
import store from "./redux/store";

let persistor = persistStore(store);

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <HashRouter>
        <App />
      </HashRouter>
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);

// ReactDOM.render(
//   <Provider store={store}>
//     <HashRouter>
//       <App />
//     </HashRouter>
//   </Provider>,
//   document.getElementById('root'),
// )

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
