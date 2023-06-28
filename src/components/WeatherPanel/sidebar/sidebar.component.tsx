import L from "leaflet";
import "leaflet-sidebar-v2";
import "leaflet/dist/leaflet.css";
import "leaflet-sidebar-v2/css/leaflet-sidebar.min.css";
import { useMap } from "react-leaflet";
import { useEffect, useRef } from "react";
import WeatherDateSelector from "../weather-date-selector/weather-date-selector.component";
import WeatherInfoSelector from "../weather-info-selector/weather-info-selector.component";
import { Button, Form, OverlayTrigger, Popover } from "react-bootstrap";
import ParallelCoordinatesChart from "../parallel-coordinates-chart/paralell-coordinates-chart.component";
import "./sidebar.styles.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTable, faChartLine, faCog, faWindowClose, faInfo } from '@fortawesome/free-solid-svg-icons'
import Recommendations from "../recommendations/recommendations.component";
import SidebarTabHead from "../sidebar-tab-head/sidebar-tab-head.component";
import FeaturesTable from "../features-table/features-table.component";
import { useDispatch } from "react-redux";
import { setSidebar } from "../../../store/refs/refs.action";
import { openSidebar, updateOpenTabId } from "../../../store/settings/settings.action";
import TableFeatures from "../table-features/table-features.component";


const Sidebar = () => {
    const map = useMap();
    const dispatch = useDispatch<any>();

    const sidebar = L.control.sidebar({
        autopan: true,       // whether to maintain the centered map point when opening the sidebar
        closeButton: true,    // whether t add a close button to the panes
        container: 'sidebar', // the DOM container or #ID of a predefined sidebar container that should be used
        position: 'right',     // left or right
    });

    const sidebarRef = useRef(sidebar);

    useEffect(() => {
        sidebar.on("opening", (e) => {
            dispatch(openSidebar(true));
        });

        sidebar.on("closing", () => {
            dispatch(openSidebar(false));
        });

        map.addControl(sidebar);

        dispatch(setSidebar(sidebarRef));
        return () => { map.removeControl(sidebar) };
    }, [])

    const onTabClick = (id: number) => {
        dispatch(updateOpenTabId(id));
    }

    const popoverBottom = (
        <Popover style={{ padding: '5px' }} id="popover-trigger-click-root-close" title="Popover bottom">
          <p>Clique numa linha da tabela para ativar a localidade e ver as recomendações.</p>
          <p>Clique nas caixas de seleção para criar um grupo de localidades e filtrar.</p>
        </Popover>
    );

    return (
        <div id="sidebar" className="leaflet-sidebar collapsed">
            <div className="leaflet-sidebar-tabs">
                <ul role="tablist" className="tablist"> 
                    <li key="tab1"><a href="#tab1" onClick={() => onTabClick(1)} role="tab"><FontAwesomeIcon icon={faTable} /></a></li>
                    {/* <li key="tab2"><a href="#tab2" onClick={() => onTabClick(2)} role="tab"><FontAwesomeIcon icon={faChartLine} /></a></li> */}
                </ul>
            </div>
    
            <div className="leaflet-sidebar-content">
                {/* TAB 1 */}
                <div className="leaflet-sidebar-pane" id="tab1">
                    <h1 className="leaflet-sidebar-header">Tabela
                        <OverlayTrigger rootClose trigger={['click']} placement="bottom" overlay={popoverBottom}>
                            <Button style={{ marginLeft: "5px", marginBottom: "5px"}} id="tableInfoBtn" size="sm">
                                <FontAwesomeIcon style={{ fontSize: "11px" }} icon={faInfo} />
                            </Button>
                        </OverlayTrigger>
                        <div className="leaflet-sidebar-close"><FontAwesomeIcon icon={faWindowClose} /></div>
                    </h1>
                    <div className="containerDiv">
                
                        <div className="featuresTable">
                            <TableFeatures />
                        </div>

                    </div>
                </div>

                {/* TAB 2 */}                  
                {/* <div className="leaflet-sidebar-pane" id="tab2">
                    <h1 className="leaflet-sidebar-header">Gráfico
                        <div className="leaflet-sidebar-close"><FontAwesomeIcon icon={faWindowClose} /></div>
                    </h1>
                    <div className="containerDiv">
                
                        <div className="featuresChart">
                            <ParallelCoordinatesChart />
                        </div>

                    </div>
                </div> */}
    
            

                <div className="recommendations">
                    <Recommendations />
                </div>
            </div>
        </div>
    );
}

export default Sidebar;