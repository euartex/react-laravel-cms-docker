import React, { useState, useRef } from "react";
import { object, func, array, bool, number } from "prop-types";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
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
import CustomInputFile from "components/CustomInputFile/CustomInputFile.js";
import AsyncCustomMultiSelect from "components/AsyncCustomMultiSelect/AsyncCustomMultiSelect";
import ProjectSelect from "components/ProjectSelect/ProjectSelect";
import CompanySelect from "components/CompanySelect/CompanySelect";
import CustomSelect from "components/CustomSelect/CustomSelect.js";
import Checkbox from "@material-ui/core/Checkbox";
import Check from "@material-ui/icons/Check";
import CustomDatePicker from "components/CustomDatePicker/CustomDatePicker.js";
import Muted from "components/Typography/Muted";
import styles from "assets/jss/material-dashboard-react/components/tasksStyle.js";
import checkBoxStyles from "assets/jss/material-dashboard-react/components/tasksStyle.js";
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
  },
  datePicker: {
    width: "100%",
    marginTop: "27px"
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
    maxWidth: "50%",
    flexBasis: "50%"
  },
  textRight: {
    textAlign: "right"
  }
};

const useStyles = makeStyles({ ...styles, ...customStyles, ...checkBoxStyles });
const AddLivefeedForm = ({
  onClose,
  handleChange,
  dataForm,
  submitForm,
  handleMultiSelectChange,
  handleVideoUpload,
  progressProp,
  companyOptions,
  editMode,
  mainLivefeed
}) => {
  const classes = useStyles();

  const {
    id,
    title,
    asset_id,
    description,
    start_on = "",
    end_on = "",
    VDMS = "",
    long_description = "",
    poster = "",
    cover = "",
    midRollCuepoint = "",
    seo_title = "",
    seo_description = "",
    seo_url = "",
    url,
    tag_ids,
    project_id,
    ext_url,
    company_id,
    status,
    is_main
  } = dataForm;

  const initialCover = useRef(cover);
  const initialPoster = useRef(poster);

  const [
    isConfirmEditMainLivefeedOpened,
    setConfirmMainLivefeedEdit
  ] = useState(false);
  const [isDisabledCheckboxHovered, setHoverDisabledCheckbox] = useState(false);

  useSubmitOnEnter(submitForm);

  const isCurrentMainLivefeed = is_main && id === mainLivefeed?.id;

  return (
    <div>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={6} lg={4}>
          <Card>
            <CardHeader color="info">
              <h4 className={classes.cardTitleWhite}>
                {editMode ? 'Edit livefeed "' + asset_id + '"' : "Add livefeed"}
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
                <GridItem xs={12} sm={12} md={12}>
                  <CustomDatePicker
                    handleDateChange={value =>
                      handleChange({
                        target: {
                          name: "start_on",
                          value
                        }
                      })
                    }
                    value={start_on}
                    id="new-start-date"
                    label="Start date"
                    name="start_on"
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomDatePicker
                    handleDateChange={value => {
                      handleChange({
                        target: {
                          name: "end_on",
                          value
                        }
                      });
                    }}
                    value={end_on}
                    id="new-end-date"
                    label="End date"
                    name="end_on"
                    disablePast={true}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Description"
                    id="description"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={description}
                    onChange={handleChange}
                    inputProps={{
                      type: "text",
                      name: "description",
                      multiline: true,
                      rows: 3
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Long description"
                    id="new-long-description"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={long_description || ""}
                    onChange={handleChange}
                    inputProps={{
                      type: "text",
                      name: "long_description",
                      multiline: true,
                      rows: 3
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="URL"
                    id="url"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={url || ""}
                    onChange={handleChange}
                    inputProps={{
                      type: "text",
                      name: "url"
                    }}
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
                      name: "project_id"
                    }}
                  />
                </GridItem>

                {/* selector */}
                <GridItem xs={12} sm={12} md={12}>
                  <CompanySelect
                    labelText="Company*"
                    id="new-company"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={company_id}
                    onChange={handleChange}
                    inputProps={{
                      required: true,
                      type: "text",
                      name: "company_id"
                    }}
                  />
                </GridItem>

                <GridItem xs={12} sm={12} md={12}>
                  <AsyncCustomMultiSelect
                    isAutoComplete
                    labelText="Metadata"
                    id="tags"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={tag_ids}
                    onChange={e => {
                      handleMultiSelectChange(e, "tag_ids");
                    }}
                    chipColor="info"
                    url="tags/accessible-list?limit=1000&without_relations=true"
                  />
                </GridItem>

                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="External URL"
                    id="ext_url"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={ext_url || ""}
                    onChange={handleChange}
                    inputProps={{
                      type: "text",
                      name: "ext_url"
                    }}
                  />
                </GridItem>

                {/* files */}
                <div className={classes.currentImageContainer}>
                  <div className={classes.labelLeft}>
                    <Typography>Current poster</Typography>
                  </div>
                  <div>
                    {!initialPoster?.current ? (
                      <Muted className={classes.textRight}>
                        Currently no image in use
                      </Muted>
                    ) : initialPoster?.current?.small ? (
                      <img
                        src={initialPoster.current.small}
                        alt="Current poster"
                        style={{ width: "100%" }}
                      />
                    ) : (
                      <Muted className={classes.textRight}>
                        Please wait, the image is processing on server
                      </Muted>
                    )}
                  </div>
                </div>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInputFile
                    formControlProps={{
                      fullWidth: true
                    }}
                    labelText="New Poster"
                    onChange={handleChange}
                    name="poster"
                    id="new-poster"
                    tooltipText="Choose one if you want to change it"
                  />
                </GridItem>

                <div
                  className={classes.currentImageContainer}
                  style={{ paddingTop: "10px" }}
                >
                  <div className={classes.labelLeft}>
                    <Typography>Current cover</Typography>
                  </div>
                  <div>
                    {!initialCover?.current ? (
                      <Muted className={classes.textRight}>
                        Currently no image in use
                      </Muted>
                    ) : initialCover?.current?.small ? (
                      <img
                        src={initialCover.current.small}
                        alt="Current cover"
                        style={{ width: "100%" }}
                      />
                    ) : (
                      <Muted className={classes.textRight}>
                        Please wait, the image is processing on server
                      </Muted>
                    )}
                  </div>
                </div>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInputFile
                    formControlProps={{
                      fullWidth: true
                    }}
                    labelText="New Cover"
                    onChange={handleChange}
                    name="cover"
                    id="new-cover"
                    tooltipText="Choose one if you want to change it"
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInputFile
                    formControlProps={{
                      fullWidth: true
                    }}
                    labelText="Mezaninne"
                    name="path_mezaninne"
                    onChange={handleVideoUpload}
                    id="new-mezaninne"
                    fileType="Pick video"
                    showProgress={true}
                    progress={progressProp}
                  />
                </GridItem>

                <GridItem xs={12} sm={12} md={12}>
                  <div
                    className={classes.checkbox}
                    onMouseEnter={() => {
                      is_main &&
                        isCurrentMainLivefeed &&
                        setHoverDisabledCheckbox(true);
                    }}
                    onMouseLeave={() => setHoverDisabledCheckbox(false)}
                  >
                    {isConfirmEditMainLivefeedOpened && !!mainLivefeed && (
                      <div
                        className={classes.changeIsTopModal}
                        onClick={() => setConfirmMainLivefeedEdit(false)}
                      >
                        <div
                          className={classes.changeIsTopModalContent}
                          onClick={e => e.stopPropagation()}
                        >
                          <p className={classes.centered}>
                            Are you sure you want to change the main livefeed
                            from &quot;{mainLivefeed?.title}&quot; to &quot;
                            {title}
                            &quot;?
                          </p>
                          <Button
                            onClick={() => setConfirmMainLivefeedEdit(false)}
                          >
                            No
                          </Button>
                          <Button
                            color="info"
                            onClick={() => {
                              submitForm();
                              setConfirmMainLivefeedEdit(false);
                            }}
                          >
                            Yes
                          </Button>
                        </div>
                      </div>
                    )}
                    {!isDisabledCheckboxHovered && (
                      <span className="">Is main?</span>
                    )}
                    {isDisabledCheckboxHovered && (
                      <div>
                        You must have a Main Livefeed. If you want to change it
                        - please edit the livefeed you want to be the new Main
                        Livefeed.
                      </div>
                    )}
                    <Checkbox
                      id="is_main"
                      name="is_main"
                      checked={is_main}
                      disabled={is_main && isCurrentMainLivefeed}
                      onChange={handleChange}
                      tabIndex={-1}
                      checkedIcon={<Check className={classes.checkedIcon} />}
                      icon={<Check className={classes.uncheckedIcon} />}
                      classes={{
                        checked: !is_main && classes.checked,
                        root: classes.root
                      }}
                    />
                  </div>
                </GridItem>

                {/* status */}
                <GridItem xs={12} sm={12} md={12}>
                  <CustomSelect
                    labelText="Status"
                    id="new-status"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={status}
                    onChange={handleChange}
                    inputProps={{
                      type: "text",
                      name: "status",
                      required: true
                    }}
                    options={[
                      { value: "published", label: "Published" },
                      // { value: "un-published", label: "UnPublished" },
                      // { value: "converting", label: "Converting" },
                      { value: "draft", label: "Draft" }
                      // { value: "deleted", label: "Deleted" },
                      //{ value: "uploading", label: "Uploading" }
                    ]}
                  />
                </GridItem>

                {/* SEO */}
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="SEO Title"
                    id="new-seo-title"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={seo_title || ""}
                    onChange={handleChange}
                    inputProps={{
                      type: "text",
                      name: "seo_title"
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="SEO URL"
                    id="new-SEO-URL"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={seo_url || ""}
                    onChange={handleChange}
                    inputProps={{
                      type: "text",
                      name: "seo_url"
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="SEO Description"
                    id="new-SEO-description"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={seo_description}
                    onChange={handleChange}
                    inputProps={{
                      type: "text",
                      name: "seo_description"
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
                onClick={() => {
                  is_main && !isCurrentMainLivefeed && !!mainLivefeed
                    ? setConfirmMainLivefeedEdit(true)
                    : submitForm();
                }}
                xs={12}
                sm={12}
                md={12}
                disabled={!title || !company_id || !project_id}
              >
                {!id ? "Create" : "Save"}
              </Button>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
};

AddLivefeedForm.propTypes = {
  onClose: func,
  dataForm: object,
  handleChange: func,
  submitForm: func,
  handleMultiSelectChange: func,
  companyOptions: array,
  handleVideoUpload: func,
  editMode: bool,
  progressProp: number
};

export default AddLivefeedForm;
