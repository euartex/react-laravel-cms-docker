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
import LowPriorityIcon from "@material-ui/icons/LowPriority";
import Info from "@material-ui/icons/Info";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { makeStyles } from "@material-ui/core/styles";

import DeleteConfirmationModalContent from "components/DeleteConfirmationModalContent";
import PopupNotification from "components/PopupNotification/PopupNotification.js";
import Table from "components/DnDTable/DnDTable";
import ProjectSelect from "components/ProjectSelect/ProjectSelect";
import RevisionTable from "components/RevisionTable/RevisionTable";
import PlaylistReorderTable from "./PlaylistReorderTable";
import AddNavigationForm from "./AddNavigationForm";

import axiosInstance from "config/axiosInstance";
import MESSAGES from "constants/notificationMessages";
import { DEFAULT_LIMIT } from "constants/request";
import { convertDataToOptions } from "helpers/convertDataToOptions";

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
  TOGGLE_REVISION_OPENED,
  TOGGLE_SECONDARY_MODAL,
  SET_SECONDARY_MODAL_CONTENT
} from "../viewReducer/actionTypes";
import reducer from "../viewReducer/reducer";

import {
  primaryColor,
  infoColor,
  successColor
} from "assets/jss/material-dashboard-react.js";

const styles = {
  modal: {
    overflow: "scroll"
  },
  edit: {
    color: primaryColor[0]
  },
  selectProjectContainer: {
    paddingBottom: 0,
    minWidth: "65px"
  },
  revision: {
    color: infoColor[3]
  },
  reorder: {
    color: successColor[0]
  }
};

const useStyles = makeStyles(styles);

const INITIAL_FORM = {
  id: "",
  title: "",
  cms_title: "",
  description: "",
  seo_title: "",
  seo_description: "",
  project_id: 0,
  playlists: [],
  // by default should be selected 'Playlists' type, it has id 3
  type_id: 3
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
  revisionIsOpened: false,
  secondaryModalIsOpened: false,
  secondaryModalContent: null,
  revisionItemId: null
};

const TABLE_HEADER = ["Title", ""];
const optionAll = { value: 0, label: "All" };

