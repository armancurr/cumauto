import Conf from "conf";

const config = new Conf({
  projectName: "ai-commit-message",
});

const CONFIG_KEY = "gemini_api_key";

export const setApiKey = async (key) => {
  config.set(CONFIG_KEY, key);
};

export const getApiKey = () => {
  const key = process.env.GEMINI_API_KEY || config.get(CONFIG_KEY);
  if (!key) {
    throw new Error(
      "Gemini API key not found. Set it using:\n" +
        "┌─────────────────────────────────────────┐\n" +
        "│ ai-commit-message config <your-api-key> │\n" +
        "└─────────────────────────────────────────┘",
    );
  }
  return key;
};
