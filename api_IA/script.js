async function sendToAllAIs() {
    var inputText = document.getElementById('inputText').value;
    const responseContainer = document.getElementById('responseContainer');
    const loader = document.getElementById('loader');

    if (!inputText.trim()) {
        responseContainer.innerHTML = "<div style='text-align: center; color: #666;'>Por favor, ingresa algún texto.</div>";
        return;
    }

    responseContainer.innerHTML = ""; 
    loader.style.display = 'block'; 

    try {
        inputText = "Devuelve 'positivo' o 'negativo' (tal cual está entre comillas), sin ningun texto adicional y en español, si el siguiente promp de comentario es positivo o es negativo:" + inputText;
        const response = await fetch('/api/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ inputText })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error en el servidor');
        }

        const data = await response.json();
        displayResponses(data.gemini, data.cohere, data.mistral, responseContainer);
    } catch (error) {
        console.error("Error en las solicitudes:", error);
        responseContainer.innerHTML = `<div style='text-align: center; color: red;'>Error: ${error.message}</div>`;
    } finally {
        loader.style.display = 'none'; 
    }
}

function interpretarRespuesta(nombreIA, respuestaObj) {
    if (!respuestaObj.success) {
        return `<span style="color: red;">${respuestaObj.error}</span>`;
    }

    const texto = respuestaObj.text.toLowerCase();

    if (texto.includes("positivo")) {
        return `La IA <strong>${nombreIA}</strong> indica que el comentario fue <strong style="color: green;">positivo</strong>.`;
    } else if (texto.includes("negativo")) {
        return `La IA <strong>${nombreIA}</strong> indica que el comentario fue <strong style="color: red;">negativo</strong>.`;
    } else {
        return `La IA <strong>${nombreIA}</strong> devolvió una respuesta no reconocida: "${respuestaObj.text}"`;
    }
}

function displayResponses(geminiResponse, cohereResponse, mistralResponse, container) {
    container.innerHTML = `
        <div class="response-box gemini">
            <h3>🔷 Respuesta de Gemini</h3>
            <div>${interpretarRespuesta("Gemini", geminiResponse)}</div>
        </div>
        
        <div class="response-box cohere">
            <h3>🟠 Respuesta de Cohere</h3>
            <div>${interpretarRespuesta("Cohere", cohereResponse)}</div>
        </div>
        
        <div class="response-box mistral">
            <h3>🟣 Respuesta de Mistral</h3>
            <div>${interpretarRespuesta("Mistral", mistralResponse)}</div>
        </div>
    `;
}
