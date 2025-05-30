import React, { useState, useRef, useEffect } from "react";
import { func, number, bool } from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";

import "./style.css";

const styles = {
  customInput: {
    maxWidth: "160px"
  },
  noMargin: {
    marginLeft: 0,
    marginRight: 0
  }
};

const useStyles = makeStyles(styles);

const OrderInput = ({
  assetId,
  order,
  disabled,
  handleStopChange,
  assetsCount,
  assetIndex
}) => {
  const [orderValue, setOrderValue] = useState(order);
  const inputRef = useRef(null);
  const [errorMsg, setError] = useState("");

  useEffect(() => {
    setOrderValue(order);
  }, [order]);

  const classes = useStyles();

  return (
    <Tooltip
      id="tooltip-top"
      title="To finish editing press outside this field or press enter"
      placement="top"
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <TextField
          inputRef={inputRef}
          disabled={disabled}
          variant="outlined"
          size="small"
          classes={{
            root: classes.customInput
          }}
          type="number"
          value={orderValue}
          name="assetOrder"
          autoComplete="off"
          onChange={e => {
            const onlyDigitsMoreZeroAndEmptyStr = new RegExp(
              "^(s*|[1-9][0-9]*)$"
            );
            if (
              onlyDigitsMoreZeroAndEmptyStr.test(e.target.value) &&
              !e.target.value.includes("e")
            ) {
              setError("");
              setOrderValue(e.target.value);
            }
            if (parseInt(e.target.value) > assetsCount) {
              setError(
                `New order should not be more then the last index ${assetsCount}`
              );
            }
            if (!parseInt(e.target.value)) {
              setError("Invalid number");
            }
          }}
          onBlur={() => {
            if (
              parseInt(orderValue) <= assetsCount &&
              orderValue - 1 !== assetIndex
            ) {
              handleStopChange(assetId, assetIndex, orderValue);
            }
          }}
          onKeyUp={e => {
            // The keyCode 13 is the enter
            if (
              e.keyCode === 13 &&
              inputRef?.current &&
              parseInt(orderValue) <= assetsCount &&
              orderValue - 1 !== assetIndex
            ) {
              inputRef.current.blur();
            }
            return;
          }}
          error={Boolean(errorMsg)}
          helperText={errorMsg}
          FormHelperTextProps={{
            classes: {
              contained: classes.noMargin
            }
          }}
        />
      </div>
    </Tooltip>
  );
};

OrderInput.propTypes = {
  assetId: number,
  order: number,
  disabled: bool,
  handleStopChange: func,
  assetsCount: number,
  assetIndex: number
};

export default OrderInput;
