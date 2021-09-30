import { combineReducers } from "redux";

import welcomeReducers from "./WelcomePage/reducers";

export default combineReducers({
  welcome: welcomeReducers
});
