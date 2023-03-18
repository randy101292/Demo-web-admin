import {
  cilBellExclamation,
  cilBook,
  cilCarAlt,
  cilCog,
  cilGarage,
  cilGraph,
  cilTag,
  cilUser,
} from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import {
  CNavGroup,
  CNavItem,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarToggler,
} from "@coreui/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
// sidebar nav config
// import navigation from "../../_nav";
import { NavLink, useLocation } from "react-router-dom";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import Logo from "src/assets/images/Logo.png";
import { canAccess } from "src/utils/common";

const AppSidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const unfoldable = useSelector((state) => state.sidebar.sidebarUnfoldable);
  const sidebarShow = useSelector((state) =>
    Boolean(state.sidebar.sidebarShow)
  );

  const permissions = useSelector((state) => state.auth.permissions);

  return (
    <CSidebar position="fixed" unfoldable={unfoldable} visible={sidebarShow}>
      <CSidebarBrand className="d-none d-md-flex" to="/">
        {/* <CIcon className="sidebar-brand-full" icon={logoNegative} height={35} /> */}
        <div className="text-center">
          <img
            src={Logo}
            className={`image-logo2 ${unfoldable ? "foldable" : ""}`}
            alt="logo"
          />
          <div className="div-logo2">Demo . App . Testing</div>
        </div>
        {/* <CIcon className="sidebar-brand-narrow" icon={sygnet} height={35} /> */}
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar>
          {permissions && permissions.length !== 0 ? (
            <>
              {canAccess("dashboard") ? (
                <CNavItem component={NavLink} name="Dashboard" to="/dashboard">
                  <CIcon icon={cilGraph} customClassName="nav-icon" />
                  Dashboard
                </CNavItem>
              ) : (
                ""
              )}

              {canAccess("view managed services") ? (
                <CNavItem
                  component={NavLink}
                  name="Managed Services"
                  to="/services"
                >
                  <CIcon icon={cilCog} customClassName="nav-icon" />
                  Managed Services
                </CNavItem>
              ) : (
                ""
              )}

              {canAccess("view vehicles") ? (
                <CNavItem component={NavLink} name="Vehicles" to="/vehicles">
                  <CIcon icon={cilCarAlt} customClassName="nav-icon" />
                  Vehicles
                </CNavItem>
              ) : (
                ""
              )}

              {canAccess("view service centers") ? (
                <CNavItem
                  component={NavLink}
                  name="Services Center"
                  to="/serviceCenter"
                >
                  <CIcon icon={cilGarage} customClassName="nav-icon" />
                  Service Center
                </CNavItem>
              ) : (
                ""
              )}

              {canAccess("view bookings") ? (
                <CNavItem component={NavLink} name="Bookings" to="/bookings">
                  <CIcon icon={cilBook} customClassName="nav-icon" />
                  Bookings
                </CNavItem>
              ) : (
                ""
              )}

              {canAccess("view vouchers") ? (
                <CNavItem component={NavLink} name="Vouchers" to="/vouchers">
                  <CIcon icon={cilTag} customClassName="nav-icon" />
                  Vouchers
                </CNavItem>
              ) : (
                ""
              )}

              {canAccess("view notification") ? (
                <CNavGroup
                  idx="2"
                  visible={location.pathname.startsWith("/notifications")}
                  name="Notifications"
                  toggler={
                    <>
                      <CIcon
                        icon={cilBellExclamation}
                        customClassName="nav-icon"
                      />
                      Notifications
                    </>
                  }
                >
                  <CNavItem
                    component={NavLink}
                    name="Accordion"
                    to="/notifications/request"
                  >
                    Add
                  </CNavItem>

                  {canAccess("view approve notification") ? (
                    <CNavItem
                      component={NavLink}
                      name="Accordion"
                      to="/notifications/approved"
                    >
                      Approved
                    </CNavItem>
                  ) : (
                    ""
                  )}

                  {/*canAccess("view reject notification") ? (
                    <CNavItem
                      component={NavLink}
                      name="Accordion"
                      to="/notifications/rejected"
                    >
                      Rejected
                    </CNavItem>
                  ) : (
                    ""
                  )*/}
                </CNavGroup>
              ) : (
                ""
              )}
              <CNavGroup
                idx="1"
                visible={location.pathname.startsWith("/users")}
                name="Users"
                toggler={
                  <>
                    <CIcon icon={cilUser} customClassName="nav-icon" />
                    Users
                  </>
                }
              >
                {permissions.users && permissions.users.admin ? (
                  <CNavItem
                    component={NavLink}
                    name="Accordion"
                    to="/users/admin"
                  >
                    Admin
                  </CNavItem>
                ) : (
                  ""
                )}

                {canAccess("view user admin staff") ? (
                  <CNavItem
                    component={NavLink}
                    name="Accordion"
                    to="/users/admin-staff"
                  >
                    Admin Staff
                  </CNavItem>
                ) : (
                  ""
                )}

                {canAccess("view user branch manager") ? (
                  <CNavItem
                    component={NavLink}
                    name="Accordion"
                    to="/users/branch-manager"
                  >
                    Corporate Manager
                  </CNavItem>
                ) : (
                  ""
                )}

                {canAccess("view user branch staff") ? (
                  <CNavItem
                    component={NavLink}
                    name="Accordion"
                    to="/users/branch-staff"
                  >
                    Branch Manager
                  </CNavItem>
                ) : (
                  ""
                )}

                {canAccess("view user order monitoring staff") ? (
                  <CNavItem
                    component={NavLink}
                    name="Accordion"
                    to="/users/order-monitoring-staff"
                  >
                    Branch Advisor
                  </CNavItem>
                ) : (
                  ""
                )}

                {canAccess("view user customer") ? (
                  <CNavItem
                    component={NavLink}
                    name="Accordion"
                    to="/users/customer"
                  >
                    Customer
                  </CNavItem>
                ) : (
                  ""
                )}
              </CNavGroup>
            </>
          ) : (
            ""
          )}
        </SimpleBar>
      </CSidebarNav>
      <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() =>
          dispatch({
            type: "set",
            sidebarUnfoldable: !Boolean(unfoldable),
          })
        }
      />
    </CSidebar>
  );
};

export default React.memo(AppSidebar);
