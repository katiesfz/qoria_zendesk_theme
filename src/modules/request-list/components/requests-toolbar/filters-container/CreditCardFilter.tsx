import { Field, Input } from "@zendeskgarden/react-forms";
import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { FieldError } from "./FieldError";
// import type { FilterTypeKey, FilterTypeValue } from "./FilterTypeDropdown";
import type { FilterValuesMap } from "../../../data-types/FilterValue";
import type { FilterProperty } from "./FilterPropertyField";
import { FilterTypeDropdown } from "./FilterTypeDropdown";
import type { FormErrors, FormState } from "./FormState";
import { useTranslation } from "react-i18next";
import {getFilterKey} from "./SystemFieldCheck";
import { FilterValue } from "../../../data-types";

const filterOptions = ["anyValue", "exactMatch"] as const;
type FilterType = typeof filterOptions[number];

type FilterTypeKey = "filterType";
type FormFieldKey = FilterTypeKey | "cardNumber";

const CARD_NUMBER_REGEX = /^\d{4}$/;

interface CreditCardFilterProps {
  filters: FilterValuesMap;
  filterProperty: FilterProperty;
  onSelect: (state: FormState) => void;
  errors: FormErrors<FormFieldKey>;
}

export function CreditCardFilter({
  filters,
  filterProperty,
  onSelect,
  errors,
}: CreditCardFilterProps): JSX.Element {
  const { t } = useTranslation();

  const [cardNumber, setCardNumber] = useState("");

  const validateForm = (
    cardNumber: string
  ): FormState<FormFieldKey> => {
    if (cardNumber != "") {
      if (CARD_NUMBER_REGEX.test(cardNumber)) {
        return { state: "valid", values: [`:*${cardNumber}`] };
      } else {
        return {
          state: "invalid",
          errors: {
            cardNumber: t(
              "guide-requests-app.filter-modal.credit-card-digits-format-error",
              "Enter the last four digits of the credit card, using only numbers"
            ),
          },
        };
      }
    } else {
      return { state: "valid", values: [`:*`] };
    }
  };

  //const handleFilterTypeSelect = (value: FilterTypeValue) => {
  //  setFilterType(value);
  //  onSelect(validateForm(cardNumber));
  //};

  const filterKey = getFilterKey(filterProperty.identifier);

  useEffect(() => {
    const currentFilterValues = filters[filterKey] as FilterValue[] || [] as FilterValue[];


    const curValue = currentFilterValues[0]?.substring(1);
    
    if (!curValue || curValue === "*") {
      setCardNumber("");
      return;
    }

    // const rawValue = curValue.replace(/^"(.*)"$/, "$1");
    setCardNumber(curValue.substring(1, curValue.length - 1));

    //if (currentFilterValues.length > 0) {
    //  const currentValue = currentFilterValues[0] as string;
    //  if (currentValue === ":*") {
    //    setCardNumber("");
    //    return;
    //  }
    //  const rawValue = currentValue.replace(/^:\*(.*)$/, "$1");
    //  setCardNumber(rawValue);
    //} else {
    //    setCardNumber("");
    //}
  }, [filters[filterKey]]);

  const handleCardNumberChanged = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCardNumber(value);
    onSelect(validateForm(value));
  };

  return (
    <>
      <Field>
        <Field.Label>
          {t(
            "guide-requests-app.filter-modal.credit-card-digits-label",
            "Enter the last four digits of the credit card"
          )}
        </Field.Label>
        <Input
          type="text"
          inputMode="numeric"
          value={cardNumber}
          onChange={handleCardNumberChanged}
          validation={errors.cardNumber ? "error" : undefined}
          maxLength={4}
        />
        <FieldError errors={errors} field="cardNumber" />
      </Field>
    </>
  );
}
