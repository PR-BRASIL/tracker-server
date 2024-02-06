import { TeamKillLogEvent } from "../../presentation/events/team-kill-log";

export const makeTeamKillLogEvent = () => {
  const event = new TeamKillLogEvent();

  return event;
};
