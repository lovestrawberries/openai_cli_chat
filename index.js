import { OpenAI } from "openai";
import Table from "cli-table3";
import chalk from "chalk";
import dotenv from "dotenv";
import readlineSync from "readline-sync";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const cleanToken = (token) => JSON.stringify(token); //.replace(/\s+/g, " "); // tokens often contain several escape chars e.g '?' can contain '?\n\n\n'
const print = (string, colour = "white") => console.log(chalk[colour](string));
const logProbToPercent = (logProb) => (Math.exp(logProb) * 100).toFixed(6);

async function chat() {
  print("ChatGPT Terminal - Type 'exit' to quit.\n", "bgMagenta");
  let messages = [{ role: "system", content: "You are a helpful assistant." }];

  while (true) {
    const userInput = readlineSync.question("You: ");

    if (userInput.toLowerCase() === "exit") {
      print("Goodbye!", "green");
      break;
    }

    messages.push({ role: "user", content: userInput });

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages,
        logprobs: true,
        top_logprobs: 6,
      });

      const reply = response.choices[0].message.content;
      print(`ChatGPT: ${reply}\n`, "green");

      // print out the logarithimc propabilities for each work (token)
      const tokensData = response.choices[0].logprobs.content;
      const table = new Table({
        head: [
          "Chosen",
          "Option 2",
          "Option 3",
          "Option 4",
          "Option 5",
          "Option 6",
        ],
      });
      tokensData.forEach((tokenData) => {
        const options = [].concat(
          tokenData.top_logprobs.map((alternative, index) => ({
            token:
              index === 0
                ? chalk.magentaBright(cleanToken(alternative.token))
                : cleanToken(alternative.token),
            probability:
              index === 0
                ? chalk.magenta(logProbToPercent(alternative.logprob))
                : logProbToPercent(alternative.logprob),
          }))
        );
        // format into single row
        console.log(options);
        const row = options.map((o) => `${o.token} ${o.probability}`);
        console.log(row);
        table.push(row);
      });
      print(table.toString());
      messages.push({ role: "assistant", content: reply });
    } catch (error) {
      console.error(chalk.redBright("Error:", error));
    }
  }
}

chat();
