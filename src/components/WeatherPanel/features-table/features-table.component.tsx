import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { useMap } from "react-leaflet";
import HoveredFeatureStore from "../../../stores/HoveredFeatureStore";
import WeatherPanelStore from "../../../stores/WeatherPanelStore";
import "./features-table.styles.css";
import DataTable from 'react-data-table-component';

const FeaturesTable = () => {
    const weatherFields = WeatherPanelStore(state => state.weatherFields);
    const comparedFeatures = WeatherPanelStore(state => state.comparedFeatures);
    const setComparedFeatures = WeatherPanelStore(state => state.setComparedFeatures);
    const hoveredFeature = HoveredFeatureStore(state => state.featureProperties);
    const setFeatureProperties = HoveredFeatureStore(state => state.setFeatureProperties);
    const geoJsonLayerRef = WeatherPanelStore(state => state.geoJsonLayerRef);
    const map = useMap();

    const hoverFeature = (featureId: string) => {
        const feature = comparedFeatures.find((f:any) => f._id == featureId);
        setFeatureProperties({
            _id: feature._id, 
            properties: feature.properties, 
            weather: feature.weather, 
            marker: feature.marker || { _id: null },
            markerRef: feature.markerRef
        });

        /* if (feature.markerRef) feature.markerRef.fire("click");
        else {        
            const layer = geoJsonLayerRef.current.getLayer(feature._id);
            layer.fireEvent("click");
        } */
        const layer = geoJsonLayerRef.current.getLayer(feature._id);
        layer.fireEvent("click");
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

    const removeFeature = (e: any, featureId: string) => {
        e.stopPropagation();
        e.preventDefault();
        const filteredFeatures = comparedFeatures.filter((f:any) => f._id != featureId);
        setComparedFeatures(filteredFeatures);
        map.closePopup();
    }

    const getColor = (value: number, fieldName: string) => {
        const field = weatherFields.find(field => field.name === fieldName);
        if (field) {
            for (let r of field.colours) {
                const min = r.min != null ? r.min : -Infinity; 
                const max = r.max != null ? r.max : Infinity;
                if (min <= value && value < max) return r.colour
            }
        }
        return "#808080";
    }

    let columns = [
        {
            name: 'Local',
            selector: (row: any) => row.Concelho,
            sortable: true,
        }
    ];

    const weatherColumns = weatherFields.map((field:any) => {
        return {
            name: field.displayName,
            selector: (row: any) => row[field.name],
            sortable: true,
            conditionalCellStyles: [{
                when: (row: any) => row[field.name],
                style: (row: any) => ({ backgroundColor: getColor(row[field.name], field.name) }),
            }],
        }
    });

    columns = [...columns, ...weatherColumns];

    const data = comparedFeatures.map((feature:any) => {
        return {
            id: feature._id,
            Concelho: feature.properties.Concelho,
            ...feature.weather
        }
    });

    const conditionalRowStyles = [
        {
            when: (row: any) => row.id == hoveredFeature?._id,
            style: (row: any) => ({ fontWeight: 'bold', border: '3px solid red' }),
        }, 
        {
            when: (row: any) => row.id != hoveredFeature?._id || (!hoveredFeature),
            style: (row: any) => ({ fontWeight: 'normal', border: '1px solid black' }),
        }
    ];

    useEffect(() => {
        if (!comparedFeatures.length) {
            setSelectedRows([]);
            setToggleCleared(!toggleCleared);
        }
    }, [comparedFeatures]);

    const [selectedRows, setSelectedRows] = useState<any>([]);
	const [toggleCleared, setToggleCleared] = useState(false);

    const handleRowSelected = useCallback(state => {
		setSelectedRows(state.selectedRows);
	}, []);

    function getDifference(array1: any[], array2: any[]) {
        return array1.filter(object1 => {
          return !array2.some(object2 => {
            return object1._id === object2.id;
          });
        });
    };

    const handleDelete = () => {
        setToggleCleared(!toggleCleared);
        setComparedFeatures(getDifference(comparedFeatures, selectedRows));
        map.closePopup();
    };
    
    return (
        <>
        { 
            selectedRows.length && comparedFeatures.length ?
            <Button onClick={handleDelete} variant="danger" size="sm">
                Eliminar selecionados
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
            style={{zIndex: 100000}}
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