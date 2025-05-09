import React from "react";

import { object, func } from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "assets/css/custom-quill-styles.css";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import ProjectSelect from "components/ProjectSelect/ProjectSelect";
import CustomSelect from "components/CustomSelect/CustomSelect.js";

import styles from "assets/jss/material-dashboard-react/components/tasksStyle.js";
import useSubmitOnEnter from "helpers/useSubmitOnEnter";

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
  }
};

const useStyles = makeStyles({ ...styles, ...customStyles });

const AddStaticPageForm = ({
  onClose,
  handleChange,
  dataForm,
  submitForm,
  handleRTEChange
}) => {
  const classes = useStyles();
  const {
    project_id,
    title,
    sub_title,
    html_content,
    type = "web-content"
  } = dataForm;

  useSubmitOnEnter(submitForm);
  return (
    <div>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={6} lg={4}>
          <Card>
            <CardHeader color="info">
              <h4 className={classes.cardTitleWhite}>
                Add static page
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
                    labelText="Title *"
                    id="title"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={title || ""}
                    onChange={handleChange}
                    inputProps={{
                      type: "text",
                      name: "title",
                      required: true
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Sub title"
                    id="sub_title"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={sub_title}
                    onChange={handleChange}
                    inputProps={{
                      type: "text",
                      name: "sub_title",
                      required: true
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <ReactQuill
                    value={html_content}
                    style={{ marginTop: "50px" }}
                    theme="snow"
                    onChange={handleRTEChange}
                    placeholder="Put you text here..."
                  ></ReactQuill>
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <ProjectSelect
                    labelText="Project *"
                    id="project"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={project_id}
                    onChange={handleChange}
                    inputProps={{
                      type: "text",
                      name: "project_id",
                      required: true
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomSelect
                    labelText="Type *"
                    id="new-type"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={type}
                    onChange={handleChange}
                    inputProps={{
                      type: "text",
                      name: "type",
                      required: true
                    }}
                    // Hardcoded due to luck of time and low chance future change, agreed with PM and backend developers
                    options={[
                      { value: "privacy", label: "Privacy" },
                      { value: "web-content", label: "Web Content" },
                      { value: "Other", label: "other" }
                    ]}
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
                disabled={!project_id || !title || !type}
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

AddStaticPageForm.propTypes = {
  location: object,
  onClose: func,
  dataForm: object,
  handleChange: func,
  submitForm: func,
  handleRTEChange: func
};

export default AddStaticPageForm;
