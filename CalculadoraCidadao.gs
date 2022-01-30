/*====================================================================================================================================*
  CalculadoraCidadao.gs
  ====================================================================================================================================
  Version:      0.2.2
  Project Page: https://github.com/htadashi/CalculadoraCidadao.gs
  Copyright:    (c) 2020 by Hugo Tadashi
                (c) 2020 by André Pereira Henriques
  License:      MIT License
                https://opensource.org/licenses/MIT
  ------------------------------------------------------------------------------------------------------------------------------------

/**
 * @OnlyCurrentDoc
 */
function parseResponse(html) {
  const regex = /Valor\s*corrigido\s*na\s*data\s*final.*\>R\$\D*(\d*\,?\d*)/gsm;
  const match = regex.exec(html.replaceAll('.', ''));
  const stringValorPtBr = match[1];
  const partesInteiraEFracionaria = stringValorPtBr.split(',');
  const valor = parseInt(partesInteiraEFracionaria[0]) + (parseInt(partesInteiraEFracionaria[1])/100.0);
  return valor;
}

/**
 * @OnlyCurrentDoc
 */
function obterFormDataPorData(dataInicial, dataFinal, valor, formDataExtra = {}) {
  const formDataBasico = {
    'dataInicial': Utilities.formatDate(dataInicial, 'GMT', 'dd/MM/yyyy'),
    'dataFinal': Utilities.formatDate(dataFinal, 'GMT', 'dd/MM/yyyy'),
    'valorCorrecao': valor.toLocaleString('pt-BR')
  };
  const formData = {...formDataBasico, ...formDataExtra};
  return formData;
}

/**
 * @OnlyCurrentDoc
 */
function obterValor(method, formData) {
  const options = {
    'method': 'post',
    'payload': formData
  };
  try{
    const response = UrlFetchApp.fetch(`https://www3.bcb.gov.br/CALCIDADAO/publico/${method}.do?method=${method}`, options);
    const html = response.getContentText();
    const valorCorrigido = parseResponse(html);
    return valorCorrigido;
  }catch{
      throw new Error('conexão com site do BCB com problemas');
  }
}

/**
 * Obtém valor corrigido pela SELIC a partir da calculadora do cidadão do BCB
 *
 * @param {Date} data_inicial - Data inicial
 * @param {Date} data_final   - Data final
 * @param {number} valor      - Valor a ser corrigido pela SELIC
 * @customFunction
 *
 * @returns {number} Valor corrigido
 */
function CORRIGIR_SELIC(data_inicial, data_final, valor) {
  const formData = obterFormDataPorData(data_inicial, data_final, valor);
  const valorCorrigido = obterValor('corrigirPelaSelic', formData);
  return valorCorrigido;
}

/**
 * Obtém valor corrigido pelo CDI a partir da calculadora do cidadão do BCB
 *
 * @param {Date} data_inicial - Data inicial
 * @param {Date} data_final   - Data final
 * @param {number} valor      - Valor a ser corrigido pelo CDI
 * @param {number} cdi        - Percentual do CDI (de 0 a 100)
 * @customFunction
 *
 * @returns {number} Valor corrigido
 */
function CORRIGIR_CDI(data_inicial, data_final, valor, cdi) {
  const formDataExtra = {'percentualCorrecao': cdi.toLocaleString('pt-BR')};
  const formData = obterFormDataPorData(data_inicial, data_final, valor, formDataExtra);
  const valorCorrigido = obterValor('corrigirPeloCDI', formData);
  return valorCorrigido;
}

/**
 * Obtém valor corrigido pela TR a partir da calculadora do cidadão do BCB
 *
 * @param {Date} data_inicio_serie      - Data do início da série (inclui a taxa do mês inicial)
 * @param {Date} data_vencimento_serie  - Data do vencimento da série
 * @param {number} valor                - Valor a ser corrigido pela TR
 * @param {Date} data_efetivo_pagamento - Data do efetivo pagamento (atraso)
 * @customFunction
 *
 * @returns {number} Valor corrigido
 */
function CORRIGIR_TR(data_inicio_serie, data_vencimento_serie, valor, data_efetivo_pagamento) {
  const formData = {
    'dataInicioSerie': Utilities.formatDate(data_inicio_serie, 'GMT', 'dd/MM/yyyy'),
    'dataVencimentoSerie': Utilities.formatDate(data_vencimento_serie, 'GMT', 'dd/MM/yyyy'),
    'valorCorrecao': valor.toLocaleString('pt-BR'),
    'dataEfetivoPagamento': Utilities.formatDate(data_efetivo_pagamento, 'GMT', 'dd/MM/yyyy')
  };
  const valorCorrigido = obterValor('corrigirPelaTR', formData);
  return valorCorrigido;
}

