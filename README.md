# CalculadoraCidadao.gs

Script para usar a [Calculadora do Cidadão do Banco Central](https://www3.bcb.gov.br/CALCIDADAO/publico/exibirFormCorrecaoValores.do?method=exibirFormCorrecaoValores) em planilhas do Google Sheets.

## Instalação

1. Abra uma planilha no Google sheets 
2. Clique em **Ferramentas** &rsaquo; **Editor de script**
3. Copie o conteúdo de [CalculadoraCidadao.gs](CalculadoraCidadao.gs) e cole no editor
4. Salve o script com **Arquivo** &rsaquo; **Salvar** e nomeie como **CalculadoraCidadao**

## Comandos

### CORRIGIR_SELIC

Obtém valor corrigido pela SELIC.

#### Sintaxe

`CORRIGIR_SELIC(data_inicial; data_final; valor)`

 * data_inicial - Data inicial.
 * data_final - Data final.
 * valor - Valor a ser corrigido pela SELIC.

### CORRIGIR_CDI

Obtém valor corrigido pelo CDI.

#### Sintaxe

`CORRIGIR_CDI(data_inicial; data_final; valor; cdi)`

 * data_inicial - Data inicial.
 * data_final - Data final.
 * valor - Valor a ser corrigido pelo CDI.
 * cdi - Percentual do CDI (de 0 a 100).

### CORRIGIR_TR

Obtém valor corrigido pela TR.

#### Sintaxe

`CORRIGIR_TR(data_inicio_serie; data_vencimento_serie; valor; data_efetivo_pagamento)`

 * `data_inicio_serie` - Data do início da série (inclui a taxa do mês inicial).
 * `data_vencimento_serie` - Data do vencimento da série.
 * `valor` - Valor a ser corrigido pela TR.
 * `data_efetivo_pagamento` - Data do efetivo pagamento (atraso).

### CORRIGIR_POUPANCA

Obtém valor corrigido pela remuneração da poupança.

#### Sintaxe

`CORRIGIR_POUPANCA(data_inicial; data_final; valor; [regra_nova])`

 * `data_inicial` - Data inicial.
 * `data_final` - Data final.
 * `valor` - Valor a ser corrigido pela remuneração da poupança.
 * `regra_nova` - [`TRUE` por padrão] - `TRUE`: depósitos a partir de 4/5/2012; `FALSE`: depósitos até 3/5/2012.

### CORRIGIR_INDICE_DE_PRECO

Obtém valor corrigido por um índice de preço (IGP-DI, INPC, IPCA, IPC-E, IPC-BRASIL e IPC-SP).

#### Sintaxe

`CORRIGIR_INDICE_DE_PRECO(mes_inicial; mes_final; valor; indice_de_preco)`

 * `mes_inicial` - Mês inicial.
 * `mes_final` - Mês final.
 * `valor` - Valor a ser corrigido pelo índice de preço.
 * `indice_de_preco` - Índice de preço (texto): IGP-DI, INPC, IPCA, IPC-E, IPC-BRASIL ou IPC-SP.
