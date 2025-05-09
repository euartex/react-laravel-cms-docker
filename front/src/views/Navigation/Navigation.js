import React from "react";
import { bool } from "prop-types";

// @material-ui/core components
import CustomTabs from "components/CustomTabs/CustomTabs.js";

// core components

// @material-ui/icons
import NavigationTab from "./NavigationTab";
import DeletedNavigationTab from "./DeletedNavigationTab";

const NavigationPage = ({ allowEdit }) => {
  return (
    <div>
      <CustomTabs
        headerColor="info"
        tabs={[
          {
            tabName: "Navigations",
            tabContent: <NavigationTab allowEdit={allowEdit} />
          },
          {
            tabName: "Deleted Navigations",
            tabContent: <DeletedNavigationTab />
          }
        ]}
      ></CustomTabs>
    </div>
  );
};

NavigationPage.propTypes = {
  allowEdit: bool
};

export default NavigationPage;
