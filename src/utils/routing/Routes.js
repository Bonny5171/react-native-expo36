import Main from '../../screens/Main';
import Teste from '../../screens/Teste';
import LogOut from '../../screens/LogOut';
import Loading from '../../screens/Loading';
import TesteZoom from '../../screens/TesteZoom';
// import SyncPanel from '../../screens/SyncPanel';

import {
    Setup, Assistant,
    Campaigns, Catalog,
    Client, Clients,
    Dashboards, ListCatalog,
    Orders, Prices, Product, Carrinho,
    Carrinhos, Listagem, About, Order,
} from '../../pages';
// import testeCarousel from '../../pages/Catalog/testeCarousel';

export default {
  teste: {
    screen: Teste
  },
  def: {
    screen: Loading
  },
  main: {
    screen: Main
  },
  setup: {
    screen: Setup
  },
  assistant: {
    screen: Assistant
  },
  dashboard: {
    screen: Dashboards
  },
  campaigns: {
    screen: Campaigns
  },
  catalog: {
    screen: Catalog
  },
  client: {
    screen: Client
  },
  clients: {
    screen: Clients
  },
  listCatalog: {
    screen: ListCatalog
  },
  orders: {
    screen: Orders
  },
  order: {
    screen: Order
  },
  price: {
    screen: Prices
  },
  logOut: {
    screen: LogOut
  },
  product: {
    screen: Product
  },
  testeZoom: {
    screen: TesteZoom
  },
  carrinho: {
    screen: Carrinho
  },
  carrinhos: {
    screen: Carrinhos
  },
  listagem: {
    screen: Listagem
  },
  about: {
    screen: About
  },
  // testeCarousel: {
  //   screen: testeCarousel
  // },
};