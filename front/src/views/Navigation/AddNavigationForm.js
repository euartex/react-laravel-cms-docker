import React from "react";

import { object, func, bool, array } from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import ProjectSelect from "components/ProjectSelect/ProjectSelect";
import CustomMultiSelect from "components/CustomMultiSelect/CustomMultiSelect";
import CustomSelect from "components/CustomSelect/CustomSelect.js";
import styles from "assets/jss/material-dashboard-react/components/tasksStyle.js";
import useSubmitOnEnter from "helpers/useSubmitOnEnter";
import {CopyToClipboard} from 'react-copy-to-clipboard';

 
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

const AddNavigationForm = ({
  onClose,
  handleChange,
  dataForm,
  submitForm,
  isEditMode,
  playlistOptions,
  typeOptions
}) => {
  const classes = useStyles();
  const {
    slug_copy_btn = null,
    title = "",
    slug = null,
    description = "",
    seo_title = "",
    seo_description = "",
    project_id = 0,
    playlists = [],
    type_id = 0
  } = dataForm;

  useSubmitOnEnter(submitForm);

  return (
    <div>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={6} lg={4}>
          <Card>
            <CardHeader color="info">
              <h4 className={classes.cardTitleWhite}>
                {`${isEditMode ? "Update" : "Add"} navigation`}
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
                    value={title}
                    onChange={handleChange}
                    inputProps={{
                      type: "text",
                      name: "title",
                      required: true
                    }}
                  />
                </GridItem>

                {isEditMode ? (
                  <GridItem xs={12} sm={12} md={12}>
                    <CustomInput
                      labelText="Slug (readonly)"
                      id="slug"
                      formControlProps={{
                        fullWidth: true
                      }}
                      value={slug}
                      inputProps={{
                        type: "text",
                        name: "slug",
                        required: false,
                        readOnly: true,
                        endAdornment: 
                          <CopyToClipboard text={slug} onCopy={() => {{ document.getElementById("slug_copy_btn").innerHTML = 'Copied to the clipboard' }}}>
                            <Button  type="button" color="info" id="slug_copy_btn">Copy</Button>
                          </CopyToClipboard>
                      }}
                    />
                  </GridItem>
                  ) : null}

                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Description"
                    id="new-description"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={description}
                    onChange={handleChange}
                    inputProps={{
                      type: "text",
                      name: "description",
                      multiline: true,
                      rows: 2
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <ProjectSelect
                    labelText="Project *"
                    id="project-id"
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
                    value={type_id}
                    onChange={handleChange}
                    inputProps={{
                      type: "text",
                      name: "type_id"
                    }}
                    options={typeOptions}
                  />
                </GridItem>

                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="SEO title"
                    id="seo-title"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={seo_title}
                    onChange={handleChange}
                    inputProps={{
                      type: "text",
                      name: "seo_title"
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="SEO description"
                    id="seo-description"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={seo_description}
                    onChange={handleChange}
                    inputProps={{
                      type: "text",
                      name: "seo_description",
                      multiline: true,
                      rows: 3
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomMultiSelect
                    labelText="Playlists"
                    id="playlists-arr"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={playlists}
                    onChange={handleChange}
                    secureClearing={true}
                    options={playlistOptions}
                    chipColor="info"
                    inputProps={{
                      name: "playlists"
                    }}
                    isAutoComplete={true}
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
                disabled={!type_id || !project_id || !title}
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

AddNavigationForm.propTypes = {
  location: object,
  onClose: func,
  dataForm: object,
  handleChange: func,
  isEditMode: bool,
  submitForm: func,
  playlistOptions: array,
  typeOptions: array
};

export default AddNavigationForm;
