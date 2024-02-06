import { AdminLogEvent } from "../../presentation/events/admin-log";

export const makeAdminLogEvent = () => {
  const event = new AdminLogEvent();

  return event;
};
