import { CCard, CCardBody, CCardHeader, CCol, CRow } from "@coreui/react";
import ServiceList from "src/components/admin/services/ServiceList";

const Services = () => {
  return (
    <CRow>
      <CCol xl={12}>
        <CCard>
          <CCardHeader>
            <div className="d-flex justify-content-between">
              <h3>Managed Services</h3>
            </div>
          </CCardHeader>
          <CCardBody>
            <ServiceList />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Services;
