import { useSelector } from "react-redux";
import { selectSelectedFeature } from "../../../store/map/map.selector";
import { selectWeatherFields } from "../../../store/settings/settings.selector";
import HoveredFeatureStore from "../../../stores/HoveredFeatureStore";

const Recommendations = () => {
    //const hoveredFeature = HoveredFeatureStore(state => state.featureProperties);
    const selectedFeature = useSelector(selectSelectedFeature);
    const weatherFields = useSelector(selectWeatherFields);

    const getRecommendations = () => {
        let recommendations: any[] = [];
        for (const field of weatherFields) {
            const value = selectedFeature.weather[field.name];
            if (!value) continue;
            for (let r of field.colours) {
                const min = r.min != null ? r.min : -Infinity; 
                const max = r.max != null ? r.max : Infinity;
                if (min <= value && value < max) recommendations = [...recommendations, ...r.recommendations];
            }
        }
        return <ul>
            { recommendations.map(r => <li>{r.text}</li>) }
        </ul>
        
    }

    return (
        <div className="text-left pt-2">
            
            <h5>Recomendações
            { 
                selectedFeature ? 
                (!selectedFeature.markerName ? ` ${selectedFeature.properties.Concelho}` : ` ${selectedFeature.markerName} (${selectedFeature?.properties.Concelho})`) :
                null
            }
            </h5>
            {
                !selectedFeature ? <span>Sem localidade selecionada</span>
                :
                getRecommendations()
            }
            
        </div>
    );
}

export default Recommendations;