import React, { useState } from "react";
import cx from "classnames";
import * as styles from "./tagEditor.less";
import { CommonFields, ProjectFieldWithAmountUsed } from "../../types";
import { plusSvg } from "../Svg/Svg";
import { getTagDisplayValue } from "../../utils/getTagDisplayValue";

const DROPDOWN_TEXT = "Please choose from the dropdown";

interface TagEditorProps<F extends CommonFields> {
  options: F[];
  displayedFields: (keyof F)[];
  tags: ProjectFieldWithAmountUsed<F>[];
  updateTags: (tags: ProjectFieldWithAmountUsed<F>[]) => void;
}

export const TagEditor = <F extends CommonFields>({
  options,
  tags,
  updateTags,
  displayedFields,
}: TagEditorProps<F>): ReturnType<React.FC<F>> => {
  const [isEditing, setIsEditing] = useState(false);
  const [tagId, setTagId] = useState("");
  const [amount, setAmount] = useState(1); // @todo amount should not go over limit of tag

  const addTag = () => {
    const tag = options.find((option) => option.id === tagId);
    const tagAlreadyAdded = tags.some(t => t.entry.id === tagId);
    if(tag && !tagAlreadyAdded) {
      updateTags([...tags, { entry: tag, amountUsed: amount }]);
    }
    setTagId("");
    setAmount(1);
    setIsEditing(false);
  };

  const addTagOnEnter = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if(e.keyCode === 13) {
      addTag();
    }
  };

  const handlePlus = () => {
    isEditing ? addTag() : setIsEditing(true);
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
