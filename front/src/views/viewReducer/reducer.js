import {
  CHANGE_FORM,
  CLOSE_FORM,
  OPEN_FORM,
  REQUEST,
  REQUEST_ERROR,
  REQUEST_SUCCESS,
  EDIT_FORM,
  SET_LIMIT,
  SET_PAGE,
  SET_SEARCH_STRING,
  SUBMIT_FORM_SUCCES,
  SUBMIT_FORM_ERROR,
  SAVE_FORM,
  RESET_FORM,
  SET_MESSAGE,
  TOGGLE_CONFIRM,
  TOGGLE_SECOND_CONFIRM,
  TOGGLE_CONFIRM_PASSWORD,
  TOGGLE_REVISION_OPENED,
  TOGGLE_SECONDARY_MODAL,
  SET_SECONDARY_MODAL_CONTENT
} from "./actionTypes";

export default (state, action) => {
  switch (action.type) {
    case REQUEST:
      return {
        ...state,
        loading: true
      };
    case REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        pageData: action.payload.data || [],
        total: action.payload.pagination?.total || 0
      };
    case REQUEST_ERROR:
      return {
        ...state,
        loading: false,
        messageStatus: "danger",
        message: action.payload,
        isErrorShowing: true
      };
    case SET_PAGE:
      return {
        ...state,
        page: action.payload
      };
    case SET_LIMIT: {
      return {
        ...state,
        limit: action.payload,
        page: 1
      };
    }
    case SET_SEARCH_STRING: {
      return {
        ...state,
        page: 1,
        searchString: action.payload
      };
    }
    case OPEN_FORM:
      return {
        ...state,
        formIsOpened: true
      };
    case CLOSE_FORM:
      return {
        ...state,
        formIsOpened: false,
        savedForm: null
      };
    case CHANGE_FORM:
      if (action.payload.type === "checkbox") {
        return {
          ...state,
          form: {
            ...state.form,
            [action.payload.name]: !!action.payload.checked
          }
        };
      } else if (action.payload.type === "file") {
        return {
          ...state,
          form: {
            ...state.form,
            [action.payload.name]:
              action.payload?.files && action.payload.files.length
                ? action.payload.files[0]
                : ""
          }
        };
      } else {
        return {
          ...state,
          form: {
            ...state.form,
            [action.payload.name]: action.payload.value
          }
        };
      }
    case EDIT_FORM:
      return {
        ...state,
        formType: "edit",
        form: { ...state.form, ...action.payload }
      };
    case SUBMIT_FORM_SUCCES:
      return {
        ...state,
        loading: false,
        messageStatus: "success",
        message: action.payload,
        savedForm: null
      };
    case SUBMIT_FORM_ERROR:
      // eslint-disable-next-line
      let newMessage;
      if (
        action.payload.message === "Validation error" &&
        action.payload.validationErrors
      ) {
        newMessage = Object.keys(action.payload.validationErrors)
          .map(key => action.payload.validationErrors[key])
          .join(`\r\n`);
      } else {
        newMessage = action.payload.message;
      }
      return {
        ...state,
        loading: false,
        messageStatus: "danger",
        message: newMessage
      };

    case SAVE_FORM:
      return {
        ...state,
        savedForm: action.payload
      };
    case RESET_FORM:
      return {
        ...state,
        form: action.payload
      };
    case SET_MESSAGE:
      // eslint-disable-next-line
      const { message, messageStatus } = action.payload;
      return {
        ...state,
        message,
        messageStatus,
        loading: false
      };
    case TOGGLE_CONFIRM:
      return {
        ...state,
        idToDelete: action.payload?.id ? action.payload.id : null,
        nameToDelete: action.payload?.name ? action.payload.name : null,
        confirmIsOpened: !state.confirmIsOpened,
        loading: false
      };
    case TOGGLE_SECOND_CONFIRM:
      return {
        ...state,
        secondConfirmIsOpened: !state.secondConfirmIsOpened
      };
    case TOGGLE_CONFIRM_PASSWORD:
      return {
        ...state,
        emailForRequest: action.payload ? action.payload : null,
        confirmRestorePassword: !state.confirmRestorePassword
      };
    case TOGGLE_REVISION_OPENED:
      return {
        ...state,
        revisionIsOpened: !state.revisionIsOpened,
        revisionItemId: action.payload || null
      };
    case TOGGLE_SECONDARY_MODAL:
      return {
        ...state,
        secondaryModalIsOpened: !state.secondaryModalIsOpened,
        secondaryModalContent: action.payload ? action.payload : null
      };
    case SET_SECONDARY_MODAL_CONTENT:
      return {
        ...state,
        loading: false,
        secondaryModalContent: action.payload
      };
    default:
      return state;
  }
};
