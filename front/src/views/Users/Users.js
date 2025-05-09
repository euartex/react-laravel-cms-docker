import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router";

import { isAllowed, isAllowEdit } from "helpers/routeChecker";

// @material-ui/core components
import CustomTabs from "components/CustomTabs/CustomTabs.js";

// core components

// @material-ui/icons
import AppUsersTab from "./AppUsersTab";
import CmsUsersTable from "./CmsUsersTab";

export default function UserProfile() {
  // console.log('!!!', isAllowed("/articles"));


  const [defaultTab, setDefTab] = useState(0);
  // const [user, setUser] = useState();
  const { type } = useParams();
  const history = useHistory();

  useEffect(() => {
    let userObj = localStorage.getItem("user");
    if (!userObj) {
      history.push("/404");
    }
  }, []);

  useEffect(() => {
    if (type === "app" && isAllowed("/users/app")) {
      if (isAllowed("/users/cms")) setDefTab(1);
      else setDefTab(0);
    } else if (
      (type === "cms" || type === ":type") &&
      isAllowed("/users/cms")
    ) {
      setDefTab(0);
      if (type === ":type") {
        window.history.replaceState("", "", "/users/cms");
      }
    } else if (type === ":type" && isAllowed("/users/app")) {
      if (isAllowed("/users/cms")) setDefTab(1);
      else setDefTab(0);
      window.history.replaceState("", "", "/users/app");
    } else {
      history.push("/404");
    }
  }, [type]);

  const tabItems = [];
  if (isAllowed("/users/cms")) {
    tabItems.push({
      tabName: "CMS Users",
      tabContent: <CmsUsersTable allowEdit={isAllowEdit("cms.user")} />,
      path: "/users/cms"
    });
  }
  if (isAllowed("/users/app")) {
    tabItems.push({
      tabName: "APP Users",
      tabContent: <AppUsersTab allowEdit={isAllowEdit("app.user")} />,
      path: "/users/app"
    });
  }

  return (
    <div>
      <CustomTabs
        headerColor="info"
        tabs={tabItems}
        isNavigation={true}
        initialTab={defaultTab}
      ></CustomTabs>
    </div>
  );
}
