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

import DeleteConfirmationModalContent from "components/DeleteConfirmationModalContent";
import PopupNotification from "components/PopupNotification/PopupNotification.js";
import AddStaticPageForm from "./AddStaticPageForm";
import Table from "components/DnDTable/DnDTable";
import axiosInstance from "config/axiosInstance";
import { convertToFormData } from "helpers/convertToFormData";
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

import { primaryColor } from "assets/jss/material-dashboard-react.js";

const styles = {
  modal: {
    overflow: "scroll"
  },
  edit: {
    color: primaryColor[0]
  }
};

const useStyles = makeStyles(styles);

const INITIAL_FORM = {
  id: "",
  title: "",
  sub_title: "",
  project_id: "",
  html_content: "",
  type: "web-content"
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
const TABLE_HEADER = ["Title", "Sub title", "Slug", ""];

const StaticPages = ({ allowEdit }) => {
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
      .get(`/static-pages/${id}`)
      .then(res => {
        const {
          title,
          sub_title,
          html_content,
          project_id,
          type
        } = res.data.data;
        dispatch({
          type: EDIT_FORM,
          payload: { title, sub_title, html_content, project_id, id, type }
        });

        dispatch({
          type: SAVE_FORM,
          payload: { title, sub_title, html_content, project_id, id, type }
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
      .delete(`/static-pages/${idToDelete}`)
      .then(() => {
        dispatch({
          type: SET_MESSAGE,
          payload: {
            messageStatus: "success",
            message: MESSAGES.deleted("Static page")
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
    return pageData.map(staticPage => {
      const {
        title,
        sub_title,
        slug,
        html_content,
        id,
        project_id,
        type
      } = staticPage;
      return {
        id,
        data: [
          title,
          sub_title,
          slug,
          allowEdit ? (
            <div key={id} style={{ textAlign: "right" }}>
              <Tooltip
                id="tooltip-top"
                title="Edit"
                placement="top"
                onClick={() => handleEdit(id)}
              >
                <IconButton aria-label="Edit">
                  <Edit className={classes.edit} />
                </IconButton>
              </Tooltip>
              <Tooltip
                id="tooltip-top-start"
                title="Remove"
                placement="top"
                onClick={() =>
                  dispatch({
                    type: TOGGLE_CONFIRM,
                    payload: { id, name: title }
                  })
                }
              >
                <IconButton aria-label="Close" color="secondary">
                  <Close />
                </IconButton>
              </Tooltip>
            </div>
          ) : null
        ]
      };
    });
  }, [pageData]);

  const getPage = () => {
    axiosInstance
      .get(`/static-pages?limit=${limit}&page=${page}&q=${searchString}`)
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
        payload: !savedForm
          ? MESSAGES.added("Static page")
          : MESSAGES.updated("Static page")
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

    if (!savedForm) {
      axiosInstance
        .post("static-pages", convertToFormData(form))
        .then(handleFormSubmitResponse)
        .catch(handleFormSubmitError);
    } else {
      let changedFields = { _method: "PUT" };
      Object.keys(savedForm).forEach(key => {
        if (key === "id") return;
        if (form[key] !== savedForm[key]) {
          changedFields[key] = form[key];
        }
      });
      axiosInstance
        .post(`static-pages/${savedForm.id}`, convertToFormData(changedFields))
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
              <AddStaticPageForm
                submitForm={submitForm}
                dataForm={form}
                handleRTEChange={value =>
                  dispatch({
                    type: CHANGE_FORM,
                    payload: {
                      type: "text",
                      value,
                      name: "html_content"
                    }
                  })
                }
                handleChange={({ target }) => {
                  dispatch({ type: CHANGE_FORM, payload: target });
                }}
                onClose={() => {
                  dispatch({ type: CLOSE_FORM });
                  dispatch({ type: RESET_FORM, payload: INITIAL_FORM });
                }}
              />
            </Fade>
          )}
          {confirmIsOpened && (
            <Fade in={confirmIsOpened}>
              <DeleteConfirmationModalContent
                title="Delete static page"
                onConfirm={handleDelete}
                onClose={() => dispatch({ type: TOGGLE_CONFIRM })}
                isLoading={loading}
              >
                {`Confirm project${
                  nameToDelete ? ` '${nameToDelete}' ` : ""
                }deleting, please.`}
              </DeleteConfirmationModalContent>
            </Fade>
          )}
        </>
      </Modal>
      <Table
        isLoading={loading}
        onAddClick={() => dispatch({ type: OPEN_FORM })}
        tableHead={TABLE_HEADER}
        tableData={dataTable()}
        tableHeaderColor="info"
        isAddItem={allowEdit}
        getPage={getPage}
        addButtonText="+ Add new static page"
        orderUrl="/static-pages/order"
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
      />
    </>
  );
};

StaticPages.propTypes = {
  allowEdit: bool
};

export default StaticPages;
