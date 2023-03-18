import { CCard, CCardBody, CCardHeader, CCol, CRow } from "@coreui/react";
import BookingList from "src/components/admin/booking/BookingList";

const Bookings = () => {
  return (
    <CRow>
      <CCol xl={12}>
        <CCard>
          <CCardHeader>
            <div className="d-flex justify-content-between">
              <h3>Bookings</h3>
            </div>
          </CCardHeader>
          <CCardBody>
            <BookingList />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Bookings;
