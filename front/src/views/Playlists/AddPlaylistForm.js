import React, { useRef, useState } from "react";
import { object, func, bool, string } from "prop-types";
import { WIDGET_SITE_URL } from "constants/url";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Checkbox } from "@material-ui/core";
import Check from "@material-ui/icons/Check";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import ProjectSelect from "components/ProjectSelect/ProjectSelect";
import AsyncCustomMultiSelect from "components/AsyncCustomMultiSelect/AsyncCustomMultiSelect";
import CustomInputFile from "components/CustomInputFile/CustomInputFile";
import Muted from "components/Typography/Muted";
import VerticalWidgetIcon from "components/Icons/VerticalWidget";
import HorizontalWidgetIcon from "components/Icons/HorizontalWidget";
import useSubmitOnEnter from "helpers/useSubmitOnEnter";
import styles from "assets/jss/material-dashboard-react/components/tasksStyle.js";
import customInputStyle from "assets/jss/material-dashboard-react/components/customInputStyle.js";
import checkBoxStyles from "assets/jss/material-dashboard-react/components/tasksStyle.js";
import { grayColor } from "assets/jss/material-dashboard-react.js";
import { CopyToClipboard } from "react-copy-to-clipboard";

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
    position: "relative",
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
  },
  changeIsTopModal: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  changeIsTopModalContent: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0px 4px 5px 1px rgba(0,0,0,0.75)",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    fontSize: "20px",
    zIndex: 10000
  },
  centered: {
    width: "100%",
    textAlign: "center"
  },
  topSpace: {
    margin: "27px 0 0 0"
  },
  alignRight: {
    textAlign: "right"
  },
  fixAlign: {
    marginLeft: "-13px"
  },
  radioContainer: {
    marginTop: "-13px",
    display: "flex",
    alignItems: "center"
  },
  rightSpace: {
    marginRight: "13px"
  },
  borderBottom: {
    borderBottom: "1px solid #C4C4C4",
    paddingBottom: "18px"
  },
  noStyle: {
    backgroundColor: "transparent !important",
    color: "#4A43B2",
    textDecoration: "underline",
    fontWeight: 500,
    margin: "0 !important",
    padding: "0 !important",
    boxShadow: "none !important",

    "&:hover": {
      textDecoration: "underline",
      color: "#4A43B2",
      boxShadow: "none !important"
    },

    "&:focus": {
      textDecoration: "underline",
      color: "#4A43B2",
      boxShadow: "none !important"
    }
  },
  textArea: {
    display: "block",
    resize: "none",
    width: "99%",
    border: "1px solid #828282",
    marginTop: "13px"
  }
};

const useStyles = makeStyles({
  ...styles,
  ...customStyles,
  ...checkBoxStyles,
  ...customInputStyle
});

