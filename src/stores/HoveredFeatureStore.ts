import create from 'zustand'
import {HoveredFeatureState} from "../types/stores/HoveredFeatureState";

const HoveredFeatureStore = create<HoveredFeatureState>((set) => ({

    featureProperties: null,
    setFeatureProperties: (featureProperties) => set(_ => ({
        featureProperties: featureProperties
    })),

}))


export default HoveredFeatureStore;