module.exports = {
  name: "saludar",
  keywords: ["hola", "buenos", "días", "saludo"],
  execute: async function(input) {
    const hour = new Date().getHours();
    let greeting = 'Buenos días';
    if (hour >= 12 && hour < 18) greeting = 'Buenas tardes';
    if (hour >= 18) greeting = 'Buenas noches';
    return `${greeting}. Soy EVO-Asistente, tu asistente de voz con capacidad de auto-aprendizaje. ¿En qué puedo ayudarte?`;
  }
};