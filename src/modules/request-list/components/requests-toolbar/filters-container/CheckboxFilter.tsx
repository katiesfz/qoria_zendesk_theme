import {
  Dropdown,
  Item,
  Label,
  Select,
} from "@zendeskgarden/react-dropdowns.legacy";
import { useEffect, useState } from "react";
import type { CheckboxFilterValue } from "../../../data-types/FilterValue";
import { useFilterTranslations } from "../i18n";
import type { FilterValuesMap } from "../../../data-types/FilterValue";
import type { FilterProperty } from "./FilterPropertyField";
import type { FilterValue } from "../../../data-types/FilterValue";
import {getFilterKey} from "./SystemFieldCheck";
import { FieldError } from "./FieldError";
import type { FormErrors, FormState } from "./FormState";
import { useTranslation } from "react-i18next";
import { ModalMenu } from "../../modal-menu/ModalMenu";
import { Field, Input, Radio, Fieldset } from "@zendeskgarden/react-forms";


type FormFieldKey = "filterValue";

interface CheckboxFilterProps {
  label: string;
  filters: FilterValuesMap;
  filterProperty: FilterProperty;
  onSelect: (state: FormState<FormFieldKey>) => void;
  errors: FormErrors<FormFieldKey>;
}

export function CheckboxFilter({
  label,
  filters,
  filterProperty,
  onSelect,
  errors,
}: CheckboxFilterProps): JSX.Element {
  const { t } = useTranslation();

  const validateForm = (
    checkboxFilterValue: CheckboxFilterValue | null
  ): FormState<FormFieldKey> => {
    if (checkboxFilterValue === null) {
      return {
        state: "invalid",
        errors: {
          filterValue: t(
            "guide-requests-app.filters-modal.select-value-error",
            "Select a value"
          ),
        },
      };
    }

    return {
      state: "valid",
      values: [checkboxFilterValue],
    };
  };

  const { checkboxFilterValuesI18N } = useFilterTranslations();
  const [value, setValue] = useState<CheckboxFilterValue | null>(null);

  const filterKey = getFilterKey(filterProperty.identifier);

  
  useEffect(() => {
    const currentFilterValues = filters[filterKey] as FilterValue[] || [] as FilterValue[];
    if (currentFilterValues.length > 0) {
      const currentValue = currentFilterValues[0] as string;
      setValue(currentValue as CheckboxFilterValue);
    } else {
      setValue(null);
    }
  }, [filters[filterKey]]);


  const handleSelect = (item: CheckboxFilterValue) => {
    setValue(item);
    onSelect(validateForm(item));
  };

  return (
    <>
      <Fieldset>
        <Fieldset.Legend hidden>{label}</Fieldset.Legend>
            <Field>
              <Radio
                name={label}
                value=":checked"
                checked={value === ":checked"}
                onChange={event => {
                  handleSelect(event.target.value as CheckboxFilterValue);
                }}
              >
                <Field.Label>{checkboxFilterValuesI18N[":checked"]}</Field.Label>
              </Radio>
            </Field>
            <Field>
              <Radio
                name={label}
                value=":unchecked"
                checked={value === ":unchecked"}
                onChange={event => {
                  handleSelect(event.target.value as CheckboxFilterValue);
                }}
              >
                <Field.Label>{checkboxFilterValuesI18N[":unchecked"]}</Field.Label>
              </Radio>
            </Field>
      </Fieldset>
    </>
  );
}
