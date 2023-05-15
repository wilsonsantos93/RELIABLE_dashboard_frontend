import { Badge, Dropdown } from "react-bootstrap";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import pt from 'dayjs/locale/pt';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { setDateId } from "../../../store/settings/settings.action";
import { selectWeatherAlerts } from "../../../store/user/user.selector";
import "./weather-alerts.styles.css";
import { selectMainWeatherField, selectSelectedDateId } from "../../../store/settings/settings.selector";
import { selectGeoJsonLayerRef } from "../../../store/refs/refs.selector";
import { updateNextLayer } from "../../../store/map/map.action";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.locale(pt);
const tz = "Europe/Lisbon";

const WeatherAlerts = () => {

    const dispatch = useDispatch<any>();
    const geoJsonLayerRef = useSelector(selectGeoJsonLayerRef);
    const weatherAlerts = useSelector(selectWeatherAlerts); 
    const mainWeatherField = useSelector(selectMainWeatherField);
    const currentDateId = useSelector(selectSelectedDateId);

    const onAlertClick = (dateId: string, regionBorderFeatureObjectId: string) => {
      const layer = geoJsonLayerRef?.current.getLayer(regionBorderFeatureObjectId);
      if (dateId == currentDateId) layer.fire("click");
      else { 
          dispatch(setDateId(dateId));
          dispatch(updateNextLayer(layer.feature._id));
      }
    }

    const getAlertColor = (value: any) => {
        if (mainWeatherField) {
            for (let r of mainWeatherField.ranges) {
                const min = (r.min != null && !isNaN(r.min)) ? r.min : -Infinity; 
                const max = (r.max != null && !isNaN(r.max)) ? r.max : Infinity;
                if (min <= value && value < max) return r.color
            }
        }
        return "#808080";
    }

    const addMarkerNames = (a: any) => {
      if (a.locations && a.locations.length) {
        let names: string[] = [];
        a.locations.forEach((l:any) => {
          if (l.name) names.push(l.name);
        })
        if (names.length) return `(${names.join()})`;
        return 
      }
    }

    return (
    <>
      <Dropdown className="d-inline mx-2">
        <Dropdown.Toggle variant="primary" id="dropdown-autoclose-true">
          <FontAwesomeIcon icon={faTriangleExclamation} /> <span className="d-none d-lg-inline">Alertas</span> { (weatherAlerts && weatherAlerts?.alerts?.length) ? <Badge bg="danger">{weatherAlerts?.alerts?.length}</Badge> : null }
        </Dropdown.Toggle>

        <Dropdown.Menu className="alerts-dropdown" align="end">
        <div style={{textAlign: 'center'}}>
        { 
          (weatherAlerts && weatherAlerts.alerts && weatherAlerts.alerts.length && mainWeatherField) ? <>
          <span>Alertas atuais e para os próximos {weatherAlerts.numDaysAhead} dias:</span>
          {weatherAlerts.alerts.map((a: any, i) => 
            <div style={{textAlign: 'left'}} key={`alert_divider_${i}`}>
              <Dropdown.Divider />
              <Dropdown.Item className="alerts-item" style={{ marginLeft: '5px', borderLeft: `5px solid ${getAlertColor(a.weather.value)}`}} onClick={() => onAlertClick(a.date[0]._id, a.regionBorderFeatureObjectId)} key={`alert_${i}`} href="#">
                  <span>
                    <strong>{a.regionName} {addMarkerNames(a)}</strong> 
                    com {mainWeatherField?.displayName} de <strong>{a.weather.value}</strong>
                    { a.weatherDateObjectId == currentDateId ?
                      <span> neste momento.</span> :
                      <span> em {dayjs(a.date[0].date).tz(tz).format(`dddd, D MMMM ${a.date[0].format.includes(":") ? "HH:mm" : ''}`)}</span>
                    }
                  </span>
              </Dropdown.Item>
            </div>
          )} </>
          :
          <span>Não há alertas para os próximos dias.</span>
        }
        </div>
        </Dropdown.Menu>
      </Dropdown>
    </>
    );
}

export default WeatherAlerts;