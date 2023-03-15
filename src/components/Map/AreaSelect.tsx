import L from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import WeatherPanelStore from "../../stores/WeatherPanelStore";

const AreaSelect = ({ geoJsonLayer }: any) => {

    const setComparedFeatures = WeatherPanelStore(state => state.setComparedFeatures);
    const comparedFeatures = WeatherPanelStore(state => state.comparedFeatures);
    
    const map: any = useMap();

    const getFeaturesInView = (area: any) => {
        var features: any = [];
        if (!geoJsonLayer.current) return;
        geoJsonLayer.current.eachLayer((layer: any) => {
            if (layer.getBounds) {
                const bound = layer.getBounds();
                if (bound.getCenter) {
                    if (area.contains(bound.getCenter())) {
                        if (!comparedFeatures.length || !comparedFeatures.find((f:any) => f._id == layer.feature._id)) {
                            features.push({
                                _id: layer.feature._id, 
                                properties: layer.feature.properties, 
                                weather: layer.feature.weather 
                            });
                        }
                    }  
                }
                
            }
            
        });
        console.log(features)
        setComparedFeatures([...comparedFeatures, ...features])
    }

    //const selectAreaMode = WeatherPanelStore(state => state.selectAreaMode);
    const selectMode = WeatherPanelStore(state => state.selectMode);
    const setSelectMode = WeatherPanelStore(state => state.setSelectMode);
    const setComparisonMode = WeatherPanelStore(state => state.setComparisonMode);

    useEffect( () => {
        console.log("selectMode", selectMode);
        if (selectMode == 'area') {
            map.selectArea?.setControlKey(false); 
            map.selectArea.enable();
        }
        else map.selectArea.disable();
    }, [selectMode])

  
    useEffect(() => {
      if (!map.selectArea) return;
  
      map.on("areaselected", (e: any) => {
        console.log(e.bounds.toBBoxString());
        //L.rectangle(e.bounds, { color: "blue", weight: 1 }).addTo(map);
        getFeaturesInView(e.bounds);
        map.selectArea.disable();
        setSelectMode(null);
        setComparisonMode(true);
      });
  
      // You can restrict selection area like this:
      //const bounds = map.getBounds().pad(-0.25); // save current map bounds as restriction area
      
      // check restricted area on start and move
      /* map.selectArea.setValidate((layerPoint:any) => {
        return bounds.contains(map.layerPointToLatLng(layerPoint));
      }); */
  
      // now switch it off
      map.selectArea.setValidate();

    }, [map, geoJsonLayer]);
  
    return null;
}

export default AreaSelect;