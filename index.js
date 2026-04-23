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
  //response a inpute flexible jekuno data patanu jay. chat.completions moto strict nay
  const inputs = [{ role: "user", content: query }];

  let response = await openai.responses.create({
    model: process.env.AI_MODEL,
    instructions:
      "You are a helpful assistant that can use tools to answer user questions. You have access to the following tools: get_customer_profile and list_open_orders. Use these tools as needed to gather information to answer the user's question. Always provide a final answer that is specific and based on the information you have gathered.", //optional response instruction alada ababe dite hoy
    input: inputs, //chat completions a accept message but here input
    tools,
  });

  console.log(JSON.stringify(response, null, 2));

  const hasToolCall = response.output.some(
    (item) => item.type === "function_call",
  );

  if (!hasToolCall) {
    console.log("Final output:");
    console.log(response.output_text);
    return;
  }

  // Preserve model output for the next turn
  inputs.push(...response.output);

  for (const item of response.output) {
    if (item.type !== "function_call") continue;

    if (item.name === "get_customer_profile") {
      // 3. Execute the function logic for get_customer_profile
      const { customer_id } = JSON.parse(item.arguments);

      const profile = await get_customer_profile(customer_id);

      // 4. Provide function call results to the model
      inputs.push({
        type: "function_call_output",
        call_id: item.call_id,
        output: JSON.stringify(profile),
      });
    }
    if (item.name === "list_open_orders") {
      // 3. Execute the function logic for list_open_orders
      const { customer_id } = JSON.parse(item.arguments);
      const orders = await list_open_orders(customer_id);
      // 4. Provide function call results to the model
      inputs.push({
        type: "function_call_output",
        call_id: item.call_id,
        output: JSON.stringify(orders),
      });
    }
  }

  console.log("Final input:");
  console.log(JSON.stringify(inputs, null, 2));

  response = await openai.responses.create({
    model: process.env.AI_MODEL,
    instructions: "Respond only with the information gathered by the tools.",
    tools,
    input: inputs,
  });

  // 5. The model should be able to give a response!
  console.log("Final output:");
  console.log(response.output_text);
}

await agent("get the profile and open orders for me id 990 and id 777");

//*better for multiple arg and mulitiple functions
// const toolMap = {
//   get_customer_profile,
//   list_open_orders,
// };

// for (const item of response.output) {
//   if (item.type !== "function_call") continue;

//   const fn = toolMap[item.name];

//   if (fn) {
//     const args = JSON.parse(item.arguments);
//     const result = await fn(args);

//     inputs.push({
//       type: "function_call_output",
//       call_id: item.call_id,
//       output: JSON.stringify(result),
//     });
//   }
// }
