import { cilPlus, cilTrash } from "@coreui/icons";
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
import ServiceCenterServiceForm from "./ServiceCenterEmployeeForm";

const ServiceCenterEmployeesList = () => {
  const location = useLocation();
  const params = useParams();
  const [listData, setListData] = useState([]);
  const [tableOption, setTableOption] = useState({});
  const [selectedRow, setSelectedRow] = useState({});
  const [selectedRowIndex, setSelectedRowIndex] = useState({});
  const [modal, setModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add Service");
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
        Header: "Employee First Name",
        accessor: "user.first_name", // accessor is the "key" in the data
      },
      {
        Header: "Employee Last Name",
        accessor: "user.last_name", // accessor is the "key" in the data
      },
      {
        Header: "Email",
        accessor: "user.email", // accessor is the "key" in the data
      },
      {
        Header: "Date Created",
        accessor: "created_at", // accessor is the "key" in the data
        Cell: ({ value, row }) => moment(value).format("Y-MM-DD"),
        disableFilters: true,
      },
      {
        Header: "Actions",
        accessor: "act",
        disableFilters: true,
        disableSortBy: true,
        Cell: ({ row }) => (
          <>
            <CButton
              color="danger"
              onClick={() => reject(row)}
              style={{ minWidth: "90px" }}
            >
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
    setModalTitle("Update Service Center Employee");
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
      .delete(`api/admin/service-center-employee` + `/${row.original.id}`)
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

  const onFinishLoading = (success, action) => {
    //console.log("onFinishLoading");
    if (success && modalTitle === "Update Service Center Employee") {
      formRef.current.populateForm(selectedRow);
    } else if (success && modalTitle === "Delete Service Center Employee") {
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
      console.log("response", response.response.data.message);

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
      const response = await request.get(`api/admin/service-center-employee`, {
        params: {
          page: pageIndex + 1,
          per_page: pageSize,
          service_center_id: params.service_center_id,
          ...(sort !== "" && { sort_by: sort }),
          ...(sort !== "" && { descending: descending }),
          ...(filters && { filters: filters }),
        },
      });

      setListData(response.employees.data);
      setLoading(false);
      setPageCount(response.employees.last_page);
    } catch (error) {
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
        {canAccess("add services") ? (
          <CButton
            onClick={() => {
              setModalTitle("Create Service Center Employee");
              setFormKey((val) => val + 1);
              setModal(true);
            }}
            color="secondary"
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
          <ServiceCenterServiceForm
            key={formKey}
            ref={formRef}
            onFormSubmit={onFormSubmit}
            onFinishLoading={onFinishLoading}
            onSubmitting={onSubmitting}
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
            color={
              modalTitle === "Delete Service Center Employee"
                ? "danger"
                : "primary"
            }
            disabled={submitBtn}
          >
            {modalTitle === "Delete Service Center Employee"
              ? `Delete`
              : `Save changes`}
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
          !canAccess("edit services") && !canAccess("delete services")
            ? "act"
            : ""
        }
      />
    </>
  );
};

export default ServiceCenterEmployeesList;
