// Nome do arquivo: code.ts

// Este plugin atua como uma ponte entre o Figma e um servidor host local (archon_host.py).
// Ele permite configurar a URL do host e enviar prompts para o Gemini CLI via o host.

// --- Comunicação com a UI (ui.html) ---

// Função principal do plugin
async function main() {
    // Mostra a UI do plugin
    figma.showUI(__html__);
    // Define o tamanho inicial da janela da UI
    figma.ui.resize(450, 480);

    // Tenta carregar a URL salva quando o plugin inicia
    const savedUrl = await figma.clientStorage.getAsync('archon-host-url');
    // Envia a URL salva para a UI preencher o campo de input
    // Isso garante que o campo da URL na UI mostre o valor salvo ao abrir o plugin
    figma.ui.postMessage({ type: 'initial-state', url: savedUrl });

    // Escuta mensagens vindas da UI (ui.html)
    figma.ui.onmessage = async (msg: { type: string, [key: string]: any }) => {
        console.log("➡️ Mensagem da UI:", msg);

        // --- Lógica para salvar a URL do Host ---
        if (msg.type === 'save-server-url') {
            const serverUrl = msg.url;
            if (serverUrl && typeof serverUrl === 'string' && serverUrl.trim() !== '') {
                // Removida a validação new URL() para evitar conflito de tipagem com dom
                await figma.clientStorage.setAsync('archon-host-url', serverUrl);
                figma.notify(`✅ URL do Host salvo: ${serverUrl}`);
            } else {
                figma.notify('❌ Erro: URL não pode ser vazia.', { error: true });
                 figma.ui.postMessage({ type: 'display-response', data: { error: 'URL não pode ser vazia.' } });
            }
        }

        // --- Lógica para executar o comando Gemini via Host ---
        if (msg.type === 'run-gemini-command') {
            // Recupera a URL salva do armazenamento local
            const hostUrl: string | undefined = await figma.clientStorage.getAsync('archon-host-url');

            if (!hostUrl) {
                figma.notify('❌ Erro: Configure e salve a URL do Dev Server primeiro.', { error: true });
                 figma.ui.postMessage({ type: 'display-response', data: { error: 'Configure e salve a URL do Dev Server primeiro.' } });
                return;
            }

            const prompt = msg.prompt;
            if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
                figma.notify('❌ Erro: O prompt não pode estar vazio.', { error: true });
                 figma.ui.postMessage({ type: 'display-response', data: { error: 'O prompt não pode estar vazio.' } });
                return;
            }

            try {
                figma.notify('🔄 Enviando comando para o Archon Host...');
                // Envia a requisição HTTP POST para a rota de teste síncrona no host
                const response = await fetch(`${hostUrl}/teste_gemini_sync`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: prompt }),
                });

                if (!response.ok) {
                    // Captura o corpo da resposta em caso de erro HTTP
                    const errorBody = await response.text();
                    throw new Error(`HTTP error! Status: ${response.status}, Body: ${errorBody}`);
                }

                const responseData = await response.json();
                console.log("🏠 Resposta do Host (sync test via HTTP):", responseData);
                // Envia a resposta para a UI exibir
                figma.ui.postMessage({ type: 'display-response', data: responseData });
                figma.notify('✅ Resposta do Host recebida.');

            } catch (error: any) {
                console.error("❌ Erro na comunicação com o Host:", error);
                figma.notify(`❌ Erro de comunicação com o Host: ${error.message}`, { error: true });
                // Envia a mensagem de erro para a UI exibir
                figma.ui.postMessage({ type: 'display-response', data: { error: error.message } });
            }
        }

        // --- Adicionar aqui manipuladores para outras mensagens da UI (ex: WebSocket) ---
        // if (msg.type === 'start-websocket-connection') {
        //   // Lógica para iniciar a conexão WebSocket (se a UI a gerenciar)
        // }
        // if (msg.type === 'send-websocket-message') {
        //   // Lógica para enviar mensagem via WebSocket (se a conexão for gerenciada aqui ou pela UI)
        // }
    };
}

// Inicia a execução do plugin
main();

// --- Removida lógica de WebSocket direta e evento codegen modificado ---
// A lógica de WebSocket será gerenciada pela UI (ui.html) ou por um módulo dedicado no futuro.
// A funcionalidade de codegen será adaptada para usar a comunicação com o host.

// figma.codegen.on("generate", async (event: CodegenEvent) => {
//   // A lógica de codegen será integrada com a comunicação do host
//   // ... obter dados do nó ...
//   // ... enviar para o host via HTTP ou WebSocket ...
//   // ... retornar o resultado do host ...
// });
