import React, { useRef } from "react";
import { object, func, bool } from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import CustomInputFile from "components/CustomInputFile/CustomInputFile.js";
import Muted from "components/Typography/Muted";
import ProjectSelect from "components/ProjectSelect/ProjectSelect";

import useSubmitOnEnter from "helpers/useSubmitOnEnter";

import styles from "assets/jss/material-dashboard-react/components/tasksStyle.js";

const customStyles = {
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    display: "flex",
    justifyContent: "space-between"
  },
  closeButton: {
    cursor: "pointer"
  },
  footer: {
    display: "flex",
    justifyContent: "space-between"
  },
  checkbox: {
    marginTop: "27px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "dotted 1px gray"
  },
  currentImageContainer: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    boxSizing: "border-box",
    padding: "0px 15px",
    margin: "0 !important",
    width: "100% !important"
  },
  labelLeft: {
    flexGrow: "0",
    maxWidth: "25%",
    flexBasis: "25%"
  },
  labelRight: {
    flexGrow: "0",
    maxWidth: "75%",
    flexBasis: "75%"
  },
  textRight: {
    textAlign: "right"
  }
};

const useStyles = makeStyles({ ...styles, ...customStyles });

const PromotionForm = ({
  onClose,
  handleChange,
  dataForm,
  submitForm,
  isEdit
}) => {
  const classes = useStyles();

  const { name, image, timeout, project_id } = dataForm;
  const initialPicture = useRef(image);

  useSubmitOnEnter(submitForm);

  const validateFile = file => {
    const name = file.name;
    const lastDot = name.lastIndexOf(".");

    const extension = name.substring(lastDot + 1);
    return extension === "png" || extension === "jpg";
  };

  return (
    <div>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={6} lg={4}>
          <Card>
            <CardHeader color="info">
              <h4 className={classes.cardTitleWhite}>
                {isEdit ? "Edit" : "Add"} Promotion
                <span
                  className={`material-icons ${classes.closeButton}`}
                  onClick={onClose}
                >
                  clear
                </span>
              </h4>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Name *"
                    id="title"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={name}
                    onChange={handleChange}
                    inputProps={{
                      type: "text",
                      name: "name"
                    }}
                  />
                </GridItem>

                {isEdit ? (
                  <div className={classes.currentImageContainer}>
                    <div className={classes.labelLeft}>
                      <Typography>Current image</Typography>
                    </div>
                    <div className={classes.labelRight}>
                      {initialPicture?.current === null ? (
                        <Muted className={classes.textRight}>
                          Currently no image in use
                        </Muted>
                      ) : initialPicture?.current?.small ? (
                        <img
                          src={initialPicture.current.small}
                          alt="Current image"
                          style={{ width: "100%" }}
                        />
                      ) : (
                        <Muted className={classes.textRight}>
                          Please wait, the image is processing on server
                        </Muted>
                      )}
                    </div>
                  </div>
                ) : null}

                <GridItem xs={12} sm={12} md={12}>
                  <CustomInputFile
                    formControlProps={{
                      fullWidth: true
                    }}
                    labelText={isEdit ? "New image" : "New image *"}
                    onChange={handleChange}
                    name="image"
                    id="new-picture"
                    inputProps={{
                      accept: ".jpg, .png"
                    }}
                    customValidation={validateFile}
                    tooltipText="Please use image proportion 3:1 (i.e. 300x100) for better displaying on the CTV apps"
                  />
                </GridItem>

                <GridItem xs={12} sm={12} md={12}>
                  <ProjectSelect
                    labelText="Project *"
                    id="new-project"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={Number(project_id)}
                    onChange={handleChange}
                    inputProps={{
                      type: "text",
                      name: "project_id"
                    }}
                  />
                </GridItem>

                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Show time *"
                    id="show-time"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={timeout}
                    onChange={event => {
                      const onlyDigitsMoreZeroAndEmptyStr = new RegExp(
                        "^(s*|[1-9][0-9]*)$"
                      );
                      if (
                        onlyDigitsMoreZeroAndEmptyStr.test(
                          event.target.value
                        ) &&
                        parseInt(event.target.value)
                      ) {
                        handleChange(event);
                      }
                    }}
                    inputProps={{
                      type: "text",
                      name: "timeout"
                    }}
                    tooltipText="This value applies to all pictures, please consider it as minutes"
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter className={classes.footer}>
              <Button onClick={onClose}>Cancel</Button>
              <Button
                color="info"
                type="submit"
                onClick={submitForm}
                xs={12}
                sm={12}
                md={12}
                disabled={!name.length || !image || !timeout || !project_id}
              >
                Save
              </Button>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
};

PromotionForm.propTypes = {
  onClose: func,
  dataForm: object,
  handleChange: func,
  submitForm: func,
  isEdit: bool
};

export default PromotionForm;
