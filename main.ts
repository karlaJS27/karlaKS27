
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from 'zod'

// 1. Crear el servidor MCP
const server = new McpServer({
    name: 'Demo',
    version: '1.0.0',
    

});

//2. Herramientas
server.tool(
    'fetch-weather', //titulo
    'Tool to fetch the weather of a city', //descripcion
    {
     city: z.string().describe('City name'),
    },

    async({ city }) => {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=10&language=es&format=json`)
        const data = await response.json()

        if (data.length === 0) {
        return { 
        content: [
                    {
                        type: 'text',
                        text: `No se encontro informacion de la  ${city}`
                    }
                ]
            }
        }

        const { latitude, longitude } = data.results[0]
        const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&current=temperature_2m,is_day,rain,showers,precipitation&forecast_days=1`)
        const weatherData = await weatherResponse.json()


        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(weatherData, null, 2)
                }
            ]
        }

    }
)



//escuchar conexiones del cliente
const transport = new StdioServerTransport()
await server.connect(transport)






