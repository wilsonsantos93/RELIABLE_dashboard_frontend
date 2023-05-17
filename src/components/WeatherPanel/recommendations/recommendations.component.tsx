import { Accordion, ListGroup } from "react-bootstrap";
import { useSelector } from "react-redux";
import { selectSelectedFeature } from "../../../store/map/map.selector";
import { selectOpenTabId, selectRegionNamePath, selectWeatherFields } from "../../../store/settings/settings.selector";
import { getObjectValue } from "../../../utils/getObjectValue.utils";
import { useEffect } from "react";
import "./recommendations.styles.css";

const Recommendations = () => {
    const selectedFeature = useSelector(selectSelectedFeature);
    const weatherFields = useSelector(selectWeatherFields);
    const regionNamePath = useSelector(selectRegionNamePath);
    const openTabId = useSelector(selectOpenTabId);

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
        <ListGroup key="listgroup" variant="flush">
            { recommendations.map((r,i) => <ListGroup.Item key={`recommendation_${i}`}>{r}</ListGroup.Item>) }
        </ListGroup>
        : <span>Sem recomendações</span>  
    }

    /* return (
        <div className="text-left pt-3">
        
            <h6><strong>Recomendações </strong>
            { 
                selectedFeature ? 
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
    ); */


    useEffect(() => {
        const el: any = document.querySelector(".accordion-button");
        if (!el) return;

        const bodyEl: any = document.querySelector("div.accordion-collapse");
        if (!bodyEl) return;

        const isOpen = bodyEl.classList.contains("show") ? true : false;

        if ((selectedFeature && !isOpen) || (!selectedFeature && isOpen)) {
            el.click();
        }

        /* const accordions: any = document.querySelectorAll(".accordion");
        if (!accordions || !accordions.length) return;
        
        accordions.forEach((accordion: any) => {
            const btn = accordion.querySelector(".accordion-button");
            const body = accordion.querySelector("div.accordion-collapse");

            const isOpen = body.classList.contains("show") ? true : false;
            if ((selectedFeature && !isOpen) || (!selectedFeature && isOpen)) {
                btn.click();
            } 
        }); */

    }, [selectedFeature])


    const getContactRecommendation = () => {
        if (!selectedFeature) return;

        const mainField = weatherFields.find(f => f.main);
        if (!mainField) return;

        const value = selectedFeature.weather[mainField.name];
        const isAlert = mainField.ranges.find(r => {
            const min = (isNaN(r.min) || r.min == null) ? -Infinity : r.min;
            const max = (isNaN(r.max) || r.max == null) ? Infinity : r.max;
            if (r.alert && (min <= value && value <= max)) return r;
        });
        if (!isAlert) return;

        return <div key="divContactRec">
            <hr></hr>
            <div key={"contactRec"}>
                Em caso de dúvida ou necessidade ligar para o SNS 24 (808 24 24 24)<br></br>
                Em caso de emergência ligue para o 112<br></br>
                Para informações mais detalhadas consulte o <a target="_blank" href="https://www.dgs.pt/">site da DGS</a>
            </div>
        </div>
    }


    return (
        <div style={{ width: '100%', position: "absolute", bottom: "2px" }}>
            <Accordion>
                <Accordion.Item eventKey="0" style={{ overflow: 'auto', maxHeight: '45vh', flexDirection: "column-reverse" }}>
                    <Accordion.Header style={{ fontSize: 'unset', zIndex: 100, fontFamily: 'Segoe UI', top: 0, position: "sticky" }}>
                        <h6><strong>Recomendações </strong>
                        { 
                            selectedFeature ? 
                            getObjectValue(regionNamePath, selectedFeature)
                            :
                            null
                        }
                        </h6>
                    </Accordion.Header>
                    <Accordion.Body>
                    {
                        !selectedFeature ? <span>Sem localidade selecionada</span> : [getRecommendations(), getContactRecommendation()]
                    }
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    )
}

export default Recommendations;