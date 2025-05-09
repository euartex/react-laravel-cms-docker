import React, {
  useEffect,
  useCallback,
  useReducer,
  useRef,
  useState
} from "react";
import { bool } from "prop-types";
import { format } from "date-fns";

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
import AddLivefeedForm from "./AddLivefeedForm";
import IsMainIcon from "components/Icons/IsMainIcon";
import DoneIcon from "@material-ui/icons/Done";
import DescriptionIcon from "@material-ui/icons/Description";

import axiosInstance from "config/axiosInstance";
import { convertToFormData } from "helpers/convertToFormData";
import { makeDateDueSafariIssue } from "helpers/formatHelper";
import { convertDataToOptions } from "helpers/convertDataToOptions";
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
  primaryColor,
  successColor,
  grayColor
} from "assets/jss/material-dashboard-react.js";

const styles = {
  modal: {
    overflow: "scroll"
  },
  img: {
    maxWidth: "80px"
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
  },
  publish: {
    color: successColor[0]
  },
  draft: {
    color: grayColor[0]
  }
};

const useStyles = makeStyles(styles);

const INITIAL_FORM = {
  title: "",
  description: "",
  url: "",
  logo: "",
  tag_ids: [],
  project_id: 0,
  ext_url: "",
  company_id: 0,
  id: "",
  long_description: "",
  poster: "",
  cover: "",
  path_mezaninne: "",
  status: "",
  // midRollCuepoint: "",
  seo_title: "",
  seo_description: "",
  seo_url: "",
  start_on: null,
  end_on: null
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
const TABLE_HEADER = ["Name", "Description", "Created at", "Status", ""];

const LiveFeeds = ({ allowEdit }) => {
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

  const classes = useStyles();

  const notificationRef = useRef(null);
  const [companies] = useState([]);
  const [mainLivefeed, setMainLivefeed] = useState(null);

  const handleEdit = id => {
    axiosInstance.get(`livefeeds/${id}`).then(res => {
      // const {
      //   title,
      //   description,
      //   url,
      //   id,
      //   tags = [],
      //   project_id = 0,
      //   logo = "",
      //   ext_url,
      //   company_id = 0,
      //   is_main
      // } = res?.data?.data;
      const livefeed = res?.data?.data;
      dispatch({
        type: EDIT_FORM,
        payload: {
          // title,
          // description,
          // url,
          // id,
          // tag_ids: convertDataToOptions(tags),
          // project_id,
          // logo,
          // ext_url,
          // company_id,
          // is_main: !!is_main
          ...livefeed,
          tag_ids: convertDataToOptions(livefeed?.tags)
        }
      });

      dispatch({
        type: SAVE_FORM,
        payload: {
          // title,
          // description,
          // url,
          // logo,
          // id,
          // tag_ids: tags?.map(tag => tag.id),
          // project_id,
          // ext_url,
          // company_id,
          // is_main: !!is_main
          ...livefeed,
          tag_ids: convertDataToOptions(livefeed?.tags)
        }
      });

      dispatch({ type: OPEN_FORM });
    });
  };

  const handleDelete = () => {
    axiosInstance
      .delete(`/livefeeds`, { data: { ids: [idToDelete] } })
      .then(() => {
        dispatch({
          type: SET_MESSAGE,
          payload: {
            messageStatus: "success",
            message: MESSAGES.deleted("Live feed")
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
    return pageData.map(livefeed => {
      const { title, description, id, created_at, status, is_main } = livefeed;
      return [
        <p key="is_main" className={classes.title}>
          {title}
          {!!is_main && (
            <span>
              <IsMainIcon />
            </span>
          )}
        </p>,
        description,
        created_at ? format(new Date(created_at || ""), "yyyy-MM-dd") : "",
        <>
          {status === "published" && (
            <Tooltip id="tooltip-top-start" title="Published" placement="top">
              <DoneIcon className={classes.publish} />
            </Tooltip>
          )}

          {status === "draft" && (
            <Tooltip id="tooltip-top-start" title="Draft" placement="top">
              <DescriptionIcon className={classes.draft} />
            </Tooltip>
          )}
        </>,
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
            {!is_main && (
              <Tooltip
                id="tooltip-top-start"
                title="Remove"
                placement="top"
                onClick={() =>
                  dispatch({ type: TOGGLE_CONFIRM, payload: { id, title } })
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

  const getPage = () => {
    axiosInstance
      .get(`/livefeeds?limit=${limit}&page=${page}&q=${searchString}`)
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

  const getMainLivefeed = () => {
    axiosInstance
      .get(`/livefeeds?is_main=true`)
      .then(response => {
        setMainLivefeed(response?.data?.data?.[0]);
      })
      .catch(error =>
        dispatch({
          type: REQUEST_ERROR,
          payload: error.response?.data?.message
        })
      );
  };
  useEffect(() => {
    dispatch({ type: REQUEST });
    getPage();
    getMainLivefeed();
  }, [page, limit, searchString]);

  const submitForm = () => {
    if (loading) return;

    const handleFormSubmitResponse = () => {
      dispatch({
        type: SUBMIT_FORM_SUCCES,
        payload: !savedForm
          ? MESSAGES.added("Live feed")
          : MESSAGES.updated("Live feed")
      });

      dispatch({ type: CLOSE_FORM });
      dispatch({ type: RESET_FORM, payload: INITIAL_FORM });

      getPage();
      getMainLivefeed();

      return notificationRef.current?.showNotification();
    };

    const handleFormSubmitError = error => {
      dispatch({ type: SUBMIT_FORM_ERROR, payload: error?.response?.data });
      return notificationRef.current?.showNotification();
    };

    dispatch({ type: REQUEST });

    if (!savedForm) {
      const fieldsToSend = {};
      Object.keys(form).forEach(key => {
        if (form[key]) {
          if (key === "tag_ids") {
            fieldsToSend[key] = form.tag_ids.map(tag => tag.value);
          } else if (key === "start_on" || key === "end_on") {
            fieldsToSend[key] = format(
              makeDateDueSafariIssue(form[key]),
              "yyyy-MM-dd hh:mm:ss"
            );
          } else {
            fieldsToSend[key] = form[key];
          }
        }
      });

      axiosInstance
        .post(
          "livefeeds",
          convertToFormData({ type: "livefeed", ...fieldsToSend })
        )
        .then(handleFormSubmitResponse)
        .catch(handleFormSubmitError);
    } else {
      let changedFields = {};
      Object.keys(savedForm).forEach(key => {
        if (key === "id") return;
        if (key === "tag_ids") {
          changedFields[key] = form[key].map(tag => tag.value);
        } else if (form[key] !== savedForm[key]) {
          changedFields[key] = form[key];
        }
      });

      changedFields["_method"] = "PUT";
      axiosInstance
        .post(`livefeeds/${savedForm.id}`, convertToFormData(changedFields))
        .then(handleFormSubmitResponse)
        .catch(handleFormSubmitError);
    }
  };

  const handleMultiSelectChange = ({ target }) => {
    const multiValue = [...target.value];
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
              <AddLivefeedForm
                mainLivefeed={mainLivefeed}
                submitForm={submitForm}
                dataForm={form}
                handleChange={({ target }) => {
                  dispatch({ type: CHANGE_FORM, payload: target });
                }}
                handleMultiSelectChange={handleMultiSelectChange}
                onClose={() => {
                  dispatch({ type: CLOSE_FORM });
                  dispatch({ type: RESET_FORM, payload: INITIAL_FORM });
                }}
                companyOptions={convertDataToOptions(companies)}
                editMode={!!savedForm}
              />
            </Fade>
          )}
          {confirmIsOpened && (
            <Fade in={confirmIsOpened}>
              <DeleteConfirmationModalContent
                title="Delete live feed"
                onConfirm={handleDelete}
                onClose={() => dispatch({ type: TOGGLE_CONFIRM })}
                isLoading={loading}
              >
                {`Confirm livefeed${
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
        addButtonText="+ Add new live feed"
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

LiveFeeds.propTypes = {
  allowEdit: bool
};

export default LiveFeeds;
