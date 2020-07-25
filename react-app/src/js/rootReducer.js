import { combineReducers } from "redux";

import welcomeReducers from "./welcome/reducers";

export default combineReducers({
  welcome: welcomeReducers
});
