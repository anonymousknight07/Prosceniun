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

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const filteredVoices = voices.filter(voice => voice.lang.startsWith(
    language === 'English' ? 'en' :
    language === 'Spanish' ? 'es' :
    language === 'French' ? 'fr' :
    language === 'German' ? 'de' :
    language === 'Chinese' ? 'zh' :
    language === 'Hindi' ? 'hi' : ''
  ));

  return (
    <select
      value={selectedVoice?.voiceURI || ''}
      onChange={(e) => {
        const voice = voices.find(v => v.voiceURI === e.target.value);
        if (voice) onVoiceChange(voice);
      }}
      className="bg-neutral-800 text-white text-sm rounded-lg px-2 py-1 outline-none"
    >
      {filteredVoices.map((voice) => (
        <option key={voice.voiceURI} value={voice.voiceURI}>
          {voice.name}
        </option>
      ))}
    </select>
  );
};

export default VoiceSelector;