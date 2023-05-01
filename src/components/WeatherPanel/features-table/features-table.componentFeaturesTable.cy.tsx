import { Provider } from 'react-redux';
import FeaturesTable from './features-table.component';
import configureStore from 'redux-mock-store';
import { store } from '../../../store/store';

const mountComponent = (store: any) => {
  cy.mount(
    <Provider store={store}>
      <FeaturesTable />
    </Provider>
  );
}

describe('<FeaturesTable />', () => {
  const initialState = {
    refs: { geoJsonLayerRef: true },
    map: {
      selectedFeature: null,
      comparedFeatures: [{
        _id: "1",
        properties: { Concelho: "Lisboa" },
        weather: { tindoor: 20, toutdoor: 25 }
      }, {
        _id: "2",
        properties: { Concelho: "Porto" },
        weather: { tindoor: 22, toutdoor: 27 }
      }]
    },
    settings: {
      weatherFields: [{ 
        name: "tindoor", 
        displayName: "Temperatura interior", 
        ranges: [
          {
            "min" : 20,
            "max" : 26,
            "color" : "#a2ff00",
          }
        ]
      }, { 
        name: "toutdoor", 
        displayName: "Temperatura exterior", 
        ranges: [
          {
            "min" : 17,
            "max" : 28,
            "color" : "#2fff00",
          }
        ]
      }],
      regionNamePath: "properties.Concelho"
    }
  };

  const mockStore = configureStore();

  it('renders', () => {
    const store = mockStore(initialState);
    mountComponent(store);
  })

  it('should display empty list message', () => {
    let initialState: any = { 
      refs: {},
      map: {
        selectedFeature: null,
        comparedFeatures: []
      },
      settings: {
        weatherFields: [],
        regionNamePath: "properties.Concelho"
      }
    };
    const store = mockStore(initialState);
    mountComponent(store);

    cy.get(".rdt_Table > div").should("have.text", "Sem localidades na lista");
  })

  it('should display table with rows', () => {
    const store = mockStore(initialState);
    mountComponent(store);

    cy.get(".rdt_TableBody .rdt_TableRow").should("have.length", 2);

    cy.get(".rdt_TableCol div[data-column-id=1]").contains("Local");
    cy.get(".rdt_TableCol div[data-column-id=2]").contains("Temperatura interior");
    cy.get(".rdt_TableCol div[data-column-id=3]").contains("Temperatura exterior");

    cy.get("#cell-1-1").contains("Lisboa");
    cy.get("#cell-2-1").contains("20");
    cy.get("#cell-3-1").contains("25");

    cy.get("#cell-1-2").contains("Porto");
    cy.get("#cell-2-2").contains("22");
    cy.get("#cell-3-2").contains("27");
  })

  it('should check rows correctly', () => {
    store.dispatch({ type: "map/SET_COMPARED_FEATURES", payload: initialState.map.comparedFeatures });
    store.dispatch({ type: "settings/SET_REGION_NAME_PATH", payload: initialState.settings.regionNamePath });
    store.dispatch({ type: "settings/FETCH_WEATHER_FIELDS_SUCCESS", payload: initialState.settings.weatherFields });
    store.dispatch({ type: "refs/SET_GEOJSONLAYER_REF", payload: initialState.refs.geoJsonLayerRef });
    
    mountComponent(store);

    cy.get(".rdt_TableHeadRow input[type=checkbox]").click();
    cy.get(".rdt_TableCell input[type=checkbox]:checked").should("have.length", 2);

    cy.get(".btn.btn-danger").as("deleteBtn");
    cy.get("@deleteBtn").should("exist");
    cy.get("@deleteBtn").contains("Eliminar selecionados");

    cy.get(".rdt_TableHeadRow input[type=checkbox]").click();
    cy.get("@deleteBtn").should("not.exist");
    cy.get(".rdt_TableCell input[type=checkbox]:checked").should("have.length", 0);

    cy.get(".rdt_TableCell input[type=checkbox]").eq(0).click();
    cy.get("@deleteBtn").should("exist");
    cy.get(".rdt_TableCell input[type=checkbox]:checked").should("have.length", 1);

    cy.get(".rdt_TableCell input[type=checkbox]").eq(0).click();
    cy.get("@deleteBtn").should("not.exist");
    cy.get("input[type=checkbox]:checked").should("have.length", 0);    

    cy.get(".rdt_TableCell input[type=checkbox]").eq(0).click();
    cy.get("@deleteBtn").should("exist");
    cy.get("@deleteBtn").click();
    cy.get(".rdt_TableCell input[type=checkbox]:checked").should("have.length", 0);
    cy.get(".rdt_TableBody .rdt_TableRow").should("have.length", 1);
    cy.get("@deleteBtn").should("not.exist");

    cy.get(".rdt_TableHeadRow input[type=checkbox]").click();
    cy.get("@deleteBtn").should("exist");
    cy.get("@deleteBtn").click();
    cy.get(".rdt_TableBody .rdt_TableRow").should("have.length", 0);
    cy.get("@deleteBtn").should("not.exist");

  })
})