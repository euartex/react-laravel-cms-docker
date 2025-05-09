import React, { useReducer, useCallback, useEffect, useRef } from "react";

import Backdrop from "@material-ui/core/Backdrop";
import Modal from "@material-ui/core/Modal";
import Fade from "@material-ui/core/Fade";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";

import axiosInstance from "config/axiosInstance";
import Table from "components/Table/Table.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import DeviceForm from "./DeviceForm.js";

import { DEFAULT_LIMIT } from "constants/request";
import { CHANGE_VALUE, SET_MESSAGE } from "./actionTypes";
import reducer from "./reducer";

import PopupNotification from "components/PopupNotification/PopupNotification.js";

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
  }
};

const useStyles = makeStyles(styles);

const mockedDevices = [
  {
    id: 1,
    name: "Android"
  },
  {
    id: 2,
    name: "Apple TV"
  },
  {
    id: 3,
    name: "Fire TV"
  },
  {
    id: 4,
    name: "Android TV"
  },
  {
    id: 5,
    name: "Roku"
  },
  {
    id: 6,
    name: "iOS"
  }
];

const FORM_MODES = {
  NEW: "new",
  EDIT: "edit"
};

const INITIAL_STATE = {
  messageStatus: null,
  message: null,
  pagination: {},
  page: 1,
  limit: DEFAULT_LIMIT,
  isLoading: false,
  deviceList: [],
  searchKey: "",
  mode: null,
  currentDevice: {},
  changedDevice: null
};

export default function DevicePage() {
  const classes = useStyles();

  const notificationRef = useRef(null);

  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const {
    messageStatus,
    message,
    isLoading,
    pagination,
    page,
    limit,
    deviceList,
    searchKey,
    currentDevice,
    changedDevice,
    mode
  } = state;

  useEffect(() => {
    getPage();
  }, []);

  const handleFormSubmitResponse = () => {
    dispatch({
      type: SET_MESSAGE,
      payload: {
        message: "Device has been added succesfully",
        status: "success"
      }
    });
    setTimeout(
      () =>
        dispatch({
          type: CHANGE_VALUE,
          key: "mode",
          value: null
        }),
      1000
    );
    getPage();
    return notificationRef.current?.showNotification();
  };

  const handleFormSubmitError = error => {
    dispatch({
      type: SET_MESSAGE,
      payload: {
        message: error.response?.data?.message || "Error sending request",
        status: "danger"
      }
    });
    return notificationRef.current?.showNotification();
  };

  const submitForm = () => {
    if (!changedDevice) {
      axiosInstance
        .post("devices", currentDevice)
        .then(handleFormSubmitResponse)
        .catch(handleFormSubmitError);
    } else {
      let changedFields = {};
      Object.keys(changedDevice).forEach(key => {
        if ((key === "password" && currentDevice[key] === "") || key === "id")
          return;
        if (currentDevice[key] !== changedDevice[key]) {
          changedFields[key] = changedDevice[key];
        }
      });
      axiosInstance
        .put(`devices/${currentDevice.id}`, changedFields)
        .then(handleFormSubmitResponse)
        .catch(handleFormSubmitError);
    }
  };

  const getPage = () => {
    dispatch({
      type: CHANGE_VALUE,
      key: "isLoading",
      value: true
    });
    axiosInstance
      .get(`/devices?limit=${limit}&page=${page}&q=${searchKey}`)
      .then(response => {
        dispatch({
          type: CHANGE_VALUE,
          key: "deviceList",
          value: response.data || []
        });
        dispatch({
          type: CHANGE_VALUE,
          key: "pagination",
          value: response.pagination
        });
      })
      .catch(error => {
        dispatch({
          type: CHANGE_VALUE,
          payload: {
            message: error.response?.data?.message,
            status: "danger"
          }
        });

        // TODO: remove once method is implemented
        dispatch({
          type: CHANGE_VALUE,
          key: "deviceList",
          value: mockedDevices
        });

        dispatch({
          type: CHANGE_VALUE,
          key: "pagination",
          value: {
            total: mockedDevices.length
          }
        });
      })
      .finally(() =>
        dispatch({
          type: CHANGE_VALUE,
          key: "isLoading",
          value: false
        })
      );
  };

  const handleEdit = () => {};

  const handleDelete = async id => {
    await axiosInstance.delete(`/devices/${id}`);
    getPage();
  };

  const renderCells = useCallback(() => {
    return deviceList.map(({ id, name }) => {
      return [
        name,
        <>
          <div key={id} className={classes.actionContainer}>
            <Tooltip
              id="tooltip-top"
              title="Edit"
              placement="top"
              onClick={() => handleEdit({ name })}
            >
              <IconButton aria-label="Edit">
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip
              id="tooltip-top-start"
              title="Remove"
              placement="top"
              onClick={() => handleDelete(id)}
            >
              <IconButton aria-label="Close">
                <Close />
              </IconButton>
            </Tooltip>
          </div>
        </>
      ];
    });
  }, [deviceList]);

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12} lg={12}>
          <CustomTabs
            headerColor="info"
            tabs={[
              {
                tabName: "Devices",
                tabContent: (
                  <Table
                    tableHead={["Name", ""]}
                    tableData={renderCells()}
                    tableHeaderColor="info"
                    newItemTitle="device"
                    onAddClick={() =>
                      dispatch({
                        type: CHANGE_VALUE,
                        key: "mode",
                        value: FORM_MODES.NEW
                      })
                    }
                    rowsPerPage={limit}
                    page={page}
                    count={pagination?.total}
                    onPageChange={newPage =>
                      dispatch({
                        type: CHANGE_VALUE,
                        key: "page",
                        value: newPage
                      })
                    }
                    onChangeRowsPerPage={newRowsPerPage =>
                      dispatch({
                        type: CHANGE_VALUE,
                        key: "limit",
                        value: newRowsPerPage
                      })
                    }
                    isLoading={isLoading}
                    addButtonText="+ Add new Device"
                    onSearch={({ target }) =>
                      dispatch({
                        type: CHANGE_VALUE,
                        key: "searchKey",
                        value: target.value
                      })
                    }
                    searchString={searchKey}
                  />
                )
              }
            ]}
          />
        </GridItem>
      </GridContainer>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={!!mode}
        onClose={() =>
          dispatch({
            type: CHANGE_VALUE,
            key: "mode",
            value: null
          })
        }
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={!!mode}>
          <DeviceForm
            onClose={() =>
              dispatch({
                type: CHANGE_VALUE,
                key: "mode",
                value: null
              })
            }
            submitForm={submitForm}
            dataForm={currentDevice}
            handleChange={({ target }) => {
              dispatch({
                type: CHANGE_VALUE,
                key:
                  mode === FORM_MODES.NEW ? "currentDevice" : "changedDevice",
                value: {
                  ...(mode === FORM_MODES.NEW ? currentDevice : changedDevice),
                  [target.name]: target.value
                }
              });
            }}
          />
        </Fade>
      </Modal>

      <PopupNotification
        ref={notificationRef}
        status={messageStatus}
        message={message}
      />
    </div>
  );
}
