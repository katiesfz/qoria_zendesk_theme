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
    const currentFilterValues = filters[filterProperty.identifier] as FilterValue[] || [] as FilterValue[];
    console.log(`current filter values of ${filterProperty.identifier}: `, currentFilterValues);
    const synced = options.filter((option) => currentFilterValues.includes(option.value));
    console.log(`synced Options of ${filterProperty.identifier}: `, synced);
    setSelectedOptions(synced);
    console.log(`selected Options of ${filterProperty.identifier}:`, selectedOptions);
    const newFilterValues = filters[filterProperty.identifier] as FilterValue[] || [] as FilterValue[];
    console.log(`new filter values of ${filterProperty.identifier}`, newFilterValues);
  }, [filters]);

  const validateForm = (
    selectedOptions: MultiSelectOption[]
  ): FormState<FormFieldKey> => {
    if (required && selectedOptions.length === 0) {
      return {
        state: "invalid",
        errors: { 
          selectedOptions: t(
            "guide-requests-app.filters-modal.multiselect-no-value-error", 
            "Select at least one value"
          ) 
        },
      };
    } else {
      return { 
        state: "valid", 
        values: selectedOptions.map((option):FilterValue => option.value) 
      };
    }
  };
  
  function handleCheckboxChange(option: MultiSelectOption, isChecked: boolean) {
    const updatedOptions = isChecked
      ? [...selectedOptions, option]
      : selectedOptions.filter((item) => item.value !== option.value);

    // console.log("selected Options: ", selectedOptions);
    // console.log("updated Options: ", updatedOptions);
    
    setSelectedOptions(updatedOptions);
    onSelect(validateForm(updatedOptions));
  }

  // const isOptionSelected = (option: MultiSelectOption): boolean => {
  //   return selectedOptions.some((item) => item.value === option.value);
  // };

  const isOptionSelected = (option: MultiSelectOption): boolean => {
    const fieldId = filterProperty.identifier;
    if (selectedOptions.some((item) => item.value === `${option.value}`)) {
      return true;
    } else if (filters[fieldId]) {
      return filters[fieldId].some((item) => item === `${option.value}`);
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
