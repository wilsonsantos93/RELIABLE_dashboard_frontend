import { combineReducers } from "redux";
import { userReducer } from "./user/user.reducer";
import { settingsReducer } from "./settings/settings.reducer";
import { refsReducer } from "./refs/refs.reducer";
import { mapReducer } from "./map/map.reducer";

export const rootReducer = combineReducers({
  user: userReducer,
  settings: settingsReducer,
  refs: refsReducer,
  map: mapReducer
});
