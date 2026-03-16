import styled from "styled-components";
import { useTranslation } from "react-i18next";
import type { FormErrors, FormState } from "./FormState";
import type { FilterValuesMap } from "../../../data-types/FilterValue";
import { useState } from "react";
import type { Organization, TicketField } from "../../../data-types";
import type { MultiSelectOption } from "./Multiselect";
import { FilterPropertyField } from "./FilterPropertyField";
import type { FilterProperty } from "./FilterPropertyField";

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

interface FilterPropertiesGroupProps {
  ticketFields: TicketField[];
  organizations: Organization[];
  hasCustomStatuses: boolean;
  customStatusOptions: MultiSelectOption[];
  filterValuesMap: FilterValuesMap;
  onFiltersChanged: (filters: FilterValuesMap) => void;
  errors: FormErrors<FormFieldKey>;
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
    hasCustomStatuses
      ? {
          identifier: "custom_status_id",
          label: t("guide-requests-app.status", "Status"),
        }
      : {
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

  const checkTicketField = (filterProperty: FilterProperty) => {
    return (
      ticketFields.find(
      (field) => String(field.id) === filterProperty.identifier
      )
    ) as TicketField;
  }

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
    <>
      {filterProperties.map((property) => (
        checkTicketField(property) != null && 
          <FilterPropertyField
            ticketField={checkTicketField(property)}
            filterProperty={property}
            organizations={organizations}
            customStatusOptions={customStatusOptions}
            onValueChanged={handlePropertyFilterChanged}
            errors={errors}>
          </FilterPropertyField>
      ))}
    </>
  );
}
