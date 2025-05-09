import React from "react";
import { func, string, array, object, bool } from "prop-types";

import { makeStyles } from "@material-ui/core/styles";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import CustomMultiSelect from "components/CustomMultiSelect/CustomMultiSelect.js";

import checkBoxStyles from "assets/jss/material-dashboard-react/components/tasksStyle.js";
import useSubmitOnEnter from "helpers/useSubmitOnEnter";

const compStyles = {
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
  }
};
const styles = { ...checkBoxStyles, ...compStyles };

const useStyles = makeStyles(styles);

const ProjectForm = ({
  onClose,
  title,
  companyOptions,
  handleChange,
  dataForm,
  submitForm,
  isLoading
}) => {
  const classes = useStyles();
  const { companies, newProjectName } = dataForm;

  useSubmitOnEnter(submitForm);
  return (
    <div>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={6} lg={4}>
          <Card>
            <CardHeader color="info">
              <h4 className={classes.cardTitleWhite}>
                {title}
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
                    labelText="Project name *"
                    id="new-project-name"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={newProjectName}
                    onChange={handleChange}
                    inputProps={{
                      type: "text",
                      name: "newProjectName",
                      required: true
                    }}
                  />
                </GridItem>

                <GridItem xs={12} sm={12} md={12}>
                  <CustomMultiSelect
                    labelText="Companies"
                    id="companies"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={companies}
                    onChange={handleChange}
                    options={companyOptions}
                    chipColor="info"
                    inputProps={{
                      name: "companies"
                    }}
                    isAutoComplete={true}
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter className={classes.footer}>
              <Button onClick={onClose}>Cancel</Button>
              <Button
                onClick={submitForm}
                color="info"
                disabled={!newProjectName.length || isLoading}
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

ProjectForm.propTypes = {
  onClose: func,
  title: string,
  companyOptions: array,
  handleChange: func,
  dataForm: object,
  submitForm: func,
  isLoading: bool
};

export default ProjectForm;
