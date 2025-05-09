import React, { useEffect, useCallback, useReducer, useRef } from "react";
import { bool } from "prop-types";

import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";
// import LockOpenIcon from "@material-ui/icons/LockOpen";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { makeStyles } from "@material-ui/core/styles";

import DeleteConfirmationModalContent from "components/DeleteConfirmationModalContent";
import PopupNotification from "components/PopupNotification/PopupNotification.js";
import Table from "components/Table/Table";
import ConfirmationModalContent from "components/ConfirmationModalContent";
import AddAppUserForm from "./AddAppUserForm";

import axiosInstance from "config/axiosInstance";
import MESSAGES from "constants/notificationMessages";
import { DEFAULT_LIMIT } from "constants/request";
import { convertToFormData } from "helpers/convertToFormData";
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
  TOGGLE_CONFIRM,
  SET_MESSAGE,
  TOGGLE_CONFIRM_PASSWORD
} from "../viewReducer/actionTypes";
import reducer from "../viewReducer/reducer";

import {
  dangerColor,
  primaryColor,
  successColor
} from "assets/jss/material-dashboard-react.js";

const styles = {
  modal: {
    overflow: "scroll"
  },
  edit: {
    color: primaryColor[0]
  },
  delete: {
    color: dangerColor[0]
  },
  restore: {
    color: successColor[0]
  }
};

const useStyles = makeStyles(styles);

const INITIAL_FORM = {
  id: "",
  email: "",
  first_name: "",
  last_name: "",
  password: "",
  confirmPassword: "",
  newsletter: false
};

const initialState = {
  loading: false,
  errorMessage: "",
  pageData: [],
  page: 1,
  limit: DEFAULT_LIMIT,
  total: 0,
  searchString: "",
  formIsOpened: false,
  savedForm: null,
  form: INITIAL_FORM,
  formSubmitMessage: "",
  messageStatus: "success",
  message: "",
  confirmIsOpened: false,
  idToDelete: null,
  confirmRestorePassword: false,
  emailForRequest: null
};

const TABLE_HEADER = ["Email", "First name", "Last name", ""];

