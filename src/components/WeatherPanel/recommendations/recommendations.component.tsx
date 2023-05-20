import { Accordion, ListGroup } from "react-bootstrap";
import { useSelector } from "react-redux";
import { selectSelectedFeature } from "../../../store/map/map.selector";
import { selectRegionNamePath, selectWeatherFields } from "../../../store/settings/settings.selector";
import { getObjectValue } from "../../../utils/getObjectValue.utils";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
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
                if ((min <= value) && (value <= max) && r.recommendations) {
                    for (const rec of r.recommendations) {
                        if (!recommendations.includes(rec)) recommendations.push(rec);
                    }
                }
            }
        }

        recommendations = [];

        return recommendations.length ? 
        <ListGroup key="listgroup" variant="flush">
            { recommendations.map((r,i) => <ListGroup.Item key={`recommendation_${i}`}>{r}</ListGroup.Item>) }
        </ListGroup>
        : 
        <span>
            <FontAwesomeIcon icon={faCheckCircle} className="check-circle"></FontAwesomeIcon> Sem recomendações
        </span>  
    }

    useEffect(() => {
        const el: any = document.querySelector(".accordion-button");
        if (!el) return;

        const bodyEl: any = document.querySelector("div.accordion-collapse");
        if (!bodyEl) return;

        const isOpen = bodyEl.classList.contains("show") ? true : false;

        if ((selectedFeature && !isOpen) || (!selectedFeature && isOpen)) {
            el.click();
        }

    }, [selectedFeature])


    const isAlert = () => {
        if (!selectedFeature) return null;

        const mainField = weatherFields.find(f => f.main);
        if (!mainField) return null;

        const value = selectedFeature.weather[mainField.name];
        const isAlert = mainField.ranges.find(r => {
            const min = (isNaN(r.min) || r.min == null) ? -Infinity : r.min;
            const max = (isNaN(r.max) || r.max == null) ? Infinity : r.max;
            if (r.alert && (min <= value && value <= max)) return r;
        });
        if (!isAlert) return null;

        return isAlert;
    }

    const getContactRecommendation = () => {
        return <div key="divContactRec">
            <hr></hr>
            <div key={"contactRec"}>
                Em caso de dúvida ou necessidade ligar para o SNS 24 (808 24 24 24)<br></br>
                Em caso de emergência ligue para o 112<br></br>
                Para informações mais detalhadas consulte o <a target="_blank" href="https://www.dgs.pt/">site da DGS</a>
            </div>
        </div>
    }

    const getFullRecommendations = () => {
        return <><strong>No caso de temperaturas baixas:</strong>
        <ul>
            <li>Mantenha a temperatura da sua casa entre os 18ºC e os 21ºC</li>
            <li>Tenha cuidado com as mudanças bruscas de temperatura</li>
            <li>Se não conseguir aquecer todas as divisões da casa, tente manter a sala de 
            estar quente durante o dia e aqueça o quarto antes de se ir deitar</li>
            <li>Se utilizar lareiras, braseiras, salamandras ou equipamentos de aquecimento a gás
            mantenha a correta ventilação das divisões de forma a evitar a acumulação de gases
            nocivos à saúde, evitando os acidentes por monóxido de carbono que podem causar
            intoxicação ou morte</li>
            <li>Evite permanecer muito perto das fontes de calor</li>
            <li>Mantenha a pele hidratada, principalmente mãos, pés, cara e lábios</li>
            <li>Use várias camadas de roupa, em vez de uma única muito grossa, e não use roupas
            demasiado justas que dificultem a circulação sanguínea</li>
            <li>Escolha calçado confortável e antiderrapante para prevenir quedas e trambolhões</li>
            <li>Proteja as extremidades do corpo (com luvas, gorro, meias quentes e cachecol) e use
            calçado adequado às condições meteorológicas</li>
            <li>Mantenha-se ativo realizando atividades físicas controladas</li>
            <li>Faça refeições mais frequentes encurtando as horas entre elas</li>
            <li>Mesmo que não tenha sede, ingira líquidos ao longo do dia</li>
            <li>Dê preferência a sopas e a bebidas quentes, como leite ou chá</li>
            <li>Aumente o consumo de alimentos ricos em vitaminas, sais minerais e antioxidantes
            (por exemplo, frutos e hortícolas), pois contribuem para minimizar o aparecimento
            de infeções</li>
            <li>Evite bebidas alcoólicas que provocam vasodilatação com perda de calor e
            arrefecimento do corpo</li>
        </ul>

        <strong>No caso de temperaturas altas:</strong>
        <ul>
            <li>Procurar ambientes frescos e arejados</li>
            <li>Beber água ou sumos naturais com regularidade e mesmo que não tenha sede</li>
            <li>Evitar o consumo de bebidas quentes, alcoólicas, gaseificadas, com cafeína e ricas
            em açúcar</li>
            <li>Evitar a exposição direta ao sol nas horas de maior calor, nomeadamente entre as
            11 e as 17 horas</li>
            <li>Aplicar protetor solar com fator 30 ou superior de 2 em 2 horas ou de acordo com a
            indicação da embalagem</li>
            <li>Usar roupas leves, soltas e de cor clara e preferencialmente de algodão e utilizar
            chapéu e óculos de sol</li>
            <li>Evite atividades físicas no exterior, principalmente nos horários mais quentes</li>
            <li>Evite atividades físicas que exijam muito esforço, principalmente nos horários mais
            quentes</li>
            <li>Não permanecer dentro de viaturas estacionadas e expostas ao sol</li>
            <li>Fazer refeições leves e comer mais vezes ao dia</li>
            <li>Ter uma atenção especial face aos grupos de pessoas mais vulneráveis ao calor</li>
            <li>Evite estar em zonas de poluição elevada uma vez que as temperaturas elevadas e a
            poluição do ar estão, muitas vezes, associadas</li>
            <li>No período de maior calor tome um duche de água tépida. Evite, no entanto,
            mudanças bruscas de temperatura (um duche gelado, imediatamente depois de se
            ter apanhado muito calor, pode causar hipotermia, principalmente em pessoas
            idosas ou em crianças)</li>
        </ul></>;
    }


    return (
        <div className="recommendationsAccordion">
            <Accordion>
                <Accordion.Item eventKey="0" className="accordionItem">
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
                        !selectedFeature ? 
                        <span>Sem localidade selecionada</span> 
                        : 
                        isAlert() ?
                        [getFullRecommendations(), getContactRecommendation()]
                        :
                        getRecommendations()
                    }
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    )
}

export default Recommendations;