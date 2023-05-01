import { Provider } from 'react-redux';
import { store } from '../../../store/store';
import WeatherDateSelector from './weather-date-selector.component'

const mountComponent = () => {
  cy.mount(
    <Provider store={store}>
      <WeatherDateSelector />
    </Provider>
  );
}

describe('<WeatherDateSelector />', () => {
  it('renders', () => {
    mountComponent();
  })

  it('should show empty list', () => {
    cy.intercept('GET', '/api/weather/dates', []).as('getDates');

    mountComponent();

    cy.wait('@getDates');

    cy.get("select option").should("have.length", 1);
    cy.get("select option").eq(0).should("have.text", "Sem data selecionada")
  })

  it('should show all items in list', () => {
    const dates = [
      {
        _id: "1",
        date: "2023-04-10T23:00:00.000Z",
        format: "YYYY-MM-DD"
      }, 
      {
        _id: "2",
        date: "2023-04-11T23:00:00.000Z",
        format: "YYYY-MM-DD"
      }
    ];

    cy.intercept('GET', '/api/weather/dates', dates).as('getDates');

    mountComponent();

    cy.wait('@getDates');

    cy.get("select option").should("have.length", 3);
    cy.get("select option").eq(0).should("have.text", "Sem data selecionada");
    cy.get("select").find('option:selected').should('have.text', '2023-04-12');
  })

  it('should change the selected item', () => {
    const dates = [
      {
        _id: "1",
        date: "2023-04-10T23:00:00.000Z",
        format: "YYYY-MM-DD"
      }, 
      {
        _id: "2",
        date: "2023-04-11T23:00:00.000Z",
        format: "YYYY-MM-DD"
      }
    ];

    cy.intercept('GET', '/api/weather/dates', dates).as('getDates');

    mountComponent();

    cy.wait('@getDates');

    cy.get('select').select('2023-04-11', {force: true})
    cy.get("select").find('option:selected').should('have.text', '2023-04-11');
  })

})