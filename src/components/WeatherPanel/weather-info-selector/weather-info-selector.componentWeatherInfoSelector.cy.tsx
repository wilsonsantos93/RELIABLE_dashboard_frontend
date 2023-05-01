import { Provider } from 'react-redux';
import WeatherInfoSelector from './weather-info-selector.component';
import { store } from '../../../store/store';

describe('<WeatherInfoSelector />', () => {
  it('renders', () => {
    <Provider store={store}>
      <WeatherInfoSelector />
    </Provider>
  })

  it('should show empty list', () => {
    cy.intercept('GET', '/api/weather/metadata', []).as('getFields');

    cy.mount(
      <Provider store={store}>
        <WeatherInfoSelector />
      </Provider>
    );

    cy.wait('@getFields');

    cy.get("select option").should("have.length", 1);
    cy.get("select option").eq(0).should("have.text", "Sem informação selecionada")
  })

  it('should show all items in list', () => {
    const fields = [
      {
        _id: "1",
        name: "tindoor",
        displayName: "Temperatura interior",
        main: true,
        active: true,
      }, 
      {
        _id: "2",
        name: "toutdoor",
        displayName: "Temperatura exterior",
        main: false,
        active: true,
      }
    ];

    cy.intercept('GET', '/api/weather/metadata', fields).as('getFields');

    cy.mount(
      <Provider store={store}>
        <WeatherInfoSelector />
      </Provider>
    );

    cy.wait('@getFields');

    cy.get("select option").should("have.length", 3);
    cy.get("select option").eq(0).should("have.text", "Sem informação selecionada");
    cy.get("select").find('option:selected').should('have.text', 'Temperatura interior');
  })
})

