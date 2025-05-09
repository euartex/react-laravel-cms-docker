import React, { useState } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import debounce from "lodash.debounce";

// @material-ui/core components
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { createMuiTheme, Tooltip } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Chip from "@material-ui/core/Chip";
import Cancel from "@material-ui/icons/Cancel";
import Button from "components/CustomButtons/Button.js";

import MenuItem from "@material-ui/core/MenuItem";
import Input from "@material-ui/core/Input";
import Autocomplete, {
  createFilterOptions
} from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

import styles from "assets/jss/material-dashboard-react/components/customInputStyle.js";
import {
  infoColor,
  whiteColor,
  successColor,
  warningColor,
  dangerColor,
  primaryColor,
  grayColor
} from "assets/jss/material-dashboard-react.js";

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300
  },
  chips: {
    display: "flex",
    flexWrap: "wrap"
  },
  chip: {
    margin: 2,
    maxWidth: "90%"
  },
  // chip styles by color name from props, default it's grey
  info: {
    margin: 2,
    backgroundColor: infoColor[3],
    color: whiteColor,
    maxWidth: "90%"
  },
  success: {
    margin: 2,
    backgroundColor: successColor[0],
    color: whiteColor
  },
  warning: {
    margin: 2,
    backgroundColor: warningColor[0],
    color: whiteColor
  },
  danger: {
    margin: 2,
    backgroundColor: dangerColor[0],
    color: whiteColor
  },
  primary: {
    margin: 2,
    backgroundColor: primaryColor[0],
    color: whiteColor
  },
  noLabel: {
    marginTop: theme.spacing(3)
  },
  select: {
    "&:focus": {
      backgroundColor: "transparent !important"
    }
  },
  clearModal: {
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
  clearModalContent: {
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
  ...styles
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

const CustomMultiSelect = ({
  labelText,
  error,
  success,
  formControlProps = {},
  id,
  labelProps,
  value = [],
  onChange,
  options = [],
  chipColor,
  inputProps,
  isAutoComplete = false,
  isCreatable = false,
  tooltipPlacement = "top-start",
  tooltipText = "Start typing to add an option",
  onSearch,
  secureClearing = false
}) => {
  const [confirmClearIsOpened, setConfirmOpened] = useState(false);
  const classes = useStyles();
  const theme = useTheme();
  const labelClasses = classNames({
    [" " + classes.labelRootError]: error,
    [" " + classes.labelRootSuccess]: success && !error
  });
  const underlineClasses = classNames({
    [classes.underlineError]: error,
    [classes.underlineSuccess]: success && !error,
    [classes.underline]: true
  });

  const getStyles = (currentOption, selectedOptions, theme) => {
    return {
      fontWeight: selectedOptions?.includes(currentOption.value)
        ? theme.typography.fontWeightMedium
        : theme.typography.fontWeightRegular
    };
  };

  const filter = createFilterOptions();

  const creatableProps = isCreatable
    ? {
        selectOnFocus: true,
        clearOnBlur: true,
        handleHomeEndKeys: true,
        freeSolo: true,
        filterOptions: (options, params) => {
          const filtered = filter(options, params);

          // Suggesting the creation of a new value
          if (params.inputValue !== "") {
            filtered.push({
              value: params.inputValue,
              label: `Add "${params.inputValue}"`
            });
          }

          return filtered;
        }
      }
    : {};

  const delayedQuery = debounce(query => {
    if (typeof onSearch === "function") {
      onSearch(query);
    }
  }, 500);

  const onChangeInput = e => {
    delayedQuery(e.target.value);
  };

  return (
    <>
      <FormControl
        {...formControlProps}
        className={formControlProps.className + " " + classes.formControl}
      >
        {labelText !== undefined && !isAutoComplete ? (
          <InputLabel
            className={classes.labelRoot + labelClasses}
            htmlFor={id}
            {...labelProps}
          >
            {labelText}
          </InputLabel>
        ) : null}

        {isAutoComplete ? (
          <ThemeProvider theme={materialTheme}>
            <Autocomplete
              {...creatableProps}
              multiple
              disableCloseOnSelect={true}
              id={id}
              options={options}
              filterSelectedOptions
              getOptionLabel={option => option.label}
              classes={{
                root: `${classes.select}`
              }}
              getOptionSelected={(option, currentValue) =>
                currentValue.value === option.value
              }
              value={value}
              onChange={(event, newValue, reason) => {
                if (reason === "clear" && secureClearing) {
                  setConfirmOpened(true);
                  return;
                }

                /**
                 * if isCreatable, in parent component detect created option by value type string
                 */
                onChange({
                  target: { name: inputProps?.name || id, value: newValue }
                });
              }}
              renderInput={params =>
                isCreatable ? (
                  <Tooltip
                    id={tooltipPlacement}
                    title={tooltipText}
                    placement={tooltipPlacement}
                  >
                    <TextField
                      {...params}
                      InputLabelProps={{
                        className: classes.labelRoot + labelClasses
                      }}
                      label={labelText}
                      autoComplete="off"
                      onChange={onChangeInput}
                    />
                  </Tooltip>
                ) : (
                  <TextField
                    {...params}
                    InputLabelProps={{
                      className: classes.labelRoot + labelClasses
                    }}
                    label={labelText}
                    autoComplete="off"
                  />
                )
              }
              renderTags={(selected, getTagProps) =>
                selected.map((option, index) => {
                  //assets with status draft should be gray, options with status field for assets
                  let status = options.find(
                    optionItem =>
                      optionItem.value === option?.value ||
                      optionItem.value === option
                  )?.status;

                  let label =
                    options.find(
                      optionItem =>
                        optionItem.value === option?.value ||
                        optionItem.value === option
                    )?.label ||
                    option?.label ||
                    "";
                  if (option?.label?.toLowerCase().includes("add")) {
                    label = option.label.split('"')[1];
                  }

                  return (
                    <Chip
                      {...getTagProps({ index })}
                      key={JSON.stringify(option)}
                      label={label}
                      //assets with status draft should be gray
                      className={
                        chipColor && status !== "draft"
                          ? classes[chipColor]
                          : classes.chip
                      }
                      onDelete={() => {
                        onChange({
                          target: {
                            value: selected.filter(item => item !== option),
                            name: inputProps?.name || id
                          }
                        });
                      }}
                    />
                  );
                })
              }
            />
            {confirmClearIsOpened && (
              <div
                className={classes.clearModal}
                onClick={() => setConfirmOpened(false)}
              >
                <div
                  className={classes.clearModalContent}
                  onClick={e => e.stopPropagation()}
                >
                  <p className={classes.centered}>
                    You want to clear all items! Are you sure?
                  </p>
                  <Button onClick={() => setConfirmOpened(false)}>No</Button>
                  <Button
                    color="info"
                    onClick={() => {
                      onChange({
                        target: {
                          value: [],
                          name: inputProps?.name || id
                        }
                      });
                      setConfirmOpened(false);
                    }}
                  >
                    Yes
                  </Button>
                </div>
              </div>
            )}
          </ThemeProvider>
        ) : (
          <Select
            id={id}
            multiple
            value={value}
            onChange={onChange}
            input={
              <Input
                id={id}
                classes={{
                  disabled: classes.disabled,
                  underline: underlineClasses
                }}
                inputProps={{
                  name: inputProps?.name || id
                }}
              />
            }
            renderValue={selected => (
              <div className={classes.chips}>
                {(Array.isArray(selected) || []).map(value => {
                  const { label } = options.find(
                    option =>
                      option.value === value?.value || option.value === value
                  );
                  return (
                    <Chip
                      key={value.toString()}
                      label={label}
                      deleteIcon={
                        <div onMouseDown={e => e.stopPropagation()}>
                          <Cancel />
                        </div>
                      }
                      className={chipColor ? classes[chipColor] : classes.chip}
                      onDelete={() => {
                        onChange({
                          target: {
                            value: selected.filter(item => item !== value),
                            name: inputProps?.name || id
                          }
                        });
                      }}
                    />
                  );
                })}
              </div>
            )}
            MenuProps={MenuProps}
            classes={{ select: classes.select }}
          >
            {options.map(option => (
              <MenuItem
                key={option.value}
                value={option.value}
                style={getStyles(option, value, theme)}
              >
                {option.label}
              </MenuItem>
            ))}
          </Select>
        )}
      </FormControl>
    </>
  );
};

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

CustomMultiSelect.propTypes = {
  labelText: PropTypes.node,
  labelProps: PropTypes.object,
  id: PropTypes.string,
  inputProps: PropTypes.object,
  formControlProps: PropTypes.object,
  error: PropTypes.bool,
  success: PropTypes.bool,
  value: PropTypes.any,
  onChange: PropTypes.func,
  onClear: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number,
      label: PropTypes.string
    })
  ),
  chipColor: PropTypes.oneOf([
    "warning",
    "success",
    "danger",
    "info",
    "primary"
  ]),
  isAutoComplete: PropTypes.bool,
  isCreatable: PropTypes.bool,
  tooltipPlacement: PropTypes.string,
  tooltipText: PropTypes.string,
  onSearch: PropTypes.func,
  secureClearing: PropTypes.bool
};

export default CustomMultiSelect;
