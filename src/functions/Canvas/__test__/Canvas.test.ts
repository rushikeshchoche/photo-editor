import { Canvas } from "../Canvas";
import "jest-canvas-mock";
import { CANVAS_DIMENSION, MAX_RESIZE_VAL } from "../../Constant";
import sampleJson from "./sample.json";

describe("Test Canvas", () => {
  let canvasElm: HTMLCanvasElement;

  beforeEach(function () {
    canvasElm = document.createElement("canvas");
  });

  it(`should init canvas `, function () {
    const canvas = new Canvas(canvasElm);
    canvas.setCanvasDimension(CANVAS_DIMENSION.width, CANVAS_DIMENSION.height);
    expect(canvas).toBeDefined();
    const { width, height } = canvas.getCanvasDimension();
    expect(width).toEqual(CANVAS_DIMENSION.width);
    expect(height).toEqual(CANVAS_DIMENSION.height);
  });

  it(`should draw image within canvas `, function () {
    const canvas = new Canvas(canvasElm);
    canvas.setCanvasDimension(CANVAS_DIMENSION.width, CANVAS_DIMENSION.height);
    const image = new Image();
    image.src = sampleJson.data;
    image.onload = () => {
      const imgWidth = image.naturalWidth;
      const imgHeight = image.naturalHeight;
      canvas.clearAndDrawImage(image, imgWidth, imgHeight, MAX_RESIZE_VAL);
      expect(canvas.getDataUrl()).toBeDefined();
      const { x, y } = canvas.getImagePosition();
      expect(x).toEqual(imgWidth / 2);
      expect(y).toEqual(imgHeight / 2);
    };
  });

  it(`should resize image within canvas `, function () {
    const canvas = new Canvas(canvasElm);
    canvas.setCanvasDimension(CANVAS_DIMENSION.width, CANVAS_DIMENSION.height);

    const image = new Image();
    image.src = sampleJson.data;

    image.onload = () => {
      const imgWidth = image.naturalWidth;
      const imgHeight = image.naturalHeight;
      canvas.clearAndDrawImage(image, imgWidth, imgHeight, MAX_RESIZE_VAL);
      canvas.resize(MAX_RESIZE_VAL - 2);
      expect(canvas.getDataUrl()).toBeDefined();
    };
  });
});
