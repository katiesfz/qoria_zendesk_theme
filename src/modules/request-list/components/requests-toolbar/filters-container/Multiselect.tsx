import { useEffect, useState } from "react";
import { Checkbox } from "@zendeskgarden/react-forms";
import styled from "styled-components";
import type { FilterValue } from "../../../data-types/FilterValue";
import { FieldError } from "./FieldError";
import type { FormErrors, FormState } from "./FormState";
import { useTranslation } from "react-i18next";

const CheckboxList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 0;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export interface MultiSelectOption {
  value: FilterValue;
  label: string;
}

type FormFieldKey = "selectedOptions";

interface MultiselectProps {
  label: string;
  options: MultiSelectOption[];
  onSelect: (state: FormState<FormFieldKey>) => void;
  errors: FormErrors<FormFieldKey>;
}

export function Multiselect({
  label,
  options,
  onSelect,
  errors,
}: MultiselectProps): JSX.Element {
  const { t } = useTranslation();

  const validateForm = (
    selectedOptions: MultiSelectOption[]
  ): FormState<FormFieldKey> => {
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
  };

  const [selectedOptions, setSelectedOptions] = useState<MultiSelectOption[]>(
    []
  );

  useEffect(() => {
    onSelect(validateForm([]));
  }, []);

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
    return selectedOptions.some((item) => item.value === option.value);
  };

  return (
    <div>
      <div style={{ marginBottom: "8px", fontWeight: 500 }}>{label}</div>
      <CheckboxList role="group" aria-label={label}>
        {options.map((option) => (
          <CheckboxWrapper key={option.value}>
            <Checkbox
              checked={isOptionSelected(option)}
              onChange={(e) => handleCheckboxChange(option, e.target.checked)}
            >
              {option.label}
            </Checkbox>
          </CheckboxWrapper>
        ))}
      </CheckboxList>
      <FieldError errors={errors} field="selectedOptions" />
    </div>
  );
}