/**
 * Obtém valor corrigido pela remuneração da poupança a partir da calculadora do cidadão do BCB
 *
 * @param {Date} data_inicial         - Data inicial
 * @param {Date} data_final           - Data final
 * @param {number} valor              - Valor a ser corrigido pela remuneração da poupança
 * @param {boolean} [regra_nova=true] - Regra de correção nova
 * @customFunction
 *
 * @returns {number} Valor corrigido
 */
function CORRIGIR_POUPANCA(data_inicial, data_final, valor, regra_nova = true) {
  const formDataExtra = {'regraNova': regra_nova.toString()};
  const formData = obterFormDataPorData(data_inicial, data_final, valor, formDataExtra);
  const valorCorrigido = obterValor('corrigirPelaPoupanca', formData);
  return valorCorrigido;
}

/**
 * Obtém valor corrigido por um índice de preço (IGP-M, IGP-DI, INPC, IPCA, IPC-E, IPC-BRASIL e IPC-SP) a partir da calculadora do cidadão do BCB
 *
 * @param {Date} mes_inicial       - Mês inicial
 * @param {Date} mes_final         - Mês final
 * @param {number} valor           - Valor a ser corrigido pelo índice de preço
 * @param {string} indice_de_preco - Índice de preço (IGP-M, IGP-DI, INPC, IPCA, IPC-E, IPC-BRASIL e IPC-SP)
 * @customFunction
 *
 * @returns {number} Valor corrigido
 */
function CORRIGIR_INDICE_DE_PRECO(mes_inicial, mes_final, valor, indice_de_preco) {
  const codigosIndices = {
    'IGP-M': '28655IGP-M',
    'IGP-DI': '00190IGP-DI',
    'INPC': '00188INPC',
    'IPCA': '00433IPCA',
    'IPCA-E': '10764IPC-E',
    'IPC-BRASIL': '00191IPC-BRASIL',
    'IPC-SP': '00193IPC-SP'
  };
  const codigo = codigosIndices[indice_de_preco];
  if (codigo !== undefined) {
    const formData = {
      'dataInicial': Utilities.formatDate(mes_inicial, 'GMT', 'MM/yyyy'),
      'dataFinal': Utilities.formatDate(mes_final, 'GMT', 'MM/yyyy'),
      'valorCorrecao': valor.toLocaleString('pt-BR'),
      'selIndice': codigo
    };
    const valorCorrigido = obterValor('corrigirPorIndice', formData);
    return valorCorrigido;
  } else {
    throw new Error('indice_de_preco inválido');
  }
}

/**
 * @OnlyCurrentDoc
 */
function teste() {
  const selic = CORRIGIR_SELIC(new Date(2019, 11, 2), new Date(2020, 0, 2), 100); // 100.37
  const cdi = CORRIGIR_CDI(new Date(2019, 11, 2), new Date(2020, 0, 2), 100, 100); // 100.37
  const tr = CORRIGIR_TR(new Date(2008, 11, 2), new Date(2020, 0, 2), 100, new Date(2020, 0, 3)); // 109.15
  const poupancaNova = CORRIGIR_POUPANCA(new Date(2019, 11, 2), new Date(2020, 0, 2), 100, true); // 100.29
  const poupancaAntiga = CORRIGIR_POUPANCA(new Date(2019, 11, 2), new Date(2020, 0, 2), 100, false); // 100.5
  const igpm = CORRIGIR_INDICE_DE_PRECO(new Date(2019, 11), new Date(2020, 0), 100, 'IGP-M'); // 102.58
  const igpdi = CORRIGIR_INDICE_DE_PRECO(new Date(2019, 11), new Date(2020, 0), 100, 'IGP-DI'); // 101.83
  const inpc = CORRIGIR_INDICE_DE_PRECO(new Date(2019, 11), new Date(2020, 0), 100, 'INPC'); // 101.41
  const ipca = CORRIGIR_INDICE_DE_PRECO(new Date(2019, 11), new Date(2020, 0), 100, 'IPCA'); // 101.36
  const ipcae = CORRIGIR_INDICE_DE_PRECO(new Date(2019, 11), new Date(2020, 0), 100, 'IPCA-E'); // 101.77
  const ipcbrasil = CORRIGIR_INDICE_DE_PRECO(new Date(2019, 11), new Date(2020, 0), 100, 'IPC-BRASIL'); // 101.36
  const ipcsp = CORRIGIR_INDICE_DE_PRECO(new Date(2019, 11), new Date(2020, 0), 100, 'IPC-SP'); // 101.23
}
