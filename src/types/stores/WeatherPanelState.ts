export interface WeatherPanelState {
    toastMsg: { message: string, type: "danger" | "success" } | null
    setToastMsg: (message: string, type: "danger" | "success") => void

    sidebar: L.Control.Sidebar | null
    setSidebar: (sidebar: L.Control.Sidebar|null) => void

    selectMode: string | null
    setSelectMode: (mode: string | null ) => void

    isTabOpen: boolean
    setIsTabOpen: (bool: boolean) => void

    selectAreaMode: boolean
    setSelectAreaMode: (bool?: boolean ) => void

    geoJsonLayerRef: any
    setGeoJsonLayerRef: (ref: any) => void

    selectedDateDatabaseId: string | undefined
    setSelectedDateDatabaseId: (selectedDateDatabaseId: string | undefined) => void

    selectedInformation: any | undefined
    setSelectedInformation: (selectedInformation: object | undefined) => void

    selectedWeatherMetadata: () => any

    loading: boolean
    setLoading: (bool: boolean) => void

    data: any
    setData: (data: any) => void

    weatherFields: any[]
    setWeatherFields: (data: any[]) => void

    clickedFeature: any
    setClickedFeature: (data: any) => void

    comparedFeatures: any
    setComparedFeatures: (data: any) => void

    comparisonMode: boolean
    setComparisonMode: (bool?: boolean) => void
}