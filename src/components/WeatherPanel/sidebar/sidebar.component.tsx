import L from "leaflet";
import "leaflet-sidebar-v2";
import "leaflet/dist/leaflet.css";
import "leaflet-sidebar-v2/css/leaflet-sidebar.min.css";
import { useMap } from "react-leaflet";
import { useCallback, useEffect, useState } from "react";
import WeatherDateSelector from "../weather-date-selector/weather-date-selector.component";
import WeatherInfoSelector from "../weather-info-selector/weather-info-selector.component";
import WeatherPanelStore from "../../../stores/WeatherPanelStore";
import { Col, Container, Dropdown, Form, Row, Table } from "react-bootstrap";
import ParallelCoordinatesChart from "../parallel-coordinates-chart/paralell-coordinates-chart.component.";
import "./sidebar.styles.css";
import HoveredFeatureStore from "../../../stores/HoveredFeatureStore";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTable, faChartLine, faCog, faWindowClose } from '@fortawesome/free-solid-svg-icons'


const Sidebar = ({ geoJsonLayer }: any ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [sidebar, setSidebar] = useState<L.Control.Sidebar|null>(null);
    const weatherFields = WeatherPanelStore(state => state.weatherFields);

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

    const setComparisonMode = WeatherPanelStore(state => state.setComparisonMode);
    const comparisonMode = WeatherPanelStore(state => state.comparisonMode);

    const setComparedFeatures = WeatherPanelStore(state => state.setComparedFeatures);

    const hoveredFeature = HoveredFeatureStore(state => state.featureProperties);

    const clearAll = () => {
        map.closePopup(); 
        setComparedFeatures([]);
        setComparisonMode();
    }

    const setComparison = () => {
        map.closePopup(); 
        setComparisonMode();
    }

    useEffect(() => {
        if (!comparisonMode && comparedFeatures.length) setComparedFeatures([comparedFeatures[0]]);
    }, [comparisonMode])

    const map = useMap();
    useEffect(() => {
        (() => { 
            const sidebar = L.control.sidebar({
                autopan: true,       // whether to maintain the centered map point when opening the sidebar
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

    const removeFeature = (e: any, featureId: string) => {
        e.stopPropagation();
        e.preventDefault();
        const filteredFeatures = comparedFeatures.filter((f:any) => f._id != featureId);
        setComparedFeatures(filteredFeatures);
        const layer = geoJsonLayer.current.getLayer(featureId);
        layer.closePopup();
    }

    const comparedFeatures = WeatherPanelStore(state => state.comparedFeatures);
    const setFeatureProperties = HoveredFeatureStore(state => state.setFeatureProperties);

    const hoverFeature = (featureId: string) => {
        const feature = comparedFeatures.find((f:any) => f._id == featureId);
        setFeatureProperties({_id: feature._id, properties: feature.properties, weather: feature.weather, rowHover: true});
        const layer = geoJsonLayer.current.getLayer(feature._id);
        layer.fireEvent("click");
    }

    useEffect(() => {
        if (comparedFeatures.length && !isOpen) sidebar?.open("tab1");
        else if (!comparedFeatures.length) sidebar?.close();
    }, [comparedFeatures])

    const onClickSeries = (featureId: string) => {
        hoverFeature(featureId);
    }

    //const setSelectAreaMode = WeatherPanelStore(state => state.setSelectAreaMode);

   /*  const selectArea = () => {
        setSelectAreaMode(true);
    }
 */
    const selectMode = WeatherPanelStore(state => state.selectMode);
    const setSelectMode = WeatherPanelStore(state => state.setSelectMode);


    return (
        <div id="sidebar" className="leaflet-sidebar collapsed">
            <div className="leaflet-sidebar-tabs">
                <ul role="tablist" style={{paddingLeft: "0px"}}> 
                    <li key="tab1"><a href="#tab1" role="tab"><FontAwesomeIcon icon={faTable} /></a></li>
                    <li key="tab2"><a href="#tab2" role="tab"><FontAwesomeIcon icon={faChartLine} /></a></li>
                    <li key="tab3"><a href="#tab3" role="tab"><FontAwesomeIcon icon={faCog} /></a></li>
                </ul>
            </div>
    
            <div className="leaflet-sidebar-content">
                <div className="leaflet-sidebar-pane" id="tab1">
                    <h1 className="leaflet-sidebar-header">Tabela
                        <div className="leaflet-sidebar-close"><FontAwesomeIcon icon={faWindowClose} /></div>
                    </h1>

                    <Container fluid className="container-table">
                    <Row className="inline-row">
                        <Col xs={12}>
                            <Row className="containerDiv">
                                <div style={{display:"flex", flexDirection: "row", alignItems:"center", margin: '5px 5px'}}>
                                <Dropdown>
                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                        Adicionar à lista
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => setSelectMode('individual')} active={selectMode == 'individual'} href="#">Selecionar individualmente</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setSelectMode('area')}  active={selectMode == 'area'} href="#">Selecionar área</Dropdown.Item>
                                        { selectMode && <Dropdown.Divider /> }
                                        { selectMode && <Dropdown.Item onClick={() => setSelectMode(null)}  active={!selectMode} href="#">Terminar seleção</Dropdown.Item> }   
                                    </Dropdown.Menu>
                                </Dropdown>
                                    <span style={{ flex: 2 }}>{comparedFeatures.length} localidades selecionadas.</span>
                                    <a style={{ flex: 1 }} href="#" onClick={clearAll}>Limpar tudo</a>
                                </div>
                                    
                                <Col xs={12} className="featuresTable">
                                    <Table size="sm" responsive striped bordered hover>
                                        <thead>
                                            <tr>
                                                { 
                                                    (comparisonMode && comparedFeatures.length > 1) &&
                                                    <th key="remove_th"></th>
                                                }
                                                <th key="local_th">Local</th>
                                                { 
                                                    weatherFields.map(field => 
                                                        <th key={field._id+"_th"}>{field.displayName}</th>
                                                    )
                                                }
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            comparedFeatures.map((feature:any, i:number) => 
                                            <tr 
                                                id={"row_"+feature._id} 
                                                style={ comparedFeatures.length > 1 && hoveredFeature && hoveredFeature._id == feature._id ? { border: '3px solid red' } : { border: '1px solid black' }} 
                                                onClick={() => hoverFeature(feature._id)}
                                                className="comparisonTblRow" 
                                                key={"local_tr_"+feature._id}
                                            >
                                               { (comparisonMode) &&
                                                <td key="remove_td">
                                                    { 
                                                    <button onClick={(e) => removeFeature(e, feature._id)} className="btn btn-sm btn-danger">X</button>
                                                    }
                                                </td>
                                                }

                                                <td key="local_td">{feature?.properties?.Concelho}</td>
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

                                    <div className="row" style={{display:'unset', textAlign: 'center'}}>
                                        <a href="#" onClick={setComparison}>
                                            { comparisonMode ? "Sair do modo comparação" : "Entrar no modo comparação" }
                                        </a>

                                      
                                    </div>
                                </Col>
                                
                                <Col xs={12} className="recommendations">
                                    <div className="text-left">
                                        <h5>Recomendações</h5>
                                        Um doce pacote de belgas foi calmamente saboreado por uma águia que só deixou de perseguir a sua presa ao quinto golo. Não foi sequer uma grande entrada em ação, mas a superioridade dos encarnados era natural e as ocasiões começaram a suceder-se, Florentino e João Mário perderam ocasiões incríveis para marcar.
                                    </div>
                                </Col>

                            </Row>
                        </Col>
                    </Row>
                    </Container>
                </div>

                <div className="leaflet-sidebar-pane" id="tab2">
                    <h1 className="leaflet-sidebar-header">Gráfico
                        <div className="leaflet-sidebar-close"><FontAwesomeIcon icon={faWindowClose} /></div>
                    </h1>
                    <ParallelCoordinatesChart geoJsonLayerRef={geoJsonLayer} onClickSeries={onClickSeries} />
                </div>
    
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