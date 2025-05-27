require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Endpoint para obtener las respuestas de las IAs
app.post('/api/query', async (req, res) => {
    const { inputText } = req.body;
    
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const cohereApiKey = process.env.COHERE_API_KEY;
    const mistralApiKey = process.env.MISTRAL_API_KEY;

    if (!inputText || !inputText.trim()) {
        return res.status(400).json({ error: 'Por favor, proporciona un texto válido.' });
    }

    if (!geminiApiKey || !cohereApiKey || !mistralApiKey) {
        return res.status(500).json({ error: 'Faltan claves API necesarias. Verifica tu archivo .env' });
    }

    try {
        const geminiPromise = fetchGeminiResponse(inputText, geminiApiKey);
        const coherePromise = fetchCohereResponse(inputText, cohereApiKey);
        const mistralPromise = fetchMistralResponse(inputText, mistralApiKey);
        
        const [geminiResponse, cohereResponse, mistralResponse] = await Promise.all([
            geminiPromise, 
            coherePromise, 
            mistralPromise
        ]);
        
        res.json({
            gemini: geminiResponse,
            cohere: cohereResponse,
            mistral: mistralResponse
        });
    } catch (error) {
        console.error("Error en las solicitudes:", error);
        res.status(500).json({ error: 'Error al conectar con las APIs' });
    }
});

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

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});