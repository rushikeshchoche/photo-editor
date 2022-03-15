export type Photo = {
  id: string;
  width: number;
  height: number;
  x: number;
  y: number;
  scale: number;
  data: {
    url: string;
    date: Date;
  };
};
