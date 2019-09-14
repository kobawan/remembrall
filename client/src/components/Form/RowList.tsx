import React, { useState } from "react";
import cx from "classnames";
import * as styles from "./rowList.less";
import { CommonFields } from "../../types";
import { plusSvg } from "../Svg/Svg";
import { FormRow, FormRowDirection } from "./FormRow";

const DROPDOWN_TEXT = "Please choose from the dropdown";

interface RowListProps<F extends CommonFields> {
  name: string;
  options: F[];
  displayedFields: (keyof F)[];
  tags: F[];
  updateTags: (field: string, tags: F[]) => void;
  isRequired?: boolean;
  withAmount?: boolean;
}

export const RowList = <F extends CommonFields>({
  name,
  options, // @todo only get available options
  isRequired,
  tags,
  updateTags,
  displayedFields,
  withAmount,
}: RowListProps<F>): ReturnType<React.FC<F>> => {
  const [isEditing, setIsEditing] = useState(false);
  const [tagId, setTagId] = useState("");
  const [amount, setAmount] = useState(1); // @todo amount should not go over limit of tag

  const addTag = () => {
    const tag = options.find((option) => option.id === tagId);
    const tagAlreadyAdded = tags.some(t => t.id === tagId);
    if(tag && !tagAlreadyAdded) {
      updateTags(name, [tag].concat(tags));
    }
    setTagId("");
    setIsEditing(false);
  };

  const removeTag = (e: React.MouseEvent<HTMLDivElement>) => {
    const id = (e.currentTarget.previousSibling as HTMLSpanElement).innerText;
    updateTags(name, tags.filter(t => t.id !== id));
  };

  const addTagOnEnter = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if(e.keyCode === 13) {
      addTag();
    }
  };

  const handlePlus = () => {
    isEditing ? addTag() : setIsEditing(true);
  };

  const renderTags = () => {
    return tags.map(({ name }, key) => (
      <div className={styles.tag} key={key}>
        <span className={styles.tagName}>{name}</span>
        <div className={styles.closeTag} onClick={removeTag}>
          {plusSvg}
        </div>
      </div>
    ));
  };

  const renderOptions = () => {
    return options.map((option, key) => {
      const value = displayedFields
        .reduce((values: any[], field: keyof F) => {
          return field === "size" && option[field]
            ? [...values, (option[field] as any as string).replace(";", " ")]
            : [...values, option[field]];
        }, [])
        .filter(Boolean)
        .join(" - ");
      return (
        <option value={option.id} key={key}>{value}</option>
      );
    });
  };

  return (
    <FormRow name={name} isRequired={isRequired} direction={FormRowDirection.row}>
      <div className={styles.container} onKeyUp={addTagOnEnter}>
        <div className={cx(styles.tagEditor, isEditing && styles.isEditing)}>
          <div className={styles.addTag} onClick={handlePlus}>
            {plusSvg}
          </div>
          {isEditing && <>
            <div className={styles.listWrapper}>
              <select
                className={styles.list}
                name={name}
                onChange={(e) => setTagId(e.currentTarget.value)}
              >
                <option value="">{DROPDOWN_TEXT}</option>
                {renderOptions()}
              </select>
            </div>
            {withAmount && (
              <div className={styles.amountWrapper}>
                <input
                  type="number"
                  name="amount"
                  onChange={(e) => setAmount(+e.currentTarget.value)}
                  value={amount}
                  className={styles.amount}
                  min={1}
                />
              </div>
            )}
          </>}
        </div>
        {renderTags()}
      </div>
    </FormRow>
  );
};
