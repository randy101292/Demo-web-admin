import React from 'react';
import {
  useAsyncDebounce
} from 'react-table/dist/react-table.development';

const DefaultColumnFilter =({
  column: { filterValue, preFilteredRows, setFilter },
}) => {
  const count = preFilteredRows.length
  const [value, setValue] = React.useState(filterValue)
  const onChange = useAsyncDebounce(value => {
    setFilter(value || undefined)
  }, 1000)

  return (
    <input
      value={value || ""}
      onClick={e => e.stopPropagation()}
      onChange={e => {
        setValue(e.target.value);
        onChange(e.target.value);
         // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  )
}

export default DefaultColumnFilter;