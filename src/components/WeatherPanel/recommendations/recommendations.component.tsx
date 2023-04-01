import { ListGroup } from "react-bootstrap";
import { useSelector } from "react-redux";
import { selectSelectedFeature } from "../../../store/map/map.selector";
import { selectWeatherFields } from "../../../store/settings/settings.selector";
/* import HoveredFeatureStore from "../../../stores/HoveredFeatureStore"; */
import "./recommendations.styles.css";

const Recommendations = () => {
    //const hoveredFeature = HoveredFeatureStore(state => state.featureProperties);
    const selectedFeature = useSelector(selectSelectedFeature);
    const weatherFields = useSelector(selectWeatherFields);

    const getRecommendations = () => {
        if (!selectedFeature || !selectedFeature.weather) return null;
        let recommendations: any[] = [];
        for (const field of weatherFields) {
            const value = selectedFeature.weather[field.name];
            if (!value) continue;
            for (let r of field.ranges) {
                const min = r.min != null ? r.min : -Infinity; 
                const max = r.max != null ? r.max : Infinity;
                if (min <= value && value < max && r.recommendations) recommendations.push(...r.recommendations);
            }
        }
        return recommendations.length ? 
        <ListGroup variant="flush">
            { recommendations.map((r,i) => <ListGroup.Item key={`recommendation_${i}`}>{r}</ListGroup.Item>) }
        </ListGroup>
        : <span>Sem recomendações</span>  
    }

    return (
        <div className="text-left pt-3">
        
            <h6><strong>Recomendações</strong>
            { 
                selectedFeature ? 
                (!selectedFeature.markerName ? ` ${selectedFeature.properties.Concelho}` : ` ${selectedFeature.markerName} (${selectedFeature?.properties.Concelho})`) :
                null
            }
            </h6>
            {
                !selectedFeature ? <span>Sem localidade selecionada</span>
                :
                getRecommendations()
            }
            
        </div>
    );
}

export default Recommendations;