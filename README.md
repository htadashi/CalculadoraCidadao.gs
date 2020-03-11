# CalculadoraCidadao.<span></span>gs

Script para usar a Calculadora do Cidadão do Banco Central em planilhas do Google Sheets.

## Instalação
1. Abra uma planilha no Google sheets 
2. Clique em **Ferramentas** &rsaquo; **Editor de script**
3. Copie o conteúdo de [`CalculadoraCidadao.gs`](https://raw.githubusercontent.com/cryptofinance-ai/cryptofinance-google-sheets-add-on/master/CRYPTOFINANCE.gs) e cole no editor
4. Salve o script com **Arquivo** &rsaquo; **Salvar** e nomeie como **CalculadoraCidadao**

## Comandos

* `CORRIGIR_SELIC(data_inicial;data_final;v)`: Obtém o valor *v* corrigido pela taxa SELIC a partir da data inicial *data_inicial* até a data final *data_final*.  A data inicial e a data final devem estar no formato DD/MM/AAAA.
* `CORRIGIR_CDI(data_inicial;data_final;perc_cdi;v)`:  Obtém o valor *v* corrigido pela taxa CDI com porcentagem *perc_cdi* a partir da data inicial *data_inicial* até a data final *data_final*.  A data inicial e a data final devem estar no formato DD/MM/AAAA.

## Disclaimer
O autor do script não assume qualquer responsabilidade por eventuais bugs, atrasos ou indisponibilidade de serviços de telecomunicação, interrupção, falha ou pelas imprecisões no fornecimento dos serviços ou informações. Não assume, também, responsabilidade por qualquer perda ou dano oriundo de tais interrupções, atrasos, falhas ou imperfeições, bem como pelo uso inadequado das informações fornecidas.
