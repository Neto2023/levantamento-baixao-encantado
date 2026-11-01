# Como ligar o formulário à planilha

Tudo o que pede login é feito pelo Dr. Abrahão; o Claude Code nunca digita senha. Leva uns 5 minutos.

1. Abra a planilha **Levantamento Baixão Encantado**, na pasta Baixão Encantado do Google Drive.
2. Abra **Extensões** > **Apps Script**, apague o texto que vier no editor e cole todo o conteúdo de [`Code.gs`](Code.gs).
3. Clique em **Salvar projeto**.
4. Ao lado de **Executar**, escolha **prepararPlanilha** e clique em **Executar**.
5. Autorize com a sua conta. No aviso "O Google não verificou este app", clique em **Avançado** e no link de acesso ao projeto; depois em **Permitir**.
6. Clique em **Implantar** > **Nova implantação**, na engrenagem escolha **App da Web** e preencha:
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
7. Clique em **Implantar** e copie a **URL do app da Web**, que termina em `/exec`.
8. Passe essa URL ao Claude Code, que a coloca em `index.html`.

"Qualquer pessoa" permite responder sem login. A planilha continua visível só para o dono: o script apenas acrescenta linhas.
