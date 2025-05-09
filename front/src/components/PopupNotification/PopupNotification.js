import React from "react";
import { string, func, any } from "prop-types";

import Snackbar from "components/Snackbar/Snackbar.js";

// Had to use class in order to have an access to its `showNotification` method in other components
class PopupNotification extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showPopup: false };
  }

  showNotification = () => {
    this.setState({ showPopup: true });
    const self = this;
    setTimeout(function() {
      self.setState({ showPopup: false });
      if (typeof self.props.onHideNotification === "function") {
        self.props.onHideNotification();
      }
    }, 5000);
  };

  render() {
    const { showPopup } = this.state;
    const { status, message, itemRef } = this.props;

    return (
      <Snackbar
        itemRef={itemRef}
        place="tr"
        color={status}
        message={message}
        open={showPopup}
        closeNotification={() => {
          this.setState({ showPopup: false });
          if (typeof this.props.onHideNotification === "function") {
            this.props.onHideNotification();
          }
        }}
        close
      />
    );
  }
}

PopupNotification.propTypes = {
  status: string,
  message: string,
  itemRef: any,
  onHideNotification: func
};

PopupNotification.defaultProps = {
  status: "info",
  message: "Something happens"
};

export default PopupNotification;
