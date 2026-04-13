import {
  Dropdown,
  Select,
  Field as DropdownField,
  Label as DropdownLabel,
} from "@zendeskgarden/react-dropdowns.legacy";
import { Field, Input, Radio, Fieldset } from "@zendeskgarden/react-forms";
import { Grid } from "@zendeskgarden/react-grid";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useFilterTranslations } from "../i18n";
import { FieldError } from "./FieldError";
import type { FormErrors, FormState } from "./FormState";
import type { FilterValuesMap } from "../../../data-types/FilterValue";
import type { FilterProperty } from "./FilterPropertyField";
import { useTranslation } from "react-i18next";
import { ModalMenu } from "../../modal-menu/ModalMenu";
import { FilterTypeDropdown } from "./FilterTypeDropdown";
import { Menu, Item, IMenuProps } from '@zendeskgarden/react-dropdowns';
import { FilterValue } from "../../../data-types";
import {isSystemFieldType} from "./SystemFieldCheck";

type FormFieldKey = "filterType" | "minValue" | "maxValue" | "exactValue";

interface AnyValueNumberFilter {
  type: "anyValue"
}

interface RangeNumberFilter {
  type: "range";
  minValue?: string;
  maxValue?: string
}

interface ExactMatchNumberFilter {
  type: "exactMatch";
  value?: string
}

type NumberFilter =
  | AnyValueNumberFilter
  | ExactMatchNumberFilter
  | RangeNumberFilter;

const filterOptions: NumberFilter[] = [{
    type: "range"
  }, {
    type: "exactMatch"
  }];
  

interface NumberFilterProps {
  label: string;
  filters: FilterValuesMap;
  filterProperty: FilterProperty;
  onSelect: (state: FormState<FormFieldKey>) => void;
  errors: FormErrors<FormFieldKey>;
  type: "decimal" | "integer";
}


