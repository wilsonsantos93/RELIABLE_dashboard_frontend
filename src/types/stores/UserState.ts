export interface UserState {
    user: any
    setUser: (user: any) => void
    token: string | null
    setToken: (token: string | null) => void
    markers: any[]
    setMarkers: (markers: any[]) => void
    isLoggedIn: () => boolean
    getUserMarkers: () => any[]
    setUserMarkers: (markers: any[]) => void
    removeUserMarker:  (id: string) => void
    addUserMarker: (position: any) => void
    updateUserMarker: (id: string, name?: string, position?: any) => void
}