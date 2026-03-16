import styled from "styled-components";
import { useTranslation } from "react-i18next";
import type { FormErrors, FormState } from "./FormState";
import { FilterValuesList } from "./FilterValuesList";
import type { Organization, TicketField } from "../../../data-types";
import type { FilterValuesMap } from "../../../data-types/FilterValue";
import type { MultiSelectOption } from "./Multiselect";
import { Accordion } from '@zendeskgarden/react-accordions';
import { useState } from "react";

const PropertySection = styled.div`
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e8e8e8;

  &:last-child {
    border-bottom: none;
  }
`;

const PropertyLabel = styled.h3`
  margin-bottom: 8px;
`;

type FormFieldKey = "ticketField";

export interface FilterProperty {
  identifier: string;
  label: string;
}

interface FilterPropertyFieldProps {
  ticketField: TicketField;
  filterProperty: FilterProperty;
  organizations: Organization[];
  customStatusOptions: MultiSelectOption[];
  onValueChanged: (property: FilterProperty, state: FormState<string>) => void;
  errors: FormErrors<FormFieldKey>;
}

export function FilterPropertyField({
  ticketField,
  filterProperty,
  organizations,
  customStatusOptions,
  onValueChanged,
  errors,
}: FilterPropertyFieldProps): JSX.Element {

  const { t } = useTranslation();

  return (
    <>
      <Accordion.Header>
        <Accordion.Label>
          {filterProperty.label}
        </Accordion.Label>
      </Accordion.Header>
      <Accordion.Panel>
        <FilterValuesList
        filterProperty={filterProperty}
        organizations={organizations}
        customStatusOptions={customStatusOptions}
        onSelect={(state) => onValueChanged(filterProperty, state)}
        errors={errors}
        required={false}
        ticketField={ticketField}
      />
      </Accordion.Panel>
    </>
  );
}
