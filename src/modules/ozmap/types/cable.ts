export type Cable = {
  id: number;
  name?: string;
  cableType?: string;
  boxA?: string | null;
  boxB?: string | null;
  poles: { lat: number; lng: number }[];
  createdAt: string;
  updatedAt: string;
};
