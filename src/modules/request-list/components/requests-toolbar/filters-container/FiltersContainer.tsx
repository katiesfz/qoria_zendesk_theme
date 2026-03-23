import type { FormEventHandler } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { FilterValuesMap } from "../../../data-types/FilterValue";
import { Accordion } from '@zendeskgarden/react-accordions';
import styled from "styled-components";
import { FilterPropertiesGroup } from "./FilterProperties";
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

interface FiltersContainerProps {
  filters: FilterValuesMap;
  ticketFields: TicketField[];
  organizations: Organization[];
  customStatusesEnabled: boolean;
  customStatusOptions: MultiSelectOption[];
  filterValuesMap: FilterValuesMap;
  onFiltersChanged: (filters: FilterValuesMap) => void;
}

export function FiltersContainer({
  filters,
  ticketFields,
  organizations,
  filterValuesMap,
  onFiltersChanged,
  customStatusesEnabled,
  customStatusOptions,
}: FiltersContainerProps): JSX.Element {
  const { t } = useTranslation();


  return (
    <FormContainer>
      <FilterPropertiesGroup
        filters={filters}
        ticketFields={ticketFields}
        organizations={organizations}
        hasCustomStatuses={customStatusesEnabled}
        customStatusOptions={customStatusOptions}
        filterValuesMap={filterValuesMap}
        onFiltersChanged={onFiltersChanged}
      />
    </FormContainer>
  );
}
