import { CCard, CCardBody, CCardHeader, CCol, CRow } from "@coreui/react";
import React from "react";
import { useParams } from "react-router-dom";

const Rejected = React.lazy(() =>
  import("src/components/admin/notifications/NotificationsRejectedList")
);
const Approved = React.lazy(() =>
  import("src/components/admin/notifications/NotificationsApprovalList")
);
const Requested = React.lazy(() =>
  import("src/components/admin/notifications/NotificationsRequestedList")
);

const Notifications = () => {
  const { type } = useParams();
  //console.log(type);
  return (
    <CRow>
      <CCol xl={12}>
        <CCard>
          <CCardHeader>
            <div className="d-flex justify-content-between">
              <h3>Notifications</h3>
            </div>
          </CCardHeader>
          <CCardBody>
            {type === "rejected" ? (
              <Rejected />
            ) : type === "approved" ? (
              <Approved />
            ) : (
              <Requested />
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Notifications;
