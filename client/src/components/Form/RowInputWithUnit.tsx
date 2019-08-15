import React from "react";
import "./rowInputWithUnit.less";
import { RowProps, OnChangeFn } from "./types";
import { FormRow } from "./FormRow";

interface RowInputWithUnitProps extends RowProps {
  type?: string;
  autofocus?: boolean;
  options: string[];
  unitValue: string;
  onUnitChange: OnChangeFn;
}

export const RowInputWithUnit = (({
  name,
  value,
  onChange,
  type,
  autofocus,
  options,
  unitValue,
  onUnitChange,
}: RowInputWithUnitProps) => {
  const renderOptions = () => {
    return options.map((value, i) => (
      <option value={value} key={i}>
        {value}
      </option>
    ));
  };
  return (
    <FormRow name={name}>
      <input
        type={type ? type : "text"}
        name={name}
        onChange={onChange}
        value={value}
        autoFocus={!!autofocus}
        className="rowInputMain"
      />
      <select
        className="rowInputUnit"
        onChange={onUnitChange}
        name="measurement"
        defaultValue={unitValue}
      >
        {renderOptions()}
      </select>
    </FormRow>
  );
});
