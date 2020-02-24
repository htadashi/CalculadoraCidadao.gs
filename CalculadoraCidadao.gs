/*====================================================================================================================================*
  CalculadoraCidadao.gs by Hugo Tadashi
  ====================================================================================================================================
  Version:      0.1.1
  Project Page: https://github.com/
  Copyright:    (c) 2020 by Hugo Tadashi
  License:      MIT License
                https://opensource.org/licenses/MIT
  ------------------------------------------------------------------------------------------------------------------------------------
  /* TODO:
   * 1 - Modificar a função parseResponse para usar XPath com a biblioteca cheeriogs (github.com/bibliobibulus/cheeriogs)?
   */

/**
 * Usa expressão regular para fazer análise do retorno  
 * @OnlyCurrentDoc
 */
function parseResponse(html){
  
  const regex = /Valor\s*corrigido\s*na\s*data\s*final\s*\<.*\>R\$\s*(\d*\.?\d*\,?\d*)/gsm;
  var match = regex.exec(html);
  var valor = match[1];   
  
  if(SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetLocale() == 'pt_BR'){        
    
  }else{
    valor = valor.replace('.','');
    a_valor = valor.split(',');
    int_valor  = a_valor[0];
    frac_valor = a_valor[1].substring(0,2);
    valor = parseFloat(a_valor[0]) + (parseFloat(a_valor[1])/100);
    valor = valor.toLocaleString();
  }
  return valor;
}

/**
 * Obtém valor corrigido pela SELIC a partir da calculadora do cidadão do BCB
 *
 * @param {data_inicial} Data inicial no formado "DD/MM/AAAA"
 * @param {data_final}   Data final no formado "DD/MM/AAAA"
 * @param {valor}        Valor a ser corrigido pelo SELIC
 * @customFunction
 *
 * @return Valor corrigido 
 */
function CORRIGIR_SELIC(data_inicial, data_final, valor) {

  valor_br = valor.toLocaleString('pt-BR');
  // POST request 
  var formData = {
    'dataInicial': data_inicial,
    'dataFinal': data_final,
    'valorCorrecao': valor_br
  };
  
  var options = {
    'method' : 'post',
    'payload' : formData
  };
  var response = UrlFetchApp.fetch('https://www3.bcb.gov.br/CALCIDADAO/publico/corrigirPelaSelic.do?method=corrigirPelaSelic', options);
  var html = response.getContentText(); 
  var valor = parseResponse(html);  

  return valor;  
}

/**
 * Obtém valor corrigido pelo CDI a partir da calculadora do cidadão do BCB
 *
 * @param {data_inicial} Data inicial no formado "DD/MM/AAAA"
 * @param {data_final}   Data final no formado "DD/MM/AAAA"
 * @param {valor}        Valor a ser corrigido pelo CDI
 * @param {CDI}          Percentual do CDI (de 0% a 100%)
 * @customFunction
 *
 * @return Valor corrigido 
 */
function CORRIGIR_CDI(data_inicial, data_final, valor, CDI) {
  
  valor_br = valor.toLocaleString('pt-BR');
  // POST request 
  var formData = {
    'dataInicial': data_inicial,
    'dataFinal': data_final,
    'valorCorrecao': valor_br,
    'percentualCorrecao': CDI
  };
  
  var options = {
    'method' : 'post',
    'payload' : formData
  };
  var response = UrlFetchApp.fetch('https://www3.bcb.gov.br/CALCIDADAO/publico/corrigirPeloCDI.do?method=corrigirPeloCDI', options);
  var html = response.getContentText(); 
  var valor = parseResponse(html);    

  return valor;  
}
