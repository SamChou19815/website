import defineCommand from "../lib/define-command";

export default defineCommand({}, ({ positionals }) => {
  for (const a of positionals) {
    console.log(a);
  }
});
