import "./css/main.scss";
import { Canvas } from "./functions/Canvas/Canvas";
import {
  ALLOWED_IMAGE_EXTENSIONS,
  CANVAS_DIMENSION,
  MAX_RESIZE_VAL,
} from "./functions/Constant";
import { exportCanvasDataToJsonFile, getScaledValue } from "./functions/helper";
import { ImageDetails } from "./functions/ImageDetails";
import { Print } from "./types/Print";

const AppView = () => {
  document.body.innerHTML = `<div class="container">
    <h1>Photo Editor</h1>
    <div class="content">
      <form action="#">
        <div>
          <label for="fileSelector" class="file-select">Upload an Image file</label>
          <input type="file" id="fileSelector" />
          <span class="image-formats">Supported formats: .jpeg, .png, .gif</span>
        </div>
        <div>
          <label>Resize</label>
          <input type="range" id="resize" min="4" max="10" value="10" disabled>
        </div>
        <div>
          <label for="jsonExport" class="file-select">Export JSON</label>
          <input type="button" id="jsonExport" disabled/>
        </div>
          <label for="jsonImport" class="file-select">Upload an JSON file</label>
          <input type="file" id="jsonImport" accept=".json"/>
      </form>
      <canvas id="editorCanvas" class="canvas"></canvas>
    </div>
  </div>`;

  const editorCanvas = document.getElementById("editorCanvas");
  const canvas = new Canvas(editorCanvas as HTMLCanvasElement);
  const fileSelector = document.getElementById("fileSelector");
  const resize = document.getElementById("resize") as HTMLInputElement;
  const jsonExport = document.getElementById("jsonExport") as HTMLInputElement;
  const jsonImport = document.getElementById("jsonImport");
  const imageDetails = new ImageDetails();

  /**
   * This event listner handles file selection and draw image on canvas
   */
  fileSelector.onchange = function (event: Event) {
    // get all selected Files
    const target = event.target as HTMLInputElement;
    const files = target.files;
    let file: File;
    for (let i = 0; i < files.length; ++i) {
      file = files[i];
      // check if file is valid Image (just a MIME check)
      if (!ALLOWED_IMAGE_EXTENSIONS.includes(file.type)) {
        return;
      }
      // read Image contents from file
      const reader = new FileReader();
      reader.onload = function (e) {
        // create HTMLImageElement holding image data
        const img = new Image();
        img.src = reader.result as string;

        img.onload = function () {
          try {
            // grab some data from the image
            const imgWidth = img.naturalWidth;
            const imgHeight = img.naturalHeight;

            imageDetails.setphoto({
              id: file.name,
              x: 0,
              y: 0,
              scale: MAX_RESIZE_VAL,
              width: imgWidth,
              height: imgHeight,
              data: {
                url: canvas.getDataUrl(),
                date: new Date(),
              },
            });

            const cw = CANVAS_DIMENSION.width;
            const ch = (CANVAS_DIMENSION.height * imgHeight) / imgWidth;
            canvas.setCanvasDimension(cw, ch);

            canvas.clearAndDrawImage(img, imgWidth, imgHeight, MAX_RESIZE_VAL);
            resize.disabled = false;
            jsonExport.disabled = false;
          } catch (error) {
            console.error(error);
            resize.disabled = true;
            jsonExport.disabled = true;
          }
        };
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * This event listner exports image and its details into a json file
   */
  jsonExport.onclick = function (e) {
    const { width, height } = canvas.getCanvasDimension();
    if (width <= 0 || height <= 0) {
      return;
    }
    const photo = imageDetails.getphoto();
    const { x, y } = canvas.getImagePosition();
    if (!x || !y) {
      return;
    }
    photo.x = x;
    photo.y = y;

    const canvasDetails: Print = {
      canvas: {
        width,
        height,
        photo,
      },
    };
    exportCanvasDataToJsonFile(canvasDetails);
  };

  /**
   * This event listner handles json file import and draw image on canvas
   */
  jsonImport.onchange = function (event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files[0];
    if (!file || file.type !== "application/json") {
      return;
    }

    // read json contents from file
    const reader = new FileReader();
    reader.onload = function (e) {
      const imageData = JSON.parse(reader.result as string) as Print;
      var image = new Image();
      image.src = imageData.canvas.photo.data.url;
      image.onload = function () {
        try {
          const imgWidth = image.naturalWidth;
          const imgHeight = image.naturalHeight;
          const { x, y, width, height, scale } = imageData.canvas.photo;
          canvas.setCanvasDimension(
            imageData.canvas.width,
            imageData.canvas.height
          );

          canvas.clearAndDrawImage(
            image,
            width,
            height,
            scale,
            x - width / 2,
            y - height / 2
          );
          resize.disabled = false;
          jsonExport.disabled = false;
        } catch (error) {
          console.error(error);
          resize.disabled = true;
          jsonExport.disabled = true;
        }
      };
    };
    reader.readAsText(file);
  };

  /**
   * This event listner handles image resize on canvas
   */
  resize.onchange = function (event: Event) {
    const target = event.target as HTMLInputElement;
    const value = parseInt(target.value);
    const image = imageDetails.getphoto();
    const { width, height } = canvas.getCanvasDimension();
    imageDetails.setphoto({
      ...image,
      width: getScaledValue(width, value),
      height: getScaledValue(height, value),
      scale: value,
      data: {
        url: canvas.getDataUrl(),
        date: new Date(),
      },
    });
    canvas.resize(value);
  };
};

AppView();
