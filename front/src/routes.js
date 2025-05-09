/*!

=========================================================
* Material Dashboard React - v1.8.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import GroupOutlinedIcon from "@material-ui/icons/GroupOutlined";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import BusinessOutlinedIcon from "@material-ui/icons/BusinessOutlined";
import ListOutlinedIcon from "@material-ui/icons/ListOutlined";
import SubscriptionsOutlinedIcon from "@material-ui/icons/SubscriptionsOutlined";
import ScannerOutlinedIcon from "@material-ui/icons/ScannerOutlined";
import LiveTvOutlinedIcon from "@material-ui/icons/LiveTvOutlined";
import LabelOutlinedIcon from "@material-ui/icons/LabelOutlined";
import FindInPageOutlinedIcon from "@material-ui/icons/FindInPageOutlined";
import NextWeekOutlinedIcon from "@material-ui/icons/NextWeekOutlined";
import GitHubIcon from "@material-ui/icons/GitHub";

// core components/views for Admin layout
import Companies from "views/Companies/Companies.js";
import Roles from "views/Roles/Roles.js";
import Release from "views/Release/Release.js";
import Projects from "views/Projects/Projects.js";
import Assets from "views/Assets/";
import Navigation from "views/Navigation/Navigation.js";
import Playlists from "views/Playlists/Playlists.js";
import EPG from "views/EPG/EPG.js";
import Metadata from "views/Metadata/Metadata.js";
import StaticPages from "views/StaticPages/Static.js";
import ChangePassword from "views/Auth/ChangePassword.js";
import Users from "views/Users/Users";
import NotFound from "views/NotFound/NotFound.js";
import WelcomePage from "views/Dashboard/WelcomePage.js";
import Promotions from "views/Promotions/Promotions";

const dashboardRoutes = [
  {
    path: "/dashboard",
    component: WelcomePage,
    hiddenFromMenu: true,
    layout: "/admin"
  },
  {
    path: "/project",
    name: "Projects",
    icon: LibraryBooks,
    component: Projects,
    layout: "/admin"
  },
  {
    path: "/static-page",
    name: "Static Pages",
    icon: FindInPageOutlinedIcon,
    component: StaticPages,
    layout: "/admin",
    include: ["articles"]
  },
  {
    path: "/company",
    name: "Companies",
    icon: BusinessOutlinedIcon,
    component: Companies,
    layout: "/admin"
  },
  {
    // do not remove ':type' because match params inside Users screen will be undefined
    path: "/users/:type",
    name: "Users",
    icon: GroupOutlinedIcon,
    component: Users,
    layout: "/admin"
  },
  {
    path: "/roles",
    name: "Roles",
    icon: Dashboard,
    component: Roles,
    layout: "/admin"
  },
  {
    path: "/asset",
    name: "Assets",
    icon: "content_paste",
    component: Assets,
    layout: "/admin"
  },
  {
    path: "/navigation",
    name: "Menu Structure",
    icon: ListOutlinedIcon,
    component: Navigation,
    layout: "/admin"
  },
  {
    path: "/playlist",
    name: "Playlists",
    icon: SubscriptionsOutlinedIcon,
    component: Playlists,
    layout: "/admin"
  },
  {
    // do not remove ':type' because match params inside EPG screen will be undefined
    path: "/epg/:type",
    name: "EPG",
    icon: ScannerOutlinedIcon,
    component: EPG,
    layout: "/admin"
  },

  {
    path: "/metadata",
    name: "Metadata",
    icon: LabelOutlinedIcon,
    component: Metadata,
    layout: "/admin"
  },
  {
    path: "/change-password",
    name: "Change password",
    component: ChangePassword,
    hiddenFromMenu: true,
    layout: "/admin"
  },
  {
    path: "/404",
    name: "Page not found",
    component: NotFound,
    hiddenFromMenu: true,
    layout: "/admin"
  },
  {
    path: "/banner",
    name: "Promotions",
    icon: NextWeekOutlinedIcon,
    component: Promotions,
    layout: "/admin"
  },
  {
    path: "/release",
    name: "Release",
    icon: GitHubIcon,
    component: Release,
    layout: "/admin",
    hiddenFromMenu: true,
  },
];

export default dashboardRoutes;
