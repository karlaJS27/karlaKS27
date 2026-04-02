
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio";
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
        return { 
        content: [
                    {
                        type: 'text',
                        text: `The weather in ${city} is sunny with a temperature of 25°C.`
                    }
                ]
            }
    }
)



//escuchar conexiones del cliente
const transport = new StdioServerTransport()
await server.connect(transport)






