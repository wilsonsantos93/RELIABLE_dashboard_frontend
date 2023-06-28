import { useEffect, useState } from "react";
import Legend from "./legend";
import * as d3 from "d3";
import { WeatherField } from "../../../store/settings/settings.types";

type LegendComponentProps = {
    weatherField: WeatherField | undefined,
    options?: any;
}

const LegendComponent = ({ weatherField, options }: LegendComponentProps) => {
    const width = options?.width;

    const [colors, setColors] = useState<any>();
    const [domain, setDomain] = useState<any>();
    const [tickFormat, setTickFormat] = useState<any>(".0f");
    
    useEffect(() => {
        if (!weatherField) {
            return;
        }
        // descending order
        const ranges = [...weatherField.ranges].sort((a, b) => b.min - a.min);

        setColors(`[${ranges.map(r => `"${r.color}"`).reverse()}]`);

        const domain = ranges.map(r => r.min).reverse();
        domain.push(ranges[0].max || Infinity);
        setDomain(`[${domain}]`);

        const sumTicks = ranges.reduce((acc, i) => acc+=i.min, 0);
        const sumTicksStr = sumTicks.toString();
        const decimalPlaces = sumTicksStr.split(".")[1];
        
        let tickFormat = ".0f";
        if (decimalPlaces) {
            tickFormat = `.${decimalPlaces.length}f`;
        } 
        setTickFormat(tickFormat);
    }, [weatherField])


    const legend = () => {
        let color;
        let tickSize;
        const d = JSON.parse(domain.replace(/'/g, '"'));
        const c = JSON.parse(colors.replace(/'/g, '"'));
        let t = [0, d.length-1];
        let marginLeft;

        if (weatherField?.scaleType === 'categorical') {
            d.pop();
            t[1] = d.length-1;
            color = d3.scaleOrdinal(d, c);
            tickSize = 0;
            marginLeft = 25;
        } else {
            color = d3.scaleThreshold(d, c);
        }

        const options = {
            tickSize,
            marginLeft,
            width: width || 180,
            tickValues: t,
            tickFormat
        };

        return Legend(color, options) as any;
    }

    return (
        weatherField && colors && domain ? 
        <div><svg dangerouslySetInnerHTML={{__html: legend().innerHTML}} /></div>
        : null
    );
}

export default LegendComponent;