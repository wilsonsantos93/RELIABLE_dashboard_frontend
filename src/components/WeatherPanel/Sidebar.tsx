import L from "leaflet";
import "leaflet-sidebar-v2";
import "leaflet/dist/leaflet.css";
import "leaflet-sidebar-v2/css/leaflet-sidebar.min.css";
import { useMap } from "react-leaflet";
import { createRef, useEffect, useMemo, useState } from "react";
import WeatherDateSelector from "./WeatherDateSelector";
import WeatherInfoSelector from "./WeatherInfoSelector";
import WeatherPanelStore from "../../stores/WeatherPanelStore";
import { Table } from "react-bootstrap";
import { useTable, useSortBy } from "react-table";
import ParallelCoordinatesChart from "./parallel-coordinates-chart/paralell-coordinates-chart.component.";

const Sidebar = () => {
    const clickedFeature = WeatherPanelStore(state => state.clickedFeature);
    const [isOpen, setIsOpen] = useState(false);
    const [sidebar, setSidebar] = useState<L.Control.Sidebar|null>(null);
    const weatherFields = WeatherPanelStore(state => state.weatherFields);
    /* const columns: any = useMemo(
        () => [
            { Header: 'Concelho', accessor: 'location' }, 
            ...weatherFields.map(field => { return { Header: field.displayName, accessor: field.name} })
        ], []
    ); */

    // Get color for depending on value
    const getColor = (value: number, fieldName:string) => {
        const field = weatherFields.find(field => field.name === fieldName);
        if (field) {
            for (let r of field.colours) {
                if (r.min <= value && value < r.max) return r.colour
            }
        }
        return "#808080";
    }

/*     const data = useMemo(
        () => [
            {
                location: clickedFeature?.properties.Concelho, 
                ...clickedFeature?.weather
            }
        ],
        [clickedFeature]
    );

    const table = useTable({ columns, data }, useSortBy);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = table;
     */

    const setComparisonMode = WeatherPanelStore(state => state.setComparisonMode);
    const comparisonMode = WeatherPanelStore(state => state.comparisonMode);

    const map = useMap();
    useEffect(() => {
        (() => { 
            const sidebar = L.control.sidebar({
                autopan: false,       // whether to maintain the centered map point when opening the sidebar
                closeButton: true,    // whether t add a close button to the panes
                container: 'sidebar', // the DOM container or #ID of a predefined sidebar container that should be used
                position: 'right',     // left or right
            });
            sidebar.on("opening", () => {
                setIsOpen(true);
            })

            sidebar.on("closing", () => {
                setIsOpen(false);
            })

            map.addControl(sidebar);
            setSidebar(sidebar);
            return () => map.removeControl(sidebar);
        })()
    }, [])


    useEffect(() => {
        if (clickedFeature && !isOpen) sidebar?.open("tab1");
        else if (!clickedFeature) sidebar?.close();
    }, [clickedFeature])

    const comparedFeatures = WeatherPanelStore(state => state.comparedFeatures);

    return (
        <div id="sidebar" className="leaflet-sidebar collapsed">
            <div className="leaflet-sidebar-tabs">
                <ul role="tablist" style={{paddingLeft: "0px"}}> 
                    <li key="tab1"><a href="#tab1" role="tab">t1</a></li>
                    <li key="tab2"><a href="#tab2" role="tab">t2</a></li>
                    <li key="tab3"><a href="#tab3" role="tab">t3</a></li>
                </ul>
            </div>
    
            <div className="leaflet-sidebar-content">
                <div className="leaflet-sidebar-pane" id="tab1">
                    <h1 className="leaflet-sidebar-header">Dados
                        <div className="leaflet-sidebar-close">X</div>
                    </h1>
                    {comparedFeatures.length}
                    <Table responsive striped bordered hover>
                        <thead>
                            <tr>
                                <th key="Concelho_th">Concelho</th>
                                { 
                                    weatherFields.map(field => 
                                        <th key={field._id+"_th"}>{field.displayName}</th>
                                    )
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {/* <tr>
                                <td>{clickedFeature?.properties?.Concelho}</td>
                                {
                                    weatherFields.map(field => {
                                        if (!clickedFeature?.weather) return <td></td>
                                        return <td style={{backgroundColor: getColor(clickedFeature?.weather[field.name], field.name)}} key={field._id+"_td"}>
                                            {clickedFeature?.weather[field.name]}
                                        </td>
                                    })
                                }
                            </tr> */}
                            {
                               comparedFeatures.map((feature:any) => 
                                <tr key={"Concelho_tr_"+feature._id}>
                                    <td key="Concelho_td">{feature?.properties?.Concelho}</td>
                                    {
                                        weatherFields.map(field => {
                                            if (!feature?.weather) return <td key="none_td_key"></td>
                                            return <td style={{backgroundColor: getColor(feature?.weather[field.name], field.name)}} key={field._id+"_td"}>
                                                {feature?.weather[field.name]}
                                            </td>
                                        })
                                    }
                                </tr>)
                            }

                        </tbody>
                    </Table>
                    <a href="#" onClick={setComparisonMode}>
                        { comparisonMode ? "Cancelar comparação" : "Adicionar mais localidades para comparar" }
                    </a>
                </div>

                <div className="leaflet-sidebar-pane" id="tab3">
                    <h1 className="leaflet-sidebar-header">Gráfico
                        <div className="leaflet-sidebar-close">X</div>
                    </h1>
                    <ParallelCoordinatesChart/>
                </div>
    
                <div className="leaflet-sidebar-pane" id="tab2">
                    <h1 className="leaflet-sidebar-header">Configurar
                        <div className="leaflet-sidebar-close">X</div>
                    </h1>
                    <WeatherDateSelector/>
                    <WeatherInfoSelector/>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;