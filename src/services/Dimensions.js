import { Dimensions } from 'react-native';

const obterLarguraDaPagina = () => {
  const window = Dimensions.get('window');
  const { width } = window;
  const menuFerramenta = 100;
  const paddingLeft = 25;

  return width - menuFerramenta - paddingLeft;
};

const obterQuantidaDeCaixas = width => {
  const tamMinimo = 220;
  const larguraDaPagina = obterLarguraDaPagina(width);

  return Math.floor(larguraDaPagina / tamMinimo);
};

const obterLarguraDasCaixas = width => {
  const larguraDaPagina = obterLarguraDaPagina(width);
  const qtdDeCaixasPorLinha = obterQuantidaDeCaixas(width);
  const margemFixa = 25;

  return Math.floor((larguraDaPagina - margemFixa - qtdDeCaixasPorLinha * margemFixa) / qtdDeCaixasPorLinha);
};

export { obterLarguraDaPagina, obterLarguraDasCaixas, obterQuantidaDeCaixas };