const NavigationTab = ({ allowEdit }) => {
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
    revisionIsOpened,
    secondaryModalIsOpened,
    secondaryModalContent,
    revisionItemId,
    nameToDelete
  } = state;

  const notificationRef = useRef(null);
  const [currentProject, setCurrentProject] = useState(optionAll.value);
  const [playlistAll, setPlaylistAll] = useState([]);
  const [typesAll, setTypesAll] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/playlists/accessible-list?limit=10000&without_relations=true")
      .then(response => setPlaylistAll(response.data.data))
      .catch(error => {
        dispatch({
          type: REQUEST_ERROR,
          payload:
            error?.response?.data?.message || MESSAGES.couldntReadFromError
        });
        return notificationRef?.current?.showNotification();
      });

    axiosInstance
      .get("/navigations/types?limit=1000")
      .then(response => setTypesAll(response.data.data))
      .catch(error => {
        dispatch({
          type: REQUEST_ERROR,
          payload:
            error?.response?.data?.message || MESSAGES.couldntReadFromError
        });
        return notificationRef?.current?.showNotification();
      });
  }, []);

  const handleEdit = id => {
    axiosInstance
      .get(`/navigations/${id}`)
      .then(res => {
        const formFields = {
          ...res.data.data[0],
          project_id: res.data.data?.[0].project_id || 0,
          playlists: res.data.data?.[0].playlists
            ? convertDataToOptions(res.data.data[0].playlists)
            : [],
          type_id: res.data.data[0].type_id
        };

        dispatch({
          type: EDIT_FORM,
          payload: { ...formFields }
        });

        dispatch({
          type: SAVE_FORM,
          payload: { ...formFields }
        });
        dispatch({ type: OPEN_FORM });
      })
      .catch(error => {
        dispatch({
          type: REQUEST_ERROR,
          payload:
            error?.response?.data?.message || MESSAGES.couldntReadFromError
        });
        return notificationRef?.current?.showNotification();
      });
  };

  const handleDelete = () => {
    axiosInstance
      .delete(`/navigations/${idToDelete}`)
      .then(() => {
        dispatch({
          type: SET_MESSAGE,
          payload: {
            messageStatus: "success",
            message: MESSAGES.deleted("Navigation")
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
          type: REQUEST_ERROR,
          payload:
            error?.response?.data?.message || MESSAGES.couldntReadFromError
        });
        setTimeout(() => dispatch({ type: TOGGLE_CONFIRM }), 1000);
        return notificationRef?.current?.showNotification();
      });
  };

  const getPlaylists = () => {
    axiosInstance
      .get(`/navigations/${secondaryModalContent?.id}`)
      .then(res => {
        dispatch({
          type: SET_SECONDARY_MODAL_CONTENT,
          payload: {
            id: secondaryModalContent?.id,
            playlists: res.data.data?.[0].playlists
          }
        });
      })
      .catch(error => {
        dispatch({
          type: REQUEST_ERROR,
          payload:
            error?.response?.data?.message || MESSAGES.couldntReadFromError
        });
        return notificationRef?.current?.showNotification();
      });
  };

  const handleOpenPlaylistOrderModal = ({ id, title }) => {
    axiosInstance
      .get(`/navigations/${id}`)
      .then(res => {
        dispatch({
          type: TOGGLE_SECONDARY_MODAL,
          payload: {
            id: id,
            name: title,
            playlists: res.data.data?.[0].playlists
          }
        });
      })
      .catch(error => {
        dispatch({
          type: REQUEST_ERROR,
          payload:
            error?.response?.data?.message || MESSAGES.couldntReadFromError
        });
        return notificationRef?.current?.showNotification();
      });
  };

  const dataTable = useCallback(() => {
    return pageData.map(navigation => {
      const { title, id } = navigation;
      return {
        id,
        data: [
          title,
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
              <Tooltip
                id="tooltip-top"
                title="Order playlists"
                placement="top"
                onClick={() => handleOpenPlaylistOrderModal({ id, title })}
              >
                <IconButton aria-label="Order playlists">
                  <LowPriorityIcon className={classes.reorder} />
                </IconButton>
              </Tooltip>
              <Tooltip
                id="tooltip-top-start"
                title="Revision"
                placement="top"
                onClick={() => {
                  dispatch({ type: TOGGLE_REVISION_OPENED, payload: id });
                }}
              >
                <IconButton
                  aria-label="Info"
                  className={classes.tableActionButton}
                >
                  <Info
                    className={
                      classes.tableActionButtonIcon + " " + classes.revision
                    }
                  />
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
      .get(
        `/navigations?limit=${limit}&page=${page}${
          currentProject ? "&project_id=" + currentProject : ""
        }&q=${searchString}`
      )
      .then(response => {
        dispatch({ type: REQUEST_SUCCESS, payload: response.data });
      })
      .catch(error => {
        dispatch({
          type: REQUEST_ERROR,
          payload:
            error?.response?.data?.message || MESSAGES.couldntReadFromError
        });
      });
  };

  const classes = useStyles();

  useEffect(() => {
    dispatch({ type: REQUEST });
    getPage();
  }, [page, limit, searchString, currentProject]);

  const submitForm = () => {
    if (loading) return;
    const formatDataForRequest = data => {
      const body = {
        title: data.title,
        cms_title: data.cms_title,
        description: data.description,
        seo_title: data.seo_title,
        seo_description: data.seo_description,
        type_id: data.type_id,
        project_id: data.project_id,
        playlist_arr: data.playlists.map(playlist => playlist.value)
      };
      return body;
    };

    const handleFormSubmitResponse = isUpdate => {
      dispatch({
        type: SUBMIT_FORM_SUCCES,
        payload: isUpdate
          ? MESSAGES.updated("Navigation")
          : MESSAGES.added("Navigation")
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
        .post(`/navigations`, formatDataForRequest(form))
        .then(() => handleFormSubmitResponse(false))
        .catch(handleFormSubmitError);
    } else {
      axiosInstance
        .put(`/navigations/${savedForm.id}`, formatDataForRequest(form))
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
        open={
          formIsOpened ||
          confirmIsOpened ||
          revisionIsOpened ||
          secondaryModalIsOpened
        }
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
              <AddNavigationForm
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
                playlistOptions={convertDataToOptions(playlistAll)}
                typeOptions={convertDataToOptions(typesAll)}
              />
            </Fade>
          )}
          {confirmIsOpened && (
            <Fade in={confirmIsOpened}>
              <DeleteConfirmationModalContent
                title="Delete navigation"
                onConfirm={handleDelete}
                onClose={() => dispatch({ type: TOGGLE_CONFIRM })}
                isLoading={loading}
              >
                {`Confirm navigation${
                  nameToDelete ? ` '${nameToDelete}' ` : ""
                }deleting, please.`}
              </DeleteConfirmationModalContent>
            </Fade>
          )}
          {revisionIsOpened && (
            <Fade in={revisionIsOpened}>
              <RevisionTable
                title="Revision navigation"
                onClose={() => dispatch({ type: TOGGLE_REVISION_OPENED })}
                requestType="navigation"
                itemId={revisionItemId}
              />
            </Fade>
          )}
          {secondaryModalIsOpened && (
            <Fade in={secondaryModalIsOpened}>
              <PlaylistReorderTable
                data={secondaryModalContent}
                loading={loading}
                onClose={() => {
                  dispatch({ type: TOGGLE_SECONDARY_MODAL });
                }}
                getPage={getPlaylists}
                onChangeOrder={(id_playlist, type, positionEntityId) => {
                  dispatch({ type: REQUEST });
                  axiosInstance
                    .post(
                      `/navigations/${secondaryModalContent.id}/order-playlists`,
                      {
                        id_playlist,
                        type,
                        positionEntityId
                      }
                    )
                    .then(() => getPlaylists())
                    .catch(error => {
                      dispatch({
                        type: REQUEST_ERROR,
                        payload:
                          error?.response?.data?.message ||
                          MESSAGES.couldntReadFromError
                      });
                      return notificationRef?.current?.showNotification();
                    });
                }}
              />
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
        addButtonText="+ Add new navigation"
        orderUrl="/navigations/order"
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
        getPage={getPage}
        isLoading={loading}
        secondaryControlComponents={
          <ProjectSelect
            labelText="Project"
            id="project"
            formControlProps={{
              className: classes.selectProjectContainer
            }}
            value={currentProject}
            onChange={({ target }) => {
              setCurrentProject(target.value);
            }}
            inputProps={{
              type: "text",
              name: "project"
            }}
          />
        }
      />
    </>
  );
};

NavigationTab.propTypes = {
  allowEdit: bool
};

export default NavigationTab;
