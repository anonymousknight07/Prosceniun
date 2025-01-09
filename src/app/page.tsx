"use client";
import "regenerator-runtime/runtime";
import React, { useState, useEffect } from "react";
import {
  IconCopy,
  IconStar,
  IconThumbDown,
  IconThumbUp,
  IconVolume,
} from "@tabler/icons-react";
import SpeechRecognitionComponent from "@/components/SpeechRecognition/SpeechRecognition";
import TextArea from "@/components/Inputs/TextArea";
import FileUpload from "@/components/Inputs/FileUpload";
import LinkPaste from "@/components/Inputs/LinkPaste";
import LanguageSelector from "@/components/Inputs/LanguageSelector";
import useTranslate from "@/hooks/useTranslate";
import SvgDecorations from "@/components/SvgDecorations";
import CategoryLinks from "@/components/categoryLinks";
import ThemeToggle from "@/components/ThemeToggle";
import Toast from "@/components/Toast";
import CharacterCount from "@/components/CharacterCount";
import TranslationHistory from "@/components/TranslationHistory";

interface Translation {
  id: string;
  source: string;
  target: string;
  language: string;
  timestamp: Date;
  likes: number;
  dislikes: number;
}

const Home: React.FC = () => {
  const [sourceText, setSourceText] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [favorite, setFavorite] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(true);
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [speaking, setSpeaking] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [showToast, setShowToast] = useState<boolean>(false);
  const [languages] = useState<string[]>([
    "English",
    "Spanish",
    "French",
    "German",
    "Chinese",
    "Hindi",
  ]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("Spanish");

  const targetText = useTranslate(sourceText, selectedLanguage);

  // Theme persistence
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result as string;
        setSourceText(text);
      };
      reader.readAsText(file);
    }
  };

  const handleLinkPaste = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const link = e.target.value;
    try {
      const response = await fetch(link);
      const data = await response.text();
      setSourceText(data);
    } catch (error) {
      console.error("Error fetching link content:", error);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(targetText);
    showToastMessage("Copied to clipboard!");
  };

  const handleLike = (translationId?: string) => {
    if (translationId) {
      setTranslations(prev =>
        prev.map(t =>
          t.id === translationId
            ? { ...t, likes: t.likes + 1 }
            : t
        )
      );
    }
    showToastMessage("Thanks for your feedback!");
  };

  const handleDislike = (translationId?: string) => {
    if (translationId) {
      setTranslations(prev =>
        prev.map(t =>
          t.id === translationId
            ? { ...t, dislikes: t.dislikes + 1 }
            : t
        )
      );
    }
    showToastMessage("Thanks for your feedback!");
  };

  const handleFavorite = () => {
    setFavorite(!favorite);
    if (!favorite) {
      localStorage.setItem("favoriteTranslation", targetText);
      showToastMessage("Added to favorites!");
    } else {
      localStorage.removeItem("favoriteTranslation");
      showToastMessage("Removed from favorites!");
    }
  };

  const handleAudioPlayback = (text: string) => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set the language based on the selected language
    const langCode = {
      English: 'en-US',
      Spanish: 'es-ES',
      French: 'fr-FR',
      German: 'de-DE',
      Chinese: 'zh-CN',
      Hindi: 'hi-IN'
    }[selectedLanguage] || 'en-US';
    
    utterance.lang = langCode;
    
    utterance.onend = () => {
      setSpeaking(false);
    };

    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleDeleteTranslation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTranslations(prev => prev.filter(t => t.id !== id));
    showToastMessage("Translation deleted!");
  };

  const handleTranslationSelect = (translation: Translation) => {
    setSourceText(translation.source);
    setSelectedLanguage(translation.language);
  };

  // Save translation to history when target text changes
  useEffect(() => {
    if (targetText && sourceText) {
      const newTranslation: Translation = {
        id: Date.now().toString(),
        source: sourceText,
        target: targetText,
        language: selectedLanguage,
        timestamp: new Date(),
        likes: 0,
        dislikes: 0
      };
      setTranslations(prev => [newTranslation, ...prev].slice(0, 10));
    }
  }, [targetText, selectedLanguage, sourceText]);

  return (
    <div className={`w-full min-h-screen ${isDark ? 'dark bg-neutral-900' : 'bg-white'}`}>
      <div className={`w-full ${isDark ? 'bg-black bg-dot-white/[0.2]' : 'bg-white bg-dot-black/[0.2]'} relative flex items-center justify-center`}>
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <div className="relative overflow-hidden min-h-screen w-full">
          <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
          
          <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-24">
            <div className="text-center">
              <h1 className={`text-4xl sm:text-6xl font-bold ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>
                प्रो<span className="text-[#f87315]">SCENIUM</span>
              </h1>

              <p className={`mt-3 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Your Passport to Seamless Multilingual Chats. Let Proscenium handle the translation.
              </p>

              <div className="mt-7 sm:mt-12 mx-auto max-w-3xl relative">
                <div className="grid gap-4 md:grid-cols-2 grid-cols-1">
                  <div className={`relative z-10 flex flex-col space-y-3 p-3 border rounded-lg shadow-lg ${isDark ? 'bg-neutral-900 border-neutral-700' : 'bg-white border-neutral-200'}`}>
                    <TextArea
                      id="source-language"
                      value={sourceText}
                      onChange={(e) => setSourceText(e.target.value)}
                      placeholder="Source Language"
                    />
                    <div className="flex justify-between items-center">
                      <span className="flex space-x-2">
                        <SpeechRecognitionComponent setSourceText={setSourceText} />
                        <IconVolume
                          size={22}
                          className={`cursor-pointer ${speaking ? 'text-orange-500' : ''}`}
                          onClick={() => handleAudioPlayback(sourceText)}
                        />
                        <FileUpload handleFileUpload={handleFileUpload} />
                        <LinkPaste handleLinkPaste={handleLinkPaste} />
                      </span>
                      <CharacterCount current={sourceText.length} max={2000} />
                    </div>
                  </div>

                  <div className={`relative z-10 flex flex-col space-y-3 p-3 border rounded-lg shadow-lg ${isDark ? 'bg-neutral-900 border-neutral-700' : 'bg-white border-neutral-200'}`}>
                    <TextArea
                      id="target-language"
                      value={targetText}
                      onChange={() => {}}
                      placeholder="Target Language"
                    />
                    <div className="flex justify-between items-center">
                      <LanguageSelector
                        selectedLanguage={selectedLanguage}
                        setSelectedLanguage={setSelectedLanguage}
                        languages={languages}
                      />
                      <div className="flex items-center space-x-2">
                        <IconVolume
                          size={22}
                          className={`cursor-pointer ${speaking ? 'text-orange-500' : ''}`}
                          onClick={() => handleAudioPlayback(targetText)}
                        />
                        <IconCopy
                          size={22}
                          className="cursor-pointer"
                          onClick={handleCopyToClipboard}
                        />
                        <IconThumbUp
                          size={22}
                          className="cursor-pointer hover:text-green-500 transition-colors"
                          onClick={() => handleLike()}
                        />
                        <IconThumbDown
                          size={22}
                          className="cursor-pointer hover:text-red-500 transition-colors"
                          onClick={() => handleDislike()}
                        />
                        <IconStar
                          size={22}
                          className={`cursor-pointer transition-colors ${favorite ? "text-yellow-500" : "hover:text-yellow-500"}`}
                          onClick={handleFavorite}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <SvgDecorations />
                
                <TranslationHistory
                  translations={translations}
                  onSelect={handleTranslationSelect}
                  onDelete={handleDeleteTranslation}
                />
              </div>

              <CategoryLinks />
            </div>
          </div>
        </div>
      </div>
      <Toast message={toastMessage} isVisible={showToast} />
    </div>
  );
};

export default Home;