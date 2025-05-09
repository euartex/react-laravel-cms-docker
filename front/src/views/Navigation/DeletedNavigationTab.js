import React, { useEffect, useCallback, useReducer, useRef } from "react";

import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Restore from "@material-ui/icons/Restore";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { makeStyles } from "@material-ui/core/styles";

import ConfirmationModalContent from "components/ConfirmationModalContent";
import PopupNotification from "components/PopupNotification/PopupNotification.js";
import Table from "components/Table/Table";

import axiosInstance from "config/axiosInstance";
import MESSAGES from "constants/notificationMessages";
import { DEFAULT_LIMIT } from "constants/request";

import {
  CLOSE_FORM,
  OPEN_FORM,
  REQUEST,
  REQUEST_ERROR,
  REQUEST_SUCCESS,
  SET_LIMIT,
  SET_PAGE,
  SET_SEARCH_STRING,
  TOGGLE_CONFIRM,
  SET_MESSAGE
} from "../viewReducer/actionTypes";
import reducer from "../viewReducer/reducer";

import { successColor } from "assets/jss/material-dashboard-react.js";

const styles = {
  modal: {
    overflow: "scroll"
  },
  restore: {
    color: successColor[0]
  }
};

const useStyles = makeStyles(styles);

const initialState = {
  loading: false,
  errorMessage: "",
  pageData: [],
  page: 1,
  limit: DEFAULT_LIMIT,
  total: 0,
  searchString: "",
  messageStatus: "success",
  message: "",
  confirmIsOpened: false,
  idToDelete: null
};

const TABLE_HEADER = ["Title", "Menu Type", "Order", ""];

const DeletedNavigationTab = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    loading,
    pageData,
    limit,
    page,
    searchString,
    total,
    messageStatus,
    message,
    confirmIsOpened,
    idToDelete
  } = state;

  const notificationRef = useRef(null);

  const handleRestore = () => {
    axiosInstance
      .post(`/navigations/restore/${idToDelete}`)
      .then(() => {
        dispatch({
          type: SET_MESSAGE,
          payload: {
            messageStatus: "success",
            message: MESSAGES.restored("Navigation")
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

  const tryRestore = id => {
    dispatch({ type: TOGGLE_CONFIRM, payload: {id: id}});
  };

  const dataTable = useCallback(() => {
    return pageData.map(navigation => {
      const { title, type, order, id } = navigation;
      return [
        title,
        type?.name || "",
        order,
        <div key={id} style={{ textAlign: "right" }}>
          <Tooltip
            id="tooltip-top"
            title="Restore"
            placement="top"
            onClick={() => tryRestore(id)}
          >
            <IconButton aria-label="Restore">
              <Restore className={classes.restore} />
            </IconButton>
          </Tooltip>
        </div>
      ];
    });
  }, [pageData]);

  const getPage = () => {
    axiosInstance
      .get(
        `/navigations?only_deleted=true&limit=${limit}&page=${page}&q=${searchString}`
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
  }, [page, limit, searchString]);

  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={confirmIsOpened}
        onClose={() => {
          dispatch({ type: CLOSE_FORM });
        }}
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 600
        }}
      >
        <>
          {confirmIsOpened && (
            <Fade in={confirmIsOpened}>
              <ConfirmationModalContent
                title="Restore navigation"
                onConfirm={handleRestore}
                onClose={() => dispatch({ type: TOGGLE_CONFIRM })}
                isLoading={loading}
                styleColor="success"
              >
                Confirm navigation restoring, please.
              </ConfirmationModalContent>
            </Fade>
          )}
          <PopupNotification
            ref={notificationRef}
            status={messageStatus}
            message={message}
          />
        </>
      </Modal>
      <Table
        onAddClick={() => dispatch({ type: OPEN_FORM })}
        tableHead={TABLE_HEADER}
        tableData={dataTable()}
        tableHeaderColor="info"
        rowsPerPage={limit}
        isAddItem={false}
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

export default DeletedNavigationTab;
