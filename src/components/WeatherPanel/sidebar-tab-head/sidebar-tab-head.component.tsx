import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useMap } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { selectSidebarRef } from '../../../store/refs/refs.selector';
import { selectComparedFeatures } from '../../../store/map/map.selector';
import { updateComparedFeatures } from '../../../store/map/map.action';
import "./sidebar-tab-head.styles.css";
import { selectTableSelectedFeatures } from '../../../store/settings/settings.selector';
import { updateTableSelectedFeatures } from '../../../store/settings/settings.action';
import getArrayDifference from '../../../utils/reducer/getArrayDifference.utils';

const SidebarTabHead = () => {
    const map = useMap();
    const dispatch = useDispatch<any>();

    const sidebarRef = useSelector(selectSidebarRef);
    const comparedFeatures = useSelector(selectComparedFeatures);
    const tableSelectedFeatures = useSelector(selectTableSelectedFeatures);
    
    const clearAll = () => {
        map.closePopup(); 
        sidebarRef?.current.close();
        dispatch(updateComparedFeatures([]));
    }

    const clearSelected = () => {
        if (!tableSelectedFeatures) return;
        map.closePopup(); 
        const features = getArrayDifference(comparedFeatures, tableSelectedFeatures);
        dispatch(updateComparedFeatures(features));
        dispatch(updateTableSelectedFeatures([]));
    }

    return (
        <div className="tabHead">
            <span><FontAwesomeIcon icon={faEye} /> {comparedFeatures.length} localidades na lista</span>

            { tableSelectedFeatures && tableSelectedFeatures.length ?
                <a href="#" id="clearSelected" onClick={clearSelected}>
                    <FontAwesomeIcon icon={faTrash} /> Remover selecionados
                </a> : null
            }

            <a href="#" id="clearAll" onClick={clearAll}>
                <FontAwesomeIcon icon={faTrash} /> Remover tudo
            </a>
        </div>
    );
}

export default SidebarTabHead;