import React, {
  useCallback,
  useState,
  useEffect,
  useRef,
  useReducer
} from "react";
import { bool } from "prop-types";

// @material-ui/core components
import Backdrop from "@material-ui/core/Backdrop";
import Modal from "@material-ui/core/Modal";
import Fade from "@material-ui/core/Fade";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

// @material-ui/icons
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";

import { makeStyles } from "@material-ui/core/styles";

import Table from "components/Table/Table.js";
import PopupNotification from "components/PopupNotification/PopupNotification.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import DeleteConfirmationModalContent from "components/DeleteConfirmationModalContent";
import RoleForm from "./RoleForm.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import MESSAGES from "constants/notificationMessages";
import { DEFAULT_LIMIT } from "constants/request";
import axiosInstance from "config/axiosInstance.js";
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
  actionContainer: {
    textAlign: "right"
  },
  edit: {
    color: primaryColor[0]
  }
};

const useStyles = makeStyles(styles);

const INITIAL_FORM = {
  id: "",
  newRoleName: "",
  checkedPermissions: []
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

const RolesPage = ({ allowEdit }) => {
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
    nameToDelete
  } = state;

  const [permissions, setPermissions] = useState([]);
  const notificationRef = useRef(null);

  useEffect(() => {
    axiosInstance
      .get("/roles/permissions")
      .then(res => {
        setPermissions(res.data.data);
      })
      .catch(error => console.log(error));
  }, []);

  useEffect(() => {
    dispatch({ type: REQUEST });
    getPage();
  }, [page, limit, searchString]);

  const handleEdit = id => {
    axiosInstance
      .get(`roles/${id}`)
      .then(res => {
        const {
          name: newRoleName,
          permissions: checkedPermissions
        } = res.data.data;
        dispatch({
          type: EDIT_FORM,
          payload: {
            id,
            newRoleName,
            checkedPermissions: checkedPermissions
          }
        });

        dispatch({
          type: SAVE_FORM,
          payload: {
            id,
            newRoleName,
            checkedPermissions: checkedPermissions
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

  const dataTable = useCallback(() => {
    return pageData.map(role => {
      const { name, id } = role;
      return [
        name,
        allowEdit ? (
          <>
            <div className={classes.actionContainer}>
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
                    dispatch({ type: TOGGLE_CONFIRM, payload: { id, name } });
                  }}
                  color="secondary"
                >
                  <Close
                    className={
                      classes.tableActionButtonIcon + " " + classes.close
                    }
                  />
                </IconButton>
              </Tooltip>
            </div>
          </>
        ) : (
          ""
        )
      ];
    });
  }, [pageData]);

  const getPage = () => {
    axiosInstance
      .get(`/roles?limit=${limit}&page=${page}&q=${searchString}`)
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

  const handleDelete = () => {
    dispatch({ type: REQUEST });

    axiosInstance
      .delete(`/roles/${idToDelete}`)
      .then(() => {
        dispatch({
          type: SET_MESSAGE,
          payload: {
            messageStatus: "success",
            message: MESSAGES.deleted("Role")
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

  const submitForm = () => {
    if (loading) return;
    const handleFormSubmitResponse = isUpdated => {
      dispatch({
        type: SUBMIT_FORM_SUCCES,
        payload: isUpdated
          ? MESSAGES.updated(form.newRoleName || "Role")
          : MESSAGES.added("Role")
      });

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

    const extendPermissionsForRequest = data => {
      return data.map(checkedPerm => {
        return {
          permission_id: checkedPerm.id,
          allow: true
        };
      })
      
    }

    if (!savedForm) {
      axiosInstance
        .post(
          "/roles",
          {
            name: form.newRoleName,
            permissions: extendPermissionsForRequest(form.checkedPermissions)
          },
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        )
        .then(() => handleFormSubmitResponse(false))
        .catch(handleFormSubmitError);
    } else {
      axiosInstance
        .post(`/roles/${savedForm.id}`, {
          name: form.newRoleName,
          permissions: extendPermissionsForRequest(form.checkedPermissions),
          _method: "PUT"
        })
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
        open={confirmIsOpened || formIsOpened}
        onClose={() => {
          dispatch({ type: CLOSE_FORM });
          dispatch({ type: RESET_FORM, payload: INITIAL_FORM });
        }}
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <>
          {formIsOpened && (
            <Fade in={formIsOpened}>
              <RoleForm
                onClose={() => {
                  dispatch({ type: CLOSE_FORM });
                  dispatch({ type: RESET_FORM, payload: INITIAL_FORM });
                }}
                handleChange={({ target }) =>
                  dispatch({ type: CHANGE_FORM, payload: target })
                }
                handleSubmit={submitForm}
                dataForm={form}
                isLoading={loading}
                permissions={permissions}
              />
            </Fade>
          )}

          {confirmIsOpened && (
            <Fade in={confirmIsOpened}>
              <DeleteConfirmationModalContent
                title="Delete role"
                onConfirm={handleDelete}
                onClose={() => dispatch({ type: TOGGLE_CONFIRM })}
                isLoading={loading}
              >
                {`Confirm role${
                  nameToDelete ? ` '${nameToDelete}' ` : ""
                }deleting, please.`}
              </DeleteConfirmationModalContent>
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
                tabName: "Roles",
                tabContent: (
                  <Table
                    tableHead={["Role", ""]}
                    tableData={dataTable()}
                    tableHeaderColor="info"
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
                    isAddItem={allowEdit}
                    addButtonText="+ Add new role"
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

RolesPage.propTypes = {
  allowEdit: bool
};

export default RolesPage;
