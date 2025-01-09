import { useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

const useTranslate = (sourceText, selectedLanguage) => {
  const [targetText, setTargetText] = useState("");

  useEffect(() => {
    const handleTranslate = async (text) => {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `Translate the following text to ${selectedLanguage}:
        
        ${text}
        
        Only provide the translation, no additional text or explanations.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const translatedText = response.text();

        setTargetText(translatedText);
      } catch (error) {
        console.error("Error translating text:", error);
        setTargetText("Translation error occurred. Please try again.");
      }
    };

    if (sourceText.trim()) {
      const timeoutId = setTimeout(() => {
        handleTranslate(sourceText);
      }, 500);

      return () => clearTimeout(timeoutId);
    } else {
      setTargetText("");
    }
  }, [sourceText, selectedLanguage]);

  return targetText;
}

export default useTranslate;