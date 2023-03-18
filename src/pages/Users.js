import { CCard, CCardBody, CCardHeader, CCol, CRow } from "@coreui/react";
import UserList from "src/components/admin/users/UserList";

const Users = () => {
  return (
    <CRow>
      <CCol xl={12}>
        <CCard>
          <CCardHeader>
            <div className="d-flex justify-content-between">
              <h3>Users</h3>
            </div>
          </CCardHeader>
          <CCardBody>
            <UserList />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Users;
