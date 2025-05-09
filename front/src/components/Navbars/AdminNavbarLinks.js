import React from "react";
import classNames from "classnames";
import { useHistory } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Hidden from "@material-ui/core/Hidden";
import Poppers from "@material-ui/core/Popper";
import Divider from "@material-ui/core/Divider";
// @material-ui/icons
import Person from "@material-ui/icons/Person";
// core components
import Button from "components/CustomButtons/Button.js";
import LogoutModal from "components/LogoutModal/LogoutModal.js";
import PopupNotification from "components/PopupNotification/PopupNotification.js";

import styles from "assets/jss/material-dashboard-react/components/headerLinksStyle.js";
import axiosInstance from "config/axiosInstance";

const useStyles = makeStyles(styles);

export default function AdminNavbarLinks() {
  const classes = useStyles();
  const history = useHistory();

  const [openProfile, setOpenProfile] = React.useState(null);
  const [status, setStatus] = React.useState("success");
  const [message, setMessage] = React.useState("This is fine");
  const [isLogoutModalVisible, setIsLogoutModalVisible] = React.useState(false);

  const notificationRef = React.useRef(null);

  const handleClickProfile = event => {
    if (openProfile && openProfile.contains(event.target)) {
      setOpenProfile(null);
    } else {
      setOpenProfile(event.currentTarget);
    }
  };

  const handleCloseProfile = () => {
    setOpenProfile(null);
  };

  const handleChangePassword = () => {
    setOpenProfile(null);
    history.push("/change-password");
  };

  const handleLogoutConfirm = () => {
    setIsLogoutModalVisible(false);
    axiosInstance
      .post("/auth/logout")
      .then(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        localStorage.removeItem("expire");
        window.location = "/login";
      })
      .catch(error => {
        setStatus("danger");
        setMessage(error?.response?.data?.message || "Something went wrong");
        return notificationRef?.current?.showNotification();
      });
  };

  return (
    <div>
      <div className={classes.manager}>
        <Button
          color={window.innerWidth > 959 ? "transparent" : "white"}
          justIcon={window.innerWidth > 959}
          simple={!(window.innerWidth > 959)}
          aria-owns={openProfile ? "profile-menu-list-grow" : null}
          aria-haspopup="true"
          onClick={handleClickProfile}
          className={classes.buttonLink}
        >
          <Person className={classes.icons} />
          <Hidden mdUp implementation="css">
            <p className={classes.linkText}>Profile</p>
          </Hidden>
        </Button>
        <Poppers
          open={Boolean(openProfile)}
          anchorEl={openProfile}
          transition
          disablePortal
          className={
            classNames({ [classes.popperClose]: !openProfile }) +
            " " +
            classes.popperNav
          }
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id="profile-menu-list-grow"
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom"
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleCloseProfile}>
                  <MenuList role="menu">
                    <MenuItem
                      className={classes.dropdownItem}
                      onClick={handleChangePassword}
                    >
                      Change Password
                    </MenuItem>
                    <Divider light />
                    <MenuItem
                      onClick={() => {
                        handleCloseProfile();
                        setIsLogoutModalVisible(true);
                      }}
                      className={classes.dropdownItem}
                    >
                      Logout
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Poppers>
      </div>

      <LogoutModal
        open={isLogoutModalVisible}
        onClose={() => setIsLogoutModalVisible(false)}
        onConfirm={() => {
          handleLogoutConfirm();
          setIsLogoutModalVisible(false);
        }}
      />
      {message && (
        <PopupNotification
          ref={notificationRef}
          status={status}
          message={message}
        />
      )}
    </div>
  );
}
