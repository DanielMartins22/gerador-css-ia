// Seleção do botão de gerar CSS
const buttonGenerate = document.getElementById('btn-gerar')
// Chave da API Groq para autenticação
let key = API_KEY;
// Endereço da API Groq para chat completions
let address = "https://api.groq.com/openai/v1/chat/completions"
console.log(buttonGenerate);

// Função assíncrona para gerar o código CSS via API
async function generateCode() {
    // Obtém o valor do textarea (descrição do usuário)
    const textArea = document.querySelector('textarea').value;
    // Seleciona o elemento onde o código será exibido
    const codegerate = document.querySelector(".code-paragraph")
    // Seleciona o iframe para o preview
    const resultCode = document.getElementById('preview-iframe')
    
    // Torna o main visível (grid) após o clique
    const main = document.querySelector('main')
    main.style.display = 'grid'

    // Faz a requisição para a API Groq
    let response = await fetch(address, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + key
        },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{
                role: "system",
                content: "Você é um gerador de código HTML e CSS. Responda SOMENTE com código puro. NUNCA use crases, markdown ou explicações. Formato: primeiro <style> com o CSS, depois o HTML. Siga EXATAMENTE o que o usuário pedir. Se pedir algo quicando, use translateY no @keyframes. Se pedir algo girando, use rotate."
            },
            {
                role: "user",
                content: textArea
            }

            ]
        })
    })

    // Processa a resposta JSON da API
    let dados = await response.json()
    // Extrai o conteúdo da mensagem gerada
    let filterDados = dados.choices[0].message.content

    // Adiciona estilos de centralização ao CSS gerado para evitar elementos no canto
    if (filterDados.includes('<style>')) {
        filterDados = filterDados.replace('<style>', '<style>html { height: 100%; } body { display: flex; justify-content: center; align-items: center; height: 100%; width: 100%; margin: 0; }');
    } else {
        // Se não houver <style>, adiciona um
        filterDados = '<style>html { height: 100%; } body { display: flex; justify-content: center; align-items: center; height: 100%; width: 100%; margin: 0; }</style>' + filterDados;
    }

    // Exibe o código gerado no parágrafo (agora com centralização)
    codegerate.textContent = filterDados
    // Define o srcdoc do iframe com o código para preview
    resultCode.srcdoc = filterDados
}

// Adiciona evento de clique ao botão para chamar a função generateCode
buttonGenerate.addEventListener('click', generateCode)