import React from "react";
import { useLocation } from "react-router-dom";

import adminRoutes from "../../routes/admin";

import { CBreadcrumb, CBreadcrumbItem } from "@coreui/react";

const BreadCrumb = () => {
  const currentLocation = useLocation().pathname;

  const getRouteName = (pathname, routes) => {
    const currentRoute = routes.find(
      (route) => ("/" + route.path).indexOf(pathname) > -1
    );

    return currentRoute ? currentRoute.name : false;
  };

  const getBreadcrumbs = (location) => {
    const breadcrumbs = [];
    location.split("/").reduce((prev, curr, index, array) => {
      const currentPathname = `${prev}/${curr}`;
      const routeName = getRouteName(currentPathname, adminRoutes);
      routeName &&
        breadcrumbs.push({
          pathname: currentPathname,
          name: routeName,
          //active: index + 1 === array.length ? true : false,
          active: true,
        });
      return currentPathname;
    });
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs(currentLocation);

  return (
    <CBreadcrumb className="m-0 ms-2">
      <CBreadcrumbItem href="/">Home</CBreadcrumbItem>
      {breadcrumbs.map((breadcrumb, index) => {
        return (
          <CBreadcrumbItem
            {...(breadcrumb.active
              ? { active: true }
              : { href: breadcrumb.pathname })}
            key={index}
          >
            {breadcrumb.name}
          </CBreadcrumbItem>
        );
      })}
    </CBreadcrumb>
  );
};

export default React.memo(BreadCrumb);
