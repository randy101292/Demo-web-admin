import CIcon from "@coreui/icons-react";
import React from "react";

const _nav = [
  {
    _tag: "CSidebarNavItem",
    name: "Dashboard",
    to: "/dashboard",
    icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon" />,
  },
  {
    _tag: "CSidebarNavItem",
    name: "Service Center",
    to: "/serviceCenter",
    icon: <CIcon name="cil-bell" customClasses="c-sidebar-nav-icon" />,
  },
  {
    _tag: "CSidebarNavDropdown",
    name: "Users",
    route: "/users",
    icon: "cil-user",
    _children: [
      {
        _tag: "CSidebarNavItem",
        name: "Admin",
        to: "/users/admin",
      },
      {
        _tag: "CSidebarNavItem",
        name: "Staff",
        to: "/users/staff",
      },
      {
        _tag: "CSidebarNavItem",
        name: "Branch Admins",
        to: "/users/branch-manager",
      },
      // {
      //   _tag: "CSidebarNavItem",
      //   name: "Branch Staffs",
      //   to: "/users/breadcrumbs",
      // },
      {
        _tag: "CSidebarNavItem",
        name: "Riders",
        to: "/users/rider",
      },
      {
        _tag: "CSidebarNavItem",
        name: "Merchants",
        to: "/users/breadcrumbs",
      },
      {
        _tag: "CSidebarNavItem",
        name: "Customers",
        to: "/users/customers",
      },
    ],
  },
  {
    _tag: "CSidebarNavItem",
    name: "Merchants",
    to: "/merchant",
    icon: "cil-bell",
  },
  {
    _tag: "CSidebarNavItem",
    name: "Products",
    to: "/products",
    icon: "cil-bell",
  },
  {
    _tag: "CSidebarNavItem",
    name: "Orders",
    to: "/orders",
    icon: "cil-bell",
  },
  {
    _tag: "CSidebarNavItem",
    name: "Batch Orders",
    to: "/batch-orders",
    icon: "cil-bell",
  },
  {
    _tag: "CSidebarNavItem",
    name: "Vouchers",
    to: "/vouchers",
    icon: "cil-bell",
  },
  {
    _tag: "CSidebarNavItem",
    name: "Zones",
    to: "/zones",
    icon: "cil-bell",
  },
  {
    _tag: "CSidebarNavItem",
    name: "Shipping & Delivery",
    to: "/shipping-delivery",
    icon: "cil-bell",
  },
];

export default _nav;
