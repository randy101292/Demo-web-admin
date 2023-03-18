import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Table from "src/components/table/Table";

import moment from "moment";
import { useToasts } from "react-toast-notifications";
import request from "src/utils/request";
import { canAccess, getUpdateList } from "src/utils/common";
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CSpinner } from "@coreui/react";
import NotificationsForm from "./NotificationsForm";

const NotificationsRejectedList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [listData, setListData] = useState([]);
  const [formData, setFormData] = useState({});
  const [tableOption, setTableOption] = useState({});
  const [modal, setModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("Edit Notification");
  const [selectedRowIndex, setSelectedRowIndex] = useState({});
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitBtn, setSubmitBtn] = useState(false);
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
        Header: "Date Rejected",
        accessor: "updated_at", // accessor is the "key" in the data
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
            {canAccess("edit notification") ? (
              <CButton
                color="warning"
                onClick={() => handleEdit(row)}
                style={{ marginRight: "0.25rem", minWidth: "90px" }}
              >
                Edit
              </CButton>
            ) : (
              ""
            )}

            {canAccess("delete notification") ? (
              <CButton
                color="danger"
                onClick={() => handleDelete(row)}
                style={{ minWidth: "90px" }}
              >
                {/* Reject <CIcon icon={cilTrash} /> */}
                Delete
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

  const handleEdit = (row) => {
    setModal(true);
    setSelectedRowIndex(row.index);
    setModalTitle("Edit Notification");
    setTimeout(() => {
      formRef.current.populateForm(row.original);
    },100);
  }

  const handleDelete = (row) => {
    request
      .delete(`api/admin/notification/${row.original.id}`)
      .then((res) => {
        //console.log("success_delete", res);
        let tmpRows = listData.splice(selectedRowIndex, 1);
        setListData(tmpRows);

        addToast("Deleted successfully", {
          autoDismiss: true,
          appearance: "success",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const onFormSubmit = (success, response, action) => {
    if (success) {
      let msg = "";

      if (action === "update") {
        msg = "Updated Successfully";
        setListData(getUpdateList(listData, selectedRowIndex, response.data));
      } else if (action === "delete") {
        fetchList(tableOption);
        msg = "Deleted Successfully";
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
  }

  const onFinishLoading = () => {

  }

  const onSubmitting = () => {

  }

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
          approved: -1,
          //role: getSegment(2),
          ...(sort != "" && { sort_by: sort }),
          ...(sort != "" && { descending: descending }),
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

  useEffect(() => {
    setPageCount(10);
  }, [location]);

  return (
    <>
      <Table
        columns={columns}
        data={data}
        fetchData={fetchList}
        loading={loading}
        pageCount={pageCount}
        location={location}
      />
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
    </>
  );
};

export default NotificationsRejectedList;
