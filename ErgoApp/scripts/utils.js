export default function parseCamelCase(text) {
  let parsedText = text
    .split("")
    .map((e, i) =>
      i === 0 ? e.toUpperCase() : e === e.toUpperCase() ? ` ${e}` : e
    );
  return parsedText.join("");
}
