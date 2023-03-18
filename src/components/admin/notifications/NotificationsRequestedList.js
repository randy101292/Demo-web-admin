import { cilPlus } from "@coreui/icons";
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
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import Confirmation from "src/components/confirm/Confirmation";
import Table from "src/components/table/Table";
import { canAccess, getUpdateList } from "src/utils/common";
import request from "src/utils/request";
import NotificationsForm from "./NotificationsForm";

const NotificationsRequestedList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [listData, setListData] = useState([]);
  const [tableOption, setTableOption] = useState({});
  const [selectedRow, setSelectedRow] = useState({});
  const [selectedRowIndex, setSelectedRowIndex] = useState({});
  const [modal, setModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add Notification");
  const [pageCount, setPageCount] = useState(0);
  const [formKey, setFormKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitBtn, setSubmitBtn] = useState(false);
  const permissions = useSelector((state) => state.auth.permissions);

  const formRef = useRef();
  const { addToast } = useToasts();

  const columns = React.useMemo(
    () => [
      {
        Header: "Customer Name",
        accessor: "user", // accessor is the "key" in the data
        Cell: ({ value }) => value.first_name + " " + value.last_name,
      },
      {
        Header: "Content",
        accessor: "content", // accessor is the "key" in the data
      },
      {
        Header: "Type",
        accessor: "type", // accessor is the "key" in the data
      },
      {
        Header: "Date Requested",
        accessor: "created_at", // accessor is the "key" in the data
        Cell: ({ value }) => moment(value).format("Y-MM-DD hh:mm:ss"),
        disableFilters: true,
        disableSortBy: true,
      },
      {
        Header: "Actions",
        accessor: "act",
        disableFilters: true,
        disableSortBy: true,
        Cell: ({ row }) => (
          <>
            {canAccess("approve notification") ? (
              <CButton
                color="success"
                onClick={() => approve(row)}
                style={{ marginRight: "0.25rem", minWidth: "90px" }}
              >
                Approve &nbsp;
                <FontAwesomeIcon icon={faCheck} size="sm" />
              </CButton>
            ) : (
              ""
            )}

            {canAccess("reject notification") ? (
              <CButton
                color="danger"
                onClick={() => reject(row)}
                style={{ minWidth: "90px" }}
              >
                {/* Reject <CIcon icon={cilTrash} /> */}
                Reject &nbsp;
                <FontAwesomeIcon icon={faXmark} size="sm" />
              </CButton>
            ) : (
              ""
            )}
          </>
        ),
      },
    ],
    []
  );

  const data = React.useMemo(() => listData, [listData]);

  const approve = (row) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <Confirmation
            loading={loading}
            submitFunc={approveAsync}
            action={"APPROVE"}
            value={row}
            closeFunc={onClose}
          />
        );
      },
      closeOnEscape: false,
      closeOnClickOutside: false,
    });
  };

  const reject = (row) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <Confirmation
            loading={loading}
            submitFunc={deleteAsync}
            action={"REJECT"}
            value={row}
            closeFunc={onClose}
          />
        );
      },
      closeOnEscape: false,
      closeOnClickOutside: false,
    });
  };

  const approveAsync = (row) => {
    let values = {
      content: row.original.content,
      type: row.original.type,
      approved: 1,
    };
    request
      .put(`api/admin/notification` + `/${row.original.id}`, values)
      .then((res) => {
        addToast("Successfully Approved", {
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
      });
  };

  const deleteAsync = (row) => {
    let values = {
      content: row.original.content,
      type: row.original.type,
      approved: -1,
    };
    request
      .put(`api/admin/notification` + `/${row.original.id}`, values)
      .then((res) => {
        addToast("Successfully Rejected", {
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
      });
  };

  const onFinishLoading = (success, action) => {
    //console.log("onFinishLoading");
    if (success && modalTitle === "Update Notifications") {
      formRef.current.populateForm(selectedRow);
    } else if (success && modalTitle === "Delete Notifications") {
      formRef.current.deleteList(selectedRow);
    }
  };

  const onFormSubmit = (success, response, action) => {
    if (success) {
      let msg = "";

      if (action === "update") {
        msg = "Updated Successfully";
        setListData(getUpdateList(listData, selectedRowIndex, response));
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
      const response = await request.get(`api/admin/notification`, {
        params: {
          page: pageIndex + 1,
          per_page: pageSize,
          approved: 0,
          //role: getSegment(2),
          ...(sort !== "" && { sort_by: sort }),
          ...(sort !== "" && { descending: descending }),
          ...(filters && { filters: filters }),
        },
      });

      setListData(response.data.data);
      setLoading(false);
      setPageCount(response.data.last_page);
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
    //fetchList(tableOption);
    setPageCount(10);
  }, [location]);

  return (
    <>
      <div className="d-flex justify-end">
        {canAccess("add notification") ? (
          <CButton onClick={() => setModal(true)} color="secondary">
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
        onClose={() => setModal(false)}
      >
        <CModalHeader>
          <CModalTitle>{modalTitle}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <NotificationsForm
            ref={formRef}
            onFormSubmit={onFormSubmit}
            onFinishLoading={onFinishLoading}
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
            color={modalTitle === "Delete Notifications" ? "danger" : "primary"}
            disabled={submitBtn}
          >
            {modalTitle === "Delete Notifications" ? `Delete` : `Save changes`}
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
          !canAccess("approve notification") &&
          !canAccess("reject notification")
            ? "act"
            : ""
        }
      />
    </>
  );
};

export default NotificationsRequestedList;
