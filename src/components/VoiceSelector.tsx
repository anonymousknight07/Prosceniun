import React, { useEffect, useState } from 'react';
import { IconVolume } from '@tabler/icons-react';

interface Voice {
  name: string;
  lang: string;
  voiceURI: string;
}

interface VoiceSelectorProps {
  selectedVoice: SpeechSynthesisVoice | null;
  onVoiceChange: (voice: SpeechSynthesisVoice) => void;
  language: string;
}

const VoiceSelector: React.FC<VoiceSelectorProps> = ({ selectedVoice, onVoiceChange, language }) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 10;
    const retryInterval = 500;

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis?.getVoices() || [];
      if (isMounted) {
        setVoices(availableVoices);
        setIsLoading(false);
      }
    };

    const tryLoadVoices = () => {
      const availableVoices = window.speechSynthesis?.getVoices() || [];
      
      if (availableVoices.length > 0) {
        loadVoices();
      } else if (retryCount < maxRetries) {
        retryCount++;
        setTimeout(tryLoadVoices, retryInterval);
      } else {
        setIsLoading(false);
      }
    };

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
      
      if (voices.length === 0) {
        tryLoadVoices();
      }
    } else {
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  const getLanguageMatches = (selectedLanguage: string): string[] => {
    const langMap: { [key: string]: string[] } = {
      English: ['en', 'en-us', 'en-gb', 'en-au', 'en-ca', 'en-in', 'en-ie', 'en-nz', 'en-za'],
      Spanish: ['es', 'es-es', 'es-mx', 'es-ar', 'es-cl', 'es-co', 'es-us'],
      French: ['fr', 'fr-fr', 'fr-ca', 'fr-ch', 'fr-be'],
      German: ['de', 'de-de', 'de-at', 'de-ch'],
      Chinese: ['zh', 'zh-cn', 'zh-tw', 'zh-hk', 'cmn', 'yue'],
      Hindi: ['hi', 'hi-in']
    };
    return langMap[selectedLanguage] || [];
  };

  const filteredVoices = voices.filter(voice => {
    const voiceLang = voice.lang.toLowerCase();
    const matchingCodes = getLanguageMatches(language);
    return matchingCodes.some(code => voiceLang.startsWith(code));
  });

  const testVoice = (voice: SpeechSynthesisVoice) => {
    if (isPlaying) {
      window.speechSynthesis?.cancel();
      setIsPlaying(null);
      if (isPlaying === voice.voiceURI) return;
    }

    const sampleText = {
      English: "Hello, this is a sample voice.",
      Spanish: "Hola, esta es una voz de ejemplo.",
      French: "Bonjour, c'est un exemple de voix.",
      German: "Hallo, dies ist eine Beispielstimme.",
      Chinese: "你好，这是示例语音。",
      Hindi: "नमस्ते, यह एक उदाहरण आवाज़ है।"
    }[language] || "This is a sample voice.";

    if (window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(sampleText);
      utterance.voice = voice;
      utterance.onend = () => setIsPlaying(null);
      setIsPlaying(voice.voiceURI);
      window.speechSynthesis.speak(utterance);
    }
  };

  if (isLoading) {
    return <div className="text-neutral-400 text-sm">Loading voices...</div>;
  }

  if (!window.speechSynthesis) {
    return <div className="text-neutral-400 text-sm">Speech synthesis is not supported in your browser</div>;
  }

  if (filteredVoices.length === 0) {
    return (
      <div className="text-neutral-400 text-sm">
        No voices available for {language}. Available languages: {voices.map(v => v.lang).join(', ')}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-sm text-neutral-400 mb-2">Available voices for {language}:</div>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {filteredVoices.map((voice) => (
          <div 
            key={voice.voiceURI}
            className={`flex items-center justify-between p-2 rounded-lg ${
              selectedVoice?.voiceURI === voice.voiceURI 
                ? 'bg-orange-500/20 border border-orange-500/50' 
                : 'bg-neutral-800 hover:bg-neutral-700'
            } cursor-pointer transition-colors`}
            onClick={() => onVoiceChange(voice)}
          >
            <div className="flex flex-col">
              <span className="text-sm text-white">{voice.name}</span>
              <span className="text-xs text-neutral-400">{voice.lang}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                testVoice(voice);
              }}
              className={`p-1 rounded-full hover:bg-neutral-600 transition-colors ${
                isPlaying === voice.voiceURI ? 'text-orange-500' : 'text-neutral-400'
              }`}
            >
              <IconVolume size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VoiceSelector;