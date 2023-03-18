import { cilLockLocked, cilUser } from "@coreui/icons";
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
} from "@coreui/react";
import axios from "axios";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import Cookie from "js-cookie";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { laravelUrl } from "src/utils/url";
import { auth, fbase } from "../config/firebaseConfig";
import { login } from "../store/auth/AuthAction";

const Login = () => {
  const [formToggle, setFormToggle] = useState(false);
  const nav = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const signIn = (prov = "email") => {
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
          const user = result.user.providerData[0];
          user.isNewUser = result.additionalUserInfo.isNewUser;
          user.fbuid = result.user.uid;

          axios
            .post(laravelUrl(`api/login/auth`), user)
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
        })
        .catch((error) => {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
        });
    } else {
      fbase
        .auth()
        .signInWithEmailAndPassword(form.email, form.password)
        .then((result) => {
          const user = result.user.providerData[0];
          user.isNewUser = result.additionalUserInfo.isNewUser;
          user.fbuid = result.user.uid;
          user.password = form.password;

          axios
            .post(laravelUrl(`api/login/auth`), user)
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

  const emailSignin = () => {
    setFormToggle(!formToggle);
  };

  useEffect(() => {
    let ui = "";
    const uiConfig = {
      signInOptions: [
        {
          provider: fbase.auth.PhoneAuthProvider.PROVIDER_ID,
          recaptchaParameters: {
            type: "image",
            size: "normal",
            badge: "bottomleft",
          },
          defaultCountry: "PH",
        },
      ],
      callbacks: {
        signInSuccessWithAuthResult: (result, redirectUrl) => {
          const user = result.user.providerData[0];
          user.isNewUser = result.additionalUserInfo.isNewUser;
          user.fbuid = result.user.uid;
          user.password = form.password;

          let url = user.isNewUser ? `api/register/auth` : `api/login/auth`;

          axios
            .post(laravelUrl(url), user)
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
        },
      },
    };

    const inst = firebaseui.auth.AuthUI.getInstance();
    if (inst) {
      setTimeout(() => {
        inst.start("#firebaseui-auth-container", uiConfig);
      }, 300);
    } else {
      ui = new firebaseui.auth.AuthUI(auth);
      ui.start("#firebaseui-auth-container", uiConfig);
    }
  }, []);

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={12}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">
                      Sign In to your account
                    </p>
                    <div className="d-grid gap-2">
                      {/* <button type="button" onClick={() => signIn('facebook')} className="fb-btn" >Facebook Signin</button>
                      <button type="button" onClick={() => signIn('google')} className="google-btn" >Google Signin</button>
                      <button type="button" className="apple-btn" >Apple Signin</button>
                      <CButton onClick={emailSignin} color="primary" >Signin with email</CButton> */}
                      <div id="firebaseui-auth-container"></div>
                    </div>
                    {formToggle ? (
                      <div className="mt-3">
                        <CInputGroup className="mb-3">
                          <CInputGroupText>
                            <CIcon icon={cilUser} />
                          </CInputGroupText>
                          <CFormInput
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                          />
                        </CInputGroup>
                        <CInputGroup className="mb-4">
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
                        <CRow>
                          <CCol xs={6}>
                            <CButton
                              onClick={signIn}
                              type="button"
                              color="primary"
                              className="px-4"
                            >
                              Login
                            </CButton>
                          </CCol>
                          <CCol xs={6} className="text-right">
                            <CButton color="link" className="px-0">
                              Forgot password?
                            </CButton>
                          </CCol>
                        </CRow>
                      </div>
                    ) : null}
                  </CForm>
                </CCardBody>
              </CCard>
              {/* <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard> */}
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;
