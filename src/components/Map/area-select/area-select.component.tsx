import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { useDispatch, useSelector } from "react-redux";
import { updateComparedFeatures } from "../../../store/map/map.action";
import { selectComparedFeatures } from "../../../store/map/map.selector";
import { selectGeoJsonLayerRef } from "../../../store/refs/refs.selector";
import { setAreaMode } from "../../../store/settings/settings.action";
import { selectAreaMode } from "../../../store/settings/settings.selector";

const AreaSelect = () => {
    const map: any = useMap();
    const areaMode = useSelector(selectAreaMode);
    const comparedFeatures = useSelector(selectComparedFeatures);
    const geoJsonLayerRef = useSelector(selectGeoJsonLayerRef);

    const dispatch = useDispatch<any>();

    const getFeaturesInView = (area: any) => {
        var features: any = [];
        if (!geoJsonLayerRef || !geoJsonLayerRef.current) return;
        geoJsonLayerRef.current.eachLayer((layer: any) => {
            if (layer.getBounds) {
                const bound = layer.getBounds();
                if (bound.getCenter) {
                    if (area.contains(bound.getCenter())) {
                        if (!comparedFeatures.length || !comparedFeatures.find((f:any) => f._id === layer.feature._id)) {
                            features.push({
                                _id: layer.feature._id, 
                                properties: layer.feature.properties,
                                weather: layer.feature.weather,
                                markers: layer.markers,
                            });
                        }
                    }  
                }
                
            }
            
        });
        dispatch(updateComparedFeatures([...comparedFeatures, ...features]))

    }

    useEffect(() => {
        if (areaMode){
            map.selectArea.setControlKey(false); 
            map.selectArea.setShiftKey(false);
            map.selectArea.enable();
        }
        else map.selectArea.disable();
    }, [areaMode])

  
    useEffect(() => {
      if (!map.selectArea) return;
  
      map.on("areaselected", (e: any) => {
        getFeaturesInView(e.bounds);
        dispatch(setAreaMode(false));
      });
  
      // now switch it off
      map.selectArea.setValidate();

      return () => { map.removeEventListener("areaselected") }

    }, [map, geoJsonLayerRef]);
  
    return null;
}

export default AreaSelect;