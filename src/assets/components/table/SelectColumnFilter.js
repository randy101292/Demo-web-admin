import React from "react";

const SelectColumnFilter = ({
  column,
  column: { filterValue, setFilter, preFilteredRows, selections },
}) => {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    return selections;
  }, [selections]);

  // Render a multi-select box
  return (
    <select
      value={filterValue}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">All</option>
      {Object.keys(options).map((key, i) => (
        <option key={key} value={key}>
          {options[key]}
        </option>
      ))}
    </select>
  );
};

export default SelectColumnFilter;
