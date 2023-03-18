import {
  CButton,
  CCol,
  CFormSelect,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import React, { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";

import {
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table/dist/react-table.development";

import DefaultColumnFilter from "./DefaultColumnFilter";

const EditableCell = ({ value: initialValue }) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  return <input className="form-control" value={value} onChange={onChange} />;
};
const NotEditableCell = ({ value: initialValue }) => {
  return initialValue;
};

const Table = ({
  columns,
  data,
  fetchData,
  loading,
  pageCount: controlledPageCount,
  hideAction,
  isEditable,
  link,
  linkColumn,
}) => {
  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
      Cell: isEditable ? EditableCell : NotEditableCell,
    }),
    []
  );

  const initialState = { hiddenColumns: hideAction ? hideAction : "" };
  const {
    getTableProps,
    //getTableBodyProps,
    //visibleColumns,
    headerGroups,
    rows,
    page,
    pageOptions,
    nextPage,
    previousPage,
    prepareRow,
    gotoPage,
    setPageSize,
    //preGlobalFilteredRows,
    //setGlobalFilter,
    // state: { pageIndex, pageSize, sortBy, globalFilter, filters },
    state: { pageIndex, pageSize, sortBy, filters },
  } = useTable(
    {
      columns,
      data,
      initialState,
      defaultColumn,
      manualSortBy: true,
      manualPagination: true,
      manualFilters: true,
      pageCount: controlledPageCount,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  useEffect(() => {
    fetchData({ pageIndex, pageSize, sortBy, filters });
  }, [fetchData, sortBy, pageIndex, pageSize, filters]);

  return (
    <>
      <CTable responsive {...getTableProps()}>
        <CTableHead>
          {headerGroups.map((headerGroup) => (
            <CTableRow
              key={headerGroup.id}
              {...headerGroup.getHeaderGroupProps()}
            >
              {headerGroup.headers.map((column) => (
                <CTableHeaderCell
                  key={column.id}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                  <div>{column.canFilter ? column.render("Filter") : null}</div>
                </CTableHeaderCell>
              ))}
            </CTableRow>
          ))}
          {/* <tr>
            <th
              colSpan={visibleColumns.length}
              style={{
                textAlign: 'left',
              }}
            >
              <GlobalFilter
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
              />
            </th>
          </tr> */}
        </CTableHead>
        <CTableBody>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <CTableRow key={row.id} {...row.getRowProps()}>
                {row.cells.map((cell, idx) => {
                  return (
                    <CTableDataCell key={idx} {...cell.getCellProps()}>
                      {link && linkColumn === idx ? (
                        <Link to={`${row.original.id}/${row.original.name}`}>
                          {cell.render("Cell")}
                        </Link>
                      ) : (
                        cell.render("Cell")
                      )}
                    </CTableDataCell>
                  );
                })}
              </CTableRow>
            );
          })}
          <tr>
            {loading ? (
              // Use our custom loading state to show a loading indicator
              <td colSpan="10000" style={{ textAlign: "center" }}>
                <CSpinner />
              </td>
            ) : (
              <td colSpan="10000">
                Showing {page.length} of ~{controlledPageCount * pageSize}{" "}
                results
              </td>
            )}
          </tr>
        </CTableBody>
      </CTable>

      <Fragment>
        <CRow>
          <CCol xs={12} sm={12} md={12} lg={4}>
            <span>
              Page{" "}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>{" "}
            </span>
          </CCol>
          <CCol xs={12} sm={12} md={12} lg={4}>
            {" "}
            <div className="d-flex w-auto">
              <span className="ml-1">Records per page:&nbsp;</span>
              <CFormSelect
                value={pageSize}
                className="w-auto"
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                }}
              >
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </CFormSelect>
            </div>
          </CCol>
          <CCol xs={12} sm={12} md={12} lg={4}>
            <div className="d-flex w-auto" style={{ float: "right" }}>
              <CButton
                onClick={() => gotoPage(0)}
                className="mx-1"
                color="light"
              >
                {"<<"}
              </CButton>
              <CButton
                onClick={() => previousPage()}
                className="mx-1"
                color="light"
              >
                {"Previous"}
              </CButton>
              <CButton
                onClick={() => nextPage()}
                className="mx-1"
                color="light"
              >
                {"Next"}
              </CButton>
              <CButton
                onClick={() => gotoPage(controlledPageCount - 1)}
                className="mx-1"
                color="light"
              >
                {">>"}
              </CButton>
            </div>
          </CCol>
        </CRow>
      </Fragment>

      {/* <div className="d-flex row items-center justify-end">
        <div></div>
        <div className="d-flex w-auto">
          <span className="ml-1">Records per page:</span>
          <CFormSelect
            value={pageSize}
            className="w-auto"
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </CFormSelect>
        </div>
        <div className="d-flex w-auto">
          <span>
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{" "}
          </span>

          <CButton
            onClick={() => gotoPage(0)}
            className="mx-1"
            color="transparent"
          >
            {"<<"}
          </CButton>
          <CButton
            onClick={() => previousPage()}
            className="mx-1"
            color="transparent"
          >
            {"<"}
          </CButton>
          <CButton
            onClick={() => nextPage()}
            className="mx-1"
            color="transparent"
          >
            {">"}
          </CButton>
          <CButton
            onClick={() => gotoPage(controlledPageCount - 1)}
            className="mx-1"
            color="transparent"
          >
            {">>"}
          </CButton>
        </div>
      </div> */}
    </>
  );
};

export default Table;
