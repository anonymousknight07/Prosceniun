import React from "react";
import {
  IconBriefcase,
  IconBulb,
  IconSchool,
  IconWriting,
  IconMoodSmile,
  IconHeart,
} from "@tabler/icons-react";
import { motion } from "framer-motion";

const categories = [
  { 
    icon: IconBriefcase, 
    label: "Business",
    description: "Professional and business-related translations",
    examples: ["Contracts", "Proposals", "Business Letters"]
  },
  { 
    icon: IconSchool, 
    label: "Education",
    description: "Academic and educational content",
    examples: ["Research Papers", "Study Materials", "Course Content"]
  },
  { 
    icon: IconBulb, 
    label: "Creative",
    description: "Creative and artistic content",
    examples: ["Stories", "Poetry", "Creative Writing"]
  },
  { 
    icon: IconHeart, 
    label: "Health",
    description: "Medical and health-related content",
    examples: ["Medical Records", "Health Instructions", "Wellness Content"]
  },
  { 
    icon: IconWriting, 
    label: "Journaling",
    description: "Personal writing and journaling",
    examples: ["Diary Entries", "Personal Notes", "Reflections"]
  },
  { 
    icon: IconMoodSmile, 
    label: "Communication",
    description: "General communication content",
    examples: ["Messages", "Emails", "Social Media"]
  },
];

const CategoryLinks: React.FC = () => {
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);

  return (
    <div className="mt-10 sm:mt-20">
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map(({ icon: Icon, label }) => (
          <button
            key={label}
            className={`m-1 py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium 
              rounded-lg border border-gray-200 shadow-sm 
              transition-colors duration-200 
              ${activeCategory === label 
                ? 'bg-orange-500 text-white border-orange-600 dark:border-orange-400' 
                : 'bg-white text-gray-800 hover:bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800'
              }`}
            onClick={() => setActiveCategory(activeCategory === label ? null : label)}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>
      
      {activeCategory && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mt-6 p-4 bg-neutral-800 rounded-lg max-w-2xl mx-auto"
        >
          <h3 className="text-lg font-semibold text-white mb-2">
            {categories.find(c => c.label === activeCategory)?.label}
          </h3>
          <p className="text-neutral-300 mb-3">
            {categories.find(c => c.label === activeCategory)?.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {categories
              .find(c => c.label === activeCategory)
              ?.examples.map((example, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-neutral-700 rounded-full text-sm text-neutral-300"
                >
                  {example}
                </span>
              ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CategoryLinks;