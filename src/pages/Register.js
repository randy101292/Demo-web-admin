import { cilLockLocked } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import axios from "axios";
import Cookie from "js-cookie";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { laravelUrl } from "src/utils/url";
import { fbase } from "../config/firebaseConfig";
import { login } from "../store/auth/AuthAction";

const Register = () => {
  const [formToggle, setFormToggle] = useState(false);
  const nav = useNavigate();
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const signUp = (prov = "email") => {
    var provider = null;

    if (prov === "facebook") {
      provider = new fbase.auth.FacebookAuthProvider();
      provider.setCustomParameters({
        display: "popup",
      });
    }

    if (prov === "google") provider = new fbase.auth.GoogleAuthProvider();

    if (["facebook", "google"].includes(prov)) {
      fbase
        .auth()
        .signInWithPopup(provider)
        .then((result) => {
          console.log(result);
          const user = result.user.providerData[0];
          user.isNewUser = result.additionalUserInfo.isNewUser;
          user.fbuid = result.user.uid;

          axios
            .post(laravelUrl(`api/register/auth`), user)
            .then((res) => {
              // setListData(res.data.data);
              Cookie.set("token", res.data.data.token);

              dispatch({
                ...login(),
                ...res.data.data,
              });

              nav("dashboard");
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((error) => {
          // Handle Errors here.
          // var errorCode = error.code;
          // var errorMessage = error.message;
          // // The email of the user's account used.
          // var email = error.email;
          // // The firebase.auth.AuthCredential type that was used.
          // var credential = error.credential;
        });
    } else {
      let errs = {};
      if (form.first_name === "")
        errs.first_name = "First name cannot be empty.";
      if (form.last_name === "") errs.last_name = "Last name cannot be empty.";
      if (form.email === "") errs.email = "Email cannot be empty.";
      if (form.password === "") errs.password = "Password cannot be empty.";
      if (form.password !== form.confirm_password)
        errs.confirm_password = "Confirm password does not match.";

      if (Object.keys(errs).length > 0) {
        setErrors(errs);
        return;
      }

      fbase
        .auth()
        .createUserWithEmailAndPassword(form.email, form.password)
        .then((result) => {
          const user = result.user.providerData[0];
          user.isNewUser = result.additionalUserInfo.isNewUser;
          user.fbuid = result.user.uid;

          axios
            .post(laravelUrl(`api/register`), form)
            .then((res) => {
              // setListData(res.data.data);
              Cookie.set("token", res.data.data.token);

              dispatch({
                type: "set",
                sidebarShow: true,
                sidebarUnfoldable: false,
              });

              dispatch({
                ...login(),
                ...res.data.data,
              });

              nav("/customer/dashboard");
            })
            .catch((err) => {
              console.log(err);
            });
        });
    }
  };

  const emailSignup = () => {
    setFormToggle(!formToggle);
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm>
                  <h1>Register</h1>
                  <p className="text-medium-emphasis">Create your account</p>
                  <div className="d-grid gap-2">
                    <button
                      type="button"
                      onClick={() => signUp("facebook")}
                      className="fb-btn"
                    >
                      Facebook Sign up
                    </button>
                    <button
                      type="button"
                      onClick={() => signUp("google")}
                      className="google-btn"
                    >
                      Google Sign up
                    </button>
                    <button type="button" className="apple-btn">
                      Apple Sign up
                    </button>
                    <CButton
                      type="button"
                      onClick={emailSignup}
                      color="primary"
                    >
                      Sign up with email
                    </CButton>
                  </div>
                  {formToggle ? (
                    <div className="mt-3">
                      <div>
                        <CFormInput
                          name="first_name"
                          onChange={handleChange}
                          value={form.first_name}
                          placeholder="First Name"
                          autoComplete="first_name"
                        />
                        {errors.first_name && (
                          <div className="text-danger">{errors.first_name}</div>
                        )}
                      </div>
                      <div>
                        <CFormInput
                          className="mt-3"
                          name="last_name"
                          onChange={handleChange}
                          value={form.last_name}
                          placeholder="Last Name"
                          autoComplete="last_name"
                        />
                        {errors.last_name && (
                          <div className="text-danger">{errors.last_name}</div>
                        )}
                      </div>
                      <div>
                        <CInputGroup className="mt-3">
                          <CInputGroupText>@</CInputGroupText>
                          <CFormInput
                            name="email"
                            onChange={handleChange}
                            value={form.email}
                            placeholder="Email"
                            autoComplete="email"
                          />
                        </CInputGroup>
                        {errors.email && (
                          <div className="text-danger">{errors.email}</div>
                        )}
                      </div>
                      <div>
                        <CInputGroup className="mt-3">
                          <CInputGroupText>
                            <CIcon icon={cilLockLocked} />
                          </CInputGroupText>
                          <CFormInput
                            name="password"
                            onChange={handleChange}
                            value={form.password}
                            type="password"
                            placeholder="Password"
                            autoComplete="new-password"
                          />
                        </CInputGroup>
                        {errors.password && (
                          <div className="text-danger">{errors.password}</div>
                        )}
                      </div>
                      <div>
                        <CInputGroup className="mt-3">
                          <CInputGroupText>
                            <CIcon icon={cilLockLocked} />
                          </CInputGroupText>
                          <CFormInput
                            name="confirm_password"
                            onChange={handleChange}
                            value={form.confirm_password}
                            type="password"
                            placeholder="Repeat password"
                            autoComplete="new-password"
                          />
                        </CInputGroup>
                        {errors.confirm_password && (
                          <div className="text-danger">
                            {errors.confirm_password}
                          </div>
                        )}
                      </div>
                      <div className="d-grid mt-3">
                        <CButton color="success" onClick={signUp}>
                          Create Account
                        </CButton>
                      </div>
                    </div>
                  ) : null}
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Register;
