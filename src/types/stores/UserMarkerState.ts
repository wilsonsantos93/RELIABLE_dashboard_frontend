export interface UserMarkerState {
    userMarkers: any[]
    setUserMarkers: (userMarkers: any[]) => void

    removeUserMarker: (id: string) => void

    addUserMarker: (position: any) => void

    updateUserMarker: (id: string, name?: string, position?: any) => void
}