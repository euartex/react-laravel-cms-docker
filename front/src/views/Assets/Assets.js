import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useReducer,
  useContext
} from "react";
import { format } from "date-fns";
import { bool } from "prop-types";
import axios from "axios";
import findIndex from "lodash.findindex";
import min from "lodash.min";
import max from "lodash.max";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import ClipboardIcon from 'react-clipboard-icon'
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";
import Info from "@material-ui/icons/Info";
import Publish from "@material-ui/icons/Publish";
import DoneIcon from "@material-ui/icons/Done";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import DescriptionIcon from "@material-ui/icons/Description";

// @material-ui/core components
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Backdrop from "@material-ui/core/Backdrop";
import Modal from "@material-ui/core/Modal";
import Fade from "@material-ui/core/Fade";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import { CircularProgress } from "@material-ui/core";

import Button from "components/CustomButtons/Button.js";
import PopupNotification from "components/PopupNotification/PopupNotification.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Table from "components/Table/Table.js";
import DeleteConfirmationModalContent from "components/DeleteConfirmationModalContent";
import AssetForm from "./AssetForm.js";
import ProjectSelect from "components/ProjectSelect/ProjectSelect";
import PublishModal from "./PublishModal.js";
import RevisionTable from "components/RevisionTable/RevisionTable.js";

import { DEFAULT_LIMIT } from "constants/request";
import MESSAGES from "constants/notificationMessages";
import axiosInstance from "config/axiosInstance";
import { convertToFormData } from "helpers/convertToFormData";
import Context from "helpers/context";
import {
  formatDateMMDDYYYYwithTime,
  makeDateDueSafariIssue
} from "helpers/formatHelper";

import {
  // mockedAssets
  tableHeaderCells,
  defaultSorting,
  defaultSortingOrder
} from "./mockedData.js";

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
  TOGGLE_SECONDARY_MODAL
} from "../viewReducer/actionTypes";
import reducer from "../viewReducer/reducer";

import {
  dangerColor,
  primaryColor,
  successColor,
  infoColor,
  defaultFont,
  grayColor
} from "assets/jss/material-dashboard-react.js";

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  },
  modal: {
    overflow: "scroll"
  },
  publish: {
    color: successColor[0]
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
  draft: {
    color: grayColor[0]
  },
  tableCell: {
    ...defaultFont,
    lineHeight: "1.42857143",
    padding: "12px 8px",
    verticalAlign: "middle",
    fontSize: "0.8125rem"
  },
  tableBodyRow: {
    height: "48px",
    color: "inherit",
    display: "table-row",
    outline: "none",
    verticalAlign: "middle",
    cursor: "pointer"
  },
  deleteAll: {
    boxShadow: "none !important"
  },
  spinner: {
    color: primaryColor[0]
  },
  selectProjectContainer: {
    paddingBottom: 0,
    minWidth: "65px"
  }
};

const useStyles = makeStyles(styles);
let excludedIds = [];
const optionAll = { value: 0, label: "All" };
const INITIAL_FORM = {
  id: null,
  title: null,
  description: null,
  long_description: null,
  project_id: 0,
  tag_ids: [],
  poster: null,
  cover: null,
  path_mezaninne: null,
  status: null,
  // midRollCuepoint: "",
  seo_title: null,
  seo_description: null,
  seo_url: null,
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
  message: "",
  confirmIsOpened: false,
  idToDelete: null,
  revisionIsOpened: false,
  secondaryModalIsOpened: false,
  secondaryModalContent: null,
  revisionItemId: null
};

const CancelToken = axios.CancelToken;
let source = CancelToken.source();

