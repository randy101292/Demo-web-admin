import { cilPenAlt, cilPlus, cilTrash } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CSpinner,
} from "@coreui/react";
import moment from "moment";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import Confirmation from "src/components/confirm/Confirmation";
import Table from "src/components/table/Table";
import { canAccess } from "src/utils/common";
import request from "src/utils/request";
import BookingForm from "./BookingForm";

const BookingList = () => {
  //const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [listData, setListData] = useState([]);
  const [tableOption, setTableOption] = useState({});
  const [selectedRow, setSelectedRow] = useState({});
  const [selectedRowIndex, setSelectedRowIndex] = useState({});
  const [modal, setModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add Booking");
  const [pageCount, setPageCount] = useState(0);
  const [formKey, setFormKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitBtn, setSubmitBtn] = useState(false);
  const formRef = useRef();
  const { addToast } = useToasts();
  const permissions = useSelector((state) => state.auth.permissions);

  const columns = React.useMemo(
    () => [
      {
        Header: "Customer Name",
        accessor: "user", // accessor is the "key" in the data
        Cell: ({ value }) => value.first_name + " " + value.last_name,
      },
      {
        Header: "Service Name",
        // accessor: "service.name", // accessor is the "key" in the data
        accessor: (data) => {
          let output = [];
          data.services.map((s) => {
            output.push(s.name);
          });
          return output.join(", ");
        },
      },
      {
        Header: "Service Center",
        accessor: "service_center.name",
      },
      {
        Header: "Vehicle Name",
        accessor: "vehicle.model",
      },
      {
        Header: "Status",
        accessor: "status",
      },

      {
        Header: "Booking Date",
        accessor: "date", // accessor is the "key" in the data
        Cell: ({ value }) => {
          return (
            moment(value).format("MMM DD, yyyy") +
            " " +
            moment(value).format("hh:mm a")
          );
        },
        disableFilters: true,
      },
      {
        Header: "Booking Created",
        accessor: "created_at", // accessor is the "key" in the data
        Cell: ({ value }) => {
          return (
            moment(value).format("MMM DD, yyyy") +
            " " +
            moment(value).format("hh:mm a")
          );
        },
        disableFilters: true,
      },
      {
        Header: "Actions",
        accessor: "act",
        disableFilters: true,
        disableSortBy: true,
        Cell: ({ value, row }) => (
          <>
            <CButton
              color="info"
              className="mx-1"
              onClick={() => populateForm(row)}
            >
              Edit <CIcon icon={cilPenAlt} />
            </CButton>
            <CButton color="danger" onClick={() => reject(row)}>
              Delete <CIcon icon={cilTrash} />
            </CButton>
          </>
        ),
      },
    ],
    []
  );

  const data = React.useMemo(() => listData, [listData]);

  const populateForm = (row) => {
    //console.log("action here populate", row.index);
    setFormKey((val) => val + 1);
    setModal(true);
    setModalTitle("Update Booking");
    setSelectedRow(row.original);
    setSelectedRowIndex(row.index);
  };

  const reject = (row) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <Confirmation
            loading={loading}
            submitFunc={deleteList}
            action={"DELETE"}
            value={row}
            closeFunc={onClose}
          />
        );
      },
      closeOnEscape: false,
      closeOnClickOutside: false,
    });
  };

  const deleteList = (row) => {
    request
      .delete(`api/admin/booking` + `/${row.original.id}`)
      .then((res) => {
        //console.log("success_delete", res);
        addToast("Deleted Successfully", {
          autoDismiss: true,
          appearance: "success",
        });
        fetchList(tableOption);
      })
      .catch((error) => {
        console.log("catch-error", error);
        let err = error.response.data
          ? error.response.data.error.toString()
          : "Transaction could not proceed!";
        addToast(err, {
          autoDismiss: true,
          appearance: "error",
        });
        fetchList(tableOption);
      });
  };

  // const deleteList = (row) => {
  //   //console.log("deleteList here populate");
  //   setFormKey((val) => val + 1);
  //   setModal(true);
  //   setModalTitle("Delete Booking");
  //   setSelectedRow(row.original);
  //   setSelectedRowIndex(row.index);
  // };

  const onFinishLoading = (success, action) => {
    //console.log("onFinishLoading");
    if (success && modalTitle === "Update Booking") {
      formRef.current.populateForm(selectedRow);
    } else if (success && modalTitle === "Delete Booking") {
      formRef.current.deleteList(selectedRow);
    }
  };

  const onFormSubmit = (success, response, action) => {
    if (success) {
      let msg = "";

      if (action === "update") {
        msg = "Updated Successfully";
        //setListData(getUpdateList(listData, selectedRowIndex, response));
        fetchList(tableOption);
      } else if (action === "delete") {
        fetchList(tableOption);
        msg = "Deleted Successfully";
      } else {
        fetchList(tableOption);
        msg = "Added Successfully";
      }

      setModal(false);
      addToast(msg, {
        autoDismiss: true,
        appearance: "success",
      });
    } else {
      console.log("response", response);
      let err = response.response.data.message
        ? response.response.data.message.toString()
        : "Transaction could not proceed!";

      addToast(err, {
        autoDismiss: true,
        appearance: "error",
      });
    }

    window.setTimeout(() => {
      setSubmitBtn(false);
    }, 1000);
  };

  const fetchList = useCallback(async (props) => {
    setLoading(true);
    const { pageIndex, pageSize, sortBy, filters } = props;
    setTableOption({
      pageIndex,
      pageSize,
      sortBy,
      filters,
    });

    let sort = "";
    let descending = "";

    if (sortBy && sortBy[0]) {
      sort = sortBy[0].id;
      descending = sortBy[0].desc;
    }

    try {
      const response = await request.get(`api/admin/booking`, {
        params: {
          page: pageIndex + 1,
          per_page: pageSize,
          //role: getSegment(2),
          ...(sort !== "" && { sort_by: sort }),
          ...(sort !== "" && { descending: descending }),
          ...(filters && { filters: filters }),
        },
      });

      setListData(response.bookings.data);
      setLoading(false);
      setPageCount(response.bookings.last_page);
    } catch (error) {
      console.log("catch-response", error.response);
      console.log("catch-error", error);
      setListData([]);
      setLoading(false);
      setPageCount(0);
      let err = error.response.data
        ? error.response.data.error.toString()
        : "Transaction could not proceed!";
      addToast(err, {
        autoDismiss: true,
        appearance: "error",
      });
    }
  }, []);

  const onSubmitting = (submitBtn) => {
    setSubmitBtn(submitBtn);
  };

  useEffect(() => {
    setPageCount(10);
  }, [location]);

  return (
    <>
      <div className="d-flex justify-end">
        {canAccess("add bookings") ? (
          <CButton
            color="secondary"
            onClick={() => {
              setModalTitle("Create Booking");
              setFormKey((val) => val + 1);
              setModal(true);
            }}
          >
            Add <CIcon icon={cilPlus} />
          </CButton>
        ) : (
          ""
        )}
      </div>

      <CModal
        alignment="center"
        keyboard={false}
        portal={false}
        backdrop={"static"}
        visible={modal}
        size={"lg"}
        onClose={() => {
          setModal(false);
          setSelectedRow({});
        }}
      >
        <CModalHeader>
          <CModalTitle>{modalTitle}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <BookingForm
            key={formKey}
            ref={formRef}
            onFormSubmit={onFormSubmit}
            onFinishLoading={onFinishLoading}
            onSubmitting={onSubmitting}
            modal={setModal}
          />
        </CModalBody>
        <CModalFooter>
          {/* <CButton color="secondary">Close</CButton> */}
          <CButton color="light" onClick={() => setModal(false)}>
            Close
          </CButton>
          <CButton
            onClick={() => {
              formRef.current.handleFormSubmit();
            }}
            color={modalTitle === "Delete Booking" ? "danger" : "primary"}
            disabled={submitBtn}
          >
            {modalTitle === "Delete Booking" ? `Delete` : `Save changes`}
            {submitBtn ? <CSpinner size="sm" /> : ""}
          </CButton>
        </CModalFooter>
      </CModal>
      <Table
        columns={columns}
        data={data}
        fetchData={fetchList}
        loading={loading}
        pageCount={pageCount}
        location={location}
        hideAction={
          !canAccess("edit bookings") && !canAccess("delete bookings")
            ? "act"
            : ""
        }
      />
    </>
  );
};

export default BookingList;
