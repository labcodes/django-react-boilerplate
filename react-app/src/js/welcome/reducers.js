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

    case FETCH_WELCOME_MESSAGE_FAILURE:
      return {
        ...state,
        message:
          "It seems we're having trouble accessing the API. Are you testing the PWA?"
      };

    case FETCH_WELCOME_MESSAGE_SUCCESS:
      const { message } = action.response.data;
      return {
        ...state,
        message
      };

    default:
      return state;
  }
}
