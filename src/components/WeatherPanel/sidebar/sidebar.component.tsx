import L from "leaflet";
import "leaflet-sidebar-v2";
import "leaflet/dist/leaflet.css";
import "leaflet-sidebar-v2/css/leaflet-sidebar.min.css";
import { useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import WeatherDateSelector from "../weather-date-selector/weather-date-selector.component";
import WeatherInfoSelector from "../weather-info-selector/weather-info-selector.component";
import WeatherPanelStore from "../../../stores/WeatherPanelStore";
import { Form } from "react-bootstrap";
import ParallelCoordinatesChart from "../parallel-coordinates-chart/paralell-coordinates-chart.component.";
import "./sidebar.styles.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTable, faChartLine, faCog, faWindowClose } from '@fortawesome/free-solid-svg-icons'
import Recommendations from "../recommendations/recommendations.component";
import SidebarTabHead from "../sidebar-tab-head/sidebar-tab-head.component";
import FeaturesTable from "../features-table/features-table.component";


const Sidebar = () => {

    const setIsTabOpen = WeatherPanelStore(state => state.setIsTabOpen);
    const isTabOpen = WeatherPanelStore(state => state.isTabOpen);
    const [sidebar, setSidebar] = useState<L.Control.Sidebar|null>(null);
    const comparedFeatures = WeatherPanelStore(state => state.comparedFeatures);
    const map = useMap();

    useEffect(() => {
        const sidebar = L.control.sidebar({
            autopan: true,       // whether to maintain the centered map point when opening the sidebar
            closeButton: true,    // whether t add a close button to the panes
            container: 'sidebar', // the DOM container or #ID of a predefined sidebar container that should be used
            position: 'right',     // left or right
        });

        sidebar.on("opening", () => {
            setIsTabOpen(true);
        });

        sidebar.on("closing", () => {
            setIsTabOpen(false);
        });

        map.addControl(sidebar);
        setSidebar(sidebar);
        return () => { map.removeControl(sidebar) };
    }, [])


    useEffect(() => {
        if (comparedFeatures.length && !isTabOpen) sidebar?.open("tab1");
        else if (!comparedFeatures.length) sidebar?.close();
    }, [comparedFeatures])


    return (
        <div id="sidebar" className="leaflet-sidebar collapsed">
            <div className="leaflet-sidebar-tabs">
                <ul role="tablist" className="tablist"> 
                    <li key="tab1"><a href="#tab1" role="tab"><FontAwesomeIcon icon={faTable} /></a></li>
                    <li key="tab2"><a href="#tab2" role="tab"><FontAwesomeIcon icon={faChartLine} /></a></li>
                    <li key="tab3"><a href="#tab3" role="tab"><FontAwesomeIcon icon={faCog} /></a></li>
                </ul>
            </div>
    
            <div className="leaflet-sidebar-content">
                {/* TAB 1 */}
                <div className="leaflet-sidebar-pane" id="tab1">
                    <h1 className="leaflet-sidebar-header">Tabela
                        <div className="leaflet-sidebar-close"><FontAwesomeIcon icon={faWindowClose} /></div>
                    </h1>
                    <div className="containerDiv">
                        <SidebarTabHead />
                
                        <div className="featuresTable">
                            <FeaturesTable />
                        </div>

                        <div className="recommendations">
                            <Recommendations />
                        </div>
                    </div>
                </div>

                {/* TAB 2 */}                  
                <div className="leaflet-sidebar-pane" id="tab2">
                    <h1 className="leaflet-sidebar-header">Gráfico
                        <div className="leaflet-sidebar-close"><FontAwesomeIcon icon={faWindowClose} /></div>
                    </h1>
                    <div className="containerDiv">
                        <SidebarTabHead />
                
                        <div className="featuresChart">
                            <ParallelCoordinatesChart />
                        </div>

                        <div className="recommendations">
                            <Recommendations />
                        </div>
                    </div>
                </div>
    
                {/* TAB 3 */}
                <div className="leaflet-sidebar-pane" id="tab3">
                    <h1 className="leaflet-sidebar-header">Configurar
                        <div className="leaflet-sidebar-close"><FontAwesomeIcon icon={faWindowClose} /></div>
                    </h1>
                    <Form className="configuration">
                        <WeatherDateSelector/>
                        <WeatherInfoSelector/>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;