const AddPlaylistForm = ({
  onClose,
  handleChange,
  dataForm,
  submitForm,
  handleMultiSelectChange,
  onFileChange,
  isEditMode,
  topList
}) => {
  const classes = useStyles();
  const {
    name = "",
    description = "",
    tag_ids,
    project_id,
    asset_ids,
    is_top,
    slug,
    poster,
    cover,
    playlist_id,
    id
  } = dataForm;
  const [isConfirmEditTopListOpened, setConfirmTopListEdit] = useState(false);
  const [isDisabledCheckboxHovered, setHoverDisabledCheckbox] = useState(false);
  const [isWidgetCollapsed, setWidgetCollapsed] = useState(true);
  const [widgetType, setWidgetType] = useState("");
  const initialCover = useRef(cover);
  const initialPoster = useRef(poster);
  const plTypetextAreaRef = useRef(null);
  const combinedTypeTextAreaRef = useRef(null);
  const verticalType = "vertical";
  const horizontalType = "horizontal";

  useSubmitOnEnter(submitForm);

  const isCurrentTopList = is_top && id === topList?.id;

  return (
    <div>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={6} lg={4}>
          <Card>
            <CardHeader color="info">
              <h4 className={classes.cardTitleWhite}>
                {`${isEditMode ? "Update" : "Add"} ${playlist_id + " " ||
                  ""}playlist`}
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
                    labelText="Playlist name"
                    id="name"
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

                {isEditMode ? (
                  <GridItem xs={12} sm={12} md={12}>
                    <CustomInput
                      labelText="Slug"
                      id="slug"
                      formControlProps={{
                        fullWidth: true
                      }}
                      value={slug}
                      onChange={handleChange}
                      inputProps={{
                        type: "text",
                        name: "slug",
                        required: false,
                        endAdornment: (
                          <CopyToClipboard
                            text={slug}
                            onCopy={() => {
                              {
                                document.getElementById(
                                  "slug_copy_btn"
                                ).innerHTML = "Copied to the clipboard";
                              }
                            }}
                          >
                            <Button
                              type="button"
                              color="info"
                              id="slug_copy_btn"
                            >
                              Copy
                            </Button>
                          </CopyToClipboard>
                        )
                      }}
                    />
                  </GridItem>
                ) : null}

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
                      required: true
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <AsyncCustomMultiSelect
                    isAutoComplete
                    labelText="Metadata - Tags"
                    id="tag_ids"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={tag_ids}
                    onChange={handleChange}
                    chipColor="info"
                    url="tags/accessible-list?limit=1000&without_relations=true"
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <AsyncCustomMultiSelect
                    isAutoComplete
                    labelText="Assets"
                    id="asset_ids"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={asset_ids}
                    onChange={e => handleMultiSelectChange(e, "asset_ids")}
                    chipColor="info"
                    url={`assets?limit=10000&without_relations=true`}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <ProjectSelect
                    labelText="Project *"
                    id="project_id"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={project_id || ""}
                    onChange={handleChange}
                    inputProps={{
                      type: "text",
                      name: "project_id",
                      required: true
                    }}
                  />
                </GridItem>

                <div className={classes.currentImageContainer}>
                  <div className={classes.labelLeft}>
                    <Typography>
                      Current thumbnail (&quot;Shows&quot; page view)
                    </Typography>
                  </div>
                  <div>
                    {initialCover?.current === null ? (
                      <Muted className={classes.textRight}>
                        Currently no image in use
                      </Muted>
                    ) : initialCover?.current?.small ? (
                      <img
                        src={initialCover.current.small}
                        alt="Current thumbnail"
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
                    name="cover"
                    labelText='New thumbnail ("Shows" page view)'
                    onChange={e => {
                      if (e && e.persist) {
                        e.persist();
                      }
                      onFileChange({
                        name: "cover",
                        target: e.target
                      });
                    }}
                    id="cover"
                  />
                </GridItem>

                <div
                  className={classes.currentImageContainer}
                  style={{ paddingTop: "10px" }}
                >
                  <div>
                    <Typography>Current thumbnail (grid view)</Typography>
                  </div>
                  <div>
                    {initialPoster?.current === null ? (
                      <Muted className={classes.textRight}>
                        Currently no image in use
                      </Muted>
                    ) : initialPoster?.current?.small ? (
                      <img
                        src={initialPoster.current.small}
                        alt="Current thumbnail"
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
                    labelText="Thumbnail (grid view)"
                    name="poster"
                    onChange={e => {
                      if (e && e.persist) {
                        e.persist();
                      }
                      onFileChange({
                        name: "poster",
                        target: e.target
                      });
                    }}
                    id="poster"
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <div
                    className={classes.checkbox}
                    onMouseEnter={() => {
                      is_top &&
                        isCurrentTopList &&
                        setHoverDisabledCheckbox(true);
                    }}
                    onMouseLeave={() => setHoverDisabledCheckbox(false)}
                  >
                    {isConfirmEditTopListOpened && !!topList && (
                      <div
                        className={classes.changeIsTopModal}
                        onClick={() => setConfirmTopListEdit(false)}
                      >
                        <div
                          className={classes.changeIsTopModalContent}
                          onClick={e => e.stopPropagation()}
                        >
                          <p className={classes.centered}>
                            Are you sure you want to change the top playlist
                            from &quot;{topList?.name}&quot; to &quot;{name}
                            &quot;?
                          </p>
                          <Button onClick={() => setConfirmTopListEdit(false)}>
                            No
                          </Button>
                          <Button
                            color="info"
                            onClick={() => {
                              submitForm();
                              setConfirmTopListEdit(false);
                            }}
                          >
                            Yes
                          </Button>
                        </div>
                      </div>
                    )}
                    <span className={classes.labelRoot}>Is top playlist?</span>
                    {isDisabledCheckboxHovered && (
                      <div>
                        You must have a Top Playlist. If you want to change it -
                        please edit the playlist you want to be the new Top
                        Playlist
                      </div>
                    )}
                    <Checkbox
                      id="is_top"
                      name="is_top"
                      checked={is_top}
                      disabled={is_top && isCurrentTopList}
                      onChange={handleChange}
                      tabIndex={-1}
                      checkedIcon={<Check className={classes.checkedIcon} />}
                      icon={<Check className={classes.uncheckedIcon} />}
                      classes={{
                        checked:
                          !(is_top && isCurrentTopList) && classes.checked,
                        root: classes.root
                      }}
                    />
                  </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <div className={classes.borderBottom}>
                    <div className={classes.alignRight}>
                      <Button
                        className={classes.topSpace}
                        color="info"
                        type="submit"
                        onClick={() => setWidgetCollapsed(!isWidgetCollapsed)}
                        xs={12}
                        sm={12}
                        md={12}
                        disabled={!id}
                      >
                        Generate widget
                      </Button>
                    </div>
                    {isWidgetCollapsed ? null : (
                      <>
                        <p>Select widget type:</p>
                        <div className={classes.radioContainer}>
                          <Checkbox
                            id="widget_type"
                            name="widget_type"
                            checked={widgetType === verticalType}
                            onChange={() => setWidgetType(verticalType)}
                            tabIndex={-1}
                            checkedIcon={
                              <Check className={classes.radioChecked} />
                            }
                            icon={<Check className={classes.radioUnchecked} />}
                            classes={{
                              checked: classes.radio,
                              root: `${classes.root} ${classes.fixAlign}`
                            }}
                          />
                          <Typography className={classes.rightSpace}>
                            Vertical type
                          </Typography>
                          <VerticalWidgetIcon />
                        </div>
                        <div className={classes.radioContainer}>
                          <Checkbox
                            id="widget_type"
                            name="widget_type"
                            checked={widgetType === horizontalType}
                            onChange={() => setWidgetType(horizontalType)}
                            tabIndex={-1}
                            checkedIcon={
                              <Check className={classes.radioChecked} />
                            }
                            icon={<Check className={classes.radioUnchecked} />}
                            classes={{
                              checked: classes.radio,
                              root: `${classes.root} ${classes.fixAlign}`
                            }}
                          />
                          <Typography className={classes.rightSpace}>
                            Horizontal type
                          </Typography>
                          <HorizontalWidgetIcon />
                        </div>

                        {widgetType ? (
                          <>
                            <label htmlFor="plType">Playlist type:</label>
                            <textarea
                              readOnly
                              rows="5"
                              id="plType"
                              className={classes.textArea}
                              value={
                                "<script type=“text/javascript”> window.addEventListener(“message”, receiveSize, false); function receiveSize(e) { { if (e.origin + “/” === “" +
                                WIDGET_SITE_URL +
                                "”) document.getElementById(“av-widget-playlist”).style.height = e.data + “px”; }; } </script><iframe style=“width: 100%” src=“" +
                                WIDGET_SITE_URL +
                                "?type=playlist&id=" +
                                playlist_id +
                                "&limit=20" +
                                (widgetType === verticalType
                                  ? "&style=2"
                                  : "") +
                                "” id=“av-widget-playlist” frameborder=“0” scrolling=“no”></iframe>"
                              }
                              ref={plTypetextAreaRef}
                            />
                            <Button
                              className={classes.noStyle}
                              onClick={() => {
                                if (!widgetType) {
                                  return;
                                }
                                if (plTypetextAreaRef?.current) {
                                  plTypetextAreaRef.current.select();
                                }
                                document.execCommand("copy");
                              }}
                              title={
                                !widgetType ? "Please select widget type" : ""
                              }
                            >
                              Copy to Clipboard
                            </Button>

                            <br />
                            <br />

                            <label htmlFor="combinedType">Combined type:</label>
                            <textarea
                              readOnly
                              rows="5"
                              id="combinedType"
                              className={classes.textArea}
                              value={
                                "<script type=“text/javascript”> window.addEventListener(“message”, receiveSize, false); function receiveSize(e) { { if (e.origin + “/” === “" +
                                WIDGET_SITE_URL +
                                "”) document.getElementById(“av-widget-combined”).style.height = e.data + “px”; }; } </script><iframe style=“width: 100%” src=“" +
                                WIDGET_SITE_URL +
                                "?type=combined&id=" +
                                playlist_id +
                                "&limit=20" +
                                (widgetType === verticalType
                                  ? "&style=2"
                                  : "") +
                                '” id=“av-widget-combined” frameborder=“0" scrolling=“no”></iframe>'
                              }
                              ref={combinedTypeTextAreaRef}
                            />
                            <Button
                              className={classes.noStyle}
                              onClick={() => {
                                if (!widgetType) {
                                  return;
                                }
                                if (combinedTypeTextAreaRef?.current) {
                                  combinedTypeTextAreaRef.current.select();
                                }
                                document.execCommand("copy");
                              }}
                              title={
                                !widgetType ? "Please select widget type" : ""
                              }
                            >
                              Copy to Clipboard
                            </Button>
                          </>
                        ) : null}
                      </>
                    )}
                  </div>
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter className={classes.footer}>
              <Button onClick={onClose}>Cancel</Button>
              <Button
                color="info"
                type="submit"
                onClick={() => {
                  is_top && !isCurrentTopList && !!topList
                    ? setConfirmTopListEdit(true)
                    : submitForm();
                }}
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

AddPlaylistForm.propTypes = {
  location: object,
  onClose: func,
  dataForm: object,
  handleChange: func,
  submitForm: func,
  handleMultiSelectChange: func,
  onFileChange: func,
  isEditMode: bool,
  topList: string
};

export default AddPlaylistForm;
