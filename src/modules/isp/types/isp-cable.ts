export type IspCable = {
  id: number;
  name: string;
  capacity: number;
  boxes_connected: number[];
  path: Array<{ lat: number; lng: number }>;
}[];
