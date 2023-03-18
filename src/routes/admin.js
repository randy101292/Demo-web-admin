import React from "react";

const Dashboard = React.lazy(() => import("../pages/Dashboard"));
const ServiceCenter = React.lazy(() => import("../pages/ServiceCenter"));
const ServiceCenterOthers = React.lazy(() =>
  import("../pages/ServiceCenterOthers")
);
const Users = React.lazy(() => import("../pages/Users"));
const Services = React.lazy(() => import("../pages/Services"));
const Bookings = React.lazy(() => import("../pages/Bookings"));
const Vouchers = React.lazy(() => import("../pages/Vouchers"));
const Vehicles = React.lazy(() => import("../pages/Vehicles"));
const Notifications = React.lazy(() => import("../pages/Notifications"));

const adminRoutes = [
  // { path: "/", exact: true, name: "Home" },
  {
    path: "dashboard",
    name: "Dashboard",
    element: Dashboard,
    key: "dashboard",
  },
  {
    path: "serviceCenter/",
    name: "Service Center",
    element: ServiceCenter,
    key: "service_center",
  },
  {
    path: "serviceCenter/:service_center_id/:service_center_name",
    name: "Service Center Others",
    element: ServiceCenterOthers,
    key: "service_center_others",
  },
  { path: "users/:type", name: "Users", element: Users, key: "users" },
  {
    path: "services",
    name: "Managed Services",
    element: Services,
    key: "services",
  },
  { path: "bookings", name: "Bookings", element: Bookings, key: "bookings" },
  { path: "vouchers", name: "Vouchers", element: Vouchers, key: "vouchers" },
  { path: "vehicles", name: "Vehicles", element: Vehicles, key: "vehicles" },
  {
    path: "notifications/:type",
    name: "Notifications",
    element: Notifications,
    key: "notifications",
  },
];

export default adminRoutes;
