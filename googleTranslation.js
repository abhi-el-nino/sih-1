const { Translate } = require("@google-cloud/translate").v2;
const axios = require("axios");
// Creates a client
const translate = new Translate();

module.exports = async function translateText(text, number) {
  try {
    console.log("text", text, number);
    const target = "hi";
    console.log("credentials", process.env.GOOGLE_APPLICATION_CREDENTIALS);
    let [translations] = await translate.translate(text, target);
    translations = Array.isArray(translations) ? translations : [translations];
    let response = await axios.post(
      `https://api.textlocal.in/send/?unicode=1&apiKey=9vAkgLw23+M-6SZtbHOzAEJSS6L9hLuh4fKaCwSI0U&numbers=${number}&message=${encodeURIComponent(
        translations[0]
      )}`,
      {
        sender: "TXTLCL",
      }
    );
  } catch (error) {
    throw error;
  }
};
