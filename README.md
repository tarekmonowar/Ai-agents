# AI Agents Learning Project

This project is for learning AI agents and automation in two simple ways:

1. Manual agent handling (ReAct style loop)
2. OpenAI Responses API with tool calling

## What I am learning

- How an agent thinks, takes actions, and uses observations
- How to connect local JavaScript functions as tools
- How to let the model call tools and then return final answers

## Project structure

- `manual.js`: manual agent loop with Thought -> Action -> Observation flow
- `prompt.js`: system prompt for manual ReAct behavior
- `manualTools.js`: tools used by the manual agent (`getLocation`, `getCurrentWeather`)
- `index.js`: OpenAI Responses API example with function tool calling
- `tools.js`: CRM-style tool functions (`get_customer_profile`, `list_open_orders`)
- `config.js`: OpenAI client and environment variable validation

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file:

```env
AI_API_KEY=your_api_key
AI_URL=https://api.openai.com/v1
AI_MODEL=your_model_name
```

## Run examples

### 1) Manual agent handling

```bash
npm run manual
```

This runs a custom loop where the model outputs an `Action`, your code executes the function, and then sends an `Observation` back.

### 2) OpenAI Responses API tool calling

```bash
npm start
```

This runs tool calling with `openai.responses.create()`, executes requested functions, sends `function_call_output`, and gets the final answer.

## Why this repo is useful

- You can compare manual orchestration vs built-in tool calling
- You can understand agent automation step by step
- You can extend with your own tools and workflows
