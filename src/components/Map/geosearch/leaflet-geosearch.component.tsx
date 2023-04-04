import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import 'leaflet-geosearch/dist/geosearch.css';
import L from 'leaflet';
import { useSelector } from 'react-redux';
import { selectGeoJsonLayerRef } from '../../../store/refs/refs.selector';
declare function require(name:string):any;
const leafletPip = require('@mapbox/leaflet-pip');

const LeafletGeoSearch = (props: any) => {
    //const geoJsonLayerRef = WeatherPanelStore(state => state.geoJsonLayerRef);
    const geoJsonLayerRef = useSelector(selectGeoJsonLayerRef);

    const provider = new OpenStreetMapProvider({
        params: {
            'accept-language': 'pt', // render results in portuguese
            countrycodes: 'pt', // limit search results to Portugal
            addressdetails: 1
        }
    });

    // @ts-ignore
    const searchControl = new GeoSearchControl({
        provider: provider,
        style: 'button', // button or bar
        keepResult: false,
        showMarker: false,
        searchLabel: "Pesquise uma morada...",
        autoClose: true,
    });

    const map = useMap();

    useEffect(() => {
        if (!geoJsonLayerRef) return;
        map.removeEventListener('geosearch/showlocation');
        map.on('geosearch/showlocation', (result: any) => {
            const latlngPoint = new L.LatLng(result.location.y, result.location.x);
            const results = leafletPip.pointInLayer(latlngPoint, geoJsonLayerRef.current, true);
            results.forEach(function(layer: any) {
                layer.fire('click', {
                  latlng: latlngPoint
                });
            });
        });

        return () => { map.removeEventListener('geosearch/showlocation') }
    }, [geoJsonLayerRef])

    useEffect(() => {
        map.addControl(searchControl);
        return () => { map.removeControl(searchControl) };
    }, []);

    return (<></>);
}

export default LeafletGeoSearch;