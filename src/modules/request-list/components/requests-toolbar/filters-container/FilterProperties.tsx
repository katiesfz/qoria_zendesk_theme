import styled from "styled-components";
import { useTranslation } from "react-i18next";
import type { FormErrors, FormState } from "./FormState";
import type { FilterValuesMap } from "../../../data-types/FilterValue";
import { useState } from "react";
import type { Organization, TicketField } from "../../../data-types";
import type { MultiSelectOption } from "./Multiselect";
import { FilterPropertyField } from "./FilterPropertyField";
import type { FilterProperty } from "./FilterPropertyField";
import { Accordion } from '@zendeskgarden/react-accordions';

interface FilterPropertiesGroupProps {
  filters: FilterValuesMap;
  ticketFields: TicketField[];
  organizations: Organization[];
  hasCustomStatuses: boolean;
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
  
export function FilterPropertiesGroup({
  filters,
  ticketFields,
  organizations,
  hasCustomStatuses,
  customStatusOptions,
  filterValuesMap,
  onFiltersChanged,
}: FilterPropertiesGroupProps): JSX.Element {
  const { t } = useTranslation();

  const HIDDEN_FIELDS = [
    "description",
    "group",
    "assignee",
    "custom_status",
    "status",
    "subject",
    "priority",
    "tickettype",
    "lookup",
    "requester",
  ];

  const filterProperties: FilterProperty[] = [
    {
      identifier: "created_at",
      label: t("guide-requests-app.createdDate", "Created date"),
    },
    {
      identifier: "updated_at",
      label: t("guide-requests-app.updatedDate", "Updated date"),
    },
    hasCustomStatuses ? {
        identifier: "custom_status_id",
        label: t("guide-requests-app.status", "Status"),
      } : {
        identifier: "status",
        label: t("guide-requests-app.status", "Status"),
      },
    ...(organizations.length > 1
      ? [
          {
            identifier: "organization",
            label: t("guide-requests-app.organization", "Organization"),
          },
        ]
      : []),
    ...ticketFields
      .filter((field) => !HIDDEN_FIELDS.includes(field.type))
      .map(({ id, title_in_portal }) => ({
        identifier: String(id),
        label: title_in_portal,
      })),
  ];

  //console.log("Ticket fields: ", ticketFields)
  //console.log("Filter Properties: ", filterProperties);

  const checkTicketField = (filterProperty: FilterProperty) => {

    //console.log('Filter property:', filterProperty);

    const foundFilter = ticketFields.find(
      (field) => String(field.id) === filterProperty.identifier
      );
    //console.log('Filter property found:', foundFilter);

    return (
      ticketFields.find(
      (field) => String(field.id) === filterProperty.identifier
      )
    ) as TicketField;
  }

    const emptyTicketField: TicketField = {} as TicketField;
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
        // console.log("New filters map: ", newFiltersMap);
        onFiltersChanged(newFiltersMap);
      } else if (state.state === "invalid") {
        setErrors((prev) => ({ ...prev, ...state.errors }));
      }
    };

    
  

  return (
    <Accordion level={4} isExpandable>
      {filterProperties.map((property) => (
        <Accordion.Section key={property.identifier}>
        <FilterPropertyField
          filters={filters}
          filterProperty={property}
          organizations={organizations}
          customStatusOptions={customStatusOptions}
          onValueChanged={handlePropertyFilterChanged}
          errors={errors}
          ticketField={checkTicketField(property) ?? emptyTicketField} />
          </Accordion.Section>
      ))}
    </Accordion>
  );
}
