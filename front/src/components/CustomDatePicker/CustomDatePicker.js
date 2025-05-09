import React from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  KeyboardDateTimePicker
} from "@material-ui/pickers";

import DateFnsUtils from "@date-io/date-fns";
import {
  infoColor,
  grayColor,
  primaryColor
} from "assets/jss/material-dashboard-react.js";
import buttonStyle from "assets/jss/material-dashboard-react/components/buttonStyle.js";

const styles = {
  datePicker: {
    width: "100%",
    marginTop: "50px"
  }
};
const useStyles = makeStyles(styles);
const useButtonStyles = makeStyles(buttonStyle);

const CustomDatePicker = ({
  handleDateChange,
  value,
  label,
  id,
  name,
  disablePast = false,
  withTime = false,
  format = "MM/dd/yyyy, HH:mm",
  mask = "__/__/____, __:__",
  maxDate,
  maxDateMessage
}) => {
  const classes = useStyles();
  const buttonClasses = useButtonStyles();

  const okBtnClasses = `${buttonClasses.button} ${buttonClasses["info"]}`;

  return (
    <ThemeProvider theme={materialTheme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        {withTime ? (
          <KeyboardDateTimePicker
            className={classes.datePicker}
            id={id}
            label={label}
            format={format}
            value={value}
            inputProps={{
              name
            }}
            onChange={handleDateChange}
            KeyboardButtonProps={{
              "aria-label": "change date"
            }}
            disablePast={disablePast}
            okLabel={<span className={okBtnClasses}>Ok</span>}
            cancelLabel={<span className={buttonClasses.button}>Cancel</span>}
            variant="dialog"
            invalidDateMessage={`Date should be in format: ${format}`}
            mask={mask}
            maxDate={maxDate}
            maxDateMessage={maxDateMessage}
            strictCompareDates
          />
        ) : (
          <KeyboardDatePicker
            className={classes.datePicker}
            id={id}
            label={label}
            format="MM/dd/yyyy"
            value={value}
            inputProps={{
              name
            }}
            onChange={handleDateChange}
            KeyboardButtonProps={{
              "aria-label": "change date"
            }}
            disablePast={disablePast}
            okLabel={<span className={okBtnClasses}>Ok</span>}
            cancelLabel={<span className={buttonClasses.button}>Cancel</span>}
            variant="dialog"
            invalidDateMessage={`Date should be in format: ${format}`}
            mask={mask}
          />
        )}
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  );
};

CustomDatePicker.propTypes = {
  handleDateChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  id: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  disablePast: PropTypes.bool,
  withTime: PropTypes.bool,
  mask: PropTypes.string,
  format: PropTypes.string,
  maxDate: PropTypes.string,
  maxDateMessage: PropTypes.string
};

const materialTheme = createMuiTheme({
  overrides: {
    MuiPickerDTTabs: {
      tabs: {
        backgroundColor: grayColor[0]
      }
    },
    PrivateTabIndicator: {
      colorSecondary: {
        backgroundColor: primaryColor[3]
      }
    },
    MuiPickersToolbar: {
      toolbar: {
        backgroundColor: infoColor[0]
      }
    },
    MuiPickersDay: {
      today: {
        backgroundColor: infoColor[0]
      },
      daySelected: {
        backgroundColor: infoColor[0],
        "&:hover": {
          backgroundColor: infoColor[0]
        }
      },
      current: {
        color: infoColor[0]
      }
    },
    MuiButton: {
      textPrimary: {
        color: infoColor[0],
        "&:hover": {
          backgroundColor: "transparent"
        }
      }
    },
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
    },
    MuiPickersClock: {
      pin: {
        backgroundColor: infoColor[0]
      }
    },
    MuiPickersClockPointer: {
      pointer: {
        backgroundColor: infoColor[0]
      },
      thumb: {
        borderColor: infoColor[0]
      }
    }
  }
});

export default CustomDatePicker;
