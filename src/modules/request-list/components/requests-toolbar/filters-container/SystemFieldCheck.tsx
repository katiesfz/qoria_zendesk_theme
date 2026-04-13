
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
