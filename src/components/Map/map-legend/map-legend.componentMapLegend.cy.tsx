import MapLegend from './map-legend.component';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

describe('<MapLegend />', () => {
  let store: any;

  before(() => {
    const initialState = { 
      settings: {
        selectedWeatherField: { 
          name: "tindoor", 
          displayName: "Temperatura interior", 
          ranges: [
            {
              "min" : 35,
              "max" : null,
              "color" : "#ff0000",
            }
          ]
        }
      }
    };
    const mockStore = configureStore();
    store = mockStore(initialState);
  })

  it('renders', () => {
    cy.mount(
      <Provider store={store}>
        <MapLegend />
      </Provider>
    );
  })

  it('shows legend items correctly', () => {
    cy.mount(
      <Provider store={store}>
        <MapLegend />
      </Provider>
    );

    cy.get(".MapFeatureInformation > span").contains("Temperatura interior");
    cy.get(".MapFeatureInformation div.legend-list-item").should("have.length", 1);
    cy.get(".MapFeatureInformation div.legend-list-item span.legend-text").eq(0).should("have.text", "> 35");
  })

})