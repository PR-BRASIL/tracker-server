import { ReportLogEvent } from "../../presentation/events/report-log";

export const makeReportLogEvent = () => {
  const event = new ReportLogEvent();

  return event;
};
