import React, { useState, useRef } from "react";
import classNames from "classnames";
import { object, node, bool, string, func, number } from "prop-types";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Tooltip from "@material-ui/core/Tooltip";
import LinearProgress from "@material-ui/core/LinearProgress";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";

// core components
import inputStyles from "assets/jss/material-dashboard-react/components/customInputStyle.js";
import buttonStyles from "assets/jss/material-dashboard-react/components/buttonStyle.js";
import {
  grayColor,
  successColor
} from "assets/jss/material-dashboard-react.js";

const customStyles = {
  customFileInput: {
    opacity: "0",
    position: "absolute",
    zIndex: -1
  },
  customFileInputLabel: {
    ...buttonStyles.button,
    ...buttonStyles.info,
    marginTop: 0,
    marginBottom: 0
  },
  fileName: {
    display: "flex",
    alignItems: "center",
    margin: "0 0.3125rem"
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  labelText: {
    position: "static",
    transform: "translate(0, 0px) scale(1)"
  },
  rowUnderline: {
    borderBottom: `1px solid ${grayColor[4]}`
  },
  deleteImageButton: {
    "&:hover": {
      cursor: "pointer"
    }
  },
  disableInput: {
    ...buttonStyles.disabled
  },
  progressContainer: {
    flexGrow: 1
  },
  progress: {
    width: "100%"
  },
  interactiveContainer: {
    display: "flex",
    alignItems: "center"
  }
};
const styles = { ...customStyles, ...inputStyles };
const useStyles = makeStyles(styles);

const CustomInputFile = ({
  error,
  success,
  initialFileName,
  formControlProps,
  labelText,
  labelProps,
  id,
  onChange,
  tooltipPlacement,
  tooltipText,
  fileType = "Pick image",
  inputProps = {},
  singleButton = false,
  showProgress = false,
  progress,
  name,
  customValidation
}) => {
  const classes = useStyles();
  const fileRef = useRef(null);
  const [newFile, setNewFile] = useState(initialFileName || "");

  const labelClasses = classNames({
    [classes.labelRoot]: true,
    [classes.labelRootError]: error,
    [classes.labelRootSuccess]: success && !error,
    [classes.labelText]: true
  });

  const labelTextStyle = classNames({
    [classes.customFileInputLabel]: true,
    [classes.disableInput]: inputProps?.disabled
  });

  const fileNameStyle = classNames({
    [classes.labelRoot]: true,
    [classes.fileName]: true,
    [classes.progressContainer]: showProgress
  });

  return (
    <ThemeProvider theme={materialTheme}>
      <FormControl
        {...formControlProps}
        className={
          formControlProps?.className +
          " " +
          classes.formControl +
          " " +
          classes.container +
          " " +
          classes.rowUnderline
        }
      >
        {labelText !== undefined ? (
          <InputLabel className={labelClasses} {...labelProps}>
            {labelText}
          </InputLabel>
        ) : null}
        <div className={classes.interactiveContainer}>
          {!singleButton && newFile?.name && (
            <div className={fileNameStyle}>
              {!showProgress ? (
                <img
                  src={URL.createObjectURL(newFile)}
                  alt={newFile.name}
                  style={{ maxWidth: "150px" }}
                />
              ) : (
                <LinearProgress
                  variant="determinate"
                  valueBuffer={100}
                  value={progress}
                  className={classes.progress}
                />
              )}
              <span
                className={`material-icons ${classes.deleteImageButton}`}
                onClick={() => {
                  setNewFile("");
                  onChange({ target: { name: inputProps.name, value: null } });
                  if (fileRef?.current) {
                    fileRef.current.value = null;
                  }
                }}
              >
                clear
              </span>
            </div>
          )}
          {tooltipText ? (
            <Tooltip
              id="tooltip-top"
              title={tooltipText}
              placement={tooltipPlacement || "top"}
            >
              <label htmlFor={id} className={labelTextStyle}>
                {fileType}
              </label>
            </Tooltip>
          ) : (
            <label htmlFor={id} className={labelTextStyle}>
              {fileType}
            </label>
          )}

          <input
            id={id}
            type="file"
            name={name}
            ref={fileRef}
            className={classes.customFileInput}
            onChange={event => {
              const files = event.target.files;
              if (files.length && files[0]?.name) {
                if (typeof customValidation === "function") {
                  if (customValidation(files[0])) {
                    setNewFile(files[0]);
                    onChange(event);
                  } else {
                    return;
                  }
                } else {
                  setNewFile(files[0]);
                  onChange(event);
                }
              }
            }}
            {...inputProps}
          />
        </div>
      </FormControl>
    </ThemeProvider>
  );
};

const materialTheme = createMuiTheme({
  overrides: {
    MuiLinearProgress: {
      root: {
        height: "10px",
        borderRadius: "3px"
      },
      colorPrimary: {
        backgroundColor: "rgba(92, 184, 96, 0.3)"
      },
      barColorPrimary: {
        backgroundColor: successColor[0]
      }
    }
  }
});

CustomInputFile.propTypes = {
  initialFileName: object,
  labelText: node,
  labelProps: object,
  id: string,
  error: bool,
  success: bool,
  formControlProps: object,
  onChange: func,
  tooltipPlacement: string,
  tooltipText: string,
  fileType: string,
  inputProps: object,
  singleButton: bool,
  showProgress: bool,
  progress: number,
  name: string,
  customValidation: func
};

export default CustomInputFile;
