import React, {
  useState,
  useEffect,
  useRef,
  useReducer,
  useCallback,
  useContext
} from "react";
import { bool } from "prop-types";

import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";
import WarningIcon from "@material-ui/icons/Warning";

// @material-ui/core components
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Backdrop from "@material-ui/core/Backdrop";
import Modal from "@material-ui/core/Modal";
import Fade from "@material-ui/core/Fade";

import PopupNotification from "components/PopupNotification/PopupNotification.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import Table from "components/Table/Table.js";
import ProjectForm from "./ProjectForm.js";
import DeleteConfirmationModalContent from "components/DeleteConfirmationModalContent";

import axiosInstance from "config/axiosInstance";
import MESSAGES from "constants/notificationMessages";
import { DEFAULT_LIMIT } from "constants/request";
import Context from "helpers/context";

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
  TOGGLE_SECOND_CONFIRM
} from "../viewReducer/actionTypes";
import reducer from "../viewReducer/reducer";

import {
  primaryColor,
  dangerColor
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
  edit: {
    color: primaryColor[0]
  },
  warning: {
    color: dangerColor[0]
  },
  warningSize: {
    fontSize: "48px"
  },
  warningContainer: {
    textAlign: "center",
    marginBottom: "20px"
  }
};

const useStyles = makeStyles(styles);

const INITIAL_FORM = {
  id: "",
  newProjectName: "",
  companies: []
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
  secondConfirmIsOpened: false
};

