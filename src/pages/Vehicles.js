import { CCard, CCardBody, CCardHeader, CCol, CRow } from "@coreui/react";
import VehicleList from "src/components/admin/vehicles/VehicleList";

const Vehicles = () => {
  return (
    <CRow>
      <CCol xl={12}>
        <CCard>
          <CCardHeader>
            <div className="d-flex justify-content-between">
              <h3>Vehicles</h3>
            </div>
          </CCardHeader>
          <CCardBody>
            <VehicleList />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Vehicles;
