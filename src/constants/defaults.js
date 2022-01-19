import {
  defaultData,
  datasetTree,
  variableTree,
  urlParamsTree,
} from "../config/index";
import variables from "../config/variables";
import tables from "../config/tables";
import datasets from "../config/datasets";

import { findIn, findTableOrDefault } from "../utils";
// read in URL params
let paramsDict = {};
for (const [key, value] of new URLSearchParams(window.location.search)) {
  paramsDict[key] = value;
}
const currVariable = paramsDict.hasOwnProperty("var")
  ? {
      ...findIn(variables, "name", paramsDict.var.replace(/_/g, " ")),
      [paramsDict.hasOwnProperty("date") && "nIndex"]: +paramsDict.date,
      [paramsDict.hasOwnProperty("range") && "nRange"]:
        paramsDict.range === "null" ? null : +paramsDict.range,
    }
  : {};

const currentData = paramsDict.hasOwnProperty("src")
  ? `${paramsDict.src}.geojson`
  : defaultData;
const currDataset = findIn(datasets, "file", currentData);

export const INITIAL_STATE = {
  // Default data state
  currentData,
  currentMethod: paramsDict.hasOwnProperty("mthd")
    ? paramsDict.mthd
    : "natural_breaks",
  datasets,
  tables,
  variables,
  datasetTree,
  variableTree,
  urlParamsTree,
  // Large data storage
  lazyFetched: false,
  storedGeojson: {},
  storedData: {},
  storedLisaData: {},
  storedCartogramData: {},
  storedMobilityData: {},
  dotDensityData: [],
  centroids: {},
  // data and map params
  dataParams: {
    variableName: "Confirmed Count per 100K Population",
    numerator: "cases",
    nType: "time-series",
    nRange: 7,
    nProperty: null,
    nIndex: null,
    denominator: "properties",
    dType: "characteristic",
    dProperty: "population",
    dRange: null,
    dIndex: null,
    scale: 100000,
    scale3D: 1000,
    fixedScale: null,
    colorScale: null,
    dataNote: null,
    zAxisParams: null,
    storedRange: null,
    ...currVariable,
  },
  storedRange: null,
  mapParams: {
    mapType: paramsDict.hasOwnProperty("mthd")
      ? paramsDict.mthd
      : "natural_breaks",
    bins: {
      bins: [],
      breaks: [],
    },
    binMode:
      paramsDict.hasOwnProperty("dBin") && paramsDict.dBin ? "dynamic" : "",
    fixedScale: null,
    nBins:
      paramsDict.hasOwnProperty("mthd") &&
      paramsDict.mthd.includes === "hinge15_breaks"
        ? 6
        : paramsDict.hasOwnProperty("mthd") &&
          paramsDict.mthd.includes === "lisa"
        ? 4
        : 8,
    vizType: paramsDict.hasOwnProperty("viz") ? paramsDict.viz : "2D",
    activeGeoid: "",
    overlay: paramsDict.hasOwnProperty("ovr") ? paramsDict.ovr : "",
    resource: paramsDict.hasOwnProperty("res") ? paramsDict.res : "",
    colorScale: [
      [240, 240, 240],
      [255, 255, 204],
      [255, 237, 160],
      [254, 217, 118],
      [254, 178, 76],
      [253, 141, 60],
      [252, 78, 42],
      [227, 26, 28],
      [177, 0, 38],
    ],
    dotDensityParams: {
      raceCodes: {
        1: true,
        2: true,
        3: true,
        4: true,
        5: false,
        6: false,
        7: false,
        8: true,
      },
      colorCOVID: false,
      backgroundTransparency: 0.01,
    },
  },
  chartParams: {
    table: "cases",
    populationNormalized: false,
  },
  // current data
  chartData: [{}],
  currentTable: {
    numerator: findTableOrDefault(currDataset, tables, "cases"),
    denominator: "properties",
  },
  currentZVariable: null,
  dates: {},
  mapData: {
    data: [],
    params: [],
  },
  sidebarData: {},
  // selection info
  selectionKeys: [],
  selectionNames: [],
  // UI tags
  anchorEl: null,
  isPlaying: false,
  mapLoaded: false,
  notification: {
    info: null,
    location: "",
  },
  panelState: {
    variables: true,
    info: false,
    tutorial: false,
    lineChart: true,
    context: false,
    contextPos: { x: null, y: null },
    dataLoader: false,
    scatterChart: false
  },
  urlParams: {},
  tooltipInfo: {
    x: 0,
    y: 0,
    data: null,
  },
  shouldUpdate: true,
  isLoading: true,
  mapScreenshotData: {},
};
