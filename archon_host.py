# Nome do arquivo: archon_host.py

from flask import Flask, jsonify, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import subprocess # Módulo para executar comandos do terminal (o Gemini CLI)
import os # Para acessar variáveis de ambiente, se necessário

# -------------------- CONFIGURAÇÃO INICIAL --------------------
app = Flask(__name__)
# A chave secreta é necessária para as sessões do SocketIO
# Recomenda-se usar uma variável de ambiente em produção
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'seu-segredo-super-secreto!')

# Habilita o CORS especificamente para a origem do Figma
# Permite credenciais para suportar cookies (se necessário no futuro)
CORS(app, resources={r"/*": {"origins": "https://www.figma.com"}}, supports_credentials=True)


# Inicializa o SocketIO
# O modo assíncrono "threading" é simples e suficiente para nosso caso de uso inicial
# Em produção, pode-se considerar eventlet ou gevent para maior escalabilidade
socketio = SocketIO(app, cors_allowed_origins="https://www.figma.com")


# -------------------- ROTAS E EVENTOS --------------------

@app.route('/')
def index():
    """ Rota básica para verificar se o servidor está no ar. """
    return jsonify({"status": "Archon Host Local está no ar e aguardando conexões.", "version": "1.0"})

@socketio.on('connect')
def handle_connect():
    """ Evento disparado quando o plugin do Figma se conecta ao nosso host. """
    print('✅ Plugin do Figma conectado com sucesso!')
    # Opcional: Enviar uma mensagem de volta para o plugin confirmando a conexão
    emit('host-status', {'status': 'connected', 'message': 'Conectado ao Archon Host Local'})

@socketio.on('disconnect')
def handle_disconnect():
    """ Evento disparado quando o plugin do Figma se desconecta. """
    print('🔌 Plugin do Figma desconectado.')
    # Opcional: Lidar com a desconexão, limpar recursos, etc.

# --- Opção A: Rota HTTP síncrona para teste do Gemini CLI ---
@app.route('/teste_gemini_sync', methods=['POST'])
def teste_gemini_sync():
    """
    Rota de teste síncrona para executar um comando básico do Gemini CLI.
    Recebe um prompt e retorna o resultado diretamente.
    """
    data = request.json
    if not data or 'prompt' not in data:
        return jsonify({"error": "JSON inválido ou 'prompt' ausente"}), 400

    prompt = data['prompt']
    print(f"🔄 Recebido pedido de teste síncrono com prompt: {prompt}")

    try:
        # Construa o comando para o Gemini CLI
        # Assumindo que 'gemini' está no PATH e pronto para receber o prompt
        command = ["gemini", prompt]

        # Execute o comando no terminal
        # capture_output=True captura stdout e stderr
        # text=True decodifica a saída como texto
        # check=True levanta uma exceção se o comando retornar um código de erro
        result = subprocess.run(command, capture_output=True, text=True, check=True)

        print("✅ Comando Gemini CLI executado com sucesso.")
        print("--- stdout ---")
        print(result.stdout)
        print("--- stderr ---")
        print(result.stderr)

        # Retorne a saída padrão do comando como resposta
        return jsonify({"status": "success", "output": result.stdout, "error": result.stderr}), 200

    except FileNotFoundError:
        print("❌ Erro: Comando 'gemini' não encontrado. Certifique-se de que o Gemini CLI está instalado e no PATH.")
        return jsonify({"status": "error", "message": "Gemini CLI não encontrado. Verifique a instalação e o PATH."}), 500
    except subprocess.CalledProcessError as e:
        print(f"❌ Erro ao executar o comando Gemini CLI: {e}")
        print("--- stdout ---")
        print(e.stdout)
        print("--- stderr ---")
        print(e.stderr)
        return jsonify({"status": "error", "message": f"Erro na execução do Gemini CLI: {e.stderr}", "output": e.stdout}), 500
    except Exception as e:
        print(f"❌ Ocorreu um erro inesperado: {e}")
        return jsonify({"status": "error", "message": f"Erro interno do servidor: {e}"}), 500


# Aqui adicionaremos os eventos WebSocket para a lógica assíncrona (Opção B)


# -------------------- EXECUÇÃO DO SERVIDOR --------------------

if __name__ == '__main__':
    print("🚀 Iniciando o servidor Host Local do Archon em http://127.0.0.1:5001")
    print("Aguardando conexões do plugin do Figma...")
    # O host 0.0.0.0 torna o servidor acessível na sua rede local
    # Permite conexões de outras máquinas na mesma rede (útil para testes)
    # Em produção, considere restringir o host se necessário
    socketio.run(app, host='0.0.0.0', port=5001, debug=True) # debug=True para desenvolvimento
