import React, { useState } from "react";
import cx from "classnames";
import * as styles from "./rowTagsList.less";
import { CommonFields } from "../../types";
import { plusSvg } from "../Svg/Svg";
import { FormRow, FormRowDirection } from "./FormRow";

const DROPDOWN_TEXT = "Please choose from the dropdown";

interface RowTagsListProps<F extends CommonFields> {
  name: string;
  options: F[];
  displayedFields: (keyof F)[];
  tags: F[];
  updateTags: (tags: F[]) => void;
  isRequired?: boolean;
}

// @todo re-use RowTagsListWithAmount
export const RowTagsList = <F extends CommonFields>({
  name,
  options,
  isRequired,
  tags,
  updateTags,
  displayedFields,
}: RowTagsListProps<F>): ReturnType<React.FC<F>> => {
  const [isEditing, setIsEditing] = useState(false);
  const [tagId, setTagId] = useState("");

  const addTag = () => {
    const tag = options.find((option) => option.id === tagId);
    const tagAlreadyAdded = tags.some(t => t.id === tagId);
    if(tag && !tagAlreadyAdded) {
      updateTags([...tags, tag]);
    }
    setTagId("");
    setIsEditing(false);
  };

  const removeTag = (id: string) => {
    updateTags(tags.filter(t => t.id !== id));
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
    return tags.map(({ name, id }, key) => (
      <div className={styles.tag} key={key}>
        <span className={styles.tagName}>{name}</span>
        <div className={styles.closeTag} onClick={() => removeTag(id)}>
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
          <div className={styles.addTag} onClick={handlePlus} tabIndex={0}>
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
          </>}
        </div>
        {renderTags()}
      </div>
    </FormRow>
  );
};
