# Albelli test

This repository contains Photo editor TypeScript project. 

### Goal

This application covers below two scenarios:

##### Scenario 1.

* The user can select a photo file from his/her device and import it into the application
* The user can position and scale this photo on a canvas.

* Hit a submit button which will generate the print description
 These instructions should be stored locally as a JSON file.

##### Scenario 2.

* The user can hit an import button which loads a previously saved JSON description
* Upon loading, the application should show a canvas that contains the photo
* Photo is scaled and positioned as expected according to the loaded print instructions

## Project Structure

```bash
├── src
│   ├── functions
│   │   ├── Canvas/Canvas.ts     # Canvas class tp handle all canvas related functions and context
│   │   ├── Constants.ts/        # Contains all contants
│   │   ├── helper.ts            # Helper functions
│   │   ├── ImageDetails.ts      # Image details store
│   ├── types
│   │   ├── Photo.ts             # Photo type
│   │   ├── Price.ts             # Price type
│   ├── index.html               # This is the single HTML file for the application
│   ├── index.ts                 # This is the root ts file which creates canvas view and adds functionality
```

## Please follow below commands to run this project : 

In the current project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:8080](http://localhost:8080) to view it in the browser.

### `npm test`

Runs the unit tests

### `npm run build`

Builds the app to the `dist` folder.\

