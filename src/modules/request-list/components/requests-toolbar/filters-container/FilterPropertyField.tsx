import styled from "styled-components";
import { useTranslation } from "react-i18next";
import type { FormErrors, FormState } from "./FormState";
import { FilterValuesList } from "./FilterValuesList";
import type { Organization, TicketField } from "../../../data-types";
import type { FilterValuesMap } from "../../../data-types/FilterValue";
import type { MultiSelectOption } from "./Multiselect";
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

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleFilterOpen = () => {setIsFilterOpen(!isFilterOpen)}

  if (ticketField == null) {
    return <></>;
  }

  return (
    <PropertySection key={filterProperty.identifier}>
      <h3 onClick={toggleFilterOpen}>{filterProperty.label}</h3>
      {isFilterOpen && 
        <FilterValuesList
          filterProperty={filterProperty}
          ticketField={ticketField}
          // ticketFields={ticketFields}
          organizations={organizations}
          customStatusOptions={customStatusOptions}
          onSelect={(state) => onValueChanged(filterProperty, state)}
          errors={errors}
          required={false}
        />
      }
    </PropertySection>
  );
}
