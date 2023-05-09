import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Row } from 'primereact/row';
import { ColumnGroup } from 'primereact/columngroup';
import { selectRegionNamePath, selectWeatherFields } from '../../../store/settings/settings.selector';
import { useDispatch, useSelector } from 'react-redux';
import { useMemo } from 'react';
import { getObjectValue } from '../../../utils/reducer/getObjectValue.utils';
import { selectComparedFeatures, selectSelectedFeature } from '../../../store/map/map.selector';
import "primereact/resources/themes/lara-light-indigo/theme.css"; 
import "primereact/resources/primereact.min.css";
import "./table-features.styles.css";
import { selectGeoJsonLayerRef } from '../../../store/refs/refs.selector';
import { selectFeature } from '../../../store/map/map.action';
import { WeatherField } from '../../../store/settings/settings.types';

const TableFeatures = () => {
    const dispatch = useDispatch<any>();
    const weatherFields = useSelector(selectWeatherFields);
    const comparedFeatures = useSelector(selectComparedFeatures);
    const regionNamePath = useSelector(selectRegionNamePath);
    const selectedFeature = useSelector(selectSelectedFeature);
    const geoJsonLayerRef = useSelector(selectGeoJsonLayerRef);
    
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

    const data = useMemo(() => {
        return comparedFeatures.map((feature:any) => {
             return {
                 _id: feature._id,
                 local: getObjectValue(regionNamePath, feature),
                 ...feature.weather
             }
         });
    }, [comparedFeatures])

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

        if (!value) return;

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


    const onRowClicked = (e: any) => {
        if (!geoJsonLayerRef) return;

        const featureId = e.data._id;
        if (selectedFeature && selectedFeature._id == featureId) return;
        const feature = comparedFeatures.find((f:any) => f._id === featureId);
        dispatch(selectFeature(feature));
        const layer = geoJsonLayerRef.current.getLayer(feature._id);
        if (layer) layer.fireEvent("click");
    }

    const setLegend = (colName: string) => {
        const field = weatherFields.find((f: WeatherField) => f.name === colName);
        if (!field) return;
        
        const ranges = field.ranges.sort((a, b) => b.min - a.min);
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

        return <color-legend 
                    class="tableLegend"
                    width="85"
                    tickValues={ticks}
                    domain={domains}
                    range={colors}
                    scaletype="threshold"
                    titleText=""
                    tickFormat={tickFormat}
                ></color-legend>
    }

    const headerGroup = (
        <ColumnGroup>
            <Row>
                <Column header="Local" key="local" field="local" sortable rowSpan={2} />
                {   weatherColumns.map((col, i) => (
                        <Column 
                            key={`col_legend_${i}`} 
                            header={() => setLegend(col.name)}
                            body={(row, options) => cellTemplate(row, options, col.field)}
                        />
                    ))
                }
            </Row>
            <Row>
                {   weatherColumns.map((col, i) => (
                        <Column 
                            sortable 
                            key={col.field} 
                            field={col.field} 
                            header={col.header} 
                            body={(row, options) => cellTemplate(row, options, col.field)}
                        />
                    ))
                }
            </Row>
        </ColumnGroup>
    );

    return (
        <DataTable value={data} headerColumnGroup={headerGroup} onRowClick={onRowClicked} rowClassName={rowClass} size='small' cellClassName={cellClassName} scrollable scrollHeight="44vh" tableStyle={{ fontSize: '12px', maxWidth: '98%' }}>
            { 
                columns.map((col, i) => (
                    <Column 
                        sortable 
                        //frozen={col.field === 'local'} 
                        key={col.field} 
                        field={col.field} 
                        header={col.header} 
                        body={(row, options) => cellTemplate(row, options, col.field)}
                    />
                ))
            }
        </DataTable>
    )
}

export default TableFeatures;