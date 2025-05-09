import React, {
  useEffect,
  useCallback,
  useReducer,
  useRef,
  useState
} from "react";
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
import Table from "components/Table/Table";
import AddCategoryForm from "./AddCategoryForm";

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
  name: "",
  tag_ids: []
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
  idToDelete: null
};

const TABLE_HEADER = ["Metadata category", ""];

const CategoryTab = ({ allowEdit }) => {
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
  const [tagOptions, setTagOptions] = useState([]);

  const notificationRef = useRef(null);

  useEffect(() => {
    axiosInstance
      .get("/tags?limit=1000&without_relations=true")
      .then(response => {
        setTagOptions(response.data.data);
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
  }, []);

  const handleEdit = (name, tags = [], id) => {
    dispatch({
      type: EDIT_FORM,
      payload: {
        name,
        tag_ids: tags.map(tag => ({
          value: tag.id,
          label: tag.title
        })),
        id
      }
    });

    dispatch({
      type: SAVE_FORM,
      payload: {
        name,
        tag_ids: tags.map(tag => ({
          value: tag.id,
          label: tag.title
        })),
        id
      }
    });
    dispatch({ type: OPEN_FORM });
  };

  const handleDelete = () => {
    axiosInstance
      .delete(`/metadata/${idToDelete}`)
      .then(() => {
        dispatch({
          type: SET_MESSAGE,
          payload: {
            messageStatus: "success",
            message: MESSAGES.deleted("Metadata category")
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
    return pageData.map(category => {
      const { name, id, tags } = category;
      return [
        name,
        allowEdit ? (
          <div key={id} style={{ textAlign: "right" }}>
            <Tooltip
              id="tooltip-top"
              title="Edit"
              placement="top"
              onClick={() => handleEdit(name, tags, id)}
            >
              <IconButton aria-label="Edit" color="primary">
                <Edit className={classes.edit} />
              </IconButton>
            </Tooltip>
            <Tooltip
              id="tooltip-top-start"
              title="Remove"
              placement="top"
              onClick={() =>
                dispatch({ type: TOGGLE_CONFIRM, payload: { id, name } })
              }
            >
              <IconButton aria-label="Close" color="secondary">
                <Close />
              </IconButton>
            </Tooltip>
          </div>
        ) : null
      ];
    });
  }, [pageData]);

  const getPage = () => {
    axiosInstance
      .get(`/metadata?limit=${limit}&page=${page}&q=${searchString}`)
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

    const handleFormSubmitResponse = isChanged => {
      dispatch({
        type: SUBMIT_FORM_SUCCES,
        payload: isChanged
          ? MESSAGES.updated("Metadata")
          : MESSAGES.added("Metadata")
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
        .post("metadata", {
          ...form,
          tag_ids: form.tag_ids.map(tag => tag.value)
        })
        .then(() => handleFormSubmitResponse(false))
        .catch(handleFormSubmitError);
    } else {
      let changedFields = {};
      Object.keys(savedForm).forEach(key => {
        if (key === "id") return;
        if (form[key] !== savedForm[key]) {
          if (key === "tag_ids") {
            changedFields[key] = form[key].map(tag => tag.value);
          } else {
            changedFields[key] = form[key];
          }
        }
      });
      changedFields.name = form.name;
      axiosInstance
        .put(`metadata/${savedForm.id}`, changedFields)
        .then(handleFormSubmitResponse)
        .catch(handleFormSubmitError);
    }
  };

  const handleMultiSelectChange = async ({ target }) => {
    let multiValue = [...target.value];

    const addedTag = multiValue.find(
      valueOption => typeof valueOption.value === "string"
    );

    if (addedTag) {
      multiValue = await axiosInstance
        .post("/tags", { title: addedTag.value })
        .then(response =>
          multiValue.reduce((acc, curr) => {
            if (curr.value === addedTag.value) {
              return [
                ...acc,
                { value: response.data.data.id, label: addedTag.value }
              ];
            }
            return [...acc, curr];
          }, [])
        )
        .catch(error => {
          dispatch({
            type: SET_MESSAGE,
            payload: {
              messageStatus: "danger",
              message:
                error?.response?.data?.message || MESSAGES.couldntReadFromError
            }
          });
          setTimeout(() => {
            return notificationRef?.current?.showNotification();
          }, 100);

          return [...multiValue];
        });
    }

    dispatch({
      type: "CHANGE_FORM",
      payload: { name: "tag_ids", value: multiValue }
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
              <AddCategoryForm
                submitForm={submitForm}
                dataForm={form}
                handleChange={({ target }) =>
                  dispatch({ type: CHANGE_FORM, payload: target })
                }
                handleMultiSelectChange={handleMultiSelectChange}
                onClose={() => {
                  dispatch({ type: CLOSE_FORM });
                  dispatch({ type: RESET_FORM, payload: INITIAL_FORM });
                }}
                isEdit={!!savedForm}
                tagOptions={tagOptions}
              />
            </Fade>
          )}
          {confirmIsOpened && (
            <Fade in={confirmIsOpened}>
              <DeleteConfirmationModalContent
                title="Delete category"
                onConfirm={handleDelete}
                onClose={() => dispatch({ type: TOGGLE_CONFIRM })}
              >
                {`Confirm category${
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
        addButtonText="+ Add new category"
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

CategoryTab.propTypes = {
  allowEdit: bool
};

export default CategoryTab;
