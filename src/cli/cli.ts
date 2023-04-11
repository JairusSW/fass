const version = "v0.1.0";
const args = process.argv.slice(2);
if (args.includes("-h") || !args.length) {
  console.log("Usage: fass --assemblyscript -o build/ schemas/*.fass");
}
