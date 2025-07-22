export function parseCamelCase(text) {
  let parsedText = text
    .split("")
    .map((e, i) =>
      i === 0 ? e.toUpperCase() : e === e.toUpperCase() ? ` ${e}` : e
    );
  return parsedText.join("");
}

export function shortenName(name) {
  if (name.length < 10) {
    return name;
  }

  const firstName = name.split(" ")[0];
  if (firstName.length < 10) {
    return firstName;
  }

  return firstName.slice(0, 3) + ".";
}
export function fractionToPercentage(numerator, denominator) {
  // Handle division by zero
  if (denominator === 0) return "0%";

  // Calculate percentage and round to nearest integer
  const percentage = Math.round((numerator / denominator) * 100);
  return `${percentage}%`;
}

export function containsText(text, search) {
  // Función auxiliar para normalizar texto (remover acentos y convertir a minúsculas)
  const normalize = (str) =>
    str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  // Normalizar ambos textos y verificar si uno contiene al otro
  return normalize(text).includes(normalize(search));
}
