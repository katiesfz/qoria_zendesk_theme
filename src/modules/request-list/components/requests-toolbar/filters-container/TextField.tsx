import { Field, Input } from "@zendeskgarden/react-forms";
import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import { FieldError } from "./FieldError";
import type { FilterTypeKey, FilterTypeValue } from "./FilterTypeDropdown";
import { FilterTypeDropdown } from "./FilterTypeDropdown";
import type { FormErrors, FormState } from "./FormState";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { input } from "@testing-library/user-event/dist/cjs/event/input.js";

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
  const [selectedFilter, setSelectedFilter] = useState<FilterTypeValue>("anyValue");

  const validateForm = (
    filterType: FilterTypeValue,
    value: string
  ): FormState<FormFieldKey> => {
    switch (filterType) {
      case "anyValue": {
        return { state: "valid", values: [":*"] };
      }
      case "exactMatch": {
        if (value !== "") {
          return { state: "valid", values: [`:"${value}"`] };
        } else {
          return {
            state: "invalid",
            errors: {
              textValue: t(
                "guide-requests-app.filters-modal.no-text-value-error",
                "Insert a value"
              ),
            },
          };
        }
      }
    }
  };

  //useEffect(() => {
  //  onSelect(validateForm(undefined, ""));
  //}, []);

  const handleFilterTypeSelect = (filterType: FilterTypeValue) => {
    setSelectedFilter(filterType);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    console.log(inputValue);
    setValue(inputValue);
    onSelect(validateForm(selectedFilter, inputValue));
  };

  return (
    <>
      <FilterTypeDropdown
        onFilterTypeSelect={handleFilterTypeSelect}
        selectedFilter={selectedFilter}
        errors={errors}
      />
      <Field>
        <Field.Label>
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
