import React from 'react';
import { motion } from 'framer-motion';
import { IconTrash, IconThumbUp, IconThumbDown } from '@tabler/icons-react';

interface Translation {
  id: string;
  source: string;
  target: string;
  language: string;
  timestamp: Date;
  likes: number;
  dislikes: number;
}

interface TranslationHistoryProps {
  translations: Translation[];
  onSelect: (translation: Translation) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

const TranslationHistory: React.FC<TranslationHistoryProps> = ({ translations, onSelect, onDelete }) => {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-neutral-200 mb-4">Recent Translations</h3>
      <div className="space-y-2">
        {translations.map((translation) => (
          <motion.div
            key={translation.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-neutral-800 rounded-lg cursor-pointer hover:bg-neutral-700 transition-colors"
            onClick={() => onSelect(translation)}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-neutral-400">{translation.language}</span>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <IconThumbUp size={14} className="text-green-400" />
                  <span className="text-xs text-neutral-400">{translation.likes}</span>
                </span>
                <span className="flex items-center gap-1">
                  <IconThumbDown size={14} className="text-red-400" />
                  <span className="text-xs text-neutral-400">{translation.dislikes}</span>
                </span>
                <span className="text-xs text-neutral-500">
                  {new Date(translation.timestamp).toLocaleString()}
                </span>
                <button
                  onClick={(e) => onDelete(translation.id, e)}
                  className="p-1 hover:bg-neutral-600 rounded-full transition-colors"
                >
                  <IconTrash size={16} className="text-red-400" />
                </button>
              </div>
            </div>
            <p className="text-sm text-neutral-300 line-clamp-1">{translation.source}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default TranslationHistory;