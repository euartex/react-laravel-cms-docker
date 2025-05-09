import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import styles from "assets/jss/material-dashboard-react/components/typographyStyle.js";

const useStyles = makeStyles(styles);

export default function Muted(props) {
  const classes = useStyles();
  const { children, className } = props;
  const styleClasses = classNames({
    [classes.defaultFontStyle]: true,
    [classes.mutedText]: true,
    [className]: className !== undefined
  });

  return <div className={styleClasses}>{children}</div>;
}

Muted.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};
