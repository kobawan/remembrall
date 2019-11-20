import React from "react";
import { useMutation, MutationTuple } from "@apollo/react-hooks";
import * as styles from "./rowTagsListWithAmount.less";
import { CommonFields, ProjectFieldWithAmountUsed, AvailableAmountField, TempAnyObject } from "../../types";
import { plusSvg } from "../Svg/Svg";
import { FormRow, FormRowDirection } from "./FormRow";
import { TagEditor } from "../TagEditor/TagEditor";
import { getTagDisplayValue } from "../../utils/getTagDisplayValue";
import { UPDATE_MATERIAL_AVAILABLE_AMOUNT } from "../MaterialColumn/materialQueries";
import { UPDATE_TOOL_AVAILABLE_AMOUNT } from "../ToolColumn/toolQueries";
import { logErrors } from "../../utils/errorHandling";
import { UpdateAvailableAmountInput } from "../../graphql/client";

type CommonFieldsWithAvailableAmount = CommonFields & AvailableAmountField;

interface RowListProps<F extends CommonFieldsWithAvailableAmount> {
  name: string;
  options: F[];
  displayedFields: (keyof F)[];
  tags: ProjectFieldWithAmountUsed<F>[];
  updateTags: (tags: ProjectFieldWithAmountUsed<F>[]) => void;
  isRequired?: boolean;
}

const useUpdateAvailableAmountMutation = (name: string): MutationTuple<TempAnyObject, UpdateAvailableAmountInput> => {
  switch(name) {
    case "materials":
      return useMutation(UPDATE_MATERIAL_AVAILABLE_AMOUNT);
    case "tools":
      return useMutation(UPDATE_TOOL_AVAILABLE_AMOUNT);
    default:
      throw new Error(`Type '${name}' has no field: available amount`);
  }
};

export const RowTagsListWithAmount = <F extends CommonFieldsWithAvailableAmount>({
  name,
  options,
  isRequired,
  tags,
  updateTags,
  displayedFields,
}: RowListProps<F>): ReturnType<React.FC<F>> => {
  // @todo updateAvailableAmount on cancel/delete as well
  const [updateAvailableAmount, mutationRes] = useUpdateAvailableAmountMutation(name);

  logErrors(mutationRes.error);

  const removeTag = async (tag: CommonFieldsWithAvailableAmount, amountUsed: number) => {
    // DOESNT WORK ON ALREADY CREATED PROJECT
    await updateAvailableAmount({ variables: {
      id: tag.id,
      availableAmount: tag.availableAmount + amountUsed
    } });
    updateTags(tags.filter(t => t.entry.id !== tag.id));
  };

  const addTag = async (tag: CommonFieldsWithAvailableAmount, amountUsed: number) => {
    // DOESNT WORK ON ALREADY CREATED PROJECT
    await updateAvailableAmount({ variables: {
      id: tag.id,
      availableAmount: tag.availableAmount - amountUsed
    } });
    updateTags(tags.concat([{ entry: tag as any, amountUsed }]));
  };

  const renderTags = () => {
    // @todo open back tagEditor on click
    return tags.map(({ entry, amountUsed }, key) => (
      <div className={styles.tag} key={key}>
        <span>
          {getTagDisplayValue(displayedFields, entry)}
          <span style={{ color: "gray", fontWeight: 600 }}>&nbsp;&nbsp;x {amountUsed}</span>
        </span>
        <div className={styles.closeTag} onClick={() => removeTag(entry, amountUsed)}>
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
          addTag={addTag}
          displayedFields={displayedFields}
        />
        {renderTags()}
      </div>
    </FormRow>
  );
};
