import { cilPenAlt, cilPlus, cilTrash } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { useLocation, useParams } from "react-router-dom";
import Table from "src/components/table/Table";

import {
  CBadge,
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CSpinner,
} from "@coreui/react";
import moment from "moment";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import Confirmation from "src/components/confirm/Confirmation";
import DateFilter from "src/components/table/DateFilter";
import SelectColumnFilter from "src/components/table/SelectColumnFilter";
import request from "src/utils/request";
import { getSegment } from "src/utils/url";
import UserForm from "./UserForm";
import { canAccess } from "src/utils/common";

const UserList = () => {
  const location = useLocation();
  const params = useParams();
  const [listData, setListData] = useState([]);
  const [tableOption, setTableOption] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [modal, setModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add User");
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState();
  const [submitBtn, setSubmitBtn] = useState(false);
  const formRef = useRef();
  const { addToast } = useToasts();
  const roles = useSelector((state) => state.auth.roles[0]);

  const columns = React.useMemo(
    () => [
      {
        Header: "First Name",
        accessor: "first_name", // accessor is the "key" in the data
      },
      {
        Header: "Last Name",
        accessor: "last_name", // accessor is the "key" in the data
      },
      {
        Header: "Email",
        accessor: "email", // accessor is the "key" in the data
      },
      {
        Header: "Status",
        accessor: "status", // accessor is the "key" in the data
        Filter: SelectColumnFilter,
        selections: {
          active: "Active",
          inactive: "Inctive",
        },
        Cell: ({ value, row }) => <CBadge color="success">{value}</CBadge>,
      },
      {
        Header: "Date Created",
        accessor: "created_at", // accessor is the "key" in the data
        Cell: ({ value, row }) => moment(value).format("Y-MM-DD"),
        Filter: DateFilter,
        disableFilters: true,
      },

      {
        Header: "Actions",
        accessor: "act",
        disableFilters: true,
        disableSortBy: true,
        Cell: ({ value, row }) => (
          // <>
          //   {permissions.users && permissions.users.includes("edit") ? (
          <>
            <CButton
              color="info"
              onClick={() => populateForm(row)}
              style={{ marginRight: "0.25rem", minWidth: "90px" }}
            >
              Edit <CIcon icon={cilPenAlt} />
            </CButton>

            {roles === "super_admin" || canAccess("delete user order monitoring staff") || canAccess("delete user branch staff") ? (
              <CButton
                color="danger"
                onClick={() => reject(row)}
                style={{ minWidth: "90px" }}
              >
                Delete <CIcon icon={cilTrash} />
              </CButton>
            ) : (
              ""
            )}
          </>
          //   ) : (
          //     ""
          //   )}
          // </>
        ),
      },
    ],
    []
  );

  const data = React.useMemo(() => listData, [listData]);

  const populateForm = (row) => {
    setModal(true);
    setModalTitle("Update User");
    setTimeout(() => {
      formRef.current.populateForm(row.original);
    }, 300);
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
      .delete(`api/admin/users` + `/${row.original.id}`)
      .then((res) => {
        console.log("Res", res);
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

      // setModal(false);
      // addToast("Added Successfully", {
      //   autoDismiss: true,
      //   appearance: "success",
      // });

      // fetchList(tableOption);
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
      const response = await request.get(`api/admin/users`, {
        params: {
          page: pageIndex + 1,
          per_page: pageSize,
          role: getSegment(2),
          ...(sort !== "" && { sort_by: sort }),
          ...(sort !== "" && { descending: descending }),
          ...(filters && { filters: filters }),
        },
      });

      setListData(response.data);
      setLoading(false);
      setPageCount(response.meta.last_page);
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
    if (currentLocation) {
      fetchList(tableOption);
    }

    setPageCount(10);
    setCurrentLocation(location);
  }, [location]);

  return (
    <>
      <div className="d-flex justify-end">
        <CButton onClick={() => setModal(true)} color="secondary">
          Add <CIcon icon={cilPlus} />
        </CButton>
      </div>
      <CModal
        alignment="center"
        keyboard={false}
        portal={false}
        backdrop={"static"}
        visible={modal}
        size={"lg"}
        onClose={() => setModal(false)}
      >
        <CModalHeader>
          <CModalTitle>
            {params.type === "branch-manager"
              ? `${modalTitle} - Corporate Manager`
              : params.type === "branch-staff"
              ? `${modalTitle} - Branch Manager`
              : params.type === "order-monitoring-staff"
              ? `${modalTitle} - Branch Advisor`
              : params.type === "admin-staff"
              ? `${modalTitle} - Admin Staff`
              : params.type === "customer"
              ? `${modalTitle} - Customer`
              : ""}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <UserForm
            ref={formRef}
            onFormSubmit={onFormSubmit}
            onSubmitting={onSubmitting}
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="light" onClick={() => setModal(false)}>
            Close
          </CButton>
          <CButton
            onClick={() => {
              formRef.current.handleFormSubmit();
            }}
            color="primary"
            disabled={submitBtn}
          >
            Save changes {submitBtn ? <CSpinner size="sm" /> : ""}
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
      />
    </>
  );
};

export default UserList;
