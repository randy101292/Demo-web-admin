import { CCard, CCardBody, CCardHeader, CCol, CRow } from "@coreui/react";

const Vouchers = () => {
  return (
    <CRow>
      <CCol xl={12}>
        <CCard>
          <CCardHeader>
            <div className="d-flex justify-content-between">
              <h3>Vouchers</h3>
            </div>
          </CCardHeader>
          <CCardBody>
            <span
              style={{
                justifyContent: "center",
                fontSize: "30px",
                display: "flex",
              }}
            >
              COMING SOON.......
            </span>
            {/* <VouchersList /> */}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Vouchers;