const ProjectsPage = ({ allowEdit }) => {
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
    nameToDelete,
    secondConfirmIsOpened
  } = state;

  const [companyOptions, setCompanyOptions] = useState([]);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const notificationRef = useRef(null);
  const { getProjects } = useContext(Context);

  useEffect(() => {
    axiosInstance
      .get("/companies/accessible-list?limit=1000")
      .then(response => {
        setCompanyOptions(response.data.data);
      })
      .catch(error =>
        dispatch({
          type: REQUEST_ERROR,
          payload: error.response?.data?.message
        })
      );
  }, []);

  const handleEdit = ({ id }) => {
    axiosInstance
      .get(`/projects/${id}`)
      .then(response => {
        dispatch({
          type: EDIT_FORM,
          payload: {
            id: id,
            newProjectName: response.data.data?.[0].name,
            companies: response.data.data?.[0].companies.map(company => ({
              value: company.id,
              label: company.name
            }))
          }
        });

        dispatch({
          type: SAVE_FORM,
          payload: {
            id,
            newProjectName: response.data.data[0].name,
            companies: response.data.data[0].companies.map(company => ({
              value: company.id,
              label: company.name
            }))
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
        setTimeout(() => dispatch({ type: TOGGLE_CONFIRM }), 1000);
        return notificationRef?.current?.showNotification();
      });
  };

  const dataTable = useCallback(() => {
    return pageData.map(project => [
      project.name,
      allowEdit ? (
        <div style={{ textAlign: "right" }}>
          <Tooltip
            id="tooltip-top"
            title="Edit"
            placement="top"
            classes={{ tooltip: classes.tooltip }}
          >
            <IconButton
              aria-label="Edit"
              className={classes.tableActionButton}
              onClick={() => {
                handleEdit({
                  id: project.id
                });
              }}
            >
              <Edit
                className={classes.tableActionButtonIcon + " " + classes.edit}
              />
            </IconButton>
          </Tooltip>
          <Tooltip
            id="tooltip-top-start"
            title="Remove"
            placement="top"
            classes={{ tooltip: classes.tooltip }}
          >
            <IconButton
              aria-label="Close"
              className={classes.tableActionButton}
              onClick={() => {
                dispatch({
                  type: TOGGLE_CONFIRM,
                  payload: { id: project.id, name: project.name }
                });
              }}
              color="secondary"
            >
              <Close className={classes.tableActionButtonIcon} />
            </IconButton>
          </Tooltip>
        </div>
      ) : null
    ]);
  }, [pageData]);

  const getPage = () => {
    axiosInstance
      .get(`/projects?limit=${limit}&page=${page}&q=${searchString}`)
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

  useEffect(() => {
    dispatch({ type: REQUEST });
    getPage();
  }, [page, limit, searchString]);

  const handleDelete = () => {
    dispatch({
      type: REQUEST
    });
    axiosInstance
      .delete(`/projects/${projectToDelete}`)
      .then(() => {
        dispatch({
          type: SET_MESSAGE,
          payload: {
            messageStatus: "success",
            message: MESSAGES.deleted("Project")
          }
        });

        getProjects();

        setTimeout(() => {
          dispatch({ type: TOGGLE_SECOND_CONFIRM });
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
        setTimeout(() => dispatch({ type: TOGGLE_SECOND_CONFIRM }), 1000);
        return notificationRef?.current?.showNotification();
      })
      .finally(() => setProjectToDelete(null));
  };

  const submitForm = () => {
    if (loading) return;

    dispatch({ type: REQUEST });

    const handleFormSubmitResponse = isEdit => {
      if (loading) return;
      dispatch({
        type: SUBMIT_FORM_SUCCES,
        payload: isEdit
          ? MESSAGES.updated(form.newProjectName || "Project")
          : MESSAGES.added("Project")
      });

      getProjects();

      dispatch({ type: CLOSE_FORM });
      dispatch({ type: RESET_FORM, payload: INITIAL_FORM });

      getPage();
      return notificationRef?.current?.showNotification();
    };

    const handleFormSubmitError = error => {
      dispatch({ type: SUBMIT_FORM_ERROR, payload: error.response.data });
      return notificationRef?.current?.showNotification();
    };

    dispatch({ type: REQUEST });
    // new
    if (!savedForm) {
      axiosInstance
        .post("/projects", {
          name: form.newProjectName,
          company_arr: form.companies.map(company => company.value)
        })
        .then(() => handleFormSubmitResponse(false))
        .catch(handleFormSubmitError);
    } else {
      // edit
      let changedFields = {};
      Object.keys(savedForm).forEach(key => {
        if (key === "id") return;
        if (form[key] !== savedForm[key]) {
          if (key === "newProjectName") {
            changedFields.title = form[key];
          }
          changedFields[key] = form[key];
        }
      });
      axiosInstance
        .post(
          `/projects/${savedForm.id}`,
          {
            name: form.newProjectName,
            company_arr: changedFields.companies.map(company => company.value),
            _method: "PUT"
          },
        )
        .then(() => handleFormSubmitResponse(true))
        .catch(handleFormSubmitError);
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
        open={confirmIsOpened || formIsOpened || secondConfirmIsOpened}
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
          {confirmIsOpened && (
            <Fade in={confirmIsOpened}>
              <DeleteConfirmationModalContent
                title="Delete project"
                onConfirm={() => {
                  setProjectToDelete(idToDelete);
                  dispatch({ type: TOGGLE_CONFIRM });
                  dispatch({
                    type: TOGGLE_SECOND_CONFIRM
                  });
                }}
                onClose={() => dispatch({ type: TOGGLE_CONFIRM })}
                isLoading={loading}
              >
                {`Confirm project${
                  nameToDelete ? ` '${nameToDelete}' ` : ""
                }deleting, please.`}
              </DeleteConfirmationModalContent>
            </Fade>
          )}
          {secondConfirmIsOpened && (
            <Fade in={secondConfirmIsOpened}>
              <DeleteConfirmationModalContent
                title="Delete project"
                onConfirm={handleDelete}
                onClose={() => {
                  dispatch({ type: TOGGLE_SECOND_CONFIRM });
                }}
                isLoading={loading}
              >
                <div className={classes.warningContainer}>
                  <WarningIcon
                    fontSize="large"
                    color="primary"
                    classes={{
                      colorPrimary: classes.warning,
                      fontSizeLarge: classes.warningSize
                    }}
                  />
                </div>
                Are you 100% sure that you want to delete this project?
              </DeleteConfirmationModalContent>
            </Fade>
          )}
          {formIsOpened && (
            <Fade in={formIsOpened}>
              <ProjectForm
                title="Project"
                submitForm={submitForm}
                dataForm={form}
                handleChange={({ target }) =>
                  dispatch({ type: CHANGE_FORM, payload: target })
                }
                onClose={() => {
                  dispatch({ type: CLOSE_FORM });
                  dispatch({ type: RESET_FORM, payload: INITIAL_FORM });
                }}
                companyOptions={companyOptions.map(comp => ({
                  value: comp.id,
                  label: comp.name
                }))}
                isLoading={loading}
              />
            </Fade>
          )}
        </>
      </Modal>

      <GridContainer>
        <GridItem xs={12} sm={12} md={12} lg={12}>
          <CustomTabs
            headerColor="info"
            tabs={[
              {
                tabName: "Projects list",
                tabContent: (
                  <Table
                    tableHead={["Name", ""]}
                    tableData={dataTable()}
                    tableHeaderColor="info"
                    isAddItem={allowEdit}
                    addButtonText="+ Add new project"
                    onAddClick={() => dispatch({ type: OPEN_FORM })}
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
                      dispatch({
                        type: SET_SEARCH_STRING,
                        payload: target.value
                      })
                    }
                    onClear={() =>
                      dispatch({ type: SET_SEARCH_STRING, payload: "" })
                    }
                    isLoading={loading}
                  />
                )
              }
            ]}
          />
        </GridItem>
      </GridContainer>
    </div>
  );
};

ProjectsPage.propTypes = {
  allowEdit: bool
};

export default ProjectsPage;
