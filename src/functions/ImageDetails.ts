import { Photo } from "../types/Photo";

export class ImageDetails {
  private _photo: Photo;
  public getphoto() {
    return this._photo;
  }

  public setphoto(photo: Photo) {
    this._photo = photo;
  }
}
