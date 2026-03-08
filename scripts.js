// Seleção do botão de gerar CSS
const buttonGenerate = document.getElementById('btn-gerar');
// Chave da API Groq para autenticação
let key = API_KEY; // Substitua pela sua chave real
// Endereço da API Groq para chat completions
let address = "https://api.groq.com/openai/v1/chat/completions";

buttonGenerate.addEventListener('click', generateCode);

// Função assíncrona para gerar o código CSS via API
async function generateCode() {
    // Obtém o valor do textarea (descrição do usuário)
    const textArea = document.querySelector('textarea').value;
    // Seleciona o elemento onde o código será exibido
    const codegerate = document.querySelector(".code-paragraph");
    // Seleciona o iframe para o preview
    const resultCode = document.getElementById('preview-iframe');
    // Seleciona o main para mostrar
    const main = document.querySelector('main');

    // Mostra o main adicionando a classe .show (controle via CSS)
    main.classList.add('show');

    // Faz a requisição para a API Groq
    let response = await fetch(address, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + key
        },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: "Você é um gerador de código HTML e CSS. Responda SOMENTE com código puro. NUNCA use crases, markdown ou explicações. Formato: primeiro <style> com o CSS, depois o HTML. Siga EXATAMENTE o que o usuário pedir. Se pedir algo quicando, use translateY no @keyframes. Se pedir algo girando, use rotate."
                },
                {
                    role: "user",
                    content: textArea
                }
            ]
        })
    });

    // Processa a resposta JSON da API
    let dados = await response.json();
    // Extrai o conteúdo da mensagem gerada
    let filterDados = dados.choices[0].message.content;

    // Injeta CSS para centralizar o conteúdo no iframe
    if (filterDados.includes('<style>')) {
        filterDados = filterDados.replace('<style>', `<style>
        body {
            width: 100%;
            min-height: 100vh;
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;}`
        );
    } else {
        filterDados = `<style>
        body {
            width: 100%;
            min-height: 100vh;
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
        }</style>` + filterDados;
    }

    // Exibe o código gerado no parágrafo (texto puro, sem interpretar HTML)
    codegerate.textContent = filterDados;

    // Atualiza o srcdoc do iframe para mostrar o preview
    resultCode.srcdoc = filterDados;

    // Garante que o foco volte ao botão para evitar problemas de clique duplo
    buttonGenerate.focus();
}