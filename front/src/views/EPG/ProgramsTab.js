import React, {
  useEffect,
  useCallback,
  useReducer,
  useRef,
  useState
} from "react";
import { format } from "date-fns";
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
import CustomInputFile from "components/CustomInputFile/CustomInputFile";
import ProjectSelect from "components/ProjectSelect/ProjectSelect";
import EPGForm from "./EPGForm";

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
import { convertDataToOptionsByKey } from "helpers/convertDataToOptions";
import {
  makeDateDueSafariIssue,
  formattedDateDifference
} from "helpers/formatHelper";

import {
  dangerColor,
  primaryColor
} from "assets/jss/material-dashboard-react.js";
import { convertDataToOptions } from "helpers/convertDataToOptions";

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
    paddingBottom: 0,
    marginRight: "20px",
    marginTop: 0,
    minWidth: "65px"
  }
};

const useStyles = makeStyles(styles);

const INITIAL_FORM = {
  name: "",
  type: "",
  show_id: 0,
  start_show_at: null,
  end_show_at: null,
  project_id: 0,
  show: ""
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
const TABLE_HEADER = [
  "Title",
  "Airing Type",
  "Start on",
  "End on",
  "Duration",
  ""
];

const optionAll = { value: 0, label: "All" };

const ProgramsPage = ({ allowEdit }) => {
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
  const [currentProject, setCurrentProject] = useState(optionAll.value);
  const [programTypes, setProgramTypes] = useState([]);
  const [shows, setShows] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/programs/types/accessible-list")
      .then(response => setProgramTypes(response?.data?.data))
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
    axiosInstance
      .get("/shows/accessible-list?limit=1000&without_relations=true")
      .then(response => setShows(response?.data?.data))
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

  const handleEdit = id => {
    axiosInstance
      .get(`/programs/${id}`)
      .then(res => {
        dispatch({
          type: EDIT_FORM,
          payload: {
            id,
            name: res?.data?.data?.[0].name || "",
            type: res?.data?.data?.[0].type || "",
            show_id: res?.data?.data?.[0].show?.id || 0,
            start_show_at:
              makeDateDueSafariIssue(res?.data?.data?.[0].start_show_at) || "",
            end_show_at:
              makeDateDueSafariIssue(res?.data?.data?.[0].end_show_at) || "",
            project_id: res?.data?.data?.[0].project?.id || 0
          }
        });

        dispatch({
          type: SAVE_FORM,
          payload: {
            id,
            name: res?.data?.data?.[0].name || "",
            type: res?.data?.data?.[0].type || "",
            show_id: res?.data?.data?.[0].show?.id || 0,
            start_show_at: res?.data?.data?.[0].start_show_at || "",
            end_show_at: res?.data?.data?.[0].end_show_at || "",
            project_id: res?.data?.data?.[0].project?.id || 0
          }
        });
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

    dispatch({ type: OPEN_FORM });
  };

  const handleDelete = () => {
    axiosInstance
      .delete(`/programs/${idToDelete}`)
      .then(() => {
        dispatch({
          type: SET_MESSAGE,
          payload: {
            messageStatus: "success",
            message: MESSAGES.deleted("Program")
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
      const { id, name, type, start_show_at, end_show_at } = epg;
      const duration = formattedDateDifference(
        makeDateDueSafariIssue(end_show_at),
        makeDateDueSafariIssue(start_show_at)
      );

      return [
        name,
        type,
        // show date & time without seconds
        start_show_at.slice(0, -3),
        end_show_at.slice(0, -3),
        duration || "",
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
                dispatch({ type: TOGGLE_CONFIRM, payload: { id, name } })
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
      .get(
        `/programs?limit=${limit}&page=${page}&q=${searchString}${
          currentProject ? "&project_id=" + currentProject : ""
        }`
      )
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
  }, [page, limit, searchString, currentProject]);

  const submitForm = () => {
    const handleFormSubmitResponse = () => {
      dispatch({
        type: SUBMIT_FORM_SUCCES,
        payload: MESSAGES.added("EPG")
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
      axiosInstance
        .post("/programs", {
          ...form,
          ...(form.start_show_at
            ? {
                start_show_at: format(
                  makeDateDueSafariIssue(form.start_show_at),
                  "Y-MM-dd HH:mm"
                )
              }
            : {}),
          ...(form.end_show_at
            ? {
                end_show_at: format(
                  makeDateDueSafariIssue(form.end_show_at),
                  "Y-MM-dd HH:mm"
                )
              }
            : {})
        })
        .then(handleFormSubmitResponse)
        .catch(handleFormSubmitError);
    } else {
      let changedFields = {};
      Object.keys(savedForm).forEach(key => {
        if (key === "id") return;
        if (form[key] !== savedForm[key]) {
          changedFields[key] = form[key];
        }
      });
      if (changedFields?.start_show_at || changedFields?.end_show_at) {
        changedFields.start_show_at = format(
          makeDateDueSafariIssue(form.start_show_at),
          "Y-MM-dd HH:mm"
        );
        changedFields.end_show_at = format(
          makeDateDueSafariIssue(form.end_show_at),
          "Y-MM-dd HH:mm"
        );
      }

      axiosInstance
        .put(`/programs/${savedForm.id}`, changedFields)
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
              <EPGForm
                submitForm={submitForm}
                dataForm={form}
                programTypeOptions={convertDataToOptionsByKey(programTypes)}
                showOptions={convertDataToOptions(shows)}
                handleChange={({ target }) =>
                  dispatch({ type: CHANGE_FORM, payload: target })
                }
                handleDateChange={(date, name) =>
                  dispatch({
                    type: CHANGE_FORM,
                    payload: { type: "text", value: date, name }
                  })
                }
                onClose={() => {
                  dispatch({ type: CLOSE_FORM });
                  dispatch({ type: RESET_FORM, payload: INITIAL_FORM });
                }}
                isEdit={!!savedForm}
              />
            </Fade>
          )}
          {confirmIsOpened && (
            <Fade in={confirmIsOpened}>
              <DeleteConfirmationModalContent
                title="Delete EPG"
                onConfirm={handleDelete}
                onClose={() => dispatch({ type: TOGGLE_CONFIRM })}
                isLoading={loading}
              >
                {`Confirm program${
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
        secondaryControlComponents={
          <>
            <ProjectSelect
              labelText="Project"
              id="project"
              formControlProps={{
                className: classes.selectProjectContainer
              }}
              defaultValue={currentProject}
              onChange={({ target }) => {
                setCurrentProject(target.value);
              }}
              inputProps={{
                type: "text",
                name: "project_id",
                required: true
              }}
            />
            {allowEdit ? (
              <CustomInputFile
                fileType="Import CSV"
                formControlProps={{ className: classes.uploadEpg }}
                inputProps={{
                  accept: ".csv, .xls, .xlsx",
                  name: "epg",
                  disabled: loading
                }}
                id="epg"
                onChange={event => {
                  dispatch({ type: REQUEST });
                  const files = event.target.files;
                  if (files?.length && files[0]?.name) {
                    const formData = new FormData();
                    formData.append("file", files[0]);
                    axiosInstance
                      .post("/epg/import", formData)
                      .then(response => {
                        dispatch({
                          type: SET_MESSAGE,
                          payload: {
                            messageStatus: "success",
                            message:
                              response?.data?.message || "File was uploaded"
                          }
                        });
                        getPage();
                        return notificationRef?.current?.showNotification();
                      })
                      .catch(error => {
                        dispatch({
                          type: SET_MESSAGE,
                          payload: {
                            messageStatus: "danger",
                            message:
                              error?.response?.data?.message ||
                              MESSAGES.couldntReadFromError
                          }
                        });
                        return notificationRef?.current?.showNotification();
                      });
                  }
                }}
                singleButton={true}
              />
            ) : null}
          </>
        }
      />
    </>
  );
};

ProgramsPage.propTypes = {
  allowEdit: bool
};

export default ProgramsPage;
