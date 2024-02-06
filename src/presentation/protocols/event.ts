export interface Event {
  handle: (data: any) => Promise<void>;
}
