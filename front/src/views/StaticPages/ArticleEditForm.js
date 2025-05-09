import React, { useRef } from "react";
import { func, object, number } from "prop-types";
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
import CustomSelect from "components/CustomSelect/CustomSelect.js";
import CustomInputFile from "components/CustomInputFile/CustomInputFile.js";
import CustomMultiSelect from "components/CustomMultiSelect/CustomMultiSelect.js";

import CustomDatePicker from "components/CustomDatePicker/CustomDatePicker.js";
import ProjectSelect from "components/ProjectSelect/ProjectSelect";
import AsyncCustomMultiSelect from "components/AsyncCustomMultiSelect/AsyncCustomMultiSelect";
import Muted from "components/Typography/Muted";

import useSubmitOnEnter from "helpers/useSubmitOnEnter";
import { grayColor } from "assets/jss/material-dashboard-react.js";
import customInputStyle from "assets/jss/material-dashboard-react/components/customInputStyle.js";
import checkBoxStyles from "assets/jss/material-dashboard-react/components/tasksStyle.js";

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
  deleteImageButton: {
    cursor: "pointer",
    color: grayColor[3]
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
    borderBottom: `1px solid ${grayColor[4]}`
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
const styles = { ...checkBoxStyles, ...compStyles, ...customInputStyle };

const useStyles = makeStyles(styles);

const AssetEditForm = ({
  onSubmit,
  onClose,
  dataForm,
  handleChange,
  handleMultiSelectChange,
  handleVideoUpload,
  progressProp,
  companyOptions
}) => {
  const classes = useStyles();
  const {
    title = "",
    description = "",
    long_description = "",
    project_id,
    tag_ids = [],
    poster = "",
    cover = "",
    status = "",
    midRollCuepoint = "",
    seo_title = "",
    seo_description = "",
    seo_url = "",
    start_on = "",
    end_on = "",
    VDMS = "",
    company_id
  } = dataForm;

  const initialCover = useRef(cover);
  const initialPoster = useRef(poster);

  useSubmitOnEnter(onSubmit);

  return (
    <div>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={6} lg={4}>
          <Card>
            <CardHeader color="info">
              <h4 className={classes.cardTitleWhite}>
                Update asset
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
                    labelText="Asset name *"
                    id="new-asset-name"
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

                {/* dates */}
                {/* <GridItem xs={12} sm={12} md={12}>
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
                </GridItem> */}
                {/* <GridItem xs={12} sm={12} md={12}>
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
                </GridItem> */}

                {/* text area */}
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Description"
                    id="new-description"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={description || ""}
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

                {/* selector */}
                <GridItem xs={12} sm={12} md={12}>
                  <ProjectSelect
                    labelText="Project"
                    id="new-project"
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
                <GridItem xs={12} sm={12} md={12}>
                  <CustomSelect
                    labelText="Companies"
                    id="company_id"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={company_id}
                    onChange={handleChange}
                    options={companyOptions}
                    chipColor="info"
                    inputProps={{
                      name: "company_id"
                    }}
                  />
                </GridItem>
                {/* meta tags */}
                <GridItem xs={12} sm={12} md={12}>
                  <AsyncCustomMultiSelect
                    isAutoComplete
                    labelText="Metadata - Tags"
                    id="tag_arr"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={tag_ids}
                    onChange={e => {
                      handleMultiSelectChange(e, "tag_ids");
                    }}
                    chipColor="info"
                    url="tags/accessible-list?limit=10000&without_relations=true"
                  ></AsyncCustomMultiSelect>
                </GridItem>

                {/* files */}
                <div className={classes.currentImageContainer}>
                  <div className={classes.labelLeft}>
                    <Typography>Current poster</Typography>
                  </div>
                  <div>
                    {initialPoster?.current === null ? (
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
                    {initialCover?.current === null ? (
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
                {/* <GridItem xs={12} sm={12} md={12}>
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
                </GridItem> */}

                {/* vdms */}
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="VDMS"
                    id="new-vdms"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={VDMS || ""}
                    onChange={handleChange}
                    inputProps={{
                      type: "text",
                      name: "VDMS",
                      disabled: true
                    }}
                  />
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
                      { value: "draft", label: "Draft" },
                      // { value: "deleted", label: "Deleted" },
                      { value: "uploading", label: "Uploading" }
                    ]}
                  />
                </GridItem>

                {/* mid roll cuepoints */}
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Mid Roll Cuepoint"
                    id="new-mid-roll-cuepoint"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={midRollCuepoint || ""}
                    onChange={handleChange}
                    inputProps={{
                      type: "text",
                      name: "midRollCuepoint"
                    }}
                    tooltipText="Separate values with commas, values in sec. or if less than 1 will represent asset length percentage."
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
                    value={seo_description || ""}
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
              <Button onClick={onSubmit} color="info" disabled={!title.length}>
                Save
              </Button>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
};

AssetEditForm.propTypes = {
  onSubmit: func,
  onClose: func,
  dataForm: object,
  handleChange: func,
  handleMultiSelectChange: func,
  handleVideoUpload: func,
  progressProp: number
};

export default AssetEditForm;
