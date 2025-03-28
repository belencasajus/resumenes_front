export const categories = [
  "Personal Development",
  "Business",
  "Psychology",
  "Finance",
  "Leadership",
  "Productivity",
  "Fantasy",
  "Science Fiction",
  "Mystery"
];

export const books = [
  {
    id: 1,
    title: "The Psychology of Money",
    author: "Morgan Housel",
    imagen: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=400",
    categories: ["Finance", "Psychology", "Personal Development"],
    isPremium: false,
    isFavorite: false,
    summary: "Money – investing, personal finance, and business decisions – is typically taught as a math-based field, where data and formulas tell us exactly what to do. But in the real world, people don't make financial decisions on a spreadsheet...",
    shortSummary: "An exploration of the psychology behind money management, teaching that success with money isn't about what you know, but about how you behave.",
    audioUrl: "url-psychology-of-money.mp3",
    averageRating: 4.5,
    reviews: [
      {
        id: 1,
        userId: "user1",
        username: "John Doe",
        rating: 5,
        comment: "A life-changing perspective on handling money and making better financial decisions.",
        date: "2024-02-10"
      },
      {
        id: 2,
        userId: "user2",
        username: "Jane Smith",
        rating: 4,
        comment: "Great insights into the psychological aspects of money management.",
        date: "2024-02-09"
      }
    ]
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    imagen: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
    categories: ["Personal Development", "Productivity", "Psychology"],
    isPremium: true,
    isFavorite: false,
    summary: "No matter your goals, Atomic Habits offers a proven framework for improving every day...",
    shortSummary: "A comprehensive guide to building good habits and breaking bad ones.",
    audioUrl: "url-atomic-habits.mp3",
    averageRating: 4.8,
    reviews: []
  },
  {
    id: 3,
    title: "Deep Work",
    author: "Cal Newport",
    imagen: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=400",
    categories: ["Productivity", "Personal Development"],
    isPremium: true,
    isFavorite: false,
    shortSummary: "A guide to developing the ability to focus without distraction on cognitively demanding tasks.",
    averageRating: 4.7,
    reviews: []
  },
  {
    id: 4,
    title: "The Name of the Wind",
    author: "Patrick Rothfuss",
    imagen: "https://images.unsplash.com/photo-1518112166137-85f9979a43aa?w=400",
    categories: ["Fantasy"],
    isPremium: false,
    isFavorite: false,
    shortSummary: "The riveting first-person narrative of a young man who grows to become the most notorious magician his world has ever seen.",
    averageRating: 4.9,
    reviews: []
  },
  {
    id: 5,
    title: "Dune",
    author: "Frank Herbert",
    imagen: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=400",
    categories: ["Science Fiction"],
    isPremium: false,
    isFavorite: false,
    shortSummary: "Set in the distant future amidst a feudal interstellar society, Dune tells the story of young Paul Atreides, whose family accepts stewardship of the desert planet Arrakis.",
    averageRating: 4.8,
    reviews: []
  },
  {
    id: 6,
    title: "The Silent Patient",
    author: "Alex Michaelides",
    imagen: "https://images.unsplash.com/photo-1587876931567-564ce588bfbd?w=400",
    categories: ["Mystery"],
    isPremium: true,
    isFavorite: false,
    shortSummary: "A woman shoots her husband five times and then never speaks another word. A criminal psychotherapist is determined to unravel the mystery of her silence.",
    averageRating: 4.6,
    reviews: []
  },
  {
    id: 7,
    title: "The Mistborn Trilogy",
    author: "Brandon Sanderson",
    imagen: "https://images.unsplash.com/photo-1535666669445-e8c15cd2e7d9?w=400",
    categories: ["Fantasy"],
    isPremium: true,
    isFavorite: false,
    shortSummary: "A breathtaking saga about a street thief who must learn to master Allomancy, the power of metals, to overthrow the dark lord who rules the world.",
    averageRating: 4.9,
    reviews: []
  },
  {
    id: 8,
    title: "Project Hail Mary",
    author: "Andy Weir",
    imagen: "https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?w=400",
    categories: ["Science Fiction"],
    isPremium: true,
    isFavorite: false,
    shortSummary: "A lone astronaut must save humanity from extinction in this gripping tale of survival, friendship, and scientific discovery.",
    averageRating: 4.8,
    reviews: []
  },
  {
    id: 9,
    title: "The Way of Kings",
    author: "Brandon Sanderson",
    imagen: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400",
    categories: ["Fantasy"],
    isPremium: true,
    isFavorite: false,
    shortSummary: "Epic fantasy at its finest, following multiple characters in a world of storms, magical powers, and ancient mysteries.",
    averageRating: 4.9,
    reviews: []
  },
  {
    id: 10,
    title: "Gone Girl",
    author: "Gillian Flynn",
    imagen: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
    categories: ["Mystery"],
    isPremium: false,
    isFavorite: false,
    shortSummary: "A masterpiece of psychological thriller about a marriage gone terribly wrong, with twists that keep you guessing until the very end.",
    averageRating: 4.7,
    reviews: []
  }
];