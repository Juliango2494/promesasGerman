async function sendToAllAIs() {
    const inputText = document.getElementById('inputText').value;
    const responseContainer = document.getElementById('responseContainer');
    const loader = document.getElementById('loader');

    if (!inputText.trim()) {
        responseContainer.innerHTML = "<div style='text-align: center; color: #666;'>Por favor, ingresa algún texto.</div>";
        return;
    }

    responseContainer.innerHTML = ""; 
    loader.style.display = 'block'; 

    try {
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

function displayResponses(geminiResponse, cohereResponse, mistralResponse, container) {
    container.innerHTML = `
        <div class="response-box gemini">
            <h3>🔷 Respuesta de Gemini</h3>
            <div>${geminiResponse.success ? geminiResponse.text.replace(/\n/g, '<br>') : `<span style="color: red;">${geminiResponse.error}</span>`}</div>
        </div>
        
        <div class="response-box cohere">
            <h3>🟠 Respuesta de Cohere</h3>
            <div>${cohereResponse.success ? cohereResponse.text.replace(/\n/g, '<br>') : `<span style="color: red;">${cohereResponse.error}</span>`}</div>
        </div>
        
        <div class="response-box mistral">
            <h3>🟣 Respuesta de Mistral</h3>
            <div>${mistralResponse.success ? mistralResponse.text.replace(/\n/g, '<br>') : `<span style="color: red;">${mistralResponse.error}</span>`}</div>
        </div>
    `;
}
