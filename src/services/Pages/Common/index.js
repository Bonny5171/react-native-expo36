import * as queries from './Queries';

export const common = {
  ...queries
};

/*
  Convenções

  Nomes de métodos:
  (query || get || set || update)(nomeDoMetodo)

  query  = Retorna somente o objeto select do SQUEL
  get    = Retorna o(s) dado(s) já em array ou objeto para utilização nos componentes
  update = Padrão de update

  Queries base que são compartilhadas entre páginas ficam na pasta Common,
  Os gets recebem só o necessário para seu funcionamento básico
  Exemplo: queryBranches(id) que pega filiais de um cliente, só recebendo o id necessário

  Queries dinâmicas de acordo com store(redux) : vão ficar nos componentes mesmo.
  Exemplo:
  src/pages/Assitant/DefineClient.js > filterType() que possui algumas lógicas
  para adicionar filtrar com o .where() quando o cliente está definido.

*/
