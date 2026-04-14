import { FilterProperty } from "./FilterPropertyField";

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

export function isSystemFieldType(type: string): boolean {
  return systemType.includes(type);
}

export function getFilterKey(identifier: FilterProperty["identifier"]): string {
  return (
    isSystemFieldType(identifier) ||
    identifier === "created_at" ||
    identifier === "updated_at" ||
    identifier === "organization" ||
    identifier === "custom_status_id"
      ? identifier
      : `custom_field_${identifier}`
  )
}
  