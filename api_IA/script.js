async function sendToGemini() {
    const inputText = document.getElementById('inputText').value;
    const responseContainer = document.getElementById('responseContainer');
    const loader = document.getElementById('loader');
    
    // Extraer las API keys del entorno
    const geminiApiKey = GEMINI_API_KEY;
    const openaiApiKey = OPEN_API_KEY;
    if (!inputText.trim()) {
        responseContainer.textContent = "Por favor, ingresa algún texto.";
        return;
    }

    if (!geminiApiKey || !openaiApiKey) {
        responseContainer.innerHTML = "<strong>Error:</strong> Faltan claves API necesarias.";
        return;
    }

    responseContainer.textContent = ""; // Limpiar respuesta anterior
    loader.style.display = 'block'; // Mostrar loader

    try {
        // Crear ambas promesas
        const geminiPromise = fetchGeminiResponse(inputText, geminiApiKey);
        const openaiPromise = fetchOpenAIResponse(inputText, openaiApiKey);
        
        // Ejecutar ambas promesas en paralelo
        const [geminiResponse, openaiResponse] = await Promise.all([geminiPromise, openaiPromise]);
        
        // Mostrar las respuestas
        displayResponses(geminiResponse, openaiResponse, responseContainer);
    } catch (error) {
        console.error("Error en las solicitudes:", error);
        responseContainer.textContent = "Error al conectar con las APIs. Revisa la consola para más detalles.";
    } finally {
        loader.style.display = 'none'; // Ocultar loader
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

async function fetchOpenAIResponse(inputText, apiKey) {
    const API_URL = "https://api.openai.com/v1/chat/completions";

    const requestBody = {
        "model": "gpt-3.5-turbo",
        "messages": [
            {
                "role": "user",
                "content": inputText
            }
        ]
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
            console.error("Error en la API de OpenAI:", errorData);
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
            console.log("Respuesta completa de la API OpenAI:", data);
            return {
                success: false,
                error: "No se recibió contenido en la respuesta o la estructura es inesperada."
            };
        }
    } catch (error) {
        console.error("Error en la solicitud a OpenAI:", error);
        return {
            success: false,
            error: "Error al conectar con la API de OpenAI."
        };
    }
}

function displayResponses(geminiResponse, openaiResponse, container) {
    container.innerHTML = `
        <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 8px;">
            <h3 style="margin-top: 0;">Respuesta de Gemini:</h3>
            <div>${geminiResponse.success ? geminiResponse.text : `<span style="color: red;">${geminiResponse.error}</span>`}</div>
        </div>
        
        <div style="padding: 15px; border: 1px solid #ddd; border-radius: 8px;">
            <h3 style="margin-top: 0;">Respuesta de OpenAI:</h3>
            <div>${openaiResponse.success ? openaiResponse.text : `<span style="color: red;">${openaiResponse.error}</span>`}</div>
        </div>
    `;
}