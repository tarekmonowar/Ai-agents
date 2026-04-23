import { openai } from "./config.js";
import "dotenv/config";
import { getCurrentWeather, getLocation } from "./manualTools.js";
import { systemPrompt } from "./prompt.js";

const availableFunctions = {
  getCurrentWeather: getCurrentWeather,
  getLocation: getLocation,
};

/**
 * Goal - build an agent that can answer any questions that might require knowledge about my current location and the current weather at my location.
 */

/**
 PLAN:
 1. Design a well-written ReAct prompt
 2. Build a loop for my agent to run in.
 3. Parse any actions that the LLM determines are necessary
 4. End condition - final Answer is given

 */

/**
 * 1. Split the string on the newline character ("\n")
 * 2. Search through the array of strings for one that has "Action:"
 *      regex to use:
 *      const actionRegex = /^Action: (\w+): (.*)$/
 * 3. Parse the action (function and parameter) from the string
 * 4. Calling the function
 * 5. Add an "Obversation" message with the results of the function call
 */

async function agent(query) {
  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: query },
  ];
  const MAX_ITERATIONS = 5;
  const actionRegex = /^Action: (\w+): (.*)$/;

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    console.log(`Iteration #${i + 1}`);
    const response = await openai.chat.completions.create({
      model: process.env.AI_MODEL,
      messages,
    });

    const responseText = response.choices[0].message.content;
    console.log(responseText);
    messages.push({ role: "assistant", content: responseText });
    const responseLines = responseText.split("\n");

    const foundActionStr = responseLines.find((str) => actionRegex.test(str));

    if (foundActionStr) {
      const actions = actionRegex["exec"](foundActionStr);
      const [_, action, actionArg] = actions;

      if (!availableFunctions.hasOwnProperty(action)) {
        throw new Error(`Unknown action: ${action}: ${actionArg}`);
      }
      console.log(`Calling function ${action} with argument ${actionArg}`);
      const observation = await availableFunctions[action](actionArg);
      messages.push({
        role: "assistant",
        content: `Observation: ${observation}`,
      });
    } else {
      console.log("Agent finished with task");
      return responseText;
    }
  }
}

await agent("What book should I read next? I like self-help books.");
