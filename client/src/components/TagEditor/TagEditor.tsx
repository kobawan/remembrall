import React, { useState } from "react";
import cx from "classnames";
import * as styles from "./tagEditor.less";
import { CommonFields, ProjectFieldWithAmountUsed, AvailableAmountField } from "../../types";
import { plusSvg } from "../Svg/Svg";
import { getTagDisplayValue } from "../../utils/getTagDisplayValue";

const DROPDOWN_TEXT = "Please choose from the dropdown";

type CommonFieldsWithAvailableAmount = CommonFields & AvailableAmountField;

interface TagEditorProps<F extends CommonFieldsWithAvailableAmount> {
  options: F[];
  displayedFields: (keyof F)[];
  tags: ProjectFieldWithAmountUsed<F>[];
  addTag: (tags: CommonFieldsWithAvailableAmount, amountUsed: number) => Promise<void>;
}

export const TagEditor = <F extends CommonFieldsWithAvailableAmount>({
  options,
  tags,
  addTag,
  displayedFields,
}: TagEditorProps<F>): ReturnType<React.FC<F>> => {
  const [isEditing, setIsEditing] = useState(false);
  const [tagId, setTagId] = useState("");
  const [amount, setAmount] = useState(1); // @todo amount should not go over limit of tag

  const handleAddTag = () => {
    const tag = options.find((option) => option.id === tagId);
    const tagAlreadyAdded = tags.some(t => t.entry.id === tagId);
    if(tag && !tagAlreadyAdded) {
      addTag(tag, amount);
    }
    setTagId("");
    setAmount(1);
    setIsEditing(false);
  };

  const addTagOnEnter = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if(e.keyCode === 13) {
      handleAddTag();
    }
  };

  const handlePlus = () => {
    isEditing ? handleAddTag() : setIsEditing(true);
  };

  const renderOptions = () => {
    return options.map((option, key) => {
      const value = getTagDisplayValue(displayedFields, option);
      return (
        <option value={option.id} key={key}>{value}</option>
      );
    });
  };

  return (
    <div className={cx(styles.tagEditor, isEditing && styles.isEditing)} onKeyUp={addTagOnEnter}>
      <div className={styles.addTag} onClick={handlePlus} tabIndex={0}>
        {plusSvg}
      </div>
      {isEditing && <>
        <div className={styles.listWrapper}>
          <select
            className={styles.list}
            onChange={(e) => setTagId(e.currentTarget.value)}
          >
            <option value="">{DROPDOWN_TEXT}</option>
            {renderOptions()}
          </select>
        </div>
        <div className={styles.amountWrapper}>
          <input
            type="number"
            name="amount"
            onChange={(e) => setAmount(+e.currentTarget.value)}
            value={amount}
            className={styles.amount}
            min={0}
          />
        </div>
      </>}
    </div>
  );
};
