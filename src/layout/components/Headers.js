import { cilMenu } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
} from "@coreui/react";
import { useDispatch, useSelector } from "react-redux";

import Logo from "src/assets/images/Logo.png";
import TheBreadcrumb from "./BreadCrumb";
import TheHeaderDropdown from "./HeaderDropdown";

const TheHeader = () => {
  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.sidebar.sidebarShow);
  //const auth = useSelector((state) => state.auth);

  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          onClick={() =>
            dispatch({ type: "set", sidebarShow: !Boolean(sidebarShow) })
          }
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderBrand
          className="mx-auto d-md-none"
          to="/"
          style={{ textAlign: "center" }}
        >
          <img src={Logo} className={`image-logo2`} alt="logo" />
          <div className="div-logo2">Demo . App . Testing</div>
        </CHeaderBrand>
        {/* <CHeaderNav className="d-none d-md-flex me-auto">
          <CNavItem>
            <CNavLink to="/dashboard" component={NavLink}>
              Dashboard
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">Users</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">Settings</CNavLink>
          </CNavItem>
        </CHeaderNav> */}
        {/* <CHeaderNav>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilBell} size="lg" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilList} size="lg" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilEnvelopeOpen} size="lg" />
            </CNavLink>
          </CNavItem>
        </CHeaderNav> */}
        <CHeaderNav className="ms-3">
          {/* <h4>{auth.name}</h4> */}
          <TheHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CHeaderDivider />
      <CContainer fluid>
        <TheBreadcrumb />
      </CContainer>
    </CHeader>
  );
};

export default TheHeader;
