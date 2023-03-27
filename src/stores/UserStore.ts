import create from 'zustand'
import { UserState } from "../types/stores/UserState";
import { persist } from 'zustand/middleware';

const headers: any = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

const UserStore = create<UserState>()(persist((set, get) => ({
    user: null,
    setUser: (user) => set(() => ({
        user: user 
    })),

    token: null,
    setToken: (token) => set(() => ({
        token: token
    })),

    markers: [],
    setMarkers: (markers) => set(() => ({
        markers: markers
    })),

    isLoggedIn: () => {
        return !!get().token;
    },

    getUserMarkers: () => {
        const user = get().user;
        if (user) return user.locations;
        return [];
    },

    setUserMarkers: (markers) => { 
       const user = { ...get().user };
       user.locations = markers;
       get().setUser(user);
    },

    removeUserMarker: async (id: string) => {
        try {
            const token = get().token;
            const h = { ...headers };
            if (token) h["Authorization"] = `Bearer ${token}`;

            const response = await fetch(`http://localhost:8000/api/user/location/${id}/delete`, {
                method: 'POST',
                headers: h,
            });
            
            if (!response?.ok) throw "Error in request";

            const userMarkers = get().user.locations;
            const filteredMarkers = userMarkers.filter((marker: any) => marker._id != id);
            get().setUserMarkers(filteredMarkers);
        } catch (e) {
            console.error(e);
        }
    },

    addUserMarker: async (position: any) => {
        try {
            if (!position) throw "Coordinates not specified";

            const token = get().token;
            const h = { ...headers };
            if (token) h["Authorization"] = `Bearer ${token}`;

            const response = await fetch(`http://localhost:8000/api/user/location`, {
                method: 'POST',
                headers: h,
                body: JSON.stringify({ name: null, lat: position.lat, lng: position.lng })
            });
            
            if (!response?.ok) throw "Error in request";

            const userMarkers = [...get().user.locations];
            const marker = await response.json();
            userMarkers.push(marker);
           
            get().setUserMarkers(userMarkers);

        } catch (e) {
            console.error(e);
            return;
        }
    },

    updateUserMarker: async (id: string, name?: string, position?: any) => {
        const token = get().token;
        const h = { ...headers };
        if (token) h["Authorization"] = `Bearer ${token}`;

        try {
            const body: any = {};
            if (name) body.name = name;
            if (position) {
                body.lat = position.lat;
                body.lng = position.lng;
            };

            const response = await fetch(`http://localhost:8000/api/user/location/${id}/update`, {
                method: 'POST',
                headers: h,
                body: JSON.stringify(body)
            });

            if (!response?.ok) throw "Error in request";

            const userMarkers = [...get().user.locations];

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

}), { name: 'user-RELIABLE' } ))

export default UserStore;