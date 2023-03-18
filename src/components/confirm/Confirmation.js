import { CButton, CSpinner } from "@coreui/react";

const Confirmation = ({ loading, submitFunc, value, closeFunc, action }) => {
  return (
    <div className="react-confirm-alert">
      <div className="react-confirm-alert-body">
        <div className="icon-delete-box">
          <span className="warning">!</span>
        </div>
        <div className="title-delete">Are you sure?</div>
        <p style={{ padding: "10px", color: "black" }}>
          Do you really want to <span className="conf_action">{action}</span>{" "}
          these record?
        </p>

        <div className="text-align-center">
          <CButton type="button" color="light" onClick={closeFunc}>
            No
          </CButton>
          <CButton
            type="button"
            color={`${
              action === "REJECT" || action === "DELETE" ? "danger" : "primary"
            }`}
            disabled={loading}
            onClick={() => {
              submitFunc(value);

              window.setTimeout(() => {
                closeFunc();
              }, 1000);

              return;
            }}
          >
            {loading && (
              <div className="d-flex justify-center align-center wh-300">
                <CSpinner />
              </div>
            )}
            {loading && <span>Yes</span>}
            {!loading && <span>Yes</span>}
          </CButton>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
