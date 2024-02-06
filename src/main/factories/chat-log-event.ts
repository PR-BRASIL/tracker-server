import { ChatLogEvent } from "../../presentation/events/chat-log";

export const makeChatLogEvent = () => {
  const event = new ChatLogEvent();

  return event;
};
