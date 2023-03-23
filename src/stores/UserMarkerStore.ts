import create from 'zustand'
import { UserMarkerState } from "../types/stores/UserMarkerState";

const UserMarkerStore = create<UserMarkerState>((set, get) => ({
    userMarkers: [
        {
            _id: 'efg01xasdasd',
            name: "Casa",
            lat: 38.724425,
            lng: -9.125481,
        },
        {
            _id: 'aaa111ddd',
            name: "Trabalho",
            lat: 38.724425,
            lng: -9.105481,
        }
    ],

    setUserMarkers: (userMarkers) => set(() => ({
        userMarkers: userMarkers
    })),

    removeUserMarker: async (id: string) => {
        try {
            const response = await fetch(`http://localhost:8000/api/user/location/${id}/delete`, {
                method: 'POST',
            });
            
            //if (!response?.ok) throw "Error in request";

            const userMarkers = get().userMarkers;
            const filteredMarkers = userMarkers.filter((marker: any) => marker._id != id);
            get().setUserMarkers(filteredMarkers);
        } catch (e) {
            console.error(e);
        }
    },

    addUserMarker: async (position: any) => {
        try {
            if (!position) throw "Coordinates not specified";

            const response = await fetch(`http://localhost:8000/api/user/location`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ lat: position.lat, lng: position.lng })
            });
            
            //if (!response?.ok) throw "Error in request";

            const userMarkers = [...get().userMarkers];
            //const marker = await response.json();
            const marker = { _id: new Date().valueOf(), name: "Sem nome", lat: position.lat, lng: position.lng }
            userMarkers.push(marker);
           
            get().setUserMarkers(userMarkers);

        } catch (e) {
            console.error(e);
            return;
        }
    },

    updateUserMarker: async (id: string, name?: string, position?: any) => {
        try {
            const body: any = {};
            if (name) body.name = name;
            if (position) {
                body.lat = position.lat;
                body.lng = position.lng;
            };

            const response = await fetch(`http://localhost:8000/api/user/location/${id}/update`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            //if (!response?.ok) throw "Error in request";

            const userMarkers = [...get().userMarkers];

            const index = userMarkers.findIndex(marker => marker._id == id);

            if (index >= 0) {
                userMarkers[index] = { 
                    ...userMarkers[index],
                    ...body
                };
            } 

            get().setUserMarkers(userMarkers);   

        } catch (e) {
            console.error(e);
            return;
        }
    }
}))

export default UserMarkerStore;