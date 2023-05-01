import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import WeatherAlerts from './weather-alerts.component'

describe('<WeatherAlerts />', () => {
  let store: any;

  before(() => {
    const initialState = { 
      refs: {},
      settings: { 
        weatherFields: [] 
      },
      user: {
        weatherAlerts: [],
        currentUser: { username: "test", email: "test@test.pt" },
        token: "asdasdadasd",
      }
    };

    const mockStore = configureStore();
    store = mockStore(initialState);
  })

  it('renders', () => {
    <Provider store={store}>
      <WeatherAlerts />
    </Provider>
  })

  it('should display empty list of alerts', () => {
    cy.mount(
      <Provider store={store}>
        <WeatherAlerts />
      </Provider>
    )

    cy.get("#dropdown-autoclose-true").click();
    cy.get(".alerts-dropdown").should("exist");
    cy.contains("Não há alertas para os próximos dias.");
  })

  it('should display list of alerts correctly', () => {
    const initialState = { 
      refs: {},
      settings: { 
        weatherFields: [{ 
          name: "tindoor", 
          displayName: "Temp interior", 
          main: true, 
          active: true,
          ranges: [
            {
              "min" : 35,
              "max" : NaN,
              "color" : "#ff0000",
              "alert" : true,
              "recommendations" : [ 
                "Evitar sair à rua"
              ]
            }
          ]
        }] 
      },
      user: {
        weatherAlerts: { 
          alertNumDays: 2, 
          alerts: [{  
            regionBorderFeatureObjectId: "12345",
            date: [{ date: "2023-30-04", format: "YYYY-MM-DD"}],
            weather: { tindoor: 35 },
            regionName: "Lisboa"
          }] 
        },
        currentUser: { username: "test", email: "test@test.pt" },
        token: "asdasdadasd",
      }
    };

    const mockStore = configureStore();
    store = mockStore(initialState);

    cy.mount(
      <Provider store={store}>
        <WeatherAlerts />
      </Provider>
    )

    cy.get("#dropdown-autoclose-true").click();
    cy.get(".alerts-dropdown").should("exist");

    cy.get(".alerts-item").should("have.length", 1);
    cy.get("#dropdown-autoclose-true span.badge.bg-danger").should("have.text", "1");

    cy.get(".alerts-item").eq(0).contains("Lisboa com Temp interior de 35");

  })
})