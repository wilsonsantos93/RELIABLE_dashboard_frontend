import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "react-bootstrap";
import "./features-table.styles.css";
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from "react-redux";
import { selectComparedFeatures, selectSelectedFeature } from "../../../store/map/map.selector";
import { selectGeoJsonLayerRef } from "../../../store/refs/refs.selector";
import { selectFeature, setSelectedFeature, updateComparedFeatures } from "../../../store/map/map.action";
import { selectRegionNamePath, selectWeatherFields } from "../../../store/settings/settings.selector";
import { getObjectValue } from "../../../utils/reducer/getObjectValue.utils";
import getArrayDifference from "../../../utils/reducer/getArrayDifference.utils";

const FeaturesTable = () => {
    const dispatch = useDispatch<any>();
    const weatherFields = useSelector(selectWeatherFields);
    const comparedFeatures = useSelector(selectComparedFeatures);
    const geoJsonLayerRef = useSelector(selectGeoJsonLayerRef);
    const selectedFeature = useSelector(selectSelectedFeature);
    const regionNamePath = useSelector(selectRegionNamePath);
    
    const hoverFeature = (featureId: string) => {
        if (!geoJsonLayerRef) return;

        if (selectedFeature && selectedFeature._id == featureId) return;
        const feature = comparedFeatures.find((f:any) => f._id === featureId);
        dispatch(selectFeature(feature));
        const layer = geoJsonLayerRef.current.getLayer(feature._id);
        if (layer) layer.fireEvent("click");
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

    const getColor = (value: number, fieldName: string) => {
        const field = weatherFields.find(field => field.name === fieldName);
        if (field) {
            for (let r of field.ranges) {
                const min = (r.min != null || !isNaN(r.min)) ? r.min : -Infinity; 
                const max = (r.max != null || !isNaN(r.max)) ? r.max : Infinity;
                if (min <= value && value <= max) {
                    return r.color
                }
            }
        }
        return "#808080";
    }

    let columns = [
        {
            name: 'Local',
            selector: (row: any) => row.local,
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


    const data = useMemo(() => {
       return comparedFeatures.map((feature:any) => {
            return {
                id: feature._id,
                local: getObjectValue(regionNamePath, feature),
                ...feature.weather
            }
        });
    }, [comparedFeatures])

    const conditionalRowStyles = [
        {
            when: (row: any) => row.id === selectedFeature?._id,
            style: () => ({ fontWeight: 'bold', border: '3px solid red' }),
        }, 
        {
            when: (row: any) => row.id !== selectedFeature?._id || (!selectedFeature),
            style: () => ({ fontWeight: 'normal', border: '1px solid black' }),
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


    const handleDelete = () => {
        if (!geoJsonLayerRef) return;
        setToggleCleared(!toggleCleared);
        setSelectedRows([]);
        const diff = getArrayDifference(comparedFeatures, selectedRows);
        dispatch(updateComparedFeatures(diff));
        if (!selectedFeature) return;
        const feature = comparedFeatures.find((f:any) => f._id === selectedFeature._id);
        if (selectedRows.find((r:any) => r.id === feature._id)) {
            const layer = geoJsonLayerRef.current.getLayer(feature._id);
            if (layer) layer.closePopup();
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
        </>
    );
}

export default FeaturesTable;