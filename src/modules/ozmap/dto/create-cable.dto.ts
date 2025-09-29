export interface CreateCableDto {
  id: number;
  name?: string;
  cableType: string;
  boxA?: number;
  boxB?: number;
  poles: { lat: number; lng: number }[];
}
