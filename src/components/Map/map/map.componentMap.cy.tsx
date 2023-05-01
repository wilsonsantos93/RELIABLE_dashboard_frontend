import { Provider } from 'react-redux';
import Map from './map.component';
import { store } from '../../../store/store';

const mountComponent = (store: any) => {  
  cy.mount(
    <Provider store={store}>
      <Map />
    </Provider>
  );
}

describe('<Map />', () => {

  /* before(() => {
    cy.on("uncaught:exception", (err) => {
      cy.log(err.message);
      return false;
    });
  }); */

  it('renders', () => {
    mountComponent(store);
  })

  describe('Sidebar', () => {
    it('shows correct number of features in list', () => {
      const features = [{
        _id: "1",
        properties: { Concelho: "Lisboa" },
        weather: { tindoor: 20, toutdoor: 25 }
      }, {
        _id: "2",
        properties: { Concelho: "Porto" },
        weather: { tindoor: 22, toutdoor: 27 }
      }];

      store.dispatch({ type: "map/SET_COMPARED_FEATURES", payload: features });

      mountComponent(store);
      
      cy.get("div.tabHead").contains("2 localidades na lista");
    })

    it('removes all features of list', () => {
      const features = [{
        _id: "1",
        properties: { Concelho: "Lisboa" },
        weather: { tindoor: 20, toutdoor: 25 }
      }, {
        _id: "2",
        properties: { Concelho: "Porto" },
        weather: { tindoor: 22, toutdoor: 27 }
      }];

      store.dispatch({ type: "map/SET_COMPARED_FEATURES", payload: features });

      mountComponent(store);
      
      cy.get(".tablist li").eq(0).click();
      cy.get("div.tabHead a").eq(0).click();

      cy.get("div.tabHead").contains("0 localidades na lista");
      cy.get(".rdt_Table > div").should("have.text", "Sem localidades na lista");
    })

    it('should show recommendations for clicked feature in table', () => {
      const features = [{
        _id: "1",
        properties: { Concelho: "Lisboa" },
        weather: { tindoor: 20, toutdoor: 25 }
      }, {
        _id: "2",
        properties: { Concelho: "Porto" },
        weather: { tindoor: 22, toutdoor: 27 }
      }];

      const weatherFields = [{ 
        name: "tindoor", 
        displayName: "Temperatura interior", 
        active: true,
        ranges: [
          {
            "min" : 20,
            "max" : 26,
            "color" : "#a2ff00",
            recommendations: ["A", "B"]
          }
        ]
      }, { 
        name: "toutdoor", 
        displayName: "Temperatura exterior", 
        active: true,
        ranges: [
          {
            "min" : 17,
            "max" : 28,
            "color" : "#2fff00",
            recommendations: ["C", "D"]
          }
        ]
      }];

      cy.intercept("/api/weather/metadata", weatherFields);

      store.dispatch({ type: "map/SET_COMPARED_FEATURES", payload: features });
      store.dispatch({ type: "settings/SET_REGION_NAME_PATH", payload: "properties.Concelho" });

      mountComponent(store);

      cy.get(".tablist li").eq(0).click();

      cy.get(".rdt_TableBody .rdt_TableRow").eq(0).click();
      cy.get(".rdt_TableBody .rdt_TableRow").eq(0).should("have.css", "border").and('match', /solid/);
      cy.get(".rdt_TableBody .rdt_TableRow").eq(0).should("have.css", "font-weight", "700");

      cy.get("h6").contains("Lisboa");
      cy.get(".list-group").eq(0).find(".list-group-item").as("recList");
      cy.get("@recList").should("have.length", 4);
      cy.get("@recList").eq(0).should("have.text", "A");
      cy.get("@recList").eq(1).should("have.text", "B");
      cy.get("@recList").eq(2).should("have.text", "C");
      cy.get("@recList").eq(3).should("have.text", "D");
    });

    it('should show recommendations for clicked feature in chart', () => {
      const features = [{
        _id: "1",
        properties: { Concelho: "Lisboa" },
        weather: { tindoor: 20, toutdoor: 25 }
      }, {
        _id: "2",
        properties: { Concelho: "Porto" },
        weather: { tindoor: 22, toutdoor: 27 }
      }];

      const weatherFields = [{ 
        name: "tindoor", 
        displayName: "Temperatura interior", 
        active: true,
        ranges: [
          {
            "min" : 20,
            "max" : 26,
            "color" : "#a2ff00",
            recommendations: ["A", "B"]
          }
        ]
      }, { 
        name: "toutdoor", 
        displayName: "Temperatura exterior", 
        active: true,
        ranges: [
          {
            "min" : 17,
            "max" : 28,
            "color" : "#2fff00",
            recommendations: ["C", "D"]
          }
        ]
      }];

      cy.intercept("/api/weather/metadata", weatherFields);
      cy.intercept("/api/metadata", { DB_REGION_NAME_FIELD: "properties.Concelho"});

      store.dispatch({ type: "map/SET_COMPARED_FEATURES", payload: features });
      store.dispatch({ type: "settings/SET_REGION_NAME_PATH", payload: "properties.Concelho" });

      window.store = store;
      mountComponent(store);

      /* 
      cy.get(".rdt_TableBody .rdt_TableRow").eq(0).click();
      cy.get(".rdt_TableBody .rdt_TableRow").eq(0).should("have.css", "border").and('match', /solid/);
      cy.get(".rdt_TableBody .rdt_TableRow").eq(0).should("have.css", "font-weight", "700"); */

      cy.get(".tablist li").eq(1).click();
      cy.get("g.highcharts-series:nth-child(1)").click();

      cy
      .window()
      .its('store')
      .invoke('dispatch', { type: 'map/SET_SELECTED_FEATURE', payload: features[1] });

      cy.get("h6").contains("Porto");
      cy.get(".highcharts-legend-item path.highcharts-graph").eq(1).should("have.attr", "stroke", "red");
      cy.get(".list-group").eq(0).find(".list-group-item").as("recList");
      cy.get("@recList").should("have.length", 4);
      cy.get("@recList").eq(0).should("have.text", "A");
      cy.get("@recList").eq(1).should("have.text", "B");
      cy.get("@recList").eq(2).should("have.text", "C");
      cy.get("@recList").eq(3).should("have.text", "D");
    })

  })

})
