import create from 'zustand'
import { UserMarkerState } from "../types/stores/UserMarkerState";

const UserMarkerStore = create<UserMarkerState>((set, get) => ({
    userMarkers: [
        {
            _id: 'efg01xasdasd',
            name: "Local 1",
            lat: 38.724425,
            lng: -9.125481,
        }
    ],

    setUserMarkers: (userMarkers) => set(() => ({
        userMarkers: userMarkers
    })),

    removeUserMarker: async (id: string) => {
        try {
            await fetch(`http://localhost:8000/api/user/location/${id}/delete`, {
                method: 'POST',
            });
            const userMarkers = get().userMarkers;
            const filteredMarkers = userMarkers.filter((marker: any) => marker._id != id);
            get().setUserMarkers(filteredMarkers);
        } catch (e) {
            console.error(e);
        }
    },

    upsertUserMarker: async (id: string, name?: string, position?: number[]) => {
        try {
            const body: any = {};
            if (name) body.name = name;
            if (position) {
                body.lat = position[0];
                body.lng = position[1];
            };

            const response = await fetch(`http://localhost:8000/api/user/location/${id}/update`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (!response?.ok) throw "Error in request";

            const userMarkers = [...get().userMarkers];
            const index = userMarkers.findIndex(marker => marker._id == id);
            
            userMarkers[index] = { 
                ...userMarkers[index],
                ...body
            };

            get().setUserMarkers(userMarkers);    
        } catch (e) {
            console.error(e);
            return;
        }
    }
}))

export default UserMarkerStore;