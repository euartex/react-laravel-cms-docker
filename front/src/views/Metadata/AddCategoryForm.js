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
import CustomMultiSelect from "components/CustomMultiSelect/CustomMultiSelect";

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

const AddUserForm = ({
  onClose,
  handleChange,
  dataForm,
  submitForm,
  handleMultiSelectChange,
  isEdit,
  tagOptions
}) => {
  const classes = useStyles();
  const { name, tag_ids } = dataForm;

  useSubmitOnEnter(submitForm);

  return (
    <div>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={6} lg={4}>
          <Card>
            <CardHeader color="info">
              <h4 className={classes.cardTitleWhite}>
                {`${isEdit ? "Update" : "Add"} category`}
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
                    labelText="Metadata category"
                    id="metadataCategory"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={name || ""}
                    onChange={handleChange}
                    inputProps={{
                      type: "text",
                      name: "name",
                      required: true
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomMultiSelect
                    labelText="Tags"
                    id="meta-tags"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={tag_ids}
                    onChange={handleMultiSelectChange}
                    options={tagOptions.map(tag => ({
                      value: tag.id,
                      label: tag.title || ""
                    }))}
                    chipColor="info"
                    inputProps={{
                      name: "metaTags"
                    }}
                    isAutoComplete={true}
                    isCreatable={true}
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

AddUserForm.propTypes = {
  location: object,
  onClose: func,
  dataForm: object,
  handleChange: func,
  submitForm: func,
  handleMultiSelectChange: func,
  isEdit: bool,
  tagOptions: array,
  onTagSearch: func
};

export default AddUserForm;
