import { Field, Input } from "@zendeskgarden/react-forms";
import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import { FieldError } from "./FieldError";
//import type { FilterTypeKey, FilterTypeValue } from "./FilterTypeDropdown";
import { FilterTypeDropdown } from "./FilterTypeDropdown";
import type { FormErrors, FormState } from "./FormState";
import type { FilterValuesMap } from "../../../data-types/FilterValue";
import type { FilterProperty } from "./FilterPropertyField";
import { useTranslation } from "react-i18next";
import { useFilterTranslations } from "../i18n";
import type { FilterValue } from "../../../data-types/FilterValue";
import {getFilterKey} from "./SystemFieldCheck";
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
  filters: FilterValuesMap;
  filterProperty: FilterProperty;
  onSelect: (state: FormState) => void;
  errors: FormErrors<FormFieldKey>;
}

const Gap = styled.div`
  height: ${(p) => p.theme.space.md};
`;



export const TextField = ({
  label,
  filters,
  filterProperty,
  onSelect,
  errors,
}: TextFieldProps): JSX.Element => {
  const { t } = useTranslation();
  const [value, setValue] = useState<string>("");

  const { filterTypeDropdownI18N } = useFilterTranslations();

  const validateForm = (
    value: string
  ): FormState<FormFieldKey> => {
    if (value != "") {
      return { state: "valid", values: [`:"${value}"`] };
    } else {
      return { state: "valid", values: [`:*`] };
    }
  };
  const filterKey = getFilterKey(filterProperty.identifier);

    useEffect(() => {
      const currentFilterValues = filters[filterKey] as FilterValue[] || [] as FilterValue[];
      const curValue = currentFilterValues[0]?.substring(1);
      
      if (!curValue || curValue === "*") {
        setValue("");
        return;
      }

      // const rawValue = curValue.replace(/^"(.*)"$/, "$1");
      setValue(curValue.substring(1, curValue.length - 2));

      //if (currentFilterValues.length > 0) {
      //  const currentValue = currentFilterValues[0] as string;
      //  if (currentValue == "*") {
      //    setValue("");
      //    return;
      //  }
      //} else {
      //    setValue("");
      //}
    }, [filters[filterKey]]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setValue(inputValue);
    onSelect(validateForm(inputValue));
  };

  return (
    <>
      <Field>
        <Field.Label hidden>
          {label}
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
