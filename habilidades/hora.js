module.exports = {
  name: "decir_hora",
  keywords: ["hora", "qué hora", "time"],
  execute: async function(input) {
    const now = new Date();
    const time = now.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    const date = now.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
    return `Son las ${time} del ${date}`;
  }
};