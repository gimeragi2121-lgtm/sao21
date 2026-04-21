module.exports = {
  name: "saludo_anime",
  keywords: ["hola", "ohayo", "konnichiwa", "saludo", "anime"],
  execute: async function(input) {
    const responses = [
      "¡Ohayo gozaimasu! Senpai notó tu presencia...",
      "Konnichiwa! ¿Listo para una aventura en el mundo digital?",
      "Yahallo~! El asistente anime está activado y listo para servirte.",
      "¡Hai! El poder del electrolaser fluye a través de mis circuitos.",
      "Nya~! ¿Necesitas ayuda con algo, querido usuario?"
    ];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    return `${randomResponse} ✨`;
  }
};