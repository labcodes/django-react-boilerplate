import { fetchFromApi } from "react-redux-api-tools";

export const FETCH_WELCOME_MESSAGE = "FETCH_WELCOME_MESSAGE";
export const FETCH_WELCOME_MESSAGE_SUCCESS = "FETCH_WELCOME_MESSAGE_SUCCESS";
export const FETCH_WELCOME_MESSAGE_FAILURE = "FETCH_WELCOME_MESSAGE_FAILURE";

// this way of making requests with actions is based on react-redux-api-tools
// https://github.com/labcodes/react-redux-api-tools
export function fetchWelcomeMessage() {
  return {
    types: {
      request: FETCH_WELCOME_MESSAGE,
      success: FETCH_WELCOME_MESSAGE_SUCCESS,
      failure: FETCH_WELCOME_MESSAGE_FAILURE
    },
    shouldDispatch: ({ welcome }) => !welcome.message,
    apiCallFunction: () => fetchFromApi("/api/sample-api-view/")
  };
}