const AssetsPage = ({ allowEdit }) => {
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
    savedForm,
    confirmIsOpened,
    idToDelete,
    revisionIsOpened,
    secondaryModalIsOpened,
    secondaryModalContent,
    revisionItemId,
    nameToDelete
  } = state;

  const [currentProject, setCurrentProject] = useState(optionAll.value);
  const [companyOptions, setCompanyOptions] = useState([]);
  const [progressVideo, setProgress] = useState(0);

  const { projects: projectOptions } = useContext(Context);

  const notificationRef = useRef(null);

  const [selectedRows, setSelectedRows] = useState([]);
  const [isShiftHolden, setShiftHold] = useState(false);

  const handleKeyDown = event => {
    if (event.key === "Shift") {
      setShiftHold(true);
    }
  };

  const handleKeyUp = event => {
    if (event.key === "Shift") {
      setShiftHold(false);
    }
  };

  // This function doesn't allow highlight and select text like while selecting text mode with a mouse
  const handleSelection = () => {
    document.onselectstart = function() {
      return false;
    };
  };

  useEffect(() => {
    axiosInstance
      .get("/companies/accessible-list?limit=10000")
      .then(response => {
        setCompanyOptions(response.data.data);
      })
      .catch(error => {
        dispatch({
          type: REQUEST_ERROR,
          payload: error.response?.data?.message
        });
        return notificationRef?.current?.showNotification();
      });

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("load", handleSelection);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("load", handleSelection);
    };
  }, []);

  const getPage = (excludeIds = null) => {
    // Add ids to excludedIds const
    if (excludeIds) {
      excludedIds = [...excludedIds, ...excludeIds];
    }

    axiosInstance
      .get(
        `/assets?type_arr[0]=video&limit=${limit}&page=${page}${
          currentProject ? "&project_id=" + currentProject : ""
        }&q=${searchString}&excludeIds=${excludedIds}`
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
        dispatch({ type: REQUEST_SUCCESS, payload: { data: [] } });
        return notificationRef?.current?.showNotification();
      });
  };

  useEffect(() => {
    dispatch({ type: REQUEST });
    getPage();
  }, [page, limit, searchString, currentProject]);

  // eslint-disable-next-line no-unused-vars
  const onSortClick = values => {
    //TODO: implement sorting when server ready
    // const { sortBy, orderBy } = values;
  };

  //TODO: uncomment when server ready
  // const handleEdit = ({ id }) => {
  const handleEdit = id => {
    axiosInstance.get(`/assets/${id}`).then(res => {
      const asset = res?.data?.data;
      dispatch({
        type: EDIT_FORM,
        payload: {
          ...asset,
          tag_ids: asset?.tags.map(tag => tag?.id)
        }
      });

      dispatch({
        type: SAVE_FORM,
        payload: {
          ...asset,
          tag_ids: asset?.tags.map(tag => tag?.id)
        }
      });
      dispatch({ type: OPEN_FORM });
    });
  };

  const handleVideoUpload = ({ target }) => {
    if (!target?.files?.[0]) {
      source.cancel("Operatation was canceled by user");
      source = CancelToken.source();
      return;
    }
    const config = {
      onUploadProgress: function(progressEvent) {
        setProgress((progressEvent.loaded * 100) / progressEvent.total);
      },
      timeout: 0, // don't work without timeout
      cancelToken: source.token
    };
    let data = new FormData();
    data.append("video", target?.files?.[0]);
    axiosInstance.post(
      `/assets/${form.id}/mezanine/upload/video`,
      data,
      config
    );
  };

  const dataTable = useCallback(() => {
    return pageData.map(asset => {
      const {
        title,
        id,
        created_at,
        start_on,
        end_on,
        description,
        project_id,
        company_id,
        vdms_id,
        is_vdms_deleted,
        status
      } = asset;
      const startDate = start_on ? start_on.split(" ")[0].split("-") : "";
      const endDate = end_on ? start_on.split(" ")[0].split("-") : "";

      return {
        id: id,
        cells: [
          title,
          (
            <Tooltip id="tooltip-top-start" title="Copy title" placement="top">
              <IconButton
                  aria-label="Copy title"
                  className={classes.tableActionButton}
                  onClick={event => {
                    event.stopPropagation();
                  }}
              >
                <CopyToClipboard
                  text={title}
                  onCopy={() => {
                      dispatch({
                        type: SET_MESSAGE,
                        payload: {
                          messageStatus: "success",
                          message: 'The selected title has been copied!'
                        }
                      });
                    return notificationRef?.current?.showNotification();
                    }
                  }
                >
                  <ClipboardIcon
                      size={18}
                  />
              </CopyToClipboard>
              </IconButton>
            </Tooltip>
          ),
          created_at ? formatDateMMDDYYYYwithTime(created_at) : "",
          startDate ? `${startDate[1]}-${startDate[2]}-${startDate[0]}` : "",
          endDate ? `${endDate[1]}-${endDate[2]}-${endDate[0]}` : "",
          description,
          project_id &&
          projectOptions.find(project => project.id === project_id)
            ? projectOptions.find(project => project.id === project_id).name
            : "",
          company_id &&
          companyOptions.find(company => company.id === company_id)
            ? companyOptions.find(company => company.id === company_id).name
            : "",
          (
              <Tooltip id="tooltip-top-start" title="Copy VDMS Id" placement="top">
                <IconButton
                    aria-label="Copy VDMS Id"
                    className={classes.tableActionButton}
                    onClick={event => {
                      event.stopPropagation();
                    }}
                >
                  <CopyToClipboard
                      text={vdms_id}
                      onCopy={() => {
                        dispatch({
                          type: SET_MESSAGE,
                          payload: {
                            messageStatus: "success",
                            message: 'The selected VDMS Id has been copied!'
                          }
                        });
                        return notificationRef?.current?.showNotification();
                      }
                      }
                  >
                    <ClipboardIcon
                        size={18}
                    />
                  </CopyToClipboard>
                </IconButton>
              </Tooltip>
          ),
          vdms_id &&
          is_vdms_deleted
            ? <span className={classes.delete}>{vdms_id}</span>
            : <span>{vdms_id}</span>,
          <>
            {status === "published" && (
              <Tooltip id="tooltip-top-start" title="Published" placement="top">
                <DoneIcon className={classes.publish} />
              </Tooltip>
            )}
            {status === "uploading" && (
              <Tooltip id="tooltip-top-start" title="Uploading" placement="top">
                <ImportExportIcon className={classes.revision} />
              </Tooltip>
            )}
            {status === "draft" && (
              <Tooltip id="tooltip-top-start" title="Draft" placement="top">
                <DescriptionIcon className={classes.draft} />
              </Tooltip>
            )}
          </>,
          allowEdit ? (
            <>
              {status === "draft" && (
                <Tooltip id="tooltip-top-start" title="Publish" placement="top">
                  <IconButton
                    aria-label="Info"
                    className={classes.tableActionButton}
                    onClick={event => {
                      event.stopPropagation();
                      dispatch({
                        type: TOGGLE_SECONDARY_MODAL,
                        payload: asset
                      });
                    }}
                  >
                    <Publish
                      className={
                        classes.tableActionButtonIcon + " " + classes.publish
                      }
                    />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip id="tooltip-top" title="Edit" placement="top">
                <IconButton
                  aria-label="Edit"
                  className={classes.tableActionButton}
                  onClick={event => {
                    event.stopPropagation();
                    handleEdit(id);
                  }}
                >
                  <Edit
                    className={
                      classes.tableActionButtonIcon + " " + classes.edit
                    }
                  />
                </IconButton>
              </Tooltip>
              <Tooltip id="tooltip-top-start" title="Delete" placement="top">
                <IconButton
                  aria-label="Close"
                  className={classes.tableActionButton}
                  onClick={event => {
                    event.stopPropagation();
                    dispatch({
                      type: TOGGLE_CONFIRM,
                      payload: { id, name: title }
                    });
                  }}
                >
                  <Close
                    className={
                      classes.tableActionButtonIcon + " " + classes.delete
                    }
                  />
                </IconButton>
              </Tooltip>
              <Tooltip id="tooltip-top-start" title="Revision" placement="top">
                <IconButton
                  aria-label="Info"
                  className={classes.tableActionButton}
                  onClick={event => {
                    event.stopPropagation();
                    dispatch({ type: TOGGLE_REVISION_OPENED, payload: id });
                  }}
                >
                  <Info
                    className={
                      classes.tableActionButtonIcon + " " + classes.revision
                    }
                  />
                </IconButton>
              </Tooltip>
            </>
          ) : null
        ]
      };
    });
  }, [pageData]);

  const onDeleteRows = () => {
    axiosInstance
      .delete("/assets", { data: { ids: selectedRows.map(row => row.id) } })
      .then(() => {
        dispatch({
          type: SET_MESSAGE,
          payload: {
            messageStatus: "success",
            message: "Selected rows will be deleted"
          }
        });
        setSelectedRows([]);
        //setTimeout(() => {
        dispatch({ type: TOGGLE_CONFIRM });
        getPage(selectedRows.map(row => row.id));
        //}, 1000);
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

  const handleDelete = () => {
    if (selectedRows.length && !nameToDelete) {
      onDeleteRows();
      return;
    }
    axiosInstance
      .delete("/assets", { data: { ids: [idToDelete] } })
      .then(() => {
        dispatch({
          type: SET_MESSAGE,
          payload: {
            messageStatus: "success",
            message: MESSAGES.deleted("Asset")
          }
        });
        setSelectedRows(selectedRows.filter(({ id }) => id !== idToDelete));
        //setTimeout(() => {
        dispatch({ type: TOGGLE_CONFIRM });
        getPage();
        //}, 1000);
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

  const handlePublish = () => {
    axiosInstance
      .put(`/assets/${secondaryModalContent.id}`, { status: "published" })
      .then(() => {
        dispatch({
          type: SET_MESSAGE,
          payload: {
            messageStatus: "success",
            message: `Asset "${secondaryModalContent.id}" was published`
          }
        });
        setTimeout(() => {
          dispatch({ type: TOGGLE_SECONDARY_MODAL });
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
        setTimeout(() => dispatch({ type: TOGGLE_SECONDARY_MODAL }), 1000);
        return notificationRef?.current?.showNotification();
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

  const submitForm = () => {
    if (loading) return;

    const handleFormSubmitResponse = () => {
      dispatch({
        type: SUBMIT_FORM_SUCCES,
        payload: savedForm ? MESSAGES.updated("Asset") : MESSAGES.added("Asset")
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

    /**
     * Create
     */
    if (!savedForm) {
      /**
       * Format for asset create fields
       */
      Object.entries(form).forEach(([key, val]) => {
        !val && delete form[key];

        if ((key === "start_on" || key === "end_on") && val)
          form[key] = format(
            makeDateDueSafariIssue(val),
            "yyyy-MM-dd hh:mm:ss"
          );
      });

      /**
       * Send post
       */
      axiosInstance
        .post("/assets", convertToFormData(form))
        .then(handleFormSubmitResponse)
        .catch(handleFormSubmitError);
    } else {
      let changedFields = { _method: "PUT" };

      Object.keys(form).forEach(key => {
        if (key === "id" || !form[key]) return;
        if (form[key] !== savedForm[key]) {
          if (key === "start_on" || key === "end_on") {
            changedFields[key] = format(
              makeDateDueSafariIssue(form[key]),
              "yyyy-MM-dd hh:mm:ss"
            );
          } else {
            changedFields[key] = form[key];
          }
        }
      });
      axiosInstance
        .post(`assets/${form.id}`, convertToFormData(changedFields))
        .then(handleFormSubmitResponse)
        .catch(handleFormSubmitError);
    }
  };

  const onSelectRow = prop => {
    if (allowEdit) {
      if (isShiftHolden) {
        let minId = findIndex(
          pageData,
          item => item.id === min(selectedRows.map(({ id }) => id))
        );
        const maxId = pageData.map(row => row.id).indexOf(prop.id);

        if (maxId < minId) {
          minId = findIndex(pageData, item => {
            return item.id === max(selectedRows.map(({ id }) => id));
          });
          setSelectedRows(
            pageData
              .slice(maxId, minId + 1)
              .map(({ id, title }) => ({ id, title }))
          );
          return;
        }

        setSelectedRows(
          pageData
            .slice(minId, maxId + 1)
            .map(({ id, title }) => ({ id, title }))
        );
      } else {
        setSelectedRows(prevSelected =>
          prevSelected.find(({ id }) => prop.id === id)
            ? prevSelected.filter(({ id }) => id !== prop.id)
            : [...prevSelected, prop]
        );
      }
    }
  };

  return (
    <div>
      <PopupNotification
        ref={notificationRef}
        status={messageStatus}
        message={message}
      />

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={confirmIsOpened || formIsOpened || revisionIsOpened}
        onClose={() => {
          dispatch({ type: CLOSE_FORM });
          dispatch({ type: RESET_FORM, payload: INITIAL_FORM });
        }}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <>
          {formIsOpened && (
            <Fade in={formIsOpened}>
              <AssetForm
                isEdit={!!savedForm}
                open={true}
                progressProp={progressVideo}
                onSubmit={() => {
                  submitForm();
                  dispatch({ type: CLOSE_FORM });
                  dispatch({ type: RESET_FORM, payload: INITIAL_FORM });
                }}
                dataForm={form}
                handleChange={({ target }) => {
                  dispatch({ type: CHANGE_FORM, payload: target });
                }}
                onClose={() => {
                  dispatch({ type: CLOSE_FORM });
                  dispatch({ type: RESET_FORM, payload: INITIAL_FORM });
                }}
                isLoading={loading}
                handleMultiSelectChange={handleMultiSelectChange}
                handleVideoUpload={handleVideoUpload}
              />
            </Fade>
          )}
          {confirmIsOpened && (
            <Fade in={confirmIsOpened}>
              <DeleteConfirmationModalContent
                title={`Delete asset${
                  selectedRows.length && !nameToDelete ? "s" : ""
                }`}
                onConfirm={handleDelete}
                onClose={() => dispatch({ type: TOGGLE_CONFIRM })}
                isLoading={loading}
              >
                {" "}
                <>
                  {`Confirm asset${
                    selectedRows.length && !nameToDelete
                      ? "s"
                      : ` '${nameToDelete}'`
                  } deleting, please`}
                  {!nameToDelete &&
                    selectedRows.map(row => (
                      <span key={row.id}>
                        <br />
                        {row.title}
                      </span>
                    ))}
                </>
              </DeleteConfirmationModalContent>
            </Fade>
          )}
          {revisionIsOpened && (
            <Fade in={revisionIsOpened}>
              <RevisionTable
                title="Revision asset"
                onClose={() => dispatch({ type: TOGGLE_REVISION_OPENED })}
                requestType="asset"
                itemId={revisionItemId}
              />
            </Fade>
          )}
        </>
      </Modal>

      <PublishModal
        open={secondaryModalIsOpened}
        onClose={() => dispatch({ type: TOGGLE_SECONDARY_MODAL })}
        onConfirm={() => handlePublish()}
        item={{
          id: secondaryModalContent?.id,
          name: secondaryModalContent?.title || ""
        }}
      />

      <GridContainer>
        <GridItem xs={12} sm={12} md={12} lg={12}>
          <>
            <Table
              onAddClick={() => dispatch({ type: OPEN_FORM })}
              tableHeaderColor="info"
              rowsPerPage={limit}
              page={page}
              count={total}
              isAddItem={allowEdit}
              addButtonText="+ New asset"
              rowsPerPageOptions={[20, 50, 100, 250]}
              onPageChange={newPage => {
                dispatch({ type: SET_PAGE, payload: newPage });
              }}
              onChangeRowsPerPage={newRowsPerPage =>
                dispatch({ type: SET_LIMIT, payload: +newRowsPerPage })
              }
              isLoading={loading}
              onSearch={({ target }) => {
                dispatch({
                  type: SET_SEARCH_STRING,
                  payload: target.value
                });
              }}
              onClear={() => dispatch({ type: SET_SEARCH_STRING, payload: "" })}
              //TODO: change to tableHeaderCells when sorting will be ready
              tableHead={tableHeaderCells.map(cell => cell.label)}
              onSortClick={onSortClick}
              defaultSorting={defaultSorting}
              defaultSortingOrder={defaultSortingOrder}
              secondaryControlComponents={
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
              }
              deleteRowsComponent={
                allowEdit ? (
                  <Button
                    type="button"
                    onClick={() =>
                      dispatch({
                        type: TOGGLE_CONFIRM
                      })
                    }
                    color="danger"
                    disabled={!selectedRows.length}
                    className={classes.deleteAll}
                  >
                    Delete selected rows
                  </Button>
                ) : null
              }
              deleteRows={allowEdit}
              isSelectable={true}
              TableBodyComponent={() => (
                <TableBody>
                  {dataTable().map(prop => (
                    <TableRow
                      key={prop.id}
                      className={classes.tableBodyRow}
                      selected={!!selectedRows.find(row => row.id === prop.id)}
                      onClick={() => {
                        onSelectRow({
                          id: prop.id,
                          title: prop?.cells?.[0]
                        });
                      }}
                    >
                      {prop.cells.map((cell, key) => (
                        <TableCell className={classes.tableCell} key={key}>
                          {cell}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}

                  {loading && (
                    <TableRow>
                      <TableCell
                        align="center"
                        colSpan={tableHeaderCells.length}
                      >
                        <CircularProgress
                          color="primary"
                          className={classes.spinner}
                        />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              )}
            />
          </>
        </GridItem>
      </GridContainer>
    </div>
  );
};

AssetsPage.propTypes = {
  allowEdit: bool
};

export default AssetsPage;
