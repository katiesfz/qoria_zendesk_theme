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

  const validateForm = (
    selectedOptions: MultiSelectOption[]
  ): FormState<FormFieldKey> => {
    if (!required) {
      return {
        state: "valid",
        values: selectedOptions.map((option): FilterValue => option.value),
      };
    } else {
      if (selectedOptions.length > 0) {
        return {
          state: "valid",
          values: selectedOptions.map((option): FilterValue => option.value),
        };
      } else {
        return {
          state: "invalid",
          errors: {
            selectedOptions: t(
              "guide-requests-app.filters-modal.multiselect-no-value-error",
              "Select at least one value"
            ),
          },
        };
      }
    }
  };

  const [selectedOptions, setSelectedOptions] = useState<MultiSelectOption[]>(
    []
  );

  //useEffect(() => {
  //  onSelect(validateForm([]));
  //}, []);

  function handleCheckboxChange(option: MultiSelectOption, isChecked: boolean) {
    let updatedOptions: MultiSelectOption[];
    
    if (isChecked) {
      updatedOptions = [...selectedOptions, option];
    } else {
      updatedOptions = selectedOptions.filter((item) => item.value !== option.value);
    }
    
    setSelectedOptions(updatedOptions);
    onSelect(validateForm(updatedOptions));
  }

  const isOptionSelected = (option: MultiSelectOption): boolean => {
    const fieldId = filterProperty.identifier;
    console.log("multiselect id: ", fieldId);
    if (selectedOptions.some((item) => item.value === option.value)) {
      console.log("selected options: option exists");
      return selectedOptions.some((item) => item.value === option.value);
    } else {
      if (filters) {
        if (filters[fieldId]) {
          return filters[fieldId].some((value) => value === option.value);
        }
      }
    }
    return false;
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
