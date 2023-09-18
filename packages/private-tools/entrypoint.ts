import * as path from "path";
import * as fs from "fs/promises";

const commandsDirectory = path.join(__dirname, "commands");
const availableCommands: Array<string> = [];

for (const commandFile of await fs.readdir(commandsDirectory)) {
  const pathToCommand = path.join(commandsDirectory, commandFile);
  if (path.extname(pathToCommand) !== ".ts") {
    continue;
  }
  availableCommands.push(commandFile.substring(0, commandFile.length - 3));
}

let command = process.argv[2];
if (command == null) {
  console.error("No command given.");
  console.error(`Available commands: ${availableCommands.join(", ")}`);
  process.exit(1);
}

if (availableCommands.includes(`secret-${command}`)) {
  command = `secret-${command}`;
}
if (!availableCommands.includes(command)) {
  console.error("No matching command found. You command is", command);
  console.error(`Available commands: ${availableCommands.join(", ")}`);
  process.exit(1);
}

await (
  await import(path.resolve(path.join(commandsDirectory, `${command}.ts`)))
).default(process.argv.slice(3));
