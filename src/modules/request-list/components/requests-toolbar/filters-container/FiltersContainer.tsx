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
    ...qoriaTheme.components,
    "forms.fieldset_legend": css`
        font-size: ${p => p.theme.fontSizes.md};
        margin-bottom: ${(p) => p.theme.remSpace.md};
    `,
    "modals.drawer_modal": css`
      right: auto;
      left: 0;

      &.garden-drawer-transition-enter {
        -webkit-transform:translateX(-380px);
        -ms-transform:translateX(-380px);
        transform:translateX(-380px);
      }

      &.garden-drawer-transition-enter-active {
        -webkit-transform:translateX(0);
        -ms-transform:translateX(0);
        transform:translateX(0);
        -webkit-transition:-webkit-transform 0.25s ease-in-out;
        -webkit-transition:transform 0.25s ease-in-out;
        transition:transform 0.25s ease-in-out;
      }

      &.garden-drawer-transition-exit-active {
        -webkit-transform:translateX(-380px);
        -ms-transform:translateX(-380px);
        transform:translateX(-380px);
        -webkit-transition:-webkit-transform 0.25s ease-in-out;
        -webkit-transition:transform 0.25s ease-in-out;
        transition:transform 0.25s ease-in-out;
      }
    `
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
