import { useEffect, useState } from "react";
import { Checkbox, Fieldset, Field } from "@zendeskgarden/react-forms";
import styled from "styled-components";
import type { FilterValue } from "../../../data-types/FilterValue";
import type { FilterValuesMap } from "../../../data-types/FilterValue";
import { FieldError } from "./FieldError";
import type { FormErrors, FormState } from "./FormState";
import { useTranslation } from "react-i18next";
import type { FilterProperty } from "./FilterPropertyField";
import { Grid } from '@zendeskgarden/react-grid';


export interface MultiSelectOption {
  value: FilterValue;
  label: string;
}

type FormFieldKey = "selectedOptions";

interface MultiselectProps {
  filters: FilterValuesMap;
  filterProperty: FilterProperty;
  label: string;
  options: MultiSelectOption[];
  onSelect: (state: FormState<FormFieldKey>) => void;
  errors: FormErrors<FormFieldKey>;
  required?: boolean;
}

export function Multiselect({
  filters,
  filterProperty,
  label,
  options,
  onSelect,
  errors,
  required,
}: MultiselectProps): JSX.Element {

  const { t } = useTranslation();

  const [selectedOptions, setSelectedOptions] = useState<MultiSelectOption[]>(
    []
  );

  useEffect(() => {
    const currentFilterValues = filters[filterProperty.identifier] || [];
    const synced = options.filter((option) => currentFilterValues.includes(option.value));
    setSelectedOptions(synced);
  }, [filters, filterProperty, options]);

  const validateForm = (
    selectedOptions: MultiSelectOption[]
  ): FormState<FormFieldKey> => {
    const values = selectedOptions.map((option):FilterValue => option.value);
    if (required && values.length === 0) {
      return {
        state: "invalid",
        errors: { 
          selectedOptions: t(
            "guide-requests-app.filters-modal.multiselect-no-value-error", 
            "Select at least one value"
          ) 
        },
      };
    }
    return { state: "valid", values };
  };
  
  function handleCheckboxChange(option: MultiSelectOption, isChecked: boolean) {
    const updatedOptions = isChecked
      ? [...selectedOptions, option]
      : selectedOptions.filter((item) => item.value !== option.value);

    setSelectedOptions(updatedOptions);
    onSelect(validateForm(updatedOptions));
  }

  const isOptionSelected = (option: MultiSelectOption): boolean => {
      return selectedOptions.some((item) => item.value === option.value);
    };

  return (
    <Fieldset>
      <Fieldset.Legend hidden>{label}</Fieldset.Legend>
      {options.map((option) => (
          <Field key={option.value}>
            <Checkbox
              checked={isOptionSelected(option)}
              onChange={(e) => handleCheckboxChange(option, e.target.checked)}
            >
              <Field.Label>{option.label}</Field.Label>
            </Checkbox>
          </Field>
      ))}
      <Field>
        <FieldError errors={errors} field="selectedOptions"/>
      </Field>
    </Fieldset>
  );
}
