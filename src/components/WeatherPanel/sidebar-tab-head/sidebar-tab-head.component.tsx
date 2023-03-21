import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useMap } from 'react-leaflet';
import WeatherPanelStore from '../../../stores/WeatherPanelStore';
import "./sidebar-tab-head.styles.css";


const SidebarTabHead = () => {
    const map = useMap();

    const setComparedFeatures = WeatherPanelStore(state => state.setComparedFeatures);
    const comparedFeatures = WeatherPanelStore(state => state.comparedFeatures);
    
    const clearAll = () => {
        map.closePopup(); 
        setComparedFeatures([]);
        //setComparisonMode(false);
        //setSelectMode(null);
    }

    return (
        <div className="tabHead">
            <span>{comparedFeatures.length} localidades na lista.</span>
            <a href="#" onClick={clearAll}>
                <FontAwesomeIcon icon={faTrash} /> Limpar tudo
            </a>
        </div>
    );
}

export default SidebarTabHead;