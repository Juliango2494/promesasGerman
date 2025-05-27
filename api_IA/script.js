async function sendToAllAIs() {
    const inputText = document.getElementById('inputText').value;
    const responseContainer = document.getElementById('responseContainer');
    const loader = document.getElementById('loader');
    
    const geminiApiKey = GEMINI_API_KEY;
    const cohereApiKey = COHERE_API_KEY;
    const mistralApiKey = MISTRAL_API_KEY;

    if (!inputText.trim()) {
        responseContainer.innerHTML = "<div style='text-align: center; color: #666;'>Por favor, ingresa algún texto.</div>";
        return;
    }

    if (!geminiApiKey || !cohereApiKey || !mistralApiKey) {
        responseContainer.innerHTML = "<div style='text-align: center; color: red;'><strong>Error:</strong> Faltan claves API necesarias. Verifica tu archivo .env</div>";
        return;
    }

    responseContainer.innerHTML = ""; 
    loader.style.display = 'block'; 

    try {
        const geminiPromise = fetchGeminiResponse(inputText, geminiApiKey);
        const coherePromise = fetchCohereResponse(inputText, cohereApiKey);
        const mistralPromise = fetchMistralResponse(inputText, mistralApiKey);
        
        // Ejecutar las tres promesas en paralelo
        const [geminiResponse, cohereResponse, mistralResponse] = await Promise.all([
            geminiPromise, 
            coherePromise, 
            mistralPromise
        ]);
        
        // Mostrar las respuestas
        displayResponses(geminiResponse, cohereResponse, mistralResponse, responseContainer);
    } catch (error) {
        console.error("Error en las solicitudes:", error);
        responseContainer.innerHTML = "<div style='text-align: center; color: red;'>Error al conectar con las APIs. Revisa la consola para más detalles.</div>";
    } finally {
        loader.style.display = 'none'; 
    }
}

async function fetchGeminiResponse(inputText, apiKey) {
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const requestBody = {
        "contents": [
            {
                "parts": [
                    {
                        "text": inputText
                    }
                ]
            }
        ]
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error en la API de Gemini:", errorData);
            return {
                success: false,
                error: `Error: ${response.status} - ${errorData.error?.message || 'Error desconocido'}`
            };
        }

        const data = await response.json();

        if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
            return {
                success: true,
                text: data.candidates[0].content.parts[0].text
            };
        } else if (data.promptFeedback && data.promptFeedback.blockReason) {
            return {
                success: false,
                error: `Solicitud bloqueada: ${data.promptFeedback.blockReason}. Razón: ${data.promptFeedback.blockReasonMessage || 'No se proporcionó un mensaje específico.'}`
            };
        } else {
            console.log("Respuesta completa de la API Gemini:", data);
            return {
                success: false,
                error: "No se recibió contenido en la respuesta o la estructura es inesperada."
            };
        }
    } catch (error) {
        console.error("Error en la solicitud a Gemini:", error);
        return {
            success: false,
            error: "Error al conectar con la API de Gemini."
        };
    }
}

async function fetchCohereResponse(inputText, apiKey) {
    const API_URL = "https://api.cohere.ai/v1/generate";

    const requestBody = {
        "model": "command",
        "prompt": inputText,
        "max_tokens": 300,
        "temperature": 0.7,
        "k": 0,
        "stop_sequences": [],
        "return_likelihoods": "NONE"
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error en la API de Cohere:", errorData);
            return {
                success: false,
                error: `Error: ${response.status} - ${errorData.message || 'Error desconocido'}`
            };
        }

        const data = await response.json();

        if (data.generations && data.generations.length > 0 && data.generations[0].text) {
            return {
                success: true,
                text: data.generations[0].text.trim()
            };
        } else {
            console.log("Respuesta completa de la API Cohere:", data);
            return {
                success: false,
                error: "No se recibió contenido en la respuesta o la estructura es inesperada."
            };
        }
    } catch (error) {
        console.error("Error en la solicitud a Cohere:", error);
        return {
            success: false,
            error: "Error al conectar con la API de Cohere."
        };
    }
}

async function fetchMistralResponse(inputText, apiKey) {
    const API_URL = "https://api.mistral.ai/v1/chat/completions";

    const requestBody = {
        "model": "mistral-small-latest",
        "messages": [
            {
                "role": "user",
                "content": inputText
            }
        ],
        "max_tokens": 300,
        "temperature": 0.7
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error en la API de Mistral:", errorData);
            return {
                success: false,
                error: `Error: ${response.status} - ${errorData.error?.message || 'Error desconocido'}`
            };
        }

        const data = await response.json();

        if (data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
            return {
                success: true,
                text: data.choices[0].message.content
            };
        } else {
            console.log("Respuesta completa de la API Mistral:", data);
            return {
                success: false,
                error: "No se recibió contenido en la respuesta o la estructura es inesperada."
            };
        }
    } catch (error) {
        console.error("Error en la solicitud a Mistral:", error);
        return {
            success: false,
            error: "Error al conectar con la API de Mistral."
        };
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
