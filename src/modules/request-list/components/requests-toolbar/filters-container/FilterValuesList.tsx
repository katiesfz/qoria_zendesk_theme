import { CheckboxFilter } from "./CheckboxFilter";
import { CreditCardFilter } from "./CreditCardFilter";
import { DateFilter } from "./DateFilter";
import type { FilterProperty } from "./FilterPropertyField";
import type { FormErrors, FormState } from "./FormState";
import type { MultiSelectOption } from "./Multiselect";
import { Multiselect } from "./Multiselect";
import { NumberFilter } from "./NumberFilter";
import { TextField } from "./TextField";
import { useTranslation } from "react-i18next";
import type { Organization, TicketField } from "../../../data-types";
import { useFilterTranslations } from "../i18n";
import type { FilterValue } from "../../../data-types/FilterValue";

interface FilterValuesListProps {
  filterProperty: FilterProperty;
  organizations: Organization[];
  customStatusOptions: MultiSelectOption[];
  onSelect: (state: FormState<string>) => void;
  errors: FormErrors;
  required?: boolean;
  ticketField?: TicketField;
}

export function FilterValuesList({
  filterProperty,
  organizations,
  customStatusOptions,
  onSelect,
  errors,
  // ticketFields,
  required = true,
  ticketField,
}: FilterValuesListProps): JSX.Element {
  const { t } = useTranslation();

  const { statusFilterValuesI18N } = useFilterTranslations();

  if (
    filterProperty.identifier === "created_at" ||
    filterProperty.identifier === "updated_at"
  ) {
    return (
      <DateFilter
        label={filterProperty.label}
        onSelect={onSelect}
        errors={errors}
        allowFutureDates={false}
      />
    );
  }

  if (filterProperty.identifier === "status") {
    const options: MultiSelectOption[] = Object.entries(
      statusFilterValuesI18N
    ).map(([value, label]) => ({
      value: value as FilterValue,
      label,
    }));
    return (
      <Multiselect
        label={t("guide-requests-app.status", "Status")}
        onSelect={onSelect}
        options={options}
        errors={errors}
        required={false}
      />
    );
  }

  if (filterProperty.identifier === "custom_status_id") {
    return (
      <Multiselect
        label={t("guide-requests-app.status", "Status")}
        onSelect={onSelect}
        options={customStatusOptions}
        errors={errors}
        required={false}
      />
    );
  }

  if (filterProperty.identifier === "organization") {
    const options: MultiSelectOption[] = organizations.map((organization) => ({
      label: organization.name,
      value: `:${organization.id}`,
    }));

    return (
      <Multiselect
        label={t("guide-requests-app.organization", "Organization")}
        onSelect={onSelect}
        options={options}
        errors={errors}
        required={false}
      />
    );
  }

   if (ticketField == null) {
     return <></>;
   }

  const { type, title_in_portal } = ticketField;

  console.log("Field type: ", type);
  console.log("Field name: ", title_in_portal);

  switch (type) {
    case "textarea":
    case "text":
    case "regexp": {
      return (
        <TextField
          label={title_in_portal}
          onSelect={onSelect}
          errors={errors}
        />
      );
    }
    case "tagger":
    case "multiselect": {
      const options: MultiSelectOption[] =
        ticketField.custom_field_options?.map((option) => ({
          value: `:${option.value}`,
          label: option.name,
        })) ?? [];

      return (
        <Multiselect
          label={title_in_portal}
          onSelect={onSelect}
          options={options}
          errors={errors}
          required={false}
        />
      );
    }
    case "date": {
      return (
        <DateFilter
          label={title_in_portal}
          onSelect={onSelect}
          errors={errors}
          allowFutureDates={true}
        />
      );
    }
    case "integer":
    case "decimal": {
      return (
        <NumberFilter
          label={title_in_portal}
          onSelect={onSelect}
          errors={errors}
          type={type}
        />
      );
    }
    case "checkbox": {
      return (
        <CheckboxFilter
          label={title_in_portal}
          onSelect={onSelect}
          errors={errors}
        />
      );
    }
    case "partialcreditcard": {
      return <CreditCardFilter onSelect={onSelect} errors={errors} />;
    }
    default:
      return <></>;
  }
}
