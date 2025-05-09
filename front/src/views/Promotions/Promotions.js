import React, {
  useEffect,
  useCallback,
  useReducer,
  useRef,
  useState
} from "react";
import { bool } from "prop-types";

import Close from "@material-ui/icons/Close";
import Edit from "@material-ui/icons/Edit";

// @material-ui/core components
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { makeStyles } from "@material-ui/core/styles";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import DeleteConfirmationModalContent from "components/DeleteConfirmationModalContent";
import PopupNotification from "components/PopupNotification/PopupNotification.js";
import Table from "components/DnDTable/DnDTable";
import PromotionForm from "./PromotionForm.js";
import ProjectSelect from "components/ProjectSelect/ProjectSelect";
import imagePlaceholder from "assets/img/placeholder-image.jpg";

import MESSAGES from "constants/notificationMessages";
import { DEFAULT_LIMIT } from "constants/request";
import {
  CHANGE_FORM,
  CLOSE_FORM,
  OPEN_FORM,
  REQUEST,
  REQUEST_SUCCESS,
  EDIT_FORM,
  SET_LIMIT,
  SET_PAGE,
  SUBMIT_FORM_SUCCES,
  SUBMIT_FORM_ERROR,
  REQUEST_ERROR,
  SAVE_FORM,
  RESET_FORM,
  TOGGLE_CONFIRM,
  SET_MESSAGE,
  SET_SEARCH_STRING
} from "../viewReducer/actionTypes";
import reducer from "../viewReducer/reducer";
import { convertToFormData } from "helpers/convertToFormData";

import { primaryColor } from "assets/jss/material-dashboard-react.js";
import axiosInstance from "config/axiosInstance.js";

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
  thumbnail: {
    maxWidth: "180px"
  },
  selectProjectContainer: {
    paddingBottom: 0,
    minWidth: "65px"
  }
};
const useStyles = makeStyles(styles);

