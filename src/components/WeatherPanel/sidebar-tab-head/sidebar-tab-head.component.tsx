import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useMap } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { selectSidebarRef } from '../../../store/refs/refs.selector';
import { selectComparedFeatures } from '../../../store/map/map.selector';
import { updateComparedFeatures } from '../../../store/map/map.action';
import "./sidebar-tab-head.styles.css";

const SidebarTabHead = () => {
    const map = useMap();
    const dispatch = useDispatch<any>();

    const sidebarRef = useSelector(selectSidebarRef);
    const comparedFeatures = useSelector(selectComparedFeatures);
    
    const clearAll = () => {
        map.closePopup(); 
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