import { Button } from "@zendeskgarden/react-buttons";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import type {
  FilterValuesMap,
  FilterValue,
} from "../../../data-types/FilterValue";
import { FieldTags } from "./FieldTags";
import type { Organization, TicketField } from "../../../data-types";
import type { MultiSelectOption } from "../filter-modal/Multiselect";
import { removeFilterValuesFromMap } from "./removeFilterValuesFromMap";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.remSpace.xs};
  min-height: 0;
  margin-bottom: ${props => props.theme.remSpace.md};
`;

interface FilterTagsProps {
  filters: FilterValuesMap;
  ticketFields: TicketField[];
  organizations: Organization[];
  customStatusOptions: MultiSelectOption[];
  onFiltersChanged: (filters: FilterValuesMap) => void;
}

export function FilterTags({
  filters,
  ticketFields,
  organizations,
  customStatusOptions,
  onFiltersChanged,
}: FilterTagsProps): JSX.Element {
  const { t } = useTranslation();

  function removeFilter(field: string, values: FilterValue[]) {
    onFiltersChanged(removeFilterValuesFromMap(filters, field, values));
  }

  return (
    <>
    {Object.keys(filters).length > 0 && (
      <Container>
        {Object.entries(filters).map(([field, values]) => {
          return (
            values.length > 0 && 
            <FieldTags
              key={field}
              ticketFields={ticketFields}
              organizations={organizations}
              customStatusOptions={customStatusOptions}
              values={values}
              identifier={field}
              onFilterRemoved={(values) => removeFilter(field, values)}
            />
          );
        })}
        <Button size="small" isLink onClick={() => onFiltersChanged({})}>
          {t("guide-requests-app.clearFilters", "Clear filters")}
        </Button>
      </Container>
      )}
    </>
  );
}