const INITIAL_FORM = {
  name: "",
  image: "",
  timeout: 10,
  project_id: 0
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

const TABLE_HEADER = ["Name", "Thumbnail", "Project", ""];
const optionAll = { value: 0, label: "All" };

const Promotions = ({ allowEdit }) => {
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [currentProject, setCurrentProject] = useState(optionAll.value);

  const {
    loading,
    formIsOpened,
    form,
    pageData,
    limit,
    page,
    total,
    messageStatus,
    message,
    savedForm,
    confirmIsOpened,
    idToDelete,
    searchString,
    nameToDelete
  } = state;

  const notificationRef = useRef(null);
  const blobRef = useRef({});

  const getPage = () => {
    axiosInstance
      .get(
        `/banners?limit=${limit}&page=${page}${
          currentProject ? "&project_id=" + currentProject : ""
        }&q=${searchString}`
      )
      .then(response => {
        dispatch({ type: REQUEST_SUCCESS, payload: response?.data });
      })
      .catch(error =>
        dispatch({
          type: REQUEST_ERROR,
          payload: error?.response?.data?.message
        })
      );
  };

  useEffect(() => {
    dispatch({ type: REQUEST });
    getPage();
  }, [page, limit, currentProject, searchString]);

  const handleEdit = ({ id, name, img, timeout = 10, project_id }) => {
    axiosInstance.get(`/banners/${id}`).then(res => {
      dispatch({
        type: EDIT_FORM,
        payload: {
          id,
          name,
          image: res?.data?.data?.[0].img || img,
          timeout,
          project_id
        }
      });

      dispatch({
        type: SAVE_FORM,
        payload: {
          id,
          name,
          image: res?.data?.data?.[0].img || img,
          timeout,
          project_id
        }
      });
      dispatch({ type: OPEN_FORM });
    });
  };

  const handleDelete = () => {
    axiosInstance
      .post("/banners", { _method: "DELETE", ids: [idToDelete] })
      .then(() => {
        dispatch({
          type: SET_MESSAGE,
          payload: {
            messageStatus: "success",
            message: MESSAGES.deleted("Promotion")
          }
        });
        dispatch({ type: TOGGLE_CONFIRM });
        getPage();
        return notificationRef?.current?.showNotification();
      })
      .catch(error => {
        dispatch({
          type: REQUEST_ERROR,
          payload:
            error?.response?.data?.message || MESSAGES.couldntReadFromError
        });
        dispatch({ type: TOGGLE_CONFIRM });
        return notificationRef?.current?.showNotification();
      });
  };

  const submitForm = () => {
    if (loading) return;

    const handleFormSubmitResponse = () => {
      dispatch({
        type: SUBMIT_FORM_SUCCES,
        payload: savedForm
          ? MESSAGES.updated("Promotion")
          : MESSAGES.added("Promotion")
      });
      dispatch({ type: CLOSE_FORM });
      dispatch({ type: RESET_FORM, payload: INITIAL_FORM });
      getPage();
      return notificationRef?.current?.showNotification();
    };

    const handleFormSubmitError = error => {
      dispatch({ type: SUBMIT_FORM_ERROR, payload: error?.response?.data });
      return notificationRef?.current?.showNotification();
    };

    if (!savedForm) {
      axiosInstance
        .post("/banners", convertToFormData(form))
        .then(handleFormSubmitResponse)
        .catch(handleFormSubmitError);
    } else {
      let changedFields = { _method: "PUT" };
      Object.keys(form).forEach(key => {

        if (key === "id" || !form[key]) return;
        

        /**
        * If form item is file instance and key is image then prepare file for uploading
        */
        if (key === 'image' && form[key] === File) { 
          
          blobRef.current = {
            id: form.id,
            url: URL.createObjectURL(form[key])
          };
        }


        if (form[key] !== savedForm[key]) {
          changedFields[key] = form[key];
        }

      });
      axiosInstance
        .post(`/banners/${form.id}`, convertToFormData(changedFields))
        .then(handleFormSubmitResponse)
        .catch(handleFormSubmitError);
    }
  };

  const dataTable = useCallback(() => {
    return pageData.map(promotion => {
      const { id, name, img, timeout, project_id, project } = promotion;
      return {
        id,
        data: [
          name,
          <img
            key={`picture-${id}`}
            src={renderImageFromBlob(id, img)}
            alt={name}
            className={classes.thumbnail}
          />,
          project?.name || "",
          allowEdit ? (
            <div key={id} style={{ textAlign: "right" }}>
              <Tooltip
                id="tooltip-top"
                title="Edit"
                placement="top"
                onClick={() =>
                  handleEdit({
                    id,
                    name,
                    img,
                    timeout: timeout || 10,
                    project_id
                  })
                }
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
                  dispatch({ type: TOGGLE_CONFIRM, payload: { id, name } })
                }
              >
                <IconButton aria-label="Close" color="secondary">
                  <Close />
                </IconButton>
              </Tooltip>
            </div>
          ) : null
        ]
      };
    });
  }, [pageData]);

  const renderImageFromBlob = (id, img) => {
    if (!blobRef.current.id) return img?.small || imagePlaceholder;
    const imageFromBlob = { ...blobRef.current };
    if (imageFromBlob.id === id) {
      return imageFromBlob.url;
    }
    return img?.small || imagePlaceholder;
  };

  return (
    <div>
      <CustomTabs
        headerColor="info"
        tabs={[
          {
            tabName: "Promotions",
            tabContent: (
              <>
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
                        <PromotionForm
                          isEdit={!!savedForm}
                          submitForm={submitForm}
                          dataForm={form}
                          handleChange={({ target }) => {
                            dispatch({ type: CHANGE_FORM, payload: target });
                          }}
                          onClose={() => {
                            dispatch({ type: CLOSE_FORM });
                            dispatch({
                              type: RESET_FORM,
                              payload: INITIAL_FORM
                            });
                          }}
                        />
                      </Fade>
                    )}
                    {confirmIsOpened && (
                      <Fade in={confirmIsOpened}>
                        <DeleteConfirmationModalContent
                          title="Delete the promotion"
                          onConfirm={handleDelete}
                          onClose={() => dispatch({ type: TOGGLE_CONFIRM })}
                          isLoading={loading}
                        >
                          {`Confirm promotions${
                            nameToDelete ? ` '${nameToDelete}' ` : ""
                          }deleting, please.`}
                        </DeleteConfirmationModalContent>
                      </Fade>
                    )}
                  </>
                </Modal>
                <PopupNotification
                  ref={notificationRef}
                  status={messageStatus}
                  message={message}
                />

                <Table
                  onAddClick={() => dispatch({ type: OPEN_FORM })}
                  tableHead={TABLE_HEADER}
                  tableData={dataTable()}
                  tableHeaderColor="info"
                  isAddItem={allowEdit}
                  addButtonText="+ Add new promotion"
                  onSearch={({ target }) => {
                    dispatch({
                      type: SET_SEARCH_STRING,
                      payload: target.value
                    });
                  }}
                  onClear={() =>
                    dispatch({ type: SET_SEARCH_STRING, payload: "" })
                  }
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
                  rowsPerPage={limit}
                  page={page}
                  count={total}
                  onPageChange={newPage =>
                    dispatch({ type: SET_PAGE, payload: newPage })
                  }
                  onChangeRowsPerPage={newRowsPerPage =>
                    dispatch({ type: SET_LIMIT, payload: +newRowsPerPage })
                  }
                  isLoading={loading}
                  orderUrl="/banners/order"
                  getPage={getPage}
                />
              </>
            )
          }
        ]}
      />
    </div>
  );
};

Promotions.propTypes = {
  allowEdit: bool
};

export default Promotions;
