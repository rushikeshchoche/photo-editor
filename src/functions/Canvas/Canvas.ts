import { CANVAS_DIMENSION, MAX_RESIZE_VAL } from "../Constant";
import { getScaledValue } from "../helper";

export class Canvas {
  private _canvas: HTMLCanvasElement;
  private _context: CanvasRenderingContext2D;

  private _imageDetails: {
    image: CanvasImageSource;
    width: number;
    height: number;
    scale: number;
  };
  private _x = 0;
  private _y = 0;
  private _isDraggable = false;

  constructor(element: HTMLCanvasElement) {
    this._canvas = element;
    this._context = this._canvas.getContext("2d");
    this._canvas.width = CANVAS_DIMENSION.width;
    this._canvas.height = CANVAS_DIMENSION.height;
  }

  private clearCanvas() {
    this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
  }

  private clearData() {
    this._x = 0;
    this._y = 0;
    this._isDraggable = false;
    this._imageDetails = {
      image: null,
      width: 0,
      height: 0,
      scale: 0,
    };
  }

  public setCanvasDimension(width: number, height: number) {
    this._canvas.width = width;
    this._canvas.height = height;
  }

  public getCanvasDimension() {
    return {
      width: this._canvas.width,
      height: this._canvas.height,
    };
  }

  public getImagePosition() {
    return {
      x: this._x,
      y: this._y,
    };
  }

  private drawImage(
    image: CanvasImageSource,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    this._context.drawImage(image, x, y, width, height);
    this.mouseEvents();
  }

  public clearAndDrawImage(
    image: CanvasImageSource,
    width: number,
    height: number,
    scale: number,
    x: number = 0,
    y: number = 0
  ) {
    this.clearCanvas();
    this.clearData();
    this._x = Math.abs(x - width / 2);
    this._y = Math.abs(y - height / 2);
    this._imageDetails = {
      image,
      width,
      height,
      scale,
    };
    const _x = this._x - width / 2;
    const _y = this._y - height / 2;
    this.drawImage(image, _x, _y, this._canvas.width, this._canvas.height);
  }

  public resize(value: number) {
    if (!this._imageDetails) return;
    const { image, width, height } = this._imageDetails;
    this._imageDetails.scale = value;
    this.clearCanvas();
    this.drawImage(
      image,
      this._x - width / 2,
      this._y - height / 2,
      getScaledValue(this._canvas.width, value),
      getScaledValue(this._canvas.height, value)
    );
  }

  public getDataUrl() {
    return this._canvas.toDataURL();
  }

  private mouseEvents() {
    this._canvas.onmousedown = (e: MouseEvent) => {
      const { width, height } = this._imageDetails;

      const mouseX = e.pageX - this._canvas.offsetLeft;
      const mouseY = e.pageY - this._canvas.offsetTop;

      if (
        mouseX >= this._x - width / 2 &&
        mouseX <= this._x + width / 2 &&
        mouseY >= this._y - height / 2 &&
        mouseY <= this._y + height / 2
      ) {
        this._isDraggable = true;
        this._x = mouseX;
        this._y = mouseY;
        this._canvas.style.cursor = "grab";
      } else {
        this._canvas.style.cursor = "auto";
      }
    };
    this._canvas.onmousemove = (e: MouseEvent) => {
      if (this._isDraggable) {
        const { image, width, height, scale } = this._imageDetails;
        this._x = e.pageX - this._canvas.offsetLeft;
        this._y = e.pageY - this._canvas.offsetTop;
        this.clearCanvas();
        this.drawImage(
          image,
          this._x - width / 2,
          this._y - height / 2,
          getScaledValue(this._canvas.width, scale),
          getScaledValue(this._canvas.height, scale)
        );
      }
    };
    this._canvas.onmouseup = () => {
      this._isDraggable = false;
    };
    this._canvas.onmouseout = () => {
      this._isDraggable = false;
    };
  }
}
