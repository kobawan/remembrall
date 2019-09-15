import React from "react";
import * as styles from "./rowTagsListWithAmount.less";
import { CommonFields, ProjectFieldWithAmountUsed } from "../../types";
import { plusSvg } from "../Svg/Svg";
import { FormRow, FormRowDirection } from "./FormRow";
import { TagEditor } from "../TagEditor/TagEditor";
import { getTagDisplayValue } from "../../utils/getTagDisplayValue";

interface RowListProps<F extends CommonFields> {
  name: string;
  options: F[];
  displayedFields: (keyof F)[];
  tags: ProjectFieldWithAmountUsed<F>[];
  updateTags: (tags: ProjectFieldWithAmountUsed<F>[]) => void;
  isRequired?: boolean;
}

export const RowTagsListWithAmount = <F extends CommonFields>({
  name,
  options,
  isRequired,
  tags,
  updateTags,
  displayedFields,
}: RowListProps<F>): ReturnType<React.FC<F>> => {
  const removeTag = (id: string) => {
    updateTags(tags.filter(t => t.entry.id !== id));
  };

  const renderTags = () => {
    // @todo open back tagEditor on click
    return tags.map(({ entry, amountUsed }, key) => (
      <div className={styles.tag} key={key}>
        <span>
          {getTagDisplayValue(displayedFields, entry)}
          <span style={{ color: "gray", fontWeight: 600 }}>&nbsp;&nbsp;x {amountUsed}</span>
        </span>
        <div className={styles.closeTag} onClick={() => removeTag(entry.id)}>
          {plusSvg}
        </div>
      </div>
    ));
  };

  return (
    <FormRow name={name} isRequired={isRequired} direction={FormRowDirection.row}>
      <div className={styles.container}>
        <TagEditor
          options={options}
          tags={tags}
          updateTags={updateTags}
          displayedFields={displayedFields}
        />
        {renderTags()}
      </div>
    </FormRow>
  );
};
