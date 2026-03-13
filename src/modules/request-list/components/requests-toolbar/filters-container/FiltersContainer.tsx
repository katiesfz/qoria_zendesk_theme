import type { FormEventHandler } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { FilterValuesMap } from "../../../data-types/FilterValue";
import styled from "styled-components";
import type { FilterProperty } from "./FilterPropertyDropdown";
import { FilterPropertyDropdown } from "./FilterPropertyDropdown";
import type { FormErrors, FormState } from "./FormState";
import type { Organization, TicketField } from "../../../data-types";
import type { MultiSelectOption } from "./Multiselect";

export const Gap = styled.div`
  height: ${(p) => p.theme.space.md};
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
`;

interface FiltersContainerProps {
  ticketFields: TicketField[];
  organizations: Organization[];
  customStatusesEnabled: boolean;
  customStatusOptions: MultiSelectOption[];
  filterValuesMap: FilterValuesMap;
  onFiltersChanged: (filters: FilterValuesMap) => void;
}

const systemType = [
  "subject",
  "description",
  "status",
  "custom_status",
  "type",
  "priority",
  "basic_priority",
  "assignee",
  "group",
  "tickettype",
  "requester",
];

function isSystemFieldType(type: string): boolean {
  return systemType.includes(type);
}

export function FiltersContainer({
  ticketFields,
  organizations,
  filterValuesMap,
  onFiltersChanged,
  customStatusesEnabled,
  customStatusOptions,
}: FiltersContainerProps): JSX.Element {
  const { t } = useTranslation();

  const [errors, setErrors] = useState<FormErrors>({});

  const handlePropertyFilterChanged = (property: FilterProperty, state: FormState<string>) => {
    setErrors({});
    
    if (state.state === "valid") {
      const filterKey =
        isSystemFieldType(property.identifier) ||
        property.identifier === "created_at" ||
        property.identifier === "updated_at" ||
        property.identifier === "organization" ||
        property.identifier === "custom_status_id"
          ? property.identifier
          : `custom_field_${property.identifier}`;

      const newFiltersMap = { ...filterValuesMap };
      newFiltersMap[filterKey] = state.values;
      onFiltersChanged(newFiltersMap);
    } else if (state.state === "invalid") {
      setErrors((prev) => ({ ...prev, ...state.errors }));
    }
  };

  return (
    <FormContainer>
      <FormTitle>
        {t("guide-requests-app.filters-modal.title", "Filters")}
      </FormTitle>
      <FilterPropertyDropdown
        ticketFields={ticketFields}
        organizations={organizations}
        hasCustomStatuses={customStatusesEnabled}
        customStatusOptions={customStatusOptions}
        onFiltersChanged={handlePropertyFilterChanged}
        errors={errors}
      />
    </FormContainer>
  );
}
