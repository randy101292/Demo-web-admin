import { CCard, CCardBody, CCardHeader, CCol, CRow } from "@coreui/react";
import ServiceCenterList from "src/components/admin/service_center/ServiceCenterList";

const ServiceCenter = () => {
  return (
    <CRow>
      <CCol xl={12}>
        <CCard>
          <CCardHeader>
            <div className="d-flex justify-content-between">
              <h3>Service Center</h3>
            </div>
          </CCardHeader>
          <CCardBody>
            <ServiceCenterList />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default ServiceCenter;
