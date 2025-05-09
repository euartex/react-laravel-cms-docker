import { CHANGE_VALUE, SET_MESSAGE } from "./actionTypes";

export default (state, action) => {
  switch (action.type) {
    case CHANGE_VALUE:
      if (action.key === "mode" && !action.value) {
        return {
          ...state,
          [action.key]: action.value,
          changedDevice: null
        };
      }

      return {
        ...state,
        [action.key]: action.value
      };
    case SET_MESSAGE:
      return {
        ...state,
        message: action.payload?.message,
        messageStatus: action.payload?.status
      };
    default:
      return state;
  }
};
