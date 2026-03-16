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

export function FiltersContainer({
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
      <FormTitle>
        {t("guide-requests-app.filters-modal.title", "Filters")}
      </FormTitle>
      <Accordion level={4} isExpandable>
        <FilterPropertiesGroup
          ticketFields={ticketFields}
          organizations={organizations}
          hasCustomStatuses={customStatusesEnabled}
          customStatusOptions={customStatusOptions}
          filterValuesMap={filterValuesMap}
          onFiltersChanged={onFiltersChanged}
        />
      </Accordion>
    </FormContainer>
  );
}
