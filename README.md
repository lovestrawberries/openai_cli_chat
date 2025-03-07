# openai_cli_chat

Fast JavaScript CLI tool that lets you chat with an AI in the terminal while displaying log probabilities for each word. Here's what's been implemented:

1. Terminal-based chat using OpenAI's API
2. Colored user input for better readability
3. Log probability display for each token
4. Top alternatives for each word with probabilities
5. Formatted output using cli-table module
6. Proper handling of escape characters by stringifying tokens
   The result? A clean, structured table showing each word in the AI's response along with its confidence levels and possible alternatives.

To run:

1. Create .env file and add this line `OPENAI_API_KEY=your_access_token_here`
2. Run `npm i`
3. Run `npm run chat`
