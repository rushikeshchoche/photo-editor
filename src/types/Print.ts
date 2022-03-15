import { Photo } from "./Photo";

export type Print = {
  canvas: {
    width: number;
    height: number;
    photo: Photo;
  };
};
