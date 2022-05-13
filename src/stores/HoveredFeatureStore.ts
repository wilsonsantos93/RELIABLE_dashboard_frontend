import create from 'zustand'
import {HoveredFeatureState} from "../models/stores/HoveredFeatureState";

const HoveredFeatureStore = create<HoveredFeatureState>((set) => ({

    featureProperties: null,
    setFeatureProperties: (featureProperties) => set(_ => ({
        featureProperties: featureProperties
    })),

}))


export default HoveredFeatureStore;