const AppUsersTab = ({ allowEdit }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    loading,
    formIsOpened,
    form,
    pageData,
    limit,
    page,
    searchString,
    total,
    messageStatus,
    message,
    savedForm,
    confirmIsOpened,
    idToDelete,
    confirmRestorePassword,
    emailForRequest,
    nameToDelete
  } = state;

  const notificationRef = useRef(null);

  const handleEdit = id => {
    axiosInstance
      .get(`app-users/${id}`)
      .then(res => {
        const {
          email,
          first_name,
          last_name,
          newsletter,
          id,
          password
        } = res.data.data;
        dispatch({
          type: EDIT_FORM,
          payload: { email, first_name, last_name, newsletter }
        });

        dispatch({
          type: SAVE_FORM,
          payload: { email, first_name, last_name, newsletter, id, password }
        });
        dispatch({ type: OPEN_FORM });
      })
      .catch(error => {
        dispatch({
          type: SET_MESSAGE,
          payload: {
            messageStatus: "danger",
            message:
              error?.response?.data?.message || MESSAGES.couldntReadFromError
          }
        });
        return notificationRef?.current?.showNotification();
      });
  };

  const handleDelete = () => {
    axiosInstance
      .delete(`/app-users/${idToDelete}`)
      .then(() => {
        dispatch({
          type: SET_MESSAGE,
          payload: {
            messageStatus: "success",
            message: MESSAGES.deleted("User")
          }
        });
        setTimeout(() => {
          dispatch({ type: TOGGLE_CONFIRM });
          getPage();
        }, 1000);
        return notificationRef?.current?.showNotification();
      })
      .catch(error => {
        dispatch({
          type: SET_MESSAGE,
          payload: {
            messageStatus: "danger",
            message:
              error?.response?.data?.message || MESSAGES.couldntReadFromError
          }
        });
        setTimeout(() => dispatch({ type: TOGGLE_CONFIRM }), 1000);
        return notificationRef?.current?.showNotification();
      });
  };

  const dataTable = useCallback(() => {
    return pageData.map(user => {
      const { email, first_name, last_name, newsletter, id, password } = user;
      return [
        email,
        first_name,
        last_name,
        allowEdit ? (
          <div key={id} style={{ textAlign: "right" }}>
            {/* <Tooltip
              id="tooltip-top"
              title="Send restore password link"
              placement="top"
              onClick={() =>
                dispatch({ type: TOGGLE_CONFIRM_PASSWORD, payload: email })
              }
            >
              <IconButton aria-label="restore" className={classes.restore}>
                <LockOpenIcon />
              </IconButton>
            </Tooltip> */}
            <Tooltip
              id="tooltip-top"
              title="Edit"
              placement="top"
              onClick={() => handleEdit(id)}
            >
              <IconButton aria-label="Edit" className={classes.edit}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip
              id="tooltip-top-start"
              title="Remove"
              placement="top"
              onClick={() =>
                dispatch({
                  type: TOGGLE_CONFIRM,
                  payload: { id, name: email }
                })
              }
            >
              <IconButton aria-label="Close" className={classes.delete}>
                <Close />
              </IconButton>
            </Tooltip>
          </div>
        ) : (
          ""
        )
      ];
    });
  }, [pageData]);

  const getPage = () => {
    axiosInstance
      .get(`/app-users?limit=${limit}&page=${page}&q=${searchString}`)
      .then(response => {
        dispatch({ type: REQUEST_SUCCESS, payload: response.data });
      })
      .catch(error =>
        dispatch({
          type: REQUEST_ERROR,
          payload: error.response?.data?.message
        })
      );
  };

  const classes = useStyles();

  useEffect(() => {
    dispatch({ type: REQUEST });
    getPage();
  }, [page, limit, searchString]);

  const submitForm = () => {
    if (loading) return;
    const handleFormSubmitResponse = () => {
      dispatch({
        type: SUBMIT_FORM_SUCCES,
        payload: !savedForm ? MESSAGES.added("User") : MESSAGES.updated("User")
      });

      dispatch({ type: CLOSE_FORM });
      dispatch({ type: RESET_FORM, payload: INITIAL_FORM });

      getPage();
      return notificationRef.current?.showNotification();
    };

    const handleFormSubmitError = error => {
      dispatch({ type: SUBMIT_FORM_ERROR, payload: error.response.data });
      return notificationRef.current?.showNotification();
    };
    dispatch({ type: REQUEST });
    if (form.password !== form.confirmPassword) {
      dispatch({
        type: SUBMIT_FORM_ERROR,
        payload: {
          message: MESSAGES.passwordsNotMatch
        }
      });
      return notificationRef?.current?.showNotification();
    }
    dispatch({ type: REQUEST });

    if (!savedForm) {
      axiosInstance
        .post("/app-users", convertToFormData(form))
        .then(handleFormSubmitResponse)
        .catch(handleFormSubmitError);
    } else {
      let changedFields = { _method: "PUT" };
      Object.keys(savedForm).forEach(key => {
        if ((key === "password" && form[key] === "") || key === "id") return;
        if (form[key] !== savedForm[key]) {
          changedFields[key] = form[key];
        }
      });
      axiosInstance
        .post(`app-users/${savedForm.id}`, convertToFormData(changedFields))
        .then(handleFormSubmitResponse)
        .catch(handleFormSubmitError);
    }
  };

  const handelRestorePassword = () => {
    axiosInstance
      .post("/app-users/reset-password/create", {
        email: emailForRequest
      })
      .then(() => {
        dispatch({
          type: SET_MESSAGE,
          payload: {
            messageStatus: "success",
            message: "The reset link was sent"
          }
        });
        setTimeout(() => {
          dispatch({ type: TOGGLE_CONFIRM_PASSWORD });
          getPage();
        }, 1000);
        return notificationRef?.current?.showNotification();
      })
      .catch(error => {
        dispatch({
          type: SET_MESSAGE,
          payload: {
            messageStatus: "danger",
            message:
              error?.response?.data?.message || MESSAGES.couldntReadFromError
          }
        });
        setTimeout(() => dispatch({ type: TOGGLE_CONFIRM_PASSWORD }), 1000);
        return notificationRef?.current?.showNotification();
      });
  };

  return (
    <>
      <PopupNotification
        ref={notificationRef}
        status={messageStatus}
        message={message}
      />
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={formIsOpened || confirmIsOpened || confirmRestorePassword}
        onClose={() => {
          dispatch({ type: CLOSE_FORM });
          dispatch({ type: RESET_FORM, payload: INITIAL_FORM });
        }}
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 600
        }}
      >
        <>
          {confirmRestorePassword && (
            <Fade in={confirmRestorePassword}>
              <ConfirmationModalContent
                title="Restore password"
                onConfirm={handelRestorePassword}
                onClose={() => dispatch({ type: TOGGLE_CONFIRM_PASSWORD })}
                isLoading={loading}
                styleColor="success"
              >
                Please confirm sending a restore password link to the{" "}
                <b>{emailForRequest}</b>
              </ConfirmationModalContent>
            </Fade>
          )}
          {formIsOpened && (
            <Fade in={formIsOpened}>
              <AddAppUserForm
                isEditMode={!!savedForm}
                submitForm={submitForm}
                dataForm={form}
                handleChange={({ target }) =>
                  dispatch({ type: CHANGE_FORM, payload: target })
                }
                onClose={() => {
                  dispatch({ type: CLOSE_FORM });
                  dispatch({ type: RESET_FORM, payload: INITIAL_FORM });
                }}
                isLoading={loading}
              />
            </Fade>
          )}
          {confirmIsOpened && (
            <Fade in={confirmIsOpened}>
              <DeleteConfirmationModalContent
                title="Delete user"
                onConfirm={handleDelete}
                onClose={() => dispatch({ type: TOGGLE_CONFIRM })}
                isLoading={loading}
              >
                {`Confirm user${
                  nameToDelete ? ` '${nameToDelete}' ` : ""
                }deleting, please.`}
              </DeleteConfirmationModalContent>
            </Fade>
          )}
        </>
      </Modal>
      <Table
        onAddClick={() => dispatch({ type: OPEN_FORM })}
        tableHead={TABLE_HEADER}
        tableData={dataTable()}
        tableHeaderColor="info"
        isAddItem={allowEdit}
        addButtonText="+ Add new app user"
        rowsPerPage={limit}
        page={page}
        count={total}
        onPageChange={newPage => dispatch({ type: SET_PAGE, payload: newPage })}
        onChangeRowsPerPage={newRowsPerPage =>
          dispatch({ type: SET_LIMIT, payload: +newRowsPerPage })
        }
        onSearch={({ target }) =>
          dispatch({ type: SET_SEARCH_STRING, payload: target.value })
        }
        onClear={() => dispatch({ type: SET_SEARCH_STRING, payload: "" })}
        isLoading={loading}
      />
    </>
  );
};

AppUsersTab.propTypes = {
  allowEdit: bool
};

export default AppUsersTab;
