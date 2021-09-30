import React from "react";
import ReactDOM from "react-dom";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import { applyMiddleware, compose, createStore } from "redux";
import { apiMiddleware } from "react-redux-api-tools";

import rootReducer from "./rootReducer";

import "whatwg-fetch";
import "../scss/main.scss";
import Routes from "./Routes";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  window.initialState,
  composeEnhancers(applyMiddleware(thunk, apiMiddleware))
);

function App() {
  return (
    <Provider store={store}>
      <Routes />
    </Provider>
  );
}

ReactDOM.render(<App />, document.getElementById("react-app"));
