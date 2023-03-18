import { CContainer, CSpinner } from "@coreui/react";
import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { ToastProvider } from "react-toast-notifications";

// routes config

// const loading = (
//   <div className="pt-3 text-center">
//     <div className="sk-spinner sk-spinner-pulse"></div>
//   </div>
// );

const TheContent = () => {
  return (
    <ToastProvider
      placement="top-right"
      newestOnTop={true}
      autoDismissTimeout={1500}
    >
      <main className="c-main">
        <CContainer fluid>
          <Suspense fallback={<CSpinner color="primary" />}>
            <Outlet />
          </Suspense>
        </CContainer>
      </main>
    </ToastProvider>
  );
};

export default React.memo(TheContent);
