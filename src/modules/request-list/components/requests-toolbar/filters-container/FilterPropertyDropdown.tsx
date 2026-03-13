import styled from "styled-components";
import { useTranslation } from "react-i18next";
import type { FormErrors, FormState } from "./FormState";
import { FilterValuesList } from "./FilterValuesList";
import type { Organization, TicketField } from "../../../data-types";
import type { MultiSelectOption } from "./Multiselect";

const PropertySection = styled.div`
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e8e8e8;

  &:last-child {
    border-bottom: none;
  }
`;

type FormFieldKey = "ticketField";

export interface FilterProperty {
  identifier: string;
  label: string;
}

interface FilterPropertyDropdownProps {
  ticketFields: TicketField[];
  organizations: Organization[];
  hasCustomStatuses: boolean;
  customStatusOptions: MultiSelectOption[];
  onFiltersChanged: (property: FilterProperty, state: FormState<string>) => void;
  errors: FormErrors<FormFieldKey>;
}

export function FilterPropertyDropdown({
  ticketFields,
  organizations,
  hasCustomStatuses,
  customStatusOptions,
  onFiltersChanged,
  errors,
}: FilterPropertyDropdownProps): JSX.Element {
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

  return (
    <div>
      {filterProperties.map((property) => (
        <PropertySection key={property.identifier}>
          <FilterValuesList
            filterProperty={property}
            ticketFields={ticketFields}
            organizations={organizations}
            customStatusOptions={customStatusOptions}
            onSelect={(state) => onFiltersChanged(property, state)}
            errors={errors}
            required={false}
          />
        </PropertySection>
      ))}
    </div>
  );
}
