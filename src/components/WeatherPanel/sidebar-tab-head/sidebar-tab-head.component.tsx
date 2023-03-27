import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useMap } from 'react-leaflet';
import WeatherPanelStore from '../../../stores/WeatherPanelStore';
import "./sidebar-tab-head.styles.css";
import { useDispatch, useSelector } from 'react-redux';
import { selectSidebarRef } from '../../../store/refs/refs.selector';
import { selectComparedFeatures } from '../../../store/map/map.selector';
import { updateComparedFeatures } from '../../../store/map/map.action';


const SidebarTabHead = () => {
    const map = useMap();
    const dispatch = useDispatch<any>();
    
    /* const setComparedFeatures = WeatherPanelStore(state => state.setComparedFeatures);
    const comparedFeatures = WeatherPanelStore(state => state.comparedFeatures);
    const sidebar = WeatherPanelStore(state => state.sidebar); */
    const sidebarRef = useSelector(selectSidebarRef);
    const comparedFeatures = useSelector(selectComparedFeatures);
    
    const clearAll = () => {
        map.closePopup(); 
        /* setComparedFeatures([]);
        sidebar?.close(); */
        sidebarRef?.current.close();
        dispatch(updateComparedFeatures([]));
    }

    return (
        <div className="tabHead">
            <span><FontAwesomeIcon icon={faEye} /> {comparedFeatures.length} localidades na lista</span>
            <a href="#" onClick={clearAll}>
                <FontAwesomeIcon icon={faTrash} /> Limpar tudo
            </a>
        </div>
    );
}

export default SidebarTabHead;