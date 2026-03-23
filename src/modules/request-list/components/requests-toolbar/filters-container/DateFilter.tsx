import {
  Dropdown,
  Item,
  Label,
  Select,
} from "@zendeskgarden/react-dropdowns.legacy";
import { useEffect, useState } from "react";
import type { FilterValue } from "../../../data-types/FilterValue";
import type { FilterValuesMap } from "../../../data-types/FilterValue";
import type { FilterProperty } from "./FilterPropertyField";
import { useFilterTranslations } from "../i18n";
import { Radio, Fieldset, Field } from "@zendeskgarden/react-forms";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { format } from "date-fns";
import type { CustomDateFieldKey, CustomDateValues } from "./CustomDateFilter";
import { CustomDateFilter } from "./CustomDateFilter";
import type { FormErrors, FormState } from "./FormState";
import { FieldError } from "./FieldError";
import { ModalMenu } from "../../modal-menu/ModalMenu";

type FormFieldKey = "dateFilterItem" | CustomDateFieldKey;

interface DateFilterProps {
  filters: FilterValuesMap;
  filterProperty: FilterProperty;
  label: string;
  onSelect: (state: FormState<FormFieldKey>) => void;
  errors: FormErrors<FormFieldKey>;
  allowFutureDates: boolean;
}

const StyledCustomDateFilter = styled(CustomDateFilter)`
  margin-top: ${(p) => p.theme.space.md};
`;

type ItemValue = FilterValue | "custom";

export function DateFilter({
  filters,
  filterProperty,
  label,
  onSelect,
  errors,
  allowFutureDates,
}: DateFilterProps): JSX.Element | null {
  const { t } = useTranslation();

  const [selectedItem, setSelectedItem] = useState<ItemValue | null>(null);

  const { createDefaultDateRangeI18N } = useFilterTranslations();
  const dateRangeI18n = createDefaultDateRangeI18N();
  const customDatesInitialValues: [Date, Date] = [new Date(), new Date()];

  const renderItemValue = (
    value: ItemValue | null,
    dateRangeI18n: Record<FilterValue, string>
  ): string => {
    switch (value) {
      case null:
        return "";
      case "custom":
        return t("guide-requests-app.custom", "Custom");
      default:
        return dateRangeI18n[value] || "";
    }
  };

  const validateCustomDates = ({
    values: [startDate, endDate],
    allowFutureDates,
  }: {
    values: CustomDateValues;
    allowFutureDates: boolean;
  }): FormState<CustomDateFieldKey> => {
    if (startDate === undefined || endDate === undefined) {
      const errors: FormErrors<CustomDateFieldKey> = {};

      if (startDate === undefined) {
        errors.startDate = t(
          "guide-requests-app.no-start-date-error",
          "Select a start date"
        );
      }

      if (endDate === undefined) {
        errors.endDate = t(
          "guide-requests-app.no-end-date-error",
          "Select an end date"
        );
      }

      return { state: "invalid", errors };
    } else if (startDate > endDate) {
      return {
        state: "invalid",
        errors: {
          endDate: t(
            "guide-requests-app.endDateAfterStartDate",
            "End date must occur after the start date"
          ),
        },
      };
    } else {
      const errors: FormErrors<CustomDateFieldKey> = {};
      const today = new Date();

      if (!allowFutureDates && startDate > today) {
        errors.startDate = t(
          "guide-requests-app.date-lte-today",
          "Select a date earlier than or equal to today"
        );
      }

      if (!allowFutureDates && endDate > today) {
        errors.endDate = t(
          "guide-requests-app.date-lte-today",
          "Select a date earlier than or equal to today"
        );
      }

      if (Object.keys(errors).length > 0) {
        return { state: "invalid", errors };
      } else {
        const values: [FilterValue, FilterValue] = [
          `>=${format(startDate, "yyyy-MM-dd")}`,
          `<=${format(endDate, "yyyy-MM-dd")}`,
        ];
        return { state: "valid", values };
      }
    }
  };

  const validateForm = (
    itemValue: ItemValue | null,
    allowFutureDates: boolean,
    customDateValues: CustomDateValues = [undefined, undefined]
  ): FormState<FormFieldKey> => {
    if (itemValue === null) {
      return {
        state: "invalid",
        errors: {
          dateFilterItem: t(
            "guide-requests-app.filters-modal.select-value-error",
            "Select a value"
          ),
        },
      };
    } else if (itemValue !== "custom") {
      return { state: "valid", values: [itemValue] };
    } else {
      return validateCustomDates({
        values: customDateValues,
        allowFutureDates,
      });
    }
  };

  useEffect(() => {
    const currentFilterValues: ItemValue[] = filters[filterProperty.identifier] || [];

    if (currentFilterValues.length !== 0) {
      const currentSelection = currentFilterValues[0] || null;
      setSelectedItem(currentSelection);
    }

  }, [filters, filterProperty]);


  function handleItemSelected(item: ItemValue) {
    setSelectedItem(item);
    onSelect(validateForm(item, allowFutureDates, customDatesInitialValues));
  }

  function handleCustomDateSelected(
    values: [Date | undefined, Date | undefined]
  ) {
    onSelect(validateForm(selectedItem, allowFutureDates, values));
  }

  const [radioValue, setRadioValue] = useState('');

  return (
    <>
      <Fieldset>
        <Fieldset.Legend hidden>{label}</Fieldset.Legend>
        {Object.entries(dateRangeI18n).map(([value, label]) => (
          <Field>
            <Radio
              name={label}
              value={value}
              checked={selectedItem === value}
              onChange={() => handleItemSelected(value as FilterValue)}
              >
                <Field.Label>{label}</Field.Label>
            </Radio>
          </Field>
        ))}
        <Field>
          <Radio
            name="custom"
            value="custom"
            checked={selectedItem === "custom"}
            onChange={() => handleItemSelected("custom")}
            >
              <Field.Label>{t("guide-requests-app.custom", "Custom")}</Field.Label>
          </Radio>
        </Field>
        <Field>
          <FieldError errors={errors} field="dateFilterItem" />
        </Field>
      </Fieldset>
      {selectedItem === "custom" && (
        <StyledCustomDateFilter
          initialValues={customDatesInitialValues}
          onChange={handleCustomDateSelected}
          errors={errors}
          allowFutureDates={allowFutureDates}
        />
      )}
    </>
  );
}
