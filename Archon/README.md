# 🌉 Archon Figma Bridge

**Archon Figma Bridge** é um plugin para o Figma e um servidor host local que criam uma ponte de comunicação direta entre o ambiente de design do Figma e o poder de geração de código do Gemini CLI. Este projeto é um componente central do ecossistema Archon AI, aplicando sua filosofia de governança, controle e automação supervisionada diretamente no processo criativo.

## 🎯 Descrição do Projeto

O objetivo deste projeto é eliminar a necessidade de ferramentas de "design-para-código" de terceiros, construindo nossa própria solução integrada. Isso nos dá controle total sobre o fluxo, permitindo que o desenvolvedor, atuando como supervisor, utilize o Gemini CLI para analisar, refatorar e gerar código a partir de contextos de design de forma precisa e rastreável.

A arquitetura consiste em:
1.  **Plugin Figma (Frontend):** Uma interface de usuário construída com HTML/TypeScript que roda dentro do Figma, permitindo ao usuário configurar o host e enviar prompts.
2.  **Servidor Host Local (Backend):** Um servidor leve em Python (Flask) que recebe requisições do plugin, executa comandos do Gemini CLI via `subprocess` e retorna os resultados.

## ✨ Funcionalidades

* **Host Configurável:** Permite que o usuário defina e salve a URL do servidor host local, garantindo flexibilidade no ambiente de desenvolvimento.
* **Envio de Prompts:** Envia prompts de texto diretamente do Figma para serem processados pelo Gemini CLI no ambiente local.
* **Visualização de Respostas:** Exibe a resposta retornada pelo Gemini CLI diretamente na UI do plugin dentro do Figma.
* **Comunicação Segura:** Utiliza CORS para garantir que a comunicação entre o domínio do Figma e o `localhost` seja permitida e segura.

## 📋 Pré-requisitos

Antes de começar, garanta que você tenha os seguintes softwares instalados:
* [Node.js](https://nodejs.org/) (versão LTS recomendada) para o desenvolvimento do plugin.
* [Python](https://www.python.org/) (versão 3.8 ou superior) para o servidor host local.
* [Figma Desktop App](https://www.figma.com/downloads/) para instalar e rodar o plugin.
* [Gemini CLI](https://ai.google.dev/docs/gemini_cli_quickstart) devidamente instalado e configurado com sua chave de API.

## ⚙️ Configuração

Siga estes passos para configurar o ambiente de desenvolvimento completo.

### 1. Clonar o Repositório

```bash
git clone [https://github.com/RogerioMatos75/Archon_Figma.git](https://github.com/RogerioMatos75/Archon_Figma.git)
cd Archon_Figma
```

### 2. Configurar o Servidor Host Local (Python)

```bash
# Crie e ative um ambiente virtual
python -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate

# Crie um arquivo requirements.txt com o seguinte conteúdo:
# flask
# flask-socketio
# flask-cors

# Instale as dependências
pip install -r requirements.txt
```

### 3. Configurar o Plugin do Figma (Node.js/TypeScript)

```bash
# Navegue até a pasta do plugin (supondo que ela exista no repositório)
cd figma-plugin

# Instale as dependências do Node.js
npm install

# Compile o plugin
npm run build
```

### 4. Instalar o Plugin no Figma

1.  Abra o aplicativo Figma Desktop.
2.  Vá para `Plugins` > `Development` > `Import plugin from manifest...`.
3.  Navegue até a pasta `figma-plugin` do seu projeto e selecione o arquivo `manifest.json`.
4.  O plugin "Archon Figma Bridge" agora estará disponível no seu menu de desenvolvimento.

## 🚀 Como Usar

1.  **Iniciar o Host Local:** Em um terminal, com o ambiente virtual ativado, inicie o servidor Flask:
    ```bash
    python archon_host.py
    ```
    O servidor estará rodando em `http://127.0.0.1:5001`.

2.  **Executar o Plugin no Figma:**
    * No Figma, clique com o botão direito em qualquer lugar do canvas.
    * Vá para `Plugins` > `Development` > `Archon Figma Bridge` para abrir a UI do plugin.

3.  **Configurar a URL do Host:**
    * Na UI do plugin, no campo "Dev Server URL", verifique se o endereço `http://127.0.0.1:5001` está preenchido.
    * Clique em "Salvar & Conectar". Você deverá ver uma notificação de sucesso.

4.  **Enviar Prompts:**
    * Digite um comando no campo "Prompt para Gemini CLI".
    * Clique em "Executar Comando".
    * Aguarde e visualize a resposta do servidor no painel "Resposta do Host".

## 📂 Estrutura do Projeto

```
Archon_Figma/
├── figma-plugin/             # Código-fonte do plugin do Figma
│   ├── ui.html               # A interface visual do plugin (HTML/CSS/JS)
│   ├── code.ts               # A lógica principal do plugin (TypeScript)
│   └── manifest.json         # O arquivo de manifesto do plugin
├── archon_host.py            # O servidor host local em Python/Flask
├── places_client.py          # Módulo cliente para APIs (Ex: Google Places)
├── requirements.txt          # Dependências do Python
└── README.md                 # Este arquivo
```

## 🔮 Próximos Passos

O plano de evolução para este projeto inclui:
-   [ ] Implementar a comunicação **assíncrona** com WebSockets para tarefas longas.
-   [ ] Adicionar a capacidade do plugin de **extrair dados do design** (cores, fontes, estrutura de layers) e enviá-los como contexto para o Gemini CLI.
-   [ ] Criar uma biblioteca de **prompts pré-definidos** na UI para ações comuns (refatorar, documentar, etc.).
-   [ ] Integrar o **Agente Prospector** como um módulo dedicado na UI.

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor, abra uma issue para discutir o que você gostaria de mudar ou envie um pull request.

## 📄 Licença

Este projeto está licenciado sob a Licença MIT.

