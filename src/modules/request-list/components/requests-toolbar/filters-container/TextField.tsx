import { Field, Input } from "@zendeskgarden/react-forms";
import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import { FieldError } from "./FieldError";
//import type { FilterTypeKey, FilterTypeValue } from "./FilterTypeDropdown";
import { FilterTypeDropdown } from "./FilterTypeDropdown";
import type { FormErrors, FormState } from "./FormState";
import { useTranslation } from "react-i18next";
import { useFilterTranslations } from "../i18n";
import styled, { css, DefaultTheme } from "styled-components";
import { input } from "@testing-library/user-event/dist/cjs/event/input.js";
import { Menu, Item, IMenuProps } from '@zendeskgarden/react-dropdowns';
import { qoriaTheme } from "../../../../shared";

const filterOptions = ["anyValue", "exactMatch"] as const;
type FilterType = typeof filterOptions[number];

type FilterTypeKey = "filterType";
type FormFieldKey = FilterTypeKey | "textValue";

interface TextFieldProps {
  label: string;
  onSelect: (state: FormState) => void;
  errors: FormErrors<FormFieldKey>;
}

const Gap = styled.div`
  height: ${(p) => p.theme.space.md};
`;



export const TextField = ({
  label,
  onSelect,
  errors,
}: TextFieldProps): JSX.Element => {
  const { t } = useTranslation();
  const [value, setValue] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("anyValue");

  const { filterTypeDropdownI18N } = useFilterTranslations();

  const validateForm = (
    value: string
  ): FormState<FormFieldKey> => {
    if (value !== "") {
      return { state: "valid", values: [`:"${value}"`] };
    } else {
      return { state: "valid", values: [":*"] };
    }
  };

  //useEffect(() => {
  //  onSelect(validateForm(undefined, ""));
  //}, []);

  const handleFilterTypeSelect = (filterType: FilterType) => {
    setSelectedFilter(filterType);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setValue(inputValue);
    onSelect(validateForm(inputValue));
  };

  return (
    <>
      {/*
      <FilterTypeDropdown
        onFilterTypeSelect={handleFilterTypeSelect}
        filterOptions={filterOptions}
        selectedFilter={selectedFilter}
        errors={errors}
      />
      */}
      
      {/* <Field>
        <Field.Label hidden>{t("guide-requests-app.filter-modal.filterTypeLabel", "Filter type")}</Field.Label>
        <Menu button={selectedFilter} onChange={(e) => handleFilterTypeSelect(e.value as FilterType)}>
          {filterOptions.map(filterType =>
            <Item value={filterType}>{filterTypeDropdownI18N[filterType]}</Item>
          )}
        </Menu>
        
        <Select onChange={(e) => onFilterTypeSelect(e.currentTarget.value as FilterTypeValue)} value={selectedFilter}>
          <option value="anyValue">{filterTypeDropdownI18N.anyValue}</option>
          <option value="exactMatch">{filterTypeDropdownI18N.exactMatch}</option>
        </Select>
        
        {selectedFilter && <FieldError errors={errors} field="filterType"/>}
      </Field>*/}

      <Field>
        <Field.Label hidden>
          {t(
            "guide-requests-app.filters-modal.enter-field-value",
            "Enter {{field_name}}",
            {
              field_name: label,
            }
          )}
        </Field.Label>
        <Input
          value={value}
          onChange={handleChange}
          validation={errors["textValue"] ? "error" : undefined}
        />
        <FieldError errors={errors} field="textValue" />
      </Field>
    </>
  );
};
