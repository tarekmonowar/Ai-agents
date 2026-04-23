import { openai } from "./config.js";
import "dotenv/config";
import { get_customer_profile, list_open_orders } from "./tools.js";

const tools = [
  {
    type: "namespace", // optional, can be used to group related tools together
    name: "Customer Relationship Management",
    description: "CRM tools for customer lookup and order management.",
    tools: [
      {
        type: "function",
        name: "get_customer_profile",
        description: "Fetch a customer profile by customer ID.",
        parameters: {
          type: "object",
          properties: {
            customer_id: { type: "string" },
          },
          required: ["customer_id"],
          additionalProperties: false,
        },
      },
      {
        type: "function",
        name: "list_open_orders",
        description: "List open orders for a customer ID.",
        parameters: {
          type: "object",
          properties: {
            customer_id: { type: "string" },
          },
          required: ["customer_id"],
          additionalProperties: false,
        },
      },
    ],
  },
];

async function agent(query) {
  const inputs = [{ role: "user", content: query }];

  let response = await openai.responses.create({
    model: process.env.AI_MODEL,
    instructions:
      "You are a helpful assistant that can use tools to answer user questions. You have access to the following tools: get_customer_profile and list_open_orders. Use these tools as needed to gather information to answer the user's question. Always provide a final answer that is specific and based on the information you have gathered.", //optional response instruction alada ababe dite hoy
    input: inputs, //chat completions a accept message but here input
    tools,
  });

  const responseText = response.output[0];
  console.log(JSON.stringify(response.output, null, 2));
}

await agent("get the profile and open orders for customer ID 123");
