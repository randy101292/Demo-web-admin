import Cookie from "js-cookie";
import React, { Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { ToastProvider } from "react-toast-notifications";
import adminRoutes from "./routes/admin";
import "./scss/style.scss";
import { login } from "./store/auth/AuthAction";
import request from "./utils/request";
import { laravelUrl } from "./utils/url";

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

// Containers
const AdminLayout = React.lazy(() => import("./layout/AdminLayout"));

// Pages
const Login = React.lazy(() => import("./pages/Login"));
const AdminLogin = React.lazy(() => import("./pages/Login"));
const ForgotPassword = React.lazy(() => import("./pages/ForgotPassword"));
const ResetUserPassword = React.lazy(() => import("./pages/ResetUserPassword"));
const Register = React.lazy(() => import("./pages/Register"));
const Page404 = React.lazy(() => import("./views/pages/page404/Page404"));
const Page500 = React.lazy(() => import("./views/pages/page500/Page500"));

const Dashboard = React.lazy(() => import("./views/dashboard/Dashboard"));

const App = () => {
  const auth = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const resourceAPI = laravelUrl("api/admin/user");
  const [loading, setLoading] = useState(true);
  const [previousPath, setPreviousPath] = useState();
  const [firstLoad, setFirstLoad] = useState(true);
  const [to, setTo] = useState("/login");

  const checkAuth = () => {
    let token = Cookie.get("token");
    if (firstLoad) setLoading(true);

    if (token) {
      request
        .get(resourceAPI)
        .then(async (res) => {
          dispatch({
            type: "set",
            sidebarShow: true,
            sidebarUnfoldable: false,
          });

          await dispatch({
            ...login(),
            ...res.data,
          });

          if (location.pathname === "/") {
            navigate("dashboard");
          }

          if (firstLoad) setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          if (err.response?.status && err.response?.status === 401) {
            // redirect to login
            Cookie.remove("token");
            setLoading(false);
            navigate("login");
          }
        })
        .finally(() => {});
    } else {
      navigate(to);
      setLoading(false);
    }
  };

  useEffect(() => {
    //console.log("location change from ", previousPath, "to", location.pathname);

    if (
      location.pathname === "/login" ||
      location.pathname === "/forgot_password" ||
      location.pathname === "/reset_password"
    ) {
      setLoading(false);
      setTo(location.pathname);
    } else if (location.pathname !== "/login") {
      checkAuth();
    }
    setPreviousPath(location.pathname);
    setFirstLoad(false);
  }, [location]);

  return !loading ? (
    <ToastProvider
      placement="top-right"
      newestOnTop={true}
      autoDismissTimeout={2000}
    >
      <Suspense fallback={loading}>
        <Routes>
          <Route
            exact
            path="/login"
            name="Admin Login Page"
            element={<AdminLogin />}
          />
          <Route
            exact
            path="/reset_password"
            name="Forgot Password"
            element={<ResetUserPassword />}
          />
          <Route
            exact
            path="/forgot_password"
            name="Forgot Password"
            element={<ForgotPassword />}
          />
          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />
          <Route path="/" name="Admin" element={<AdminLayout />}>
            {adminRoutes.map((route, idx) => {
              return (
                route.element && (
                  <Route
                    key={idx}
                    path={route.path}
                    name={route.name}
                    element={<route.element />}
                  />
                )
              );
            })}
            {/* <Route path="dashboard" name="Admin Dashboard" element={ <Dashboard /> }/> */}
          </Route>
          <Route
            path="*"
            name="Home"
            element={
              auth.id !== "" ? <Page404 /> : <Navigate to={to} replace />
            }
          />
        </Routes>
      </Suspense>
    </ToastProvider>
  ) : (
    <></>
  );
};

export default App;
