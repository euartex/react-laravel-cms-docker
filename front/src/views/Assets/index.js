import React from "react";

// @material-ui/core components
import CustomTabs from "components/CustomTabs/CustomTabs.js";

import Assets from "./Assets";
import Livefeeds from "./Livefeeds";
import { isAllowed, isAllowEdit } from "helpers/routeChecker";

export default function AssetsTabs() {
  const tabsArr = [];

  if (isAllowed("/asset")) {
    tabsArr.push({
      tabName: "Videos",
      tabContent: <Assets allowEdit={isAllowEdit("asset")} />
    });
  }

  if (isAllowed("/livefeed")) {
    tabsArr.push({
      tabName: "Livefeeds",
      //TODO: there is some bug if allowEdit = false(table always empty)
      tabContent: <Livefeeds allowEdit={isAllowEdit("livefeed")} />
    });
  }
  return (
    <div>
      <CustomTabs headerColor="info" tabs={tabsArr}></CustomTabs>
    </div>
  );
}
