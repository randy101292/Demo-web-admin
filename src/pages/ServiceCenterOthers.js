import { cilArrowCircleLeft } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CRow,
} from "@coreui/react";
import { useNavigate, useParams } from "react-router-dom";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import ServiceCenterEmployeesList from "src/components/admin/service_center/employees/ServiceCenterEmployeesList";
import ServiceCenterServicesList from "src/components/admin/service_center/services/ServiceCenterServicesList";
import ServiceCenterTimeSlotList from "src/components/admin/service_center/time_slot/ServiceCenterTimeSlotList";
import ServiceCenterBookingList from "src/components/admin/service_center/bookings/ServiceCenterBookingList";


const ServiceCenterOthers = () => {
  const params = useParams();
  const navigate = useNavigate();
  return (
    <CRow>
      <CCol xl={12}>
        <CCard>
          <CCardHeader>
            <div className="d-flex justify-content-between">
              <h3>
                Service Center -{" "}
                <span style={{ color: "#df5c23" }}>
                  {params.service_center_name}
                </span>
              </h3>
            </div>
          </CCardHeader>
          <CCardBody>
            <Tabs>
              <TabList>
                <Tab style={{ color: "#39f", fontWeight: "bold" }}>
                  Services
                </Tab>
                <Tab style={{ color: "#39f", fontWeight: "bold" }}>
                  Employees
                </Tab>
                <Tab style={{ color: "#39f", fontWeight: "bold" }}>
                  Time Slot
                </Tab>
                <Tab style={{ color: "#39f", fontWeight: "bold" }}>
                  Bookings
                </Tab>
              </TabList>

              <TabPanel>
                <ServiceCenterServicesList />
              </TabPanel>
              <TabPanel>
                <ServiceCenterEmployeesList />
              </TabPanel>
              <TabPanel>
                <ServiceCenterTimeSlotList />
              </TabPanel>
              <TabPanel>
                <ServiceCenterBookingList />
              </TabPanel>
            </Tabs>
          </CCardBody>
          <CCardFooter>
            <CButton
              color="dark"
              style={{ marginRight: "0.25rem", minWidth: "90px" }}
              onClick={() => navigate(-1)}
            >
              <CIcon icon={cilArrowCircleLeft} /> &nbsp; Back
            </CButton>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default ServiceCenterOthers;
