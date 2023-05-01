import NavigationBar from './navigation-bar.component'
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

describe('<NavigationBar />', () => {
  let store: any;

  describe('if not logged in', () => {
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
          <NavigationBar />
        </Provider>
      );
    })
  
    it('has Contact, SignUp, SignIn buttons', () => {
      cy.mount(
        <Provider store={store}>
          <NavigationBar />
        </Provider>
      );
  
      cy.contains("Entrar");
      cy.contains("Registar");
      cy.contains("Contacto");
    })
  
    it('should open Contacts modal', () => {
      cy.mount(
        <Provider store={store}>
          <NavigationBar />
        </Provider>
      );
  
      cy.get("#contactsBtn").click();
      cy.contains("Contactos");
    })
  
    it('should open and close SignUp modal', () => {
      cy.mount(
        <Provider store={store}>
          <NavigationBar />
        </Provider>
      );
  
      cy.get("#signUpBtn").click();
      cy.contains("Criar conta utilizador");
  
      cy.get(".modal-header .btn-close").click();
      cy.contains("Criar conta utilizador").should("not.exist");
    })
  
    it('should open and close Login modal', () => {
      cy.mount(
        <Provider store={store}>
          <NavigationBar />
        </Provider>
      );
  
      cy.get("#signInBtn").click();
      cy.contains("Login utilizador");
  
      cy.get(".modal-header .btn-close").click();
      cy.contains("Login utilizador").should("not.exist");
    })
  })

  describe('if logged in', () => {
    before(() => {
      const initialState = { 
        refs: {},
        settings: { 
          weatherFields: [] 
        },
        user: {
          currentUser: { username: "test", email: "test@test.pt" },
          token: "asdasdadasd",
        }
      };
      const mockStore = configureStore();
      store = mockStore(initialState);
    })

    it('should show user menu', () => {
      cy.mount(
        <Provider store={store}>
          <NavigationBar />
        </Provider>
      );

      cy.get("#basic-nav-dropdown").should("exist");
      cy.get("#basic-nav-dropdown span").contains("test");
    })

    it('should open and close updatePassword modal', () => {
      cy.mount(
        <Provider store={store}>
          <NavigationBar />
        </Provider>
      );

      cy.get("#basic-nav-dropdown").click();
      cy.get(".dropdown-menu.show.dropdown-menu-end").should("exist");

      cy.get("#updatePasswordBtn").click();
      cy.contains("Alterar palavra-passe");

      cy.get(".modal-header .btn-close").click();
      cy.contains(".signup-form-btn").should("not.exist");
    })

    it('should open and close alerts dropdown', () => {
      cy.mount(
        <Provider store={store}>
          <NavigationBar />
        </Provider>
      );

      cy.get("#dropdown-autoclose-true").click();
      cy.get(".alerts-dropdown").should("exist");
      cy.contains("Não há alertas para os próximos dias.");

      cy.get("#dropdown-autoclose-true").click();
      cy.contains(".alerts-dropdown").should("not.exist");
    })

  })

})