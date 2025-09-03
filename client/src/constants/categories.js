export const GIG_CATEGORIES = [
  "Essay writing service",
  "College essay writing service",
  "Coursework writing service",
  "Dissertation writing service",
  "Custom essay writing service",
  "Research paper writing service",
  "Term paper writing service",
  "Thesis writing service",
  "Case study writing service",
  "Literature review writing service"
];

export const getCategoryIcon = (category) => {
  const icons = {
    "Essay writing service": "📄",
    "College essay writing service": "🏫",
    "Coursework writing service": "📚",
    "Dissertation writing service": "🎓",
    "Custom essay writing service": "✍️",
    "Research paper writing service": "🔬",
    "Term paper writing service": "📝",
    "Thesis writing service": "📘",
    "Case study writing service": "📊",
    "Literature review writing service": "📖"
  };
  return icons[category] || "";
};


