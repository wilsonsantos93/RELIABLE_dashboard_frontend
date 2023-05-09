import { ListGroup } from "react-bootstrap";
import { useSelector } from "react-redux";
import { selectSelectedFeature } from "../../../store/map/map.selector";
import { selectRegionNamePath, selectWeatherFields } from "../../../store/settings/settings.selector";
import { getObjectValue } from "../../../utils/reducer/getObjectValue.utils";
import "./recommendations.styles.css";

const Recommendations = () => {
    const selectedFeature = useSelector(selectSelectedFeature);
    const weatherFields = useSelector(selectWeatherFields);
    const regionNamePath = useSelector(selectRegionNamePath);

    const getRecommendations = () => {
        if (!selectedFeature || !selectedFeature.weather) return null;
        let recommendations: string[] = [];
        for (const field of weatherFields) {
            const value = selectedFeature.weather[field.name];
            if (!value) continue;
            for (let r of field.ranges) {
                const min = r.min != null ? r.min : -Infinity; 
                const max = r.max != null ? r.max : Infinity;
                if ((min <= value) && (value < max) && r.recommendations) {
                    for (const rec of r.recommendations) {
                        if (!recommendations.includes(rec)) recommendations.push(rec);
                    }
                }
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
        
            <h6><strong>Recomendações </strong>
            { 
                selectedFeature ? 
                /* (!selectedFeature.markerName ? ` ${selectedFeature.properties.Concelho}` : ` ${selectedFeature.markerName} (${selectedFeature?.properties.Concelho})`) */ 
                getObjectValue(regionNamePath, selectedFeature)
                :
                null
            }
            </h6>
            {
                !selectedFeature ? <span>Sem localidade selecionada</span>
                :
                getRecommendations()
            }
            <hr></hr>
            <div>
                Em caso de dúvida ou necessidade ligar para o SNS 24 (808 24 24 24)<br></br>
                Em caso de emergência ligue para o 112<br></br>
                Para informações mais detalhadas consulte o <a target="_blank" href="https://www.dgs.pt/">site da DGS</a>
            </div>
        </div>
    );
}

export default Recommendations;