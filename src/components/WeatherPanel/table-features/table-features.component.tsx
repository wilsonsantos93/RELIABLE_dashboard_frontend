import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Row } from 'primereact/row';
import { ColumnGroup } from 'primereact/columngroup';
import { selectRegionNamePath, selectTableSelectedFeatures, selectToggleDataButtonChecked, selectWeatherFields } from '../../../store/settings/settings.selector';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getObjectValue } from '../../../utils/getObjectValue.utils';
import { selectComparedFeatures, selectSelectedFeature } from '../../../store/map/map.selector';
import { selectGeoJsonLayerRef } from '../../../store/refs/refs.selector';
import { selectFeature } from '../../../store/map/map.action';
import { TableFeature, WeatherField } from '../../../store/settings/settings.types';
import { useMap } from 'react-leaflet';
import { updateTableSelectedFeatures } from '../../../store/settings/settings.action';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import ToggleDataButton from '../toggle-data-button/toggle-data-button.component';
import "primereact/resources/themes/lara-light-indigo/theme.css"; 
import "primereact/resources/primereact.min.css";
import "./table-features.styles.css";
import LegendComponent from '../../Map/map-legend/legend.component';


const TableFeatures = () => {
    const dispatch = useDispatch<any>();
    const map = useMap();
    const weatherFields = useSelector(selectWeatherFields);
    const comparedFeatures = useSelector(selectComparedFeatures);
    const regionNamePath = useSelector(selectRegionNamePath);
    const selectedFeature = useSelector(selectSelectedFeature);
    const geoJsonLayerRef = useSelector(selectGeoJsonLayerRef);
    const tableSelectedFeatures = useSelector(selectTableSelectedFeatures);
    const toggleDataButtonChecked = useSelector(selectToggleDataButtonChecked);
    const dt = useRef(null);
    const [lastUncheckedFeature, setLastUncheckedFeature] = useState<string | null>(null);

    useEffect( () => {
        if (!selectedFeature) return;

        const featureId = selectedFeature._id;

        if (!tableSelectedFeatures.find((f:any) => f._id == featureId)) {
            const ix = data.findIndex((f:any) => f._id == featureId)
            data[ix].checked = true;
            const checkedFeatures = [...tableSelectedFeatures, data[ix]];
            dispatch(updateTableSelectedFeatures(checkedFeatures));
        }

        const ix = data.findIndex((f:any) => f._id == featureId)
        data[ix].checked = true;

    }, [selectedFeature]);


    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        checked: { value: [false, true], matchMode: FilterMatchMode.IN }
    });

    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const onGlobalFilterChange = (e: any) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const updateCheckedFilter = () => {
        let _filters = { ...filters };
        if (toggleDataButtonChecked) {
            _filters['checked'].value = [true];
        }
        else {
            _filters['checked'].value = [false, true];
        }
        setFilters(_filters);
    }

    useEffect(() => {
        updateCheckedFilter();
    }, [toggleDataButtonChecked]);


    // Function to get color
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

    // Generate columns
    let columns = [
        {
            field: 'local',
            header: 'Local'
        }
    ];

    const weatherColumns = weatherFields.map((field:any) => {
        return {
            name: field.name,
            header: field.displayName,
            field: field.name
        }
    });

    columns = [...columns, ...weatherColumns];


    // Generate data
    const data: TableFeature[] = useMemo(() => {
        if (!comparedFeatures) return [];

        return comparedFeatures.map((feature: any) => {
             return {
                _id: feature._id,
                checked: feature.checked ? true : false,
                local: getObjectValue(regionNamePath, feature),
                ...feature.weather
             }
        });
    }, [comparedFeatures]);

    useEffect(() => {
        const checkedFeatures = data.filter((feature: any) => feature.checked == true);
        dispatch(updateTableSelectedFeatures(checkedFeatures));
    }, [data]);


    // Change cell color
    const cellTemplate = (row: any, options: any, colName:any) => {
        if (colName !== 'local') {
            new Promise(r => setTimeout(r, 0)).then(() => {
                const el: any = document.getElementsByClassName(`cell-${colName}-${options.rowIndex}`)[0];
                if (el) {
                    el.style.background = getColor(row[colName], colName)
                    el.style.color = "black"
                }
            });
        }

        let value = row[colName];
        if (value == '0.0') value = 0;

        if (value == null || value == undefined) return;

        const valueStr = value.toString();
        const decimalPlaces = valueStr.split(".")[1];
        if (decimalPlaces && decimalPlaces.length > 2) return Math.floor(value*100)/100;

        return value;
    }

    const cellClassName = (data: any, options: any) => {
        return `cell-${options.field}-${options.rowIndex}`
    }

    const rowClass = (data: any) => {
        return {
            'border-row': selectedFeature && (data._id === selectedFeature._id),
            [`row-${data._id}`]: true
        };
    };

    const onSetSelectedFeatures = (e: any) => {
        dispatch(updateTableSelectedFeatures(e.value));
    }

    // On row clicked handler
    const onRowClicked = (e: any) => {
        if (!geoJsonLayerRef) return;

        const featureId = e.data._id;
        
        if (e.originalEvent.target.matches("path, .p-checkbox-icon, .p-selection-column, .p-checkbox.p-component")) return;

        if (selectedFeature && selectedFeature._id == featureId) return;

        if (!tableSelectedFeatures.find((f:any) => f._id == featureId)) {
            const checkedFeatures = [...tableSelectedFeatures, e.data];
            dispatch(updateTableSelectedFeatures(checkedFeatures));
        }

        const ix = data.findIndex(f => f._id == featureId);
        if (ix < 0) data[ix].checked = true;

        const feature = comparedFeatures.find((f:any) => f._id === featureId);
        dispatch(selectFeature(feature));

        const layer = geoJsonLayerRef.current.getLayer(feature._id);
        if (layer) layer.fireEvent("click", { tableClicked: true });
    }

    // Set Legend for weather column
    const setLegend = (colName: string) => {
        const field = weatherFields.find((f: WeatherField) => f.name === colName);
        if (!field) return;
        
        const ranges = [...field.ranges].sort((a, b) => b.min - a.min);
        const colors = (`[${ranges.map(r => `"${r.color}"`).reverse()}]`);

        const domain = ranges.map(r => r.min).reverse();
        domain.push(ranges[0].max);

        const domains = `[${domain}]`;
        const ticks = `[${ranges.length && ranges.slice(-1)[0].min}, ${ranges.length && ranges[0].max}]`;

        const sumTicks = ranges.reduce((acc, i) => acc+=i.min, 0);
        const sumTicksStr = sumTicks.toString();
        const decimalPlaces = sumTicksStr.split(".")[1];
        
        let tickFormat = ".0f";
        if (decimalPlaces) {
            tickFormat = `.${decimalPlaces.length}f`;
        }

        return <div>
            <color-legend 
                class="tableLegend"
                width="100"
                tickValues={ticks}
                domain={domains}
                range={colors}
                scaletype="threshold"
                titleText=""
                tickFormat={tickFormat}
            ></color-legend>
            </div>
    }

    // On row select handler
    const onRowSelect = (e: any) => {
        e.originalEvent.stopPropagation();
        const ix = data.findIndex(f => f._id == e.data._id);
        data[ix].checked = true;
    };

    // On row unselect handler
    const onRowUnselect = (e: any) => {
        e.originalEvent.stopPropagation();
        const ix = data.findIndex(f => f._id == e.data._id);
        if (ix < 0) return;
        data[ix].checked = false;

        if (selectedFeature?._id == e.data._id) {
            dispatch(selectFeature(null));
            map.closePopup();
        }

        if (!geoJsonLayerRef) return;
        const layer = geoJsonLayerRef.current.getLayer(e.data._id);
        if (layer) layer.closeTooltip();

        setLastUncheckedFeature(e.data._id);
    };

    // On all rows select handler
    const onAllRowsSelect = () => {
        data.forEach(d => d.checked = true);
    };

    // On All rows unselect handler
    const onAllRowsUnselect = () => {
        map.closePopup();
        map.closeTooltip();
        data.forEach(d => d.checked = false);
        dispatch(selectFeature(null));
    };

    const headerGroup = (
        <ColumnGroup>
            <Row>
                <Column selectionMode="multiple" headerStyle={{ width: '1rem' }} key="selectCol" rowSpan={2}></Column>
                <Column header="Local" key="local" field="local" sortable rowSpan={2} />
                {   weatherColumns.map((col, i) => {
                    const weatherField = weatherFields.find((f => f.name == col.name));
                    return (
                        <Column 
                            key={`col_legend_${i}`} 
                            //header={() => setLegend(col.name)}
                            header={() => <LegendComponent options={{width: 100}} weatherField={weatherField}/>}
                            headerStyle={{ textAlign: 'center', minWidth: 130 }}
                        />
                    )})
                }
            </Row>
            <Row>
                {   weatherColumns.map((col, i) => (
                        <Column 
                            sortable
                            key={col.field} 
                            header={col.header}
                            field={col.field} 
                        />
                    ))
                }
            </Row>
        </ColumnGroup>
    );

    // Search box and Toggle button header
    const searchHeader = () => {
        return (
            <div id="searchHeader">
                <ToggleDataButton />

                <div style={{ display: 'flex', textAlign: 'right' }}>
                    <span className="p-input-icon-left">
                        <FontAwesomeIcon icon={faSearch} />
                        <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Pesquisar local" />
                    </span>
                </div>
            </div>
        ); 
    }

    // On mouse enter handler
    const onRowMouseEnter = (e: any) => {
        if (lastUncheckedFeature == e.data._id) return;
        if (!geoJsonLayerRef) return;

        const layer = geoJsonLayerRef.current.getLayer(e.data._id);
        if (layer && !window.mobileCheck()) layer.fireEvent("mouseover");
    }

    // On mouse leave handler
    const onRowMouseLeave = (e: any) => {
        setLastUncheckedFeature(null);
        if (!geoJsonLayerRef) return;

        const layer = geoJsonLayerRef.current.getLayer(e.data._id);
        if (layer) layer.fireEvent("mouseout");
    }

    return (
        <DataTable 
            ref={dt}
            onRowMouseEnter={onRowMouseEnter}
            onRowMouseLeave={onRowMouseLeave}
            onRowSelect={onRowSelect}
            onRowUnselect={onRowUnselect}
            onAllRowsSelect={onAllRowsSelect}
            onAllRowsUnselect={onAllRowsUnselect}
            value={data} 
            filters={filters} 
            globalFilterFields={['local']} 
            removableSort 
            selectionMode={'checkbox'}
            selection={tableSelectedFeatures} 
            onSelectionChange={(e) => onSetSelectedFeatures(e)} 
            emptyMessage="Sem localidades na lista" 
            showGridlines
            header={searchHeader}
            headerColumnGroup={headerGroup} 
            onRowClick={onRowClicked} 
            rowClassName={rowClass} 
            size='small' 
            cellClassName={cellClassName} 
            scrollable 
            scrollHeight="65vh"
            tableStyle={{ fontSize: '12px', maxWidth: '99%' }}
            sortField="local"
            sortOrder={1}
        >
            <Column selectionMode="multiple"></Column>
            <Column hidden filter key={"checked"} field={"checked"}></Column>
            { 
                columns.map((col, i) => (
                    <Column 
                        sortable 
                        key={col.field} 
                        field={col.field} 
                        bodyStyle={{ textAlign: 'center' }}
                        body={(row, options) => cellTemplate(row, options, col.field)}
                    />
                ))
            }
        </DataTable> 
    )
}

export default TableFeatures;