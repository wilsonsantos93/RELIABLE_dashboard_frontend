import { Provider } from 'react-redux';
import Recommendations from './recommendations.component';
import configureStore from 'redux-mock-store';

const mountComponent = (store: any) => {
  cy.mount(
    <Provider store={store}>
      <Recommendations />
    </Provider>
  );
}

describe('<Recommendations />', () => {
  let store: any;
  let initialState: any = { 
    map: {
      selectedFeature: null,
    },
    settings: {
      weatherFields: [{ 
        name: "tindoor", 
        displayName: "Temp interior", 
        main: true, 
        active: true,
        ranges: [
          {
            "min" : 35,
            "max" : null,
            "color" : "#ff0000",
            "alert" : true,
            recommendations : [ 
              "A", "B"
            ]
          }
        ]
      }],
      regionNamePath: "properties.Concelho"
    }
  };

  const mockStore = configureStore();

  it('renders', () => {
    store = mockStore(initialState);
    mountComponent(store);
  })

  it('should display empty message', () => {
    store = mockStore(initialState);
    mountComponent(store);

    cy.get("span").should("have.text", "Sem localidade selecionada");
  })

  it('should display recommendations', () => {
   
    const state = { 
      ...initialState, 
      map: {
        selectedFeature: { 
          _id: "1", 
          properties: { Concelho: "Lisboa" },
          weather: { tindoor: 35 }
        }
      }
    };

    store = mockStore(state);
    mountComponent(store);

    cy.get("h6").contains("Lisboa");
    cy.get(".list-group-item").as("recList");
    cy.get("@recList").eq(0).should("have.text", "A");
    cy.get("@recList").eq(1).should("have.text", "B");
  })


})