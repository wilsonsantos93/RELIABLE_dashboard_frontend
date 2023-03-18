export interface UserMarkerState {
    userMarkers: any[]
    setUserMarkers: (userMarkers: any[]) => void

    removeUserMarker: (id: string) => void

    upsertUserMarker: (id: string, name?: string, position?: any) => void
}