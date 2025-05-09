import React from "react";
import { object, func, array, bool } from "prop-types";
import { addHours, format } from "date-fns";
import { makeStyles } from "@material-ui/core/styles";
import { makeDateDueSafariIssue } from "helpers/formatHelper";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import CustomSelect from "components/CustomSelect/CustomSelect.js";
import CustomDatePicker from "components/CustomDatePicker/CustomDatePicker";
import ProjectSelect from "components/ProjectSelect/ProjectSelect";

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
  }
};

const useStyles = makeStyles({ ...styles, ...customStyles });

const EPGForm = ({
  onClose,
  handleChange,
  dataForm,
  submitForm,
  programTypeOptions,
  showOptions,
  handleDateChange,
  isEdit
}) => {
  const classes = useStyles();

  const {
    name,
    type,
    show_id,
    start_show_at,
    end_show_at,
    project_id
  } = dataForm;
  return (
    <div>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={6} lg={4}>
          <Card>
            <CardHeader color="info">
              <h4 className={classes.cardTitleWhite}>
                {isEdit ? "Edit" : "Add"} EPG
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
                      name: "name",
                      required: true
                    }}
                  />
                </GridItem>

                <GridItem xs={12} sm={12} md={12}>
                  <CustomSelect
                    labelText="Airing Type *"
                    id="type"
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
                    options={programTypeOptions}
                  />
                </GridItem>

                <GridItem xs={12} sm={12} md={12}>
                  <CustomSelect
                    labelText="Show *"
                    id="show_id"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={show_id}
                    onChange={handleChange}
                    inputProps={{
                      type: "text",
                      name: "show_id",
                      required: true
                    }}
                    options={showOptions}
                  />
                </GridItem>

                <GridItem xs={12} sm={12} md={12}>
                  <CustomDatePicker
                    handleDateChange={value =>
                      handleDateChange(value, "start_show_at")
                    }
                    value={start_show_at}
                    id="start_show_at"
                    label="Start on *"
                    name="start_show_at"
                    withTime
                  />
                </GridItem>

                <GridItem xs={12} sm={12} md={12}>
                  <CustomDatePicker
                    handleDateChange={value =>
                      handleDateChange(value, "end_show_at")
                    }
                    maxDate={addHours(start_show_at, 24)}
                    maxDateMessage="Date should not be more than 24 hours from start date"
                    value={end_show_at}
                    id="end_show_at"
                    label="End on *"
                    name="end_show_at"
                    withTime
                  />
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
                disabled={
                  !name.length ||
                  !type ||
                  !show_id ||
                  !start_show_at ||
                  !end_show_at ||
                  !project_id
                }
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

EPGForm.propTypes = {
  onClose: func,
  dataForm: object,
  handleChange: func,
  submitForm: func,
  handleDateChange: func,
  programTypeOptions: array,
  showOptions: array,
  isEdit: bool
};

export default EPGForm;
