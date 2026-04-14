import type { FormEventHandler } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { FilterValuesMap } from "../../../data-types/FilterValue";
import { Accordion } from '@zendeskgarden/react-accordions';
import styled, { ThemeProvider, css, DefaultTheme } from "styled-components";
import { FilterPropertiesGroup } from "./FilterProperties";
import type { FormErrors, FormState } from "./FormState";
import type { Organization, TicketField } from "../../../data-types";
import type { MultiSelectOption } from "./Multiselect";
import type { IGardenTheme } from "@zendeskgarden/react-theming";
import {
  PALETTE,
  getColor,
  mediaQuery
} from '@zendeskgarden/react-theming';
import { qoriaTheme } from "../../../../shared";


export const Gap = styled.div`
  height: ${(p) => p.theme.remSpace.md};
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  & > *:not(:last-child) {
    border-bottom: ${(p) => p.theme.borders.sm} ${props => getColor({ theme: props.theme, variable: "border.default" })};
  }
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


const filterContainerTheme = {
  ...qoriaTheme,
  "components": {
    "forms.fieldset_legend": css`
        font-size: ${p => p.theme.fontSizes.md};
        margin-bottom: ${(p) => p.theme.remSpace.md};
    `,
  }
} as DefaultTheme;


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
    <ThemeProvider theme={filterContainerTheme}>
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
    </ThemeProvider>
  );
}
