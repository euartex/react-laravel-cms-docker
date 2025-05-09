const defaultPermissions = ["404", "dashboard", "change.password", "release"];

export const isPermissionView = slug =>
  slug.includes("index") || slug.includes(".show");
export const isPermissionEdit = slug =>
  slug && !slug.includes("index") && !slug.includes(".show");

export const isAllowed = (path, include = null) => {
  let permissions = defaultPermissions;
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : {};

  if (user?.role) {
    permissions = [
      ...permissions,
      ...user.role.permissions
        .filter(permit => isPermissionView(permit.slug))
        .map(curr => curr.slug)
    ];
  }

  if (path === "/" || path === "") {
    return true;
  }
  if (path.includes("users")) {
    const userRoteArr = path.split("/");
    if (userRoteArr[2] === ":type") {
      return permissions.some(
        permit => permit.includes("cms.user") || permit.includes("app.user")
      );
    }
    /**
     * pathname can be '/users/cms' or '/users/app'
     * meanwhile permission is 'user.cms' or 'user.app'
     */
    const pathnameToCheckPermission = `${userRoteArr[2]}.${userRoteArr[1].slice(
      0,
      -1
    )}`;

    return permissions.some(permit =>
      permit.includes(pathnameToCheckPermission)
    );
  } else if (path.includes("epg")) {
    const epgRoteArr = path.split("/");

    if (epgRoteArr[2] === ":type") {
      return permissions.some(
        permit => permit.includes("show.") || permit.includes("program")
      );
    }

    return permissions.some(permit => permit.includes(epgRoteArr[2]));
  } else if (path.includes("metadata")) {
    return permissions.some(
      permit => permit.includes("metatdata") || permit.includes("tag")
    );
  } else if (path.includes("asset")) {
    return permissions.some(
      permit => permit.includes("asset") || permit.includes("livefeed")
    );
  } else if (path.includes("static-page")) { // || include.includes(relative)

     console.log('DONE', permissions, include);
    return permissions.some(
        permit => permit.includes("static.page")
      // permit => permit.includes("static.page") || (include && permit.includes(include))
    );
  } else if (path.includes("articles")) {
    console.log('WORK2');
    return permissions.some(
        permit => permit.includes("article")
    );
  } else {
    /**
     * app routing contain '-' if pathname consists of several words
     * API permission if consists of several words separates by '.'
     * substring(1) - remove '/' at the pathname beginning
     */
    if (path.includes("-")) {
      return permissions.some(permission =>
        permission.includes(path.replace(/-/g, ".").substring(1))
      );
    }

    return permissions.some(permit => permit.includes(path.substring(1)));
  }
};

export const isAllowEdit = itemToCheck => {
  let permissions = defaultPermissions;

  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : {};

  if (user?.role) {
    permissions = [
      ...permissions,
      ...user.role.permissions.filter(permit => isPermissionEdit(permit.slug))
    ];
  }

  return permissions
    .filter(permit => isPermissionEdit(permit?.slug || ""))
    .some(perm => perm.slug.includes(itemToCheck));
};
