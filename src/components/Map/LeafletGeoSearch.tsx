import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import 'leaflet-geosearch/dist/geosearch.css';
import L from 'leaflet';
declare function require(name:string):any;
var leafletPip = require('@mapbox/leaflet-pip');
//import "@mapbox/leaflet-pip/leaflet-pip.js";

const LeafletGeoSearch = (props: any) => {
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
        style: 'bar', // button or bar
        keepResult: true,
        showMarker: false,
        searchLabel: "Pesquise uma morada...",
        autoClose: true,
    });

    const map = useMap();

    useEffect(() => {
        map.removeEventListener('geosearch/showlocation');
        map.on('geosearch/showlocation', (result: any) => {
            const latlngPoint = new L.LatLng(result.location.y, result.location.x);
            const results = leafletPip.pointInLayer(latlngPoint, props.geoJsonLayer.current, true);
            results.forEach(function(layer: any) {
                layer.fire('click', {
                  latlng: latlngPoint
                });
            });
        });
    },[props.geoJsonLayer])

    useEffect(() => {
        (() => {
            map.addControl(searchControl);
            return () => map.removeControl(searchControl);
        })()
    }, []);

    return (<></>);
}

export default LeafletGeoSearch;