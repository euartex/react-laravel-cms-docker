import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useReducer
} from "react";
import axios from "axios";
import { bool } from "prop-types";

import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";

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
import CompanyForm from "./CompanyForm.js";
import DeleteConfirmationModalContent from "components/DeleteConfirmationModalContent";

import { convertDataToOptions } from "helpers/convertDataToOptions";
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
  edit: {
    color: primaryColor[0]
  }
};

const useStyles = makeStyles(styles);

const INITIAL_FORM = {
  id: "",
  newCompanyName: "",
  newCompanyAddress: "",
  newCompanyZip: "",
  newCompanyCountry: "",
  newCompanyPhone: "",
  newCompanyEmail: "",
  newCompanyTaxNumber: "",
  isAutoPublish: false,
  newCompanyTags: []
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

const CompaniesPage = ({ allowEdit }) => {
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

  const [countries, setCountries] = useState([]);

  const notificationRef = useRef(null);

  const handleEdit = id => {
    axiosInstance
      .get(`companies/${id}`)
      .then(res => {
        const company = res.data.data;
        dispatch({
          type: EDIT_FORM,
          payload: {
            id,
            newCompanyName: company.name || "",
            newCompanyAddress: company.address || "",
            newCompanyZip: company.zip || "",
            newCompanyCountry: company.country || "",
            newCompanyPhone: company.phone || "",
            newCompanyEmail: company.email || "",
            newCompanyTaxNumber: company.tax_number || "",
            isAutoPublish: Boolean(company.auto_published) || false,
            newCompanyTags: company?.meta_tags
              ? convertDataToOptions(company.meta_tags)
              : [],
            is_auto_assign_top_news_tag: company.is_auto_assign_top_news_tag
          }
        });

        dispatch({
          type: SAVE_FORM,
          payload: {
            id,
            newCompanyName: company.name || "",
            newCompanyAddress: company.address || "",
            newCompanyZip: company.zip || "",
            newCompanyCountry: company.country || "",
            newCompanyPhone: company.phone || "",
            newCompanyEmail: company.email || "",
            newCompanyTaxNumber: company.tax_number || "",
            isAutoPublish: Boolean(company.auto_published) || false,
            newCompanyTags: company?.meta_tags
              ? convertDataToOptions(company.meta_tags)
              : [],
            is_auto_assign_top_news_tag: company.is_auto_assign_top_news_tag
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

  const handleDelete = () => {
    axiosInstance
      .delete(`/companies/${idToDelete}`)
      .then(() => {
        dispatch({
          type: SET_MESSAGE,
          payload: {
            messageStatus: "success",
            message: MESSAGES.deleted("Company")
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
    return pageData.map(company => {
      const { name, id } = company;
      return [
        name,
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
                  handleEdit(id);
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
                onClick={() =>
                  dispatch({ type: TOGGLE_CONFIRM, payload: { id, name } })
                }
                color="secondary"
              >
                <Close className={classes.tableActionButtonIcon} />
              </IconButton>
            </Tooltip>
          </div>
        ) : null
      ];
    });
  }, [pageData]);

  const getPage = () => {
    axiosInstance
      .get(`/companies?limit=${limit}&page=${page}&q=${searchString}`)
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
    axios
      .get("https://restcountries.eu/rest/v2/all?fields=name;")
      .then(res => setCountries(res.data?.map(item => item.name)))
      .catch(error => console.log("error", error));
  }, []);

  useEffect(() => {
    dispatch({ type: REQUEST });
    getPage();
  }, [page, limit, searchString]);

  const handleMultiSelectChange = ({ target }) => {
    const multiValue = [...target.value];
    dispatch({
      type: "CHANGE_FORM",
      payload: { name: "newCompanyTags", value: multiValue }
    });
  };

  const formatDataForRequest = (values, isEdit) => {
    const requestBody = {};
    if (values.newCompanyName !== undefined) {
      requestBody.name = values.newCompanyName;
    }
    if (values.newCompanyAddress !== undefined) {
      requestBody.address = values.newCompanyAddress;
    }
    if (values.newCompanyZip !== undefined) {
      requestBody.zip = values.newCompanyZip;
    }
    if (values.newCompanyCountry !== undefined) {
      requestBody.country = values.newCompanyCountry;
    }
    if (values.newCompanyPhone !== undefined) {
      requestBody.phone = values.newCompanyPhone;
    }
    if (values.newCompanyEmail !== undefined) {
      requestBody.email = values.newCompanyEmail;
    }
    if (values.newCompanyTaxNumber !== undefined) {
      requestBody.tax_number = values.newCompanyTaxNumber;
    }
    if (values.isAutoPublish !== undefined) {
      requestBody.auto_published = values.isAutoPublish;
    }
    if (values.is_auto_assign_top_news_tag !== undefined) {
      requestBody.is_auto_assign_top_news_tag =
        values.is_auto_assign_top_news_tag;
    }
    if (values.newCompanyTags) {
      requestBody.tag_ids = values.newCompanyTags.map(newTag =>
        Number(newTag.value)
      );
    }
    // due to PHP bug when files attached request method should be POST, but body should be appended '_method': "PUT"
    if (isEdit) {
      requestBody._method = "PUT";
    }
    return requestBody;
  };

  const submitForm = () => {
    if (loading) return;
    const handleFormSubmitResponse = isEdit => {
      dispatch({
        type: SUBMIT_FORM_SUCCES,
        payload: isEdit
          ? MESSAGES.updated(form.newCompanyName || "Company")
          : MESSAGES.added("Company")
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
    // new
    if (!savedForm) {
      axiosInstance
        .post("/companies", formatDataForRequest(form))
        .then(() => handleFormSubmitResponse(false))
        .catch(handleFormSubmitError);
    } else {
      // edit
      let changedFields = {};
      Object.keys(savedForm).forEach(key => {
        if (key === "id") return;
        if (form[key] !== savedForm[key]) {
          changedFields[key] = form[key];
        }
      });
      axiosInstance
        .post(
          `/companies/${savedForm.id}`,
          formatDataForRequest(changedFields, true)
        )
        .then(() => handleFormSubmitResponse(true))
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
      <div>
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
            timeout: 500
          }}
        >
          <>
            {formIsOpened && (
              <Fade in={formIsOpened}>
                <CompanyForm
                  submitForm={submitForm}
                  dataForm={form}
                  handleChange={({ target }) => {
                    dispatch({ type: CHANGE_FORM, payload: target });
                  }}
                  onClose={() => {
                    dispatch({ type: CLOSE_FORM });
                    dispatch({ type: RESET_FORM, payload: INITIAL_FORM });
                  }}
                  handleMultiSelectChange={handleMultiSelectChange}
                  countries={countries}
                  loading={loading}
                  isEditMode={!!savedForm}
                />
              </Fade>
            )}
            {confirmIsOpened && (
              <Fade in={confirmIsOpened}>
                <DeleteConfirmationModalContent
                  title="Delete company"
                  onConfirm={handleDelete}
                  onClose={() => dispatch({ type: TOGGLE_CONFIRM })}
                >
                  {`Confirm company${
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
                  tabName: "Companies list",
                  tabContent: (
                    <Table
                      tableHead={["Name", ""]}
                      tableData={dataTable()}
                      tableHeaderColor="info"
                      addButtonText="+ Add new company"
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
                      isAddItem={allowEdit}
                      isLoading={loading}
                    />
                  )
                }
              ]}
            />
          </GridItem>
        </GridContainer>
      </div>
    </>
  );
};

CompaniesPage.propTypes = {
  allowEdit: bool
};

export default CompaniesPage;
