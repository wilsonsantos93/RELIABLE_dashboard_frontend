import { Provider } from 'react-redux';
import App from './App';
import { store } from '../store/store';

const mountComponent = (store: any) => {
  cy.mount(
    <Provider store={store}>
      <App />
    </Provider>
  );
}

describe('<App />', () => {
  it('renders', () => {
    mountComponent(store)
  })

  it('should show the loading spinner when loading the data then hide it afterwards', () => {
    let sendResponse: any;
    const trigger = new Promise((resolve) => {
      sendResponse = resolve;
    });

    cy.intercept('/api/map/getRegionBordersAndWeather?dateId=*', (request) => {
      return trigger.then(() => {
        request.reply();
      });
    }).as("mapRequest");

    store.dispatch({ type: "settings/SET_REGION_NAME_PATH", payload: "properties.Concelho" });

    mountComponent(store);

    cy.get("#tipToast").should("not.exist");
    cy.get("#loadingToast").contains("A carregar").should('exist').then(() => {
      // After we've successfully asserted the loading spinner is
      // visible, call the resolve function of the above Promise
      // to allow the response to the data request to occur...
      sendResponse();
      // ...and assert the spinner is removed from the DOM and
      // the data is shown instead.
      cy.get("#loadingToast").should("not.exist");
      cy.get("#tipToast").contains("Clique nas localidades para adicionar à lista").should("exist");
    });
  })
})