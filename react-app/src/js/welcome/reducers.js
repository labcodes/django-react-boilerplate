import {
  FETCH_WELCOME_MESSAGE,
  FETCH_WELCOME_MESSAGE_SUCCESS,
  FETCH_WELCOME_MESSAGE_FAILURE
} from "./actions";

const initialState = { message: null };

export default function welcomeReducers(state = initialState, action) {
  switch (action.type) {
    case FETCH_WELCOME_MESSAGE:
      return {
        ...state,
        message: "Welcome Message is being fetched from the API..."
      };

    case FETCH_WELCOME_MESSAGE_SUCCESS:
    case FETCH_WELCOME_MESSAGE_FAILURE:
      const { message } = action.response.data;
      return {
        ...state,
        message,
        action
      };

    default:
      return state;
  }
}
