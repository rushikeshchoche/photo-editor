import { Print } from "../types/Print";
import { MAX_RESIZE_VAL } from "./Constant";

export function exportCanvasDataToJsonFile(canvasData: Print) {
  const string = JSON.stringify(canvasData);
  // create a blob object representing the data as a JSON string
  const file = new Blob([string], {
    type: "application/json",
  });

  // trigger a click event on an <a> tag to open the file explorer
  const a = document.createElement("a");
  a.href = URL.createObjectURL(file);
  a.download = `${canvasData.canvas.photo.id}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function getScaledValue(value: number, scale: number) {
  return Math.floor(value * (scale / MAX_RESIZE_VAL));
}
