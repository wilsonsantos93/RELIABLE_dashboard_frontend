import { ChangeEvent, useEffect } from 'react';
import Form from 'react-bootstrap/Form'
import {Col, Row} from "react-bootstrap";
import { useDispatch, useSelector } from 'react-redux';
import { selectSelectedWeatherField, selectWeatherFields } from '../../../store/settings/settings.selector';
import { getWeatherFields, setWeatherField } from '../../../store/settings/settings.action';

const WeatherInfoSelector = () => {
    const selectedWeatherField = useSelector(selectSelectedWeatherField);
    const weatherFields = useSelector(selectWeatherFields);
    const dispatch = useDispatch<any>();

    const onSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const field = weatherFields.find(field => field.name === event.target.value);
        dispatch(setWeatherField(field));
    }

    /* useEffect( () => {
        dispatch(getWeatherFields());
    }, []); */


    return (
        <>
        <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={4}>
                Selecionar informação:
            </Form.Label>
            <Col sm={8}>
            <Form.Select style={{fontSize: "unset"}} value={selectedWeatherField?.name} onChange={onSelectChange}>
                <option key="none_opt_weather" value="">Sem informação selecionada</option>
                {
                    weatherFields.map((field: any) => 
                        <option key={field._id} value={field.name}>{field.displayName || field.name}</option>
                    )
                }
            </Form.Select>
            </Col>
        </Form.Group>

        <p>{selectedWeatherField?.description}</p>
        </>
    )
}

export default WeatherInfoSelector;
