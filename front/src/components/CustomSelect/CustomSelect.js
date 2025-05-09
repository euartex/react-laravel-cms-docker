import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Select from "@material-ui/core/Select";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

import styles from "assets/jss/material-dashboard-react/components/customInputStyle.js";
import {
  grayColor,
  primaryColor
} from "assets/jss/material-dashboard-react.js";

const additionalStyles = {
  selectRoot: {
    background: "transparent",
    "&:focus": {
      background: "transparent"
    }
  }
};

const useStyles = makeStyles({ ...styles, ...additionalStyles });

export default function CustomSelect(props) {
  const classes = useStyles();
  const {
    formControlProps,
    labelText,
    id,
    labelProps,
    inputProps,
    error,
    success,
    value,
    onChange,
    options = [],
    isAutoComplete = false
  } = props;

  const labelClasses = classNames({
    [" " + classes.labelRootError]: error,
    [" " + classes.labelRootSuccess]: success && !error
  });

  const marginTop = classNames({
    [classes.marginTop]: labelText === undefined
  });
  return (
    <FormControl
      {...formControlProps}
      className={formControlProps?.className + " " + classes.formControl}
    >
      {!isAutoComplete && (
        <InputLabel
          htmlFor={id}
          className={classes.labelRoot + labelClasses}
          {...labelProps}
        >
          {labelText}
        </InputLabel>
      )}
      {isAutoComplete ? (
        <ThemeProvider theme={materialTheme}>
          <Autocomplete
            id={id}
            options={options}
            getOptionLabel={option => option.label}
            classes={{
              root: `${marginTop} ${classes.selectRoot}`
            }}
            renderInput={params => (
              <TextField
                {...params}
                InputLabelProps={{
                  className: classes.labelRoot + labelClasses
                }}
                label={labelText}
                autoComplete="off"
              />
            )}
            value={value}
            onChange={(event, newValue) => {
              onChange({
                target: {
                  name: inputProps?.name || id,
                  value: newValue?.value || ""
                }
              });
            }}
            getOptionSelected={(option, currentValue) =>
              currentValue.value === option.value
            }
          />
        </ThemeProvider>
      ) : (
        <Select
          native
          id={id}
          value={value}
          onChange={onChange}
          input={
            <Input
              classes={{
                underline: classes.underline
              }}
            />
          }
          {...inputProps}
          classes={{
            root: `${marginTop} ${classes.selectRoot}`,
            disabled: classes.disabled
          }}
        >
          <option aria-label="None" value="" />
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      )}
    </FormControl>
  );
}

const materialTheme = createMuiTheme({
  overrides: {
    MuiInput: {
      underline: {
        "&:hover:not($disabled):before,&:before": {
          borderColor: grayColor[4] + " !important",
          borderWidth: "1px !important"
        },
        "&:after": {
          borderColor: primaryColor[0],
          borderBottom: `2px solid ${primaryColor[0]}`
        }
      }
    },
    MuiFormLabel: {
      root: {
        color: "#AAAAAA !important"
      }
    }
  }
});

CustomSelect.propTypes = {
  labelText: PropTypes.node,
  labelProps: PropTypes.object,
  id: PropTypes.string,
  inputProps: PropTypes.object,
  formControlProps: PropTypes.object,
  error: PropTypes.bool,
  success: PropTypes.bool,
  value: PropTypes.any,
  onChange: PropTypes.func,
  options: PropTypes.array,
  isAutoComplete: PropTypes.bool
};
