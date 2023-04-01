import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { useMap } from "react-leaflet";
import HoveredFeatureStore from "../../../stores/HoveredFeatureStore";
import WeatherPanelStore from "../../../stores/WeatherPanelStore";
import "./features-table.styles.css";
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from "react-redux";
import { selectComparedFeatures, selectSelectedFeature } from "../../../store/map/map.selector";
import { selectGeoJsonLayerRef } from "../../../store/refs/refs.selector";
import { selectFeature, setSelectedFeature, updateComparedFeatures } from "../../../store/map/map.action";
import { selectWeatherFields } from "../../../store/settings/settings.selector";

const FeaturesTable = () => {
    ////console.time("component")
    /* const weatherFields = WeatherPanelStore(state => state.weatherFields);
    const comparedFeatures = WeatherPanelStore(state => state.comparedFeatures);
    const setComparedFeatures = WeatherPanelStore(state => state.setComparedFeatures);
    const hoveredFeature = HoveredFeatureStore(state => state.featureProperties);
    const setFeatureProperties = HoveredFeatureStore(state => state.setFeatureProperties);
    const geoJsonLayerRef = WeatherPanelStore(state => state.geoJsonLayerRef); */
    //const map = useMap();

    const dispatch = useDispatch<any>();
    const weatherFields = useSelector(selectWeatherFields);
    const comparedFeatures = useSelector(selectComparedFeatures);
    const geoJsonLayerRef = useSelector(selectGeoJsonLayerRef);
    const selectedFeature = useSelector(selectSelectedFeature);
    
    const hoverFeature = (featureId: string) => {
        if (!geoJsonLayerRef) return;
        ////console.time("hoverFeature")
        //if (hoveredFeature && hoveredFeature._id == featureId) return;
        if (selectedFeature && selectedFeature._id == featureId) return;

        const feature = comparedFeatures.find((f:any) => f._id === featureId);
        /* setFeatureProperties({
            _id: feature._id, 
            properties: feature.properties, 
            weather: feature.weather, 
            marker: feature.marker || { _id: null },
            markerRef: feature.markerRef
        }); */
        dispatch(selectFeature(feature));

        /* if (feature.markerRef) feature.markerRef.fire("click");
        else {        
            const layer = geoJsonLayerRef.current.getLayer(feature._id);
            layer.fireEvent("click");
        } */
        const layer = geoJsonLayerRef.current.getLayer(feature._id);
        layer.fireEvent("click");
        //console.timeEnd("hoverFeature")
    }
    

    /* useEffect(() => {
        if (!hoveredFeature) return;
        const el = document.querySelector("#td_local_"+hoveredFeature._id);
        if (hoveredFeature.markers && hoveredFeature.markers.length) {
            if (el) el.innerHTML = `${hoveredFeature.properties.Concelho} (${hoveredFeature.markers.map((m:any) => m.name).join()})`;
        } else {
            if (el) el.innerHTML = hoveredFeature.properties.Concelho;
        } 
    }, [hoveredFeature]) */

    /* const removeFeature = (e: any, featureId: string) => {
        e.stopPropagation();
        e.preventDefault();
        const filteredFeatures = comparedFeatures.filter((f:any) => f._id !== featureId);
        setComparedFeatures(filteredFeatures);
        map.closePopup();
    } */

    //console.time("getColor")
    const getColor = (value: number, fieldName: string) => {
        const field = weatherFields.find(field => field.name === fieldName);
        if (field) {
            for (let r of field.ranges) {
                const min = (r.min != null || !isNaN(r.min)) ? r.min : -Infinity; 
                const max = (r.max != null || !isNaN(r.max)) ? r.max : Infinity;
                if (min <= value && value < max) {
                    return r.color
                }
            }
        }
        return "#808080";
    }

    let columns = [
        {
            name: 'Local',
            selector: (row: any) => row.Concelho,
            sortable: true
        }
    ];

    
    const weatherColumns = weatherFields.map((field:any) => {
        return {
            name: field.displayName,
            selector: (row: any) => row[field.name],
            sortable: true,
            conditionalCellStyles: [{
                when: (row: any) => row[field.name],
                style: (row: any) => ({ borderLeft: "1px solid black", backgroundColor: getColor(row[field.name], field.name) }),
            }],
        }
    });

    columns = [...columns, ...weatherColumns];
    //console.timeEnd("table columns")

    //console.time("table data")
    const data = useMemo(() => {
        /* const data = */ return comparedFeatures.map((feature:any) => {
            //const name = <span>{feature.markers && feature.markers.map((m:any)=> <FontAwesomeIcon title={m.name} icon={faLocationDot} /> )} {feature.properties.Concelho}</span>;
            return {
                id: feature._id,
                Concelho: feature.properties.Concelho,
                ...feature.weather
            }
        });
    }, [comparedFeatures])
    //console.timeEnd("table data")

    const conditionalRowStyles = [
        {
            when: (row: any) => row.id === selectedFeature?._id,
            style: (row: any) => ({ fontWeight: 'bold', border: '3px solid red' }),
        }, 
        {
            when: (row: any) => row.id !== selectedFeature?._id || (!selectedFeature),
            style: (row: any) => ({ fontWeight: 'normal', border: '1px solid black' }),
        }
    ];

    useEffect(() => {
        //console.time("use effect compared features")
        if (!comparedFeatures.length) {
            setSelectedRows([]);
            setToggleCleared(!toggleCleared);
        }
        //console.timeEnd("use effect compared features")

    }, [comparedFeatures]);

    const [selectedRows, setSelectedRows] = useState<any>([]);
	const [toggleCleared, setToggleCleared] = useState(false);

    const handleRowSelected = useCallback(state => {
		setSelectedRows(state.selectedRows);
	}, []);

    //console.time("get difference")
    const getDifference = (array1: any[], array2: any[]) => {
        return array1.filter(object1 => {
          return !array2.some(object2 => {
            return object1._id === object2.id;
          });
        });
    };

    const handleDelete = () => {
        if (!geoJsonLayerRef) return;
        setToggleCleared(!toggleCleared);
        setSelectedRows([]);
        const diff = getDifference(comparedFeatures, selectedRows);
        //setComparedFeatures(diff);
        dispatch(updateComparedFeatures(diff));
        if (!selectedFeature) return;
        const feature = comparedFeatures.find((f:any) => f._id === selectedFeature._id);
        if (selectedRows.find((r:any) => r.id === feature._id)) {
            const layer = geoJsonLayerRef.current.getLayer(feature._id);
            layer.closePopup();
            dispatch(setSelectedFeature(null));
        }
    };
    
    return (
        <>
        { 
            selectedRows.length && comparedFeatures.length ?
            <Button onClick={handleDelete} variant="danger" size="sm">
                <FontAwesomeIcon icon={faTrash} /> Eliminar selecionados
            </Button> : null
        }

        <DataTable 
            fixedHeader 
            fixedHeaderScrollHeight="300px" 
            columns={columns} 
            data={data} 
            conditionalRowStyles={conditionalRowStyles} 
            striped
            highlightOnHover
            dense
            pointerOnHover
            onRowClicked={(row) => hoverFeature(row.id) }
            selectableRows
			onSelectedRowsChange={handleRowSelected}
			clearSelectedRows={toggleCleared}
            noDataComponent="Sem localidades na lista"
            selectableRowsHighlight
        />
        
        {/* <Table size="sm" responsive striped bordered hover>
            <thead>
                <tr>
                    { 
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
                comparedFeatures.map((feature:any) => 
                    <tr 
                        id={"row_"+feature._id} 
                        style={ hoveredFeature && hoveredFeature._id == feature._id ? { fontWeight: 'bold', border: '3px solid red' } : { fontWeight: 'normal', border: '1px solid black' }} 
                        onClick={() => hoverFeature(feature)}
                        className="comparisonTblRow" 
                        key={"tr_"+feature._id}
                    >
                        
                        <td key="remove_td">
                        { 
                            <button onClick={(e) => removeFeature(e, feature._id)} className="btn btn-sm btn-danger">
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        }
                        </td>

                        <td id={"td_local_"+feature._id} key="local_td">
                            { 
                                feature.markers?.length ? 
                                `${feature.properties.Concelho} (${feature.markers.map((m:any) => m.name).join()})` :
                                feature.properties.Concelho
                            }
                        </td>
                        {
                            weatherFields.map(field => {
                                if (!feature?.weather) return <td key="none_td_key"></td>
                                return <td style={{backgroundColor: getColor(feature?.weather[field.name], field.name)}} key={field._id+"_td"}>
                                    {feature?.weather[field.name]}
                                </td>
                            })
                        }
                    </tr>
                )
            }
            </tbody>
        </Table> */}
        </>
    );
}

export default FeaturesTable;