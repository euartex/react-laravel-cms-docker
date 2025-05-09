import React, {
  useEffect,
  useCallback,
  useReducer,
  useRef,
  useState
} from "react";
import { bool } from "prop-types";

import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";
import Info from "@material-ui/icons/Info";
import LowPriorityIcon from "@material-ui/icons/LowPriority";

import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { makeStyles } from "@material-ui/core/styles";

import DeleteConfirmationModalContent from "components/DeleteConfirmationModalContent";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import PopupNotification from "components/PopupNotification/PopupNotification.js";
import Table from "components/Table/Table";
import RevisionTable from "components/RevisionTable/RevisionTable.js";
import AddPlaylistForm from "./AddPlaylistForm";
import PlaylistAssetReorderTable from "./PlaylistAssetReorderTable";
import TopIcon from "components/Icons/TopIcon";

import axiosInstance from "config/axiosInstance";
import { convertToFormData } from "helpers/convertToFormData";
import { convertDataToOptions } from "helpers/convertDataToOptions";
import MESSAGES from "constants/notificationMessages";

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
  dangerColor,
  primaryColor,
  infoColor,
  successColor,
  warningColor
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
  revision: {
    color: infoColor[3]
  },
  reorder: {
    color: successColor[0]
  },
  isTop: {
    display: "flex",
    alignItems: "center"
  }
};

const useStyles = makeStyles(styles);

const INITIAL_FORM = {
  id: "",
  name: "",
  description: "",
  project_id: "",
  metadata_tag: [],
  assets: [],
  poster: null,
  cover: null,
  playlist_id: "",
  slug: ""
};

const initialState = {
  loading: false,
  errorMessage: "",
  pageData: null,
  page: 1,
  limit: 20,
  total: 0,
  searchString: "",
  formIsOpened: false,
  savedForm: null,
  form: INITIAL_FORM,
  formSubmitMessage: "",
  messageStatus: "success",
  message: "Something happens",
  confirmIsOpened: false,
  revisionIsOpened: false,
  idToDelete: null,
  revisionItemId: null
};
const TABLE_HEADER = ["Name", "Description", "Top playlist", ""];

