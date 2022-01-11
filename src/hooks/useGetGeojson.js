import { useMemo } from "react";
import {
    indexGeoProps,
    getIdOrder
} from '../utils';

export default function useGetGeojson({
    geoda = {},
    geodaReady = false,
    currDataset = {},
    storedGeojson = {},
    dataDispatch = () => {},
  }) {
    useMemo(async () => {
      
      if (!geodaReady) return;
      if (storedGeojson[currDataset.file]) {
        return storedGeojson[currDataset.file];
      } else {
        const [mapId, data] = await geoda.loadGeoJSON(
          `${process.env.PUBLIC_URL}/geojson/${currDataset.file}`,
          currDataset.join,
        );
  
        const properties = indexGeoProps(data, currDataset.join);
  
        const order = getIdOrder(data?.features || [], currDataset.join);
  
        dataDispatch({
          type: 'LOAD_GEOJSON',
          payload: {
            [currDataset.file]: {
              data,
              mapId,
              weights: {},
              properties,
              order,
            }
          }})
      }
    }, [JSON.stringify(currDataset), geodaReady]);
  
    if (!geodaReady){
      return [
        {}, // data
        false, // data ready
        undefined, // error
      ];
    }
  
    return [
      storedGeojson[currDataset.file], // data
      storedGeojson[currDataset.file] &&
      storedGeojson[currDataset.file].data &&
      storedGeojson[currDataset.file].mapId &&
      true, // data ready
      undefined, // error
    ];
  }