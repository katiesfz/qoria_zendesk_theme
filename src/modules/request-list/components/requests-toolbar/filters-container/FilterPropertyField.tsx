import { useTheme } from 'styled-components';
import { useTranslation } from "react-i18next";
import type { FormErrors, FormState } from "./FormState";
import { FilterValuesList } from "./FilterValuesList";
import type { Organization, TicketField } from "../../../data-types";
import type { FilterValue, FilterValuesMap } from "../../../data-types/FilterValue";
import type { MultiSelectOption } from "./Multiselect";
import { Accordion } from '@zendeskgarden/react-accordions';
import { useEffect, useState } from "react";
import { Tag } from '@zendeskgarden/react-tags';
import { getColor } from '@zendeskgarden/react-theming';
import { getFilterKey } from "./SystemFieldCheck";
import { qoriaTheme } from "../../../../shared";
import styled, { css, DefaultTheme, ThemeProvider } from "styled-components";

const StyledFilterContainer = styled.div`
  padding: ${props => props.theme.remSpace.lg} 0;
  line-height: 1;
  border-bottom: 1px solid ${props => getColor({ theme: props.theme, variable: "border.default" })};
`;

const StyledFilterHeading = styled.p`
  font-size: ${p => p.theme.fontSizes.md};
  line-height: 1.5;
  margin-bottom: ${p => p.theme.remSpace.md};
  font-weight: 600;
`;


const inputLabelStyle = css`
  font-size: ${p => p.theme.fontSizes.md};
  margin-bottom: ${p => p.theme.remSpace.md};
  font-weight: 600;
`;

const singleFilterTheme = {
  ...qoriaTheme,
  "components": {
    ...qoriaTheme.components,
    'forms.input_label': inputLabelStyle,
    'forms.checkbox_label': inputLabelStyle,
    'forms.radio_label': inputLabelStyle,
    'forms.toggle_label': inputLabelStyle,
    'forms.fieldset_legend': inputLabelStyle
  }
} as DefaultTheme;


type FormFieldKey = "ticketField";

export interface FilterProperty {
  identifier: string;
  label: string;
}

interface FilterPropertyFieldProps {
  filters: FilterValuesMap;
  ticketField: TicketField;
  filterProperty: FilterProperty;
  organizations: Organization[];
  customStatusOptions: MultiSelectOption[];
  onValueChanged: (property: FilterProperty, state: FormState<string>) => void;
  errors: FormErrors<FormFieldKey>;
}

export function FilterPropertyField({
  filters,
  ticketField,
  filterProperty,
  organizations,
  customStatusOptions,
  onValueChanged,
  errors,
}: FilterPropertyFieldProps): JSX.Element {

  const { t } = useTranslation();

  
  const [facets, setFacets] = useState<number>(0);
  
  const filterKey = getFilterKey(filterProperty.identifier);
  
  const currentFilterValues = filters[filterKey] as FilterValue[] || [] as FilterValue[];

  useEffect(() => {
    const currentFilterValues = filters[filterKey] as FilterValue[] || [] as FilterValue[];
    setFacets(currentFilterValues.length as number);
  }, [filters, filterKey]);

  if (
    filterProperty.identifier === "created_at" ||
    filterProperty.identifier === "updated_at" ||
    filterProperty.identifier === "status" ||
    filterProperty.identifier === "custom_status_id" ||
    filterProperty.identifier === "organization"
  ) {
    return (
      <>
        <Accordion level={4} isExpandable defaultExpandedSections={[]}>
          <Accordion.Section key={filterProperty.identifier}>
            <Accordion.Header>
              <Accordion.Label>
                {filterProperty.label}
              </Accordion.Label>
              {(facets > 0) && (
                <Tag isRound size="small">
                  <span>{facets}</span>
                </Tag>
              )}
            </Accordion.Header>
            <Accordion.Panel>
              <FilterValuesList
              filters={filters}
              filterProperty={filterProperty}
              organizations={organizations}
              customStatusOptions={customStatusOptions}
              onSelect={(state) => onValueChanged(filterProperty, state)}
              errors={errors}
              ticketField={ticketField}
            />
            </Accordion.Panel>
          </Accordion.Section>
        </Accordion>
      </>
    );
  }
  if (ticketField == null) {
    return <></>;
  }
  const { type, title_in_portal } = ticketField;

  switch (type) {
    case "tagger":
    case "multiselect": 
    case "date": {
      return (
        <>
          <Accordion level={4} isExpandable defaultExpandedSections={[]}>
            <Accordion.Section key={filterProperty.identifier}>
              <Accordion.Header>
                <Accordion.Label>
                  {filterProperty.label}
                </Accordion.Label>
                {(facets > 0) && (
                  <Tag isRound size="small">
                    <span>{facets}</span>
                  </Tag>
                )}
              </Accordion.Header>
              <Accordion.Panel>
                <FilterValuesList
                filters={filters}
                filterProperty={filterProperty}
                organizations={organizations}
                customStatusOptions={customStatusOptions}
                onSelect={(state) => onValueChanged(filterProperty, state)}
                errors={errors}
                ticketField={ticketField}
              />
              </Accordion.Panel>
            </Accordion.Section>
          </Accordion>
        </>
      );
    }
    case "textarea":
    case "text":
    case "regexp": 
    case "integer":
    case "decimal":
    case "checkbox":
    case "partialcreditcard": {
      return (
        <>
          <Accordion level={4} isExpandable defaultExpandedSections={[]}>
            <Accordion.Section key={filterProperty.identifier}>
              <Accordion.Header>
                <Accordion.Label>
                  {filterProperty.label}
                </Accordion.Label>
                {(facets > 0) && (
                  <Tag isRound size="small">
                    <span>1</span>
                  </Tag>
                )}
              </Accordion.Header>
              <Accordion.Panel>
                <ThemeProvider theme={singleFilterTheme}>
                  <FilterValuesList
                    filters={filters}
                    filterProperty={filterProperty}
                    organizations={organizations}
                    customStatusOptions={customStatusOptions}
                    onSelect={(state) => onValueChanged(filterProperty, state)}
                    errors={errors}
                    ticketField={ticketField}
                  />
                </ThemeProvider>
              </Accordion.Panel>
            </Accordion.Section>
          </Accordion>
        </>
      );
    }
    default:
      return <></>;
  }
}
