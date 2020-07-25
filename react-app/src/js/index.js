import React from "react";
import ReactDOM from "react-dom";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import { hot } from "react-hot-loader/root";
import { createStore, applyMiddleware, compose } from "redux";
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

if (module.hot) {
  // save current state before module being reloaded
  // eslint-disable-next-line no-return-assign
  module.hot.dispose(() => (window.initialState = store.getState()));
}

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Routes />
      </Provider>
    );
  }
}

export default hot(App);

ReactDOM.render(<App />, document.getElementById("react-app"));
