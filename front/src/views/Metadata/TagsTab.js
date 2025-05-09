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

import PopupNotification from "components/PopupNotification/PopupNotification.js";
import Table from "components/Table/Table";
import DeleteConfirmationModalContent from "components/DeleteConfirmationModalContent";
import axiosInstance from "config/axiosInstance";
import AddTagForm from "./AddTagForm";
import TopIcon from "components/Icons/TopIcon";
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
  SET_MESSAGE,
  TOGGLE_CONFIRM
} from "../viewReducer/actionTypes";
import reducer from "../viewReducer/reducer";

import { primaryColor } from "assets/jss/material-dashboard-react.js";

const styles = {
  modal: {
    overflow: "scroll"
  },
  edit: {
    color: primaryColor[0]
  },
  title: {
    display: "flex",
    alignItems: "center",
    "& span": {
      marginLeft: 5
    }
  }
};

const useStyles = makeStyles(styles);
const INITIAL_FORM = {
  name: "",
  metadata_ids: [],
  is_asset_pl_add_sort_by_id: false,
  is_top_news_tag: false
};
const initialState = {
  loading: false,
  errorMessage: "",
  successMessage: "",
  pageData: [],
  page: 1,
  limit: DEFAULT_LIMIT,
  total: 0,
  searchString: "",
  formIsOpened: false,
  savedForm: null,
  form: INITIAL_FORM,
  message: "",
  messageStatus: "",
  tableWasChanged: false,
  idToDelete: null,
  confirmIsOpened: false
};
const TABLE_HEADER = ["Tag name", "Category", ""];
const TagsTab = ({ allowEdit }) => {
  const classes = useStyles();

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
    idToDelete,
    savedForm,
    confirmIsOpened,
    nameToDelete
  } = state;

  const notificationRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [topTag, setTopTag] = useState(null);

  useEffect(() => {
    axiosInstance
      .get(`/metadata/accessible-list?limit=1000&without_relations=true`)
      .then(response => {
        setCategories(response.data.data);
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

  useEffect(() => {
    dispatch({ type: REQUEST });
    getPage();
    getTopTag();
  }, [page, limit, searchString]);

  const handleEdit = (
    name,
    category,
    is_asset_pl_add_sort_by_id,
    is_top_news_tag,
    id
  ) => {
    is_asset_pl_add_sort_by_id = Boolean(Number(is_asset_pl_add_sort_by_id));
    is_top_news_tag = Boolean(Number(is_top_news_tag));

    dispatch({
      type: EDIT_FORM,
      payload: {
        id,
        title: name,
        is_asset_pl_add_sort_by_id: is_asset_pl_add_sort_by_id,
        is_top_news_tag: is_top_news_tag,
        metadata_ids: category.map(meta => ({
          value: meta.id,
          label: meta.name
        }))
      }
    });

    dispatch({
      type: SAVE_FORM,
      payload: {
        title: name,
        is_asset_pl_add_sort_by_id: is_asset_pl_add_sort_by_id,
        is_top_news_tag: is_top_news_tag,
        metadata_ids: category.map(meta => ({
          value: meta.id,
          label: meta.name
        })),
        id
      }
    });
    dispatch({ type: OPEN_FORM });
  };

  const dataTable = useCallback(() => {
    return pageData.map(tag => {
      const {
        title,
        meta,
        is_asset_pl_add_sort_by_id,
        is_top_news_tag,
        id
      } = tag;
      return [
        <p key="is_top_tag" className={classes.title}>
          {title}
          {!!is_top_news_tag && (
            <span>
              <TopIcon />
            </span>
          )}
        </p>,
        meta.map(met => met.name).join(", "),
        allowEdit ? (
          <div key={id} style={{ textAlign: "right" }}>
            <Tooltip
              id="tooltip-top"
              title="Edit"
              placement="top"
              onClick={() =>
                handleEdit(
                  title,
                  meta,
                  is_asset_pl_add_sort_by_id,
                  is_top_news_tag,
                  id
                )
              }
            >
              <IconButton aria-label="Edit" color="primary">
                <Edit className={classes.edit} />
              </IconButton>
            </Tooltip>
            {!is_top_news_tag && (
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
            )}
          </div>
        ) : null
      ];
    });
  }, [pageData]);

  const handleDelete = () => {
    axiosInstance
      .delete(`/tags/${idToDelete}`)
      .then(() => {
        dispatch({
          type: SET_MESSAGE,
          payload: {
            messageStatus: "success",
            message: MESSAGES.deleted("Tag")
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

  const getPage = () => {
    axiosInstance
      .get(`/tags?limit=${limit}&page=${page}&q=${searchString}`)
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
  const getTopTag = () => {
    axiosInstance
      .get(`/tags?is_top_news_tag=true`)
      .then(response => {
        setTopTag(response?.data?.data?.[0]);
      })
      .catch(error =>
        dispatch({
          type: REQUEST_ERROR,
          payload: error.response?.data?.message
        })
      );
  };

  const submitForm = () => {
    if (loading) return;

    const handleFormSubmitResponse = isUpdated => {
      dispatch({
        type: SUBMIT_FORM_SUCCES,
        payload: isUpdated ? MESSAGES.updated("Tag") : MESSAGES.added("Tag")
      });

      dispatch({ type: CLOSE_FORM });
      dispatch({ type: RESET_FORM, payload: INITIAL_FORM });

      getPage();
      getTopTag();
      return notificationRef.current?.showNotification();
    };

    const handleFormSubmitError = error => {
      dispatch({ type: SUBMIT_FORM_ERROR, payload: error.response.data });
      return notificationRef.current?.showNotification();
    };

    dispatch({ type: REQUEST });

    if (!savedForm) {
      axiosInstance
        .post("/tags", {
          ...form,
          metadata_ids: form.metadata_ids.map(
            metaCategory => metaCategory.value
          )
        })
        .then(() => handleFormSubmitResponse(false))
        .catch(handleFormSubmitError);
    } else {
      let changedFields = {};
      Object.keys(savedForm).forEach(key => {
        if (key === "id") return;
        changedFields[key] = form[key];
      });
      axiosInstance
        .put(`tags/${savedForm.id}`, {
          ...changedFields,
          metadata_ids: form.metadata_ids.map(
            metaCategory => metaCategory.value
          )
        })
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
              <AddTagForm
                isEditMode={!!savedForm}
                submitForm={submitForm}
                dataForm={form}
                topTag={topTag}
                handleChange={({ target }) =>
                  dispatch({ type: CHANGE_FORM, payload: target })
                }
                onClose={() => {
                  dispatch({ type: CLOSE_FORM });
                  dispatch({ type: RESET_FORM, payload: INITIAL_FORM });
                }}
                categories={categories}
              />
            </Fade>
          )}
          {confirmIsOpened && (
            <Fade in={confirmIsOpened}>
              <DeleteConfirmationModalContent
                title="Delete tag"
                onConfirm={handleDelete}
                onClose={() => dispatch({ type: TOGGLE_CONFIRM })}
                isLoading={loading}
              >
                {`Confirm tag${
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
        addButtonText="+ Add new tag"
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

TagsTab.propTypes = {
  allowEdit: bool
};

export default TagsTab;
