import React, { useEffect, useState } from 'react';

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
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  useEffect(() => {
    // Initial load of voices
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
        setVoicesLoaded(true);
      }
    };

    // Try loading voices immediately
    loadVoices();

    // Set up the event listener for when voices are loaded
    window.speechSynthesis.onvoiceschanged = () => {
      loadVoices();
    };

    // Fallback for browsers that might need a manual trigger
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.cancel();
    }

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const getLangCode = (selectedLanguage: string): string => {
    const langMap: { [key: string]: string } = {
      English: 'en',
      Spanish: 'es',
      French: 'fr',
      German: 'de',
      Chinese: 'zh',
      Hindi: 'hi'
    };
    return langMap[selectedLanguage] || '';
  };

  const filteredVoices = voices.filter(voice => 
    voice.lang.toLowerCase().startsWith(getLangCode(language).toLowerCase())
  );

  if (!voicesLoaded || filteredVoices.length === 0) {
    return null;
  }

  return (
    <select
      value={selectedVoice?.voiceURI || ''}
      onChange={(e) => {
        const voice = voices.find(v => v.voiceURI === e.target.value);
        if (voice) onVoiceChange(voice);
      }}
      className="bg-neutral-800 text-white text-sm rounded-lg px-2 py-1 outline-none"
    >
      <option value="">Select a voice</option>
      {filteredVoices.map((voice) => (
        <option key={voice.voiceURI} value={voice.voiceURI}>
          {voice.name}
        </option>
      ))}
    </select>
  );
};

export default VoiceSelector;