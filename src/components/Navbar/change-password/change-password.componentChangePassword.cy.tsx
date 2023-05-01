import ChangePassword from './change-password.component';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

describe('<ChangePassword />', () => {
  let store: any;

  before(() => {
    const initialState = { 
      user: {
        currentUser: null,
        token: null,
        locations: [],
        error: null,
        weatherAlerts: null 
      }
    };
    const mockStore = configureStore();
    store = mockStore(initialState);
  })

  it('renders', () => {
    cy.mount(
      <Provider store={store}>
        <ChangePassword show={true} handleClose={() => {}} />
      </Provider>
    )
  })

  it('should have correct attributes', () => {
    cy.mount(
      <Provider store={store}>
        <ChangePassword show={true} handleClose={() => {}}/>
      </Provider>
    );

    cy.get(".signup-form-header").contains("Alterar palavra-passe")

    cy.get('#validationCustomPassword').invoke('attr', 'placeholder').should('contain', 'Insira a palavra-passe');
    cy.get('#validationCustomPasswordConfirm').invoke('attr', 'placeholder').should('contain', 'Repita a palavra-passe');

    cy.get("button.signup-form-btn").invoke('attr', 'disabled').should('exist');
  })

  it('should enable submit button if all fields are filled', () => {
    cy.mount(
      <Provider store={store}>
        <ChangePassword show={true} handleClose={() => {}}/>
      </Provider>
    );

    cy.get('#validationCustomPassword').type("123456");
    cy.get("button.signup-form-btn").should('have.attr', 'disabled');

    cy.get('#validationCustomPasswordConfirm').type("123456");
    cy.get("button.signup-form-btn").should('not.have.attr', 'disabled');
  })

})