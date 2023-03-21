import L from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import WeatherPanelStore from "../../stores/WeatherPanelStore";

const AreaSelect = () => {
    const setComparedFeatures = WeatherPanelStore(state => state.setComparedFeatures);
    const comparedFeatures = WeatherPanelStore(state => state.comparedFeatures);
    const geoJsonLayerRef  = WeatherPanelStore(state => state.geoJsonLayerRef);
    const setSelectAreaMode = WeatherPanelStore(state => state.setSelectAreaMode);
    const selectAreaMode = WeatherPanelStore(state => state.selectAreaMode);
    
    const map: any = useMap();

    const getFeaturesInView = (area: any) => {
        var features: any = [];
        if (!geoJsonLayerRef || !geoJsonLayerRef.current) return;
        geoJsonLayerRef.current.eachLayer((layer: any) => {
            if (layer.getBounds) {
                const bound = layer.getBounds();
                if (bound.getCenter) {
                    if (area.contains(bound.getCenter())) {
                        if (!comparedFeatures.length || !comparedFeatures.find((f:any) => f._id == layer.feature._id)) {
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
        setComparedFeatures([...comparedFeatures, ...features])
    }

    const selectMode = WeatherPanelStore(state => state.selectMode);
    const setSelectMode = WeatherPanelStore(state => state.setSelectMode);

    useEffect( () => {
        //if (selectMode == 'area') {
        if (selectAreaMode){
            map.selectArea?.setControlKey(false); 
            map.selectArea.enable();
        }
        else map.selectArea.disable();
    }, [selectAreaMode])

  
    useEffect(() => {
      if (!map.selectArea) return;
  
      map.on("areaselected", (e: any) => {
        console.log(e.bounds.toBBoxString());
        //L.rectangle(e.bounds, { color: "blue", weight: 1 }).addTo(map);
        getFeaturesInView(e.bounds);
        map.selectArea.disable();
        setSelectAreaMode(false);
        //setSelectMode("individual");
        //setComparisonMode(true);
      });
  
      // You can restrict selection area like this:
      //const bounds = map.getBounds().pad(-0.25); // save current map bounds as restriction area
      
      // check restricted area on start and move
      /* map.selectArea.setValidate((layerPoint:any) => {
        return bounds.contains(map.layerPointToLatLng(layerPoint));
      }); */
  
      // now switch it off
      map.selectArea.setValidate();

      return () => { map.removeEventListener("areaselected") }

    }, [map, geoJsonLayerRef]);
  
    return null;
}

export default AreaSelect;