//import {
//  Dropdown,
//  Item,
//  Field,
//  Select,
//  Label,
//} from "@zendeskgarden/react-dropdowns.legacy";
import { Field, Select } from '@zendeskgarden/react-forms';
import styled from "styled-components";
import { useFilterTranslations } from "../i18n";
import { FieldError } from "./FieldError";
import type { FormErrors } from "./FormState";
import { useTranslation } from "react-i18next";
import { ModalMenu } from "../../modal-menu/ModalMenu";

export type FilterTypeValue = "anyValue" | "exactMatch";

export type FilterTypeKey = "filterType";

interface FilterTypeDropdownProps {
  onFilterTypeSelect: (value: FilterTypeValue) => void;
  selectedFilter: FilterTypeValue;
  errors: FormErrors<FilterTypeKey>;
}

const StyledSelect = styled(Select)`
  margin-top: ${(p) => p.theme.space.xs};
`;

export const FilterTypeDropdown = (
  props: FilterTypeDropdownProps
): JSX.Element => {
  const { t } = useTranslation();

  const { onFilterTypeSelect, selectedFilter, errors } = props;
  const { filterTypeDropdownI18N } = useFilterTranslations();

  return (
    <>
      <Field>
        <Field.Label hidden>{t("guide-requests-app.filter-modal.filterTypeLabel", "Filter type")}</Field.Label>
        <Select onChange={(e) => onFilterTypeSelect(e.currentTarget.value as FilterTypeValue)} value={selectedFilter}>
          <option value="anyValue">{filterTypeDropdownI18N.anyValue}</option>
          <option value="exactMatch">{filterTypeDropdownI18N.exactMatch}</option>
        </Select>
      </Field>

      <Field>
        <FieldError errors={errors} field="filterType"/>
      </Field>
    </>
  );
};