const Playlists = ({ allowEdit }) => {
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
    revisionIsOpened,
    idToDelete,
    secondaryModalIsOpened,
    secondaryModalContent,
    revisionItemId,
    nameToDelete
  } = state;

  const notificationRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [topList, setTopPlaylist] = useState(null);

  const handleEdit = id => {
    axiosInstance.get(`/playlists/${id}`).then(res => {
      const {
        description,
        name,
        project,
        meta_tags,
        assets,
        poster,
        cover,
        is_top,
        playlist_id,
        slug
      } = res?.data?.data[0];
      const asset_ids = (assets || []).map(asset => asset.id);
      dispatch({
        type: EDIT_FORM,
        payload: {
          name,
          description,
          tag_ids: convertDataToOptions(meta_tags),
          project_id: project?.id,
          id,
          asset_ids,
          poster,
          slug,
          cover,
          is_top,
          playlist_id
        }
      });

      dispatch({
        type: SAVE_FORM,
        payload: {
          name,
          description,
          tag_ids: (meta_tags || []).map(tag => tag.id),
          project_id: project?.id,
          id,
          asset_ids,
          poster,
          cover,
          is_top,
          playlist_id,
          slug
        }
      });
      dispatch({ type: OPEN_FORM });
    });
  };

  const handleMultiSelectChange = ({ target }, name) => {
    dispatch({
      type: "CHANGE_FORM",
      payload: {
        name,
        value: [...target.value.map(item => (item.value ? item.value : item))]
      }
    });
  };

  const handleDelete = () => {
    axiosInstance
      .delete(`/playlists/${idToDelete}`)
      .then(() => {
        dispatch({
          type: SET_MESSAGE,
          payload: {
            messageStatus: "success",
            message: MESSAGES.deleted("Playlist")
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
          payload:
            error?.response?.data?.message || MESSAGES.couldntReadFromError
        });
        setTimeout(() => dispatch({ type: TOGGLE_CONFIRM }), 1000);
        return notificationRef?.current?.showNotification();
      });
  };

  const dataTable = useCallback(() => {
    return (pageData || []).map(playlist => {
      const { name, description, id, is_top } = playlist;
      return [
        name,
        description,
        is_top ? (
          <div className={classes.isTop}>
            <TopIcon color={warningColor[1]} />
          </div>
        ) : (
          ""
        ),
        allowEdit ? (
          <div key={id} style={{ textAlign: "right" }}>
            <Tooltip
              id="tooltip-top"
              title="Edit Playlist"
              placement="top"
              onClick={() => handleEdit(id)}
            >
              <IconButton aria-label="Edit" className={classes.edit}>
                <Edit />
              </IconButton>
            </Tooltip>
            {topList?.id !== id && (
              <Tooltip
                id="tooltip-top-start"
                title="Remove"
                placement="top"
                onClick={() =>
                  dispatch({ type: TOGGLE_CONFIRM, payload: { id, name } })
                }
              >
                <IconButton aria-label="Close" className={classes.delete}>
                  <Close />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip
              id="tooltip-top"
              title="Order assets"
              placement="top"
              onClick={() => handleOpenPlaylistOrderModal({ id, name })}
            >
              <IconButton aria-label="Order assets">
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
      ];
    });
  }, [pageData]);

  const getPage = () => {
    axiosInstance
      .get(
        `/playlists?limit=${limit}&page=${page}&q=${searchString}&without_relations=true`
      )
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

  const getTopPlaylist = () => {
    axiosInstance
      .get(`/playlists?is_top=true`)
      .then(response => {
        setTopPlaylist(response?.data?.data?.[0]);
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
    getTopPlaylist();
  }, [page, limit, searchString]);

  const submitForm = () => {
    if (loading) return;
    const handleFormSubmitResponse = isChanged => {
      dispatch({
        type: SUBMIT_FORM_SUCCES,
        payload: isChanged
          ? MESSAGES.updated("Playlist")
          : MESSAGES.added("Playlist")
      });

      dispatch({ type: CLOSE_FORM });
      dispatch({ type: RESET_FORM, payload: INITIAL_FORM });

      getPage();
      getTopPlaylist();
      return notificationRef.current?.showNotification();
    };

    const handleFormSubmitError = error => {
      dispatch({ type: SUBMIT_FORM_ERROR, payload: error.response.data });
      return notificationRef.current?.showNotification();
    };

    dispatch({ type: REQUEST });

    if (!savedForm) {
      const trusyFields = {};
      Object.keys(form).forEach(key => {
        if (key === "tag_ids") {
          trusyFields[key] = form[key].map(tag => tag.value);
        } else {
          if (form[key]) trusyFields[key] = form[key];
        }
      });
      axiosInstance
        .post("playlists", convertToFormData(trusyFields))
        .then(() => handleFormSubmitResponse(false))
        .catch(handleFormSubmitError);
    } else {
      let changedFields = { _method: "PUT" };
      Object.keys(savedForm).forEach(key => {
        if (key === "id") return;
        if (key === "tag_ids") {
          changedFields[key] = form[key].map(tag => tag.value);
        } else if (form[key] !== savedForm[key]) {
          changedFields[key] = form[key];
        }
      });
      changedFields.asset_ids = form.asset_ids;
      axiosInstance
        .post(`playlists/${savedForm.id}`, convertToFormData(changedFields))
        .then(handleFormSubmitResponse)
        .catch(handleFormSubmitError);
    }
  };

  const getAssets = () => {
    axiosInstance
      .get(`/playlists/${secondaryModalContent?.id}`)
      .then(res => {
        dispatch({
          type: SET_SECONDARY_MODAL_CONTENT,
          payload: {
            id: secondaryModalContent?.id,
            name: secondaryModalContent?.name,
            assets: res.data.data?.[0].assets
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
      })
      .finally(() => setIsLoading(false));
  };

  const handleOpenPlaylistOrderModal = ({ id, name }) => {
    axiosInstance
      .get(`/playlists/${id}`)
      .then(res => {
        dispatch({
          type: TOGGLE_SECONDARY_MODAL,
          payload: { id: id, name: name, assets: res.data.data?.[0].assets }
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

  const modalIsOpened =
    formIsOpened ||
    confirmIsOpened ||
    revisionIsOpened ||
    secondaryModalIsOpened;

  return (
    <CustomTabs
      headerColor="info"
      tabs={[
        {
          tabName: "Playlists",
          tabContent: (
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
                open={modalIsOpened || false}
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
                      <AddPlaylistForm
                        isEditMode={savedForm}
                        submitForm={submitForm}
                        dataForm={form}
                        topList={topList}
                        handleMultiSelectChange={handleMultiSelectChange}
                        handleChange={({ target }) => {
                          dispatch({ type: CHANGE_FORM, payload: target });
                        }}
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
                        title="Delete playlist"
                        onConfirm={handleDelete}
                        onClose={() => dispatch({ type: TOGGLE_CONFIRM })}
                      >
                        {`Confirm playlist${
                          nameToDelete ? ` '${nameToDelete}' ` : ""
                        }deleting, please.`}
                      </DeleteConfirmationModalContent>
                    </Fade>
                  )}
                  {revisionIsOpened && (
                    <Fade in={revisionIsOpened}>
                      <RevisionTable
                        title="Revision playlist"
                        onClose={() =>
                          dispatch({ type: TOGGLE_REVISION_OPENED })
                        }
                        requestType="playlist"
                        itemId={revisionItemId}
                      />
                    </Fade>
                  )}
                  {secondaryModalIsOpened && (
                    <Fade in={secondaryModalIsOpened}>
                      <PlaylistAssetReorderTable
                        data={secondaryModalContent}
                        onClose={() => {
                          dispatch({ type: TOGGLE_SECONDARY_MODAL });
                        }}
                        getPage={getAssets}
                        onChangeOrder={(id_asset, type, positionEntityId) => {
                          setIsLoading(true);
                          axiosInstance
                            .post(
                              `/playlists/${secondaryModalContent.id}/order-assets`,
                              {
                                id_asset,
                                type,
                                positionEntityId
                              }
                            )
                            .then(() => getAssets())
                            .catch(error => {
                              setIsLoading(false);
                              dispatch({
                                type: SET_MESSAGE,
                                payload:
                                  error?.response?.data?.message ||
                                  MESSAGES.couldntReadFromError
                              });
                              return notificationRef?.current?.showNotification();
                            });
                        }}
                        loading={isLoading}
                      />
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
                addButtonText="+ Add new playlist"
                rowsPerPage={limit}
                page={page}
                count={total}
                onPageChange={newPage =>
                  dispatch({ type: SET_PAGE, payload: newPage })
                }
                onChangeRowsPerPage={newRowsPerPage =>
                  dispatch({ type: SET_LIMIT, payload: +newRowsPerPage })
                }
                onSearch={({ target }) =>
                  dispatch({ type: SET_SEARCH_STRING, payload: target.value })
                }
                onClear={() =>
                  dispatch({ type: SET_SEARCH_STRING, payload: "" })
                }
              />
            </>
          )
        }
      ]}
    ></CustomTabs>
  );
};

Playlists.propTypes = {
  allowEdit: bool
};

export default Playlists;
