import { cilLockLocked } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
} from "@coreui/react";
import axios from "axios";
import Cookie from "js-cookie";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import adminRoutes from "src/routes/admin";
import { laravelUrl } from "src/utils/url";
import Logo from "../assets/images/Logo.png";
import { login } from "../store/auth/AuthAction";

const ResetUserPassword = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { addToast } = useToasts();
  const [passwordError, setPasswordError] = useState("");
  const [confPasswordError, setConfPasswordError] = useState("");

  const [form, setForm] = useState({
    password: "",
    confirm_password: "",
  });

  const handleLogin = (e) => {
    nav("/login");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const signIn = () => {
    setLoading(true);
    let hasErrorPassWord = false;
    let hasErrorConfPassWord = false;

    if (
      form.password === "" ||
      form.password === undefined ||
      form.password === null
    ) {
      setPasswordError("Password is mandatory!");
      hasErrorPassWord = true;
    } else {
      hasErrorPassWord = false;
      setPasswordError("");
    }

    if (
      form.confirm_password === "" ||
      form.confirm_password === undefined ||
      form.confirm_password === null
    ) {
      setConfPasswordError("Confirm Password is mandatory!");
      hasErrorConfPassWord = true;
    } else {
      hasErrorConfPassWord = false;
      setConfPasswordError("");
    }

    if (form.password !== "" && form.confirm_password !== "") {
      if (form.password !== form.confirm_password) {
        setPasswordError("Password is not equal to Confirm Password!");
        setConfPasswordError("Password is not equal to Confirm Password!");
        hasErrorPassWord = true;
        hasErrorConfPassWord = true;
      } else {
        hasErrorPassWord = false;
        hasErrorConfPassWord = false;
        setPasswordError("");
        setConfPasswordError("");
      }
    }

    if (!hasErrorPassWord && !hasErrorConfPassWord) {
      axios
        .post(laravelUrl(`api/admin/login`), form)
        .then((res) => {
          // setListData(res.data.data);
          console.log(res.data);
          Cookie.set("token", res.data.access_token);

          dispatch({
            type: "set",
            sidebarShow: true,
            sidebarUnfoldable: false,
          });

          dispatch({
            ...login(),
            ...res.data,
          });

          let new_menus = adminRoutes.filter((v) => {
            return (
              res.data.permissions && res.data.permissions[v.key] !== undefined
            );
          });
          //console.log("new_menus", new_menus);

          dispatch({
            type: "menu",
            menus: new_menus,
          });
          setLoading(false);

          //console.log("res.data.permissions", res.data.permissions);
          nav("/dashboard");
        })
        .catch((error) => {
          console.log("error catch", error);
          let err = error.response.data
            ? error.response.data.error.toString()
            : "Transaction could not proceed!";
          addToast(err, {
            autoDismiss: true,
            appearance: "error",
          });
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <div className="text-center">
          <img src={Logo} className="image-logo" alt="logo" />
          <div className="div-logo">Smart . Simple . Service</div>
        </div>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4 form-box">
                <CCardBody className="">
                  <CForm>
                    <h1>Reset Password</h1>
                    <p className="text-medium-emphasis">
                      Please input your new password!
                    </p>
                    <div className="mt-3">
                      <CInputGroup className="mb-2">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          type="password"
                          placeholder="Password"
                          autoComplete="current-password"
                          name="password"
                          value={form.password}
                          onChange={handleChange}
                        />
                      </CInputGroup>
                      {passwordError && (
                        <div
                          className="text-danger"
                          style={{ textAlign: "left" }}
                        >
                          {passwordError}
                        </div>
                      )}
                      <CInputGroup className="mb-2">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          type="password"
                          placeholder="Confirm Password"
                          autoComplete="current-password"
                          name="confirm_password"
                          value={form.confirm_password}
                          onChange={handleChange}
                        />
                      </CInputGroup>
                      {confPasswordError && (
                        <div
                          className="text-danger"
                          style={{ textAlign: "left" }}
                        >
                          {confPasswordError}
                        </div>
                      )}
                      <CRow>
                        {/* <CCol xs={6}>
                          <CButton
                            onClick={signIn}
                            type="button"
                            color="primary"
                            className="px-4"
                          >
                            Login
                          </CButton>
                        </CCol> */}
                        <CCol md={12}>
                          <div>
                            {/* <input
                              className="iBtn"
                              type="button"
                              value="Sign In"
                              onClick={signIn}
                            /> */}
                            <CButton
                              onClick={() => signIn()}
                              className={`iBtn ${loading ? "disabled" : ""}`}
                              variant="outline"
                            >
                              {loading ? <CSpinner /> : "Submit "}
                            </CButton>
                          </div>
                        </CCol>
                        <CCol xs={12}>
                          <CButton
                            color="link"
                            className="px-0"
                            onClick={(e) => handleLogin(e)}
                          >
                            Login?
                          </CButton>
                        </CCol>
                      </CRow>
                    </div>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default ResetUserPassword;
