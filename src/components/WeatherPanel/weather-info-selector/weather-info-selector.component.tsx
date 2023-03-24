import { ChangeEvent, useEffect } from 'react';
import Form from 'react-bootstrap/Form'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../styles/WeatherPanel.css';
import {Col, Row} from "react-bootstrap";
import WeatherPanelStore from "../../../stores/WeatherPanelStore";
import { fetchWeatherFields } from '../../../data/fetchWeatherFields';

const WeatherInfoSelector = () => {

    const setSelectedInformation = WeatherPanelStore(state => state.setSelectedInformation);
    const selectedWeatherField = WeatherPanelStore(state => state.selectedInformation);

    const weatherFields = WeatherPanelStore(state => state.weatherFields);
    const setWeatherFields = WeatherPanelStore(state => state.setWeatherFields);

    const onSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const x = weatherFields.find(field => field.name === event.target.value);
        setSelectedInformation(x);
    }

    useEffect( () => {
        (async () => {
            const data = await fetchWeatherFields();
            setWeatherFields(data);
            setSelectedInformation(data[0]);
        })()
    }, []);


    return (
        <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={4}>
                Selecionar informação:
            </Form.Label>
            <Col sm={8}>
            <Form.Select style={{fontSize: "unset"}} value={selectedWeatherField?.name} onChange={onSelectChange}>
                <option key="none_opt_weather" value="">Sem informação selecionada</option>
                {
                    weatherFields.map((field: any) => 
                        <option key={field._id} value={field.name}>{field.displayName || field.name }</option>
                    )
                }
            </Form.Select>
            </Col>
        </Form.Group>
    )
}

export default WeatherInfoSelector;
