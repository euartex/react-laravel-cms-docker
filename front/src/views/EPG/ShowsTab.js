import React, { useEffect, useCallback, useReducer, useRef } from "react";
import { bool } from "prop-types";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { makeStyles } from "@material-ui/core/styles";
import { convertToFormData } from "helpers/convertToFormData";
import DeleteConfirmationModalContent from "components/DeleteConfirmationModalContent";
import PopupNotification from "components/PopupNotification/PopupNotification.js";
import Table from "components/Table/Table";
import ShowForm from "./ShowForm";
import axiosInstance from "config/axiosInstance";
import MESSAGES from "constants/notificationMessages";
import { DEFAULT_LIMIT } from "constants/request";
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
  SET_MESSAGE
} from "../viewReducer/actionTypes";
import reducer from "../viewReducer/reducer";
import {
  dangerColor,
  primaryColor
} from "assets/jss/material-dashboard-react.js";

const styles = {
  modal: {
    overflow: "scroll"
  },
  img: {
    maxWidth: "80px"
  },
  uploadEpg: {
    marginTop: 0,
    paddingBottom: 0,
    borderBottom: "none"
  },
  edit: {
    color: primaryColor[0]
  },
  delete: {
    color: dangerColor[0]
  },
  selectProjectContainer: {
    paddingBottom: 0
  }
};

const useStyles = makeStyles(styles);

const INITIAL_FORM = {
  title: null,
  description: null,
  poster: null,
  cover: null,
  playlist_id: null
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
  message: "Something happens",
  confirmIsOpened: false,
  idToDelete: null
};
const TABLE_HEADER = ["Title", "Description", ""];
const ShowsPage = ({ allowEdit }) => {
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
    nameToDelete
  } = state;

  const notificationRef = useRef(null);
  const handleEdit = id => {
    axiosInstance
      .get(`shows/${id}`)
      .then(res => {
        dispatch({
          type: EDIT_FORM,
          payload: {
            id,
            title: res?.data?.data?.[0].title,
            description: res?.data?.data?.[0].description,
            poster: res?.data?.data?.[0].poster,
            cover: res?.data?.data?.[0].cover,
            playlist_id: res?.data?.data?.[0].playlist?.id
          }
        });
        dispatch({
          type: SAVE_FORM,
          payload: {
            id,
            title: res?.data?.data?.[0].title,
            description: res?.data?.data?.[0].description,
            poster: res?.data?.data?.[0].poster,
            cover: res?.data?.data?.[0].cover,
            playlist_id: res?.data?.data?.[0].playlist?.id
          }
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
      .delete(`/shows/${idToDelete}`)
      .then(() => {
        dispatch({
          type: SET_MESSAGE,
          payload: {
            messageStatus: "success",
            message: MESSAGES.deleted("Show")
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
    return pageData.map(epg => {
      const { id, title, description } = epg;

      return [
        title,
        description,
        allowEdit ? (
          <div key={id} style={{ textAlign: "right" }}>
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
                dispatch({ type: TOGGLE_CONFIRM, payload: { id, name: title } })
              }
            >
              <IconButton
                aria-label="Close"
                color="secondary"
                className={classes.delete}
              >
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
      .get(`/shows?limit=${limit}&page=${page}&q=${searchString}`)
      .then(response => {
        dispatch({ type: REQUEST_SUCCESS, payload: response.data });
      })
      .catch(error => {
        dispatch({
          type: REQUEST_ERROR,
          payload: error.response?.data?.message
        });
        return notificationRef?.current?.showNotification();
      });
  };
  const classes = useStyles();

  useEffect(() => {
    dispatch({ type: REQUEST });
    getPage();
  }, [page, limit, searchString]);

  const submitForm = () => {
    const handleFormSubmitResponse = isEdit => {
      dispatch({
        type: SUBMIT_FORM_SUCCES,
        payload: isEdit ? MESSAGES.updated("Show") : MESSAGES.added("Show")
      });

      dispatch({ type: CLOSE_FORM });
      dispatch({ type: RESET_FORM, payload: INITIAL_FORM });

      getPage();
      return notificationRef.current?.showNotification();
    };

    const handleFormSubmitError = error => {
      dispatch({ type: SUBMIT_FORM_ERROR, payload: error?.response?.data });
      return notificationRef.current?.showNotification();
    };

    dispatch({ type: REQUEST });
    if (!savedForm) {
      let changedFields = {};
      Object.keys(form).forEach(key => {
        if (form[key] !== null) {
          changedFields[key] = form[key];
        }
      });
      axiosInstance
        .post("/shows",  convertToFormData(changedFields))
        .then(() => handleFormSubmitResponse(false))
        .catch(handleFormSubmitError);
    } else {
      let changedFields = {};
      Object.keys(savedForm).forEach(key => {
        if (key === "id") return;
        if (form[key] !== savedForm[key]) {
          changedFields[key] = form[key];
        }
      });

      // If playlist_id exists then send value to api route
      if (form['playlist_id']) {
        changedFields['playlist_id'] = form['playlist_id'];
      }

      // Set request method for form data
      changedFields['_method'] = 'PUT';

      axiosInstance
        .post(`/shows/${savedForm.id}`, convertToFormData(changedFields))
        .then(handleFormSubmitResponse)
        .catch(handleFormSubmitError);
    }
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
        open={formIsOpened || confirmIsOpened}
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
          {formIsOpened && (
            <Fade in={formIsOpened}>
              <ShowForm
                isEdit={!!savedForm}
                submitForm={submitForm}
                dataForm={form}
                handleChange={({ target }) =>
                  dispatch({ type: CHANGE_FORM, payload: target })
                }
                onClose={() => {
                  dispatch({ type: CLOSE_FORM });
                  dispatch({ type: RESET_FORM, payload: INITIAL_FORM });
                }}
                onFileChange={({ name, target }) => {
                  dispatch({
                    type: CHANGE_FORM,
                    payload: {
                      type: "file",
                      files: target?.files,
                      name
                    }
                  });
                }}
              />
            </Fade>
          )}
          {confirmIsOpened && (
            <Fade in={confirmIsOpened}>
              <DeleteConfirmationModalContent
                title="Delete show"
                onConfirm={handleDelete}
                onClose={() => dispatch({ type: TOGGLE_CONFIRM })}
                isLoading={loading}
              >
                {`Confirm show${
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
        addButtonText="+ Add new item"
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

ShowsPage.propTypes = {
  allowEdit: bool
};

export default ShowsPage;
