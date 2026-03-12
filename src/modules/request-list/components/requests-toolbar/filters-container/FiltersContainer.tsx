import type { FormEventHandler } from "react";
import { useState } from "react";
import { Button } from "@zendeskgarden/react-buttons";
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

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e8e8e8;
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

  const [accumulatedFilters, setAccumulatedFilters] = useState<
    Map<string, FormState>
  >(new Map());
  const [errors, setErrors] = useState<FormErrors>({});

  const handlePropertyFilterChanged = (property: FilterProperty, state: FormState<string>) => {
    const newFilters = new Map(accumulatedFilters);
    newFilters.set(property.identifier, state);
    setAccumulatedFilters(newFilters);
    setErrors({});
  };

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();

    const newFiltersMap = { ...filterValuesMap };
    let hasInvalidFilter = false;

    accumulatedFilters.forEach((state, propertyIdentifier) => {
      if (state.state === "invalid") {
        hasInvalidFilter = true;
        setErrors((prev) => ({ ...prev, ...state.errors }));
      } else if (state.state === "valid") {
        const filterKey =
          isSystemFieldType(propertyIdentifier) ||
          propertyIdentifier === "created_at" ||
          propertyIdentifier === "updated_at" ||
          propertyIdentifier === "organization" ||
          propertyIdentifier === "custom_status_id"
            ? propertyIdentifier
            : `custom_field_${propertyIdentifier}`;

        newFiltersMap[filterKey] = state.values;
      }
    });

    if (!hasInvalidFilter && accumulatedFilters.size > 0) {
      onFiltersChanged(newFiltersMap);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit} noValidate>
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