export function NumberFilter({
  label,
  filters,
  filterProperty,
  onSelect,
  errors,
  type,
}: NumberFilterProps): JSX.Element {
  const { t } = useTranslation();

  const [filter, setFilter] = useState<NumberFilter>({ type: "anyValue" });

  const validateForm = (
    filter: NumberFilter,
    type: "decimal" | "integer"
  ): FormState<FormFieldKey> => {
    switch (filter.type) {
      case "exactMatch": {
        let value: string | undefined = undefined;

        if (filter.value) {
          value = filter.value.trim();
        }
        
        if (type === "integer" && value && !Number.isInteger(Number(value))) {
          return {
            state: "invalid",
            errors: {
              exactValue: t(
                "guide-requests-app.filter-modal.integer-value-error",
                "Insert an integer value"
              ),
            },
          };
        }
        
        if (value) {
          return { state: "valid", values: [`:${value}`] };
        }

        return { state: "valid", values: [`:*`] };
      }
      
      case "range": {
        let minValue: number | undefined = undefined;
        let maxValue: number | undefined = undefined;

        if (filter.minValue){
          minValue = parseFloat(filter.minValue);
        }

        if (filter.maxValue){
          maxValue = parseFloat(filter.maxValue);
        }

        //if (Number.isNaN(minValue)) {
        //  return {
        //    state: "invalid",
        //    errors: {
        //      minValue: t(
        //        "guide-requests-app.filters-modal.no-text-value-error",
        //        "Insert a value"
        //      ),
        //    },
        //  };
        //}

        //if (Number.isNaN(maxValue)) {
        //  return {
        //    state: "invalid",
        //    errors: {
        //      maxValue: t(
        //        "guide-requests-app.filters-modal.no-text-value-error",
        //        "Insert a value"
        //      ),
        //    },
        //  };
        //}

        if (type === "integer" && minValue && !Number.isInteger(minValue)) {
          return {
            state: "invalid",
            errors: {
              minValue: t(
                "guide-requests-app.filter-modal.integer-value-error",
                "Insert an integer value"
              ),
            },
          };
        }

        if (type === "integer" && maxValue && !Number.isInteger(maxValue)) {
          return {
            state: "invalid",
            errors: {
              maxValue: t(
                "guide-requests-app.filter-modal.integer-value-error",
                "Insert an integer value"
              ),
            },
          };
        }

        if (minValue && maxValue && (minValue >= maxValue)) {
          return {
            state: "invalid",
            errors: {
              maxValue: t(
                "guide-requests-app.filter-modal.minValue-greater-than-maxValue",
                "Select a value greater than min value"
              ),
            },
          };
        }

        if (minValue && maxValue) {
          return { state: "valid", values: [`>=${minValue}`, `<=${maxValue}`] };
        }

        if (minValue) {
          return { state: "valid", values: [`>=${minValue}`] };
        }
        
        if (maxValue) {
          return { state: "valid", values: [`<=${maxValue}`] };
        }

      }
      default: {
        return {
          state: "valid",
          values: [":*"],
        };
      }
    }
  };

  const filterKey =
    isSystemFieldType(filterProperty.identifier) ||
    filterProperty.identifier === "created_at" ||
    filterProperty.identifier === "updated_at" ||
    filterProperty.identifier === "organization" ||
    filterProperty.identifier === "custom_status_id"
      ? filterProperty.identifier
      : `custom_field_${filterProperty.identifier}`;

  useEffect(() => {
    const currentFilterValues = filters[filterKey] as FilterValue[] || [] as FilterValue[];
    if (currentFilterValues.includes(":*")) {
      setFilter({ type: "anyValue" });
    } else if (currentFilterValues.some(value => value.startsWith(">=") || value.startsWith("<="))) {
      const minValue = currentFilterValues.find(value => value.startsWith(">="))?.substring(2);
      const maxValue = currentFilterValues.find(value => value.startsWith("<="))?.substring(2);
      setFilter({ type: "range", minValue, maxValue });
    } else if (currentFilterValues.length > 0) {
      const exactValue = currentFilterValues.find(value => value.startsWith(":"))?.substring(1);
      setFilter({ type: "exactMatch", value: exactValue });
    }
  }, [filters[filterKey]]);
  

  const handleFilterTypeSelect = (value: NumberFilter["type"]) => {
    let newFilter: NumberFilter;
    switch (value) {
      case "range": {
        newFilter = { type: "range", minValue: "", maxValue: "" };
        break;
      }
      case "exactMatch": {
        newFilter = { type: "exactMatch", value: "" };
        break;
      }
      default: {
        newFilter = { type: "anyValue" };
        break;
      }
    }

    setFilter(newFilter);
    onSelect(validateForm(newFilter, type));
  };

  const handleMinValueChanged = (
    newValue: string,
    filter: RangeNumberFilter
  ) => {
    const newFilter = { ...filter, minValue: newValue };
    setFilter(newFilter);
    onSelect(validateForm(newFilter, type));
  };

  const handleMaxValueChanged = (
    newValue: string,
    filter: RangeNumberFilter
  ) => {
    const newFilter = { ...filter, maxValue: newValue };
    setFilter(newFilter);
    onSelect(validateForm(newFilter, type));
  };

  const handleExactValueChanged = (
    newValue: string,
    filter: ExactMatchNumberFilter
  ) => {
    const newFilter = { ...filter, value: newValue };
    setFilter(newFilter);
    onSelect(validateForm(newFilter, type));
  };

  const { filterTypeDropdownI18N } = useFilterTranslations();


  function filterFields(
    filter: NumberFilter,
  ) {
    if (filter.type === "range") {
      return (
        <Grid.Row>
          <Grid.Col>
            <Field>
              <Input
                type="number"
                value={filter.minValue}
                onChange={(e) => {
                  handleMinValueChanged(e.target.value, filter);
                }}
                validation={errors.minValue ? "error" : undefined}
              />
              <Field.Label>
                {t("guide-requests-app.filter-modal.minValue", "Min value")}
              </Field.Label>
              <FieldError errors={errors} field="minValue" />
            </Field>
          </Grid.Col>
          <Grid.Col>
            <Field>
              <Input
                type="number"
                value={filter.maxValue}
                onChange={(e) => {
                  handleMaxValueChanged(e.target.value, filter);
                }}
                validation={errors.maxValue ? "error" : undefined}
              />
              <FieldError errors={errors} field="maxValue" />
              <Field.Label>
                {t("guide-requests-app.filter-modal.maxValue", "Max value")}
              </Field.Label>
            </Field>
          </Grid.Col>
        </Grid.Row>
      );
    } else if (filter.type === "exactMatch") {
      return (
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
            type="number"
            value={filter.value ? filter.value : ""}
            onChange={(e) => {
              handleExactValueChanged(e.target.value, filter);
            }}
            validation={errors.exactValue ? "error" : undefined}
          />
          <FieldError errors={errors} field="exactValue" />
        </Field>
      );
    } else {
      return (
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
            type="number"
            value={""}
            onChange={(e) => {
              handleExactValueChanged(e.target.value, {type: "exactMatch", value: e.target.value});
            }}
            validation={errors.exactValue ? "error" : undefined}
          />
          <FieldError errors={errors} field="exactValue" />
        </Field>
      );
    }
  }

  return (
    <>
      <Fieldset>
        <Fieldset.Legend hidden>{label}</Fieldset.Legend>
        
          {filterOptions.map(filterType =>
            <Field>
              <Radio
                name={label}
                value={filterType.type}
                checked={filter.type === filterType.type}
                onChange={event => {
                  handleFilterTypeSelect(event.target.value as NumberFilter["type"]);
                }}
              >
                <Field.Label>{filterTypeDropdownI18N[filterType.type]}</Field.Label>
              </Radio>
            </Field>
          )}
      </Fieldset>

      {filterFields(filter)}

    </>
  );
}
