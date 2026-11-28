// All site copy lives here so it can be edited without touching layout code.
// Testimonials, stats and contact details are placeholders. Replace them
// with real, approved content before going live.

export const site = {
  name: "Tribhang",
  fullName: "Tribhang · The Kathak Studio",
  tagline: "Awakening the spirit through sacred steps.",
  city: "Coimbatore",
  guru: "Guru Ishvarya",
  address: ["Tribhang · The Kathak Studio", "Thondamuthur Road, Vadavalli", "Coimbatore 641041"],
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Thondamuthur+Road+Coimbatore+641041",
  instagram: "https://www.instagram.com/tribhang.kathak",
  facebook: "https://www.facebook.com/tribhang.kathak",
  email: "tribhang.kathak@gmail.com",
  // Guru Ishvarya's WhatsApp (country code, no +). Enquiries and WhatsApp buttons go here.
  whatsappNumber: "918148562853",
};

export const whatsappLink = (text = `Hello ${site.guru}, I would like to know more about Tribhang.`) =>
  `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(text)}`;

export const nav = [
  { href: "#about", label: "About" },
  { href: "#guru", label: "Guru" },
  { href: "#journey", label: "Journey" },
  { href: "#heritage", label: "Heritage" },
  { href: "#voices", label: "Voices" },
  { href: "#contact", label: "Contact" },
];

export const hero = {
  eyebrow: "Coimbatore • Est. with Love",
  titleLead: "Awakening the spirit",
  titleAccent: "through sacred steps.",
  body: "A studio where Kathak is practised as a path inward: rhythm, reflection and finding the people you belong with.",
  primaryCta: "Observe a Class",
  secondaryCta: "Discover Tribhang",
};

export const invitation = {
  eyebrow: "A gentle invitation",
  titleLead: "You may have come for the dance.",
  titleAccent: "You may stay for much more.",
  body: "Most people who reach our door are carrying something besides curiosity about footwork. A wish to feel easy in their own body, to touch a tradition they have long admired, or simply to find a room where they can be themselves.",
  notes: [
    { quote: "I have never danced before.", note: "A first message, typed and deleted three times" },
    { quote: "Isn't it too late for me?", note: "Asked by someone in their thirties" },
    { quote: "I'm not a confident person.", note: "Said quietly, on the first visit" },
    { quote: "I'd like a place to belong.", note: "The reason underneath the other reasons" },
  ],
  welcome:
    "However you arrived, there is room for you here. Experience is not required, and neither is confidence. Curiosity is enough.",
};

export const pillars = {
  eyebrow: "What is Tribhang",
  titleLead: "Three pillars of",
  titleAccent: "a living practice",
  intro: "Tribhang is less a syllabus and more an ecosystem: three practices that lean on each other and change the people inside them.",
  items: [
    {
      kicker: "The Ancient Vocabulary",
      title: "Kathak",
      body: "One of India's classical dance traditions, Kathak grew from the storytellers of North India. We teach it as a language for your own expression, where each gesture is meaningful and each step deliberate.",
    },
    {
      kicker: "The Practice Within",
      title: "Reflection",
      body: "Movement becomes learning when it is noticed. Journaling, mindful attention and honest check-ins are part of every course, so you come to understand yourself as well as the form.",
    },
    {
      kicker: "A Place You Belong",
      title: "Community",
      body: "We are a community first. Everyone is known by name, their progress is noticed, and hard weeks are met with support. Friendships here tend to last.",
    },
  ],
  outro: "Each pillar strengthens the other two. The result is easier to feel than to describe.",
};

export const guru = {
  eyebrow: "Meet your educator",
  name: "Guru Ishvarya",
  stats: [
    { value: "15+ Years", label: "of classical training" },
    { value: "Lucknow", label: "Gharana lineage" },
    { value: "200+", label: "students mentored" },
  ],
  quote: "I wanted to build a room where people could return to themselves. The dance is how we get there.",
  bio: [
    "Guru Ishvarya has devoted more than fifteen years to Kathak, training in the Lucknow Gharana, a lineage known for grace, lyricism and expressive storytelling.",
    "Her students range from five-year-olds to adults who had never danced before their forties. What they share is the experience of being seen as a whole person, not only as a dancer in progress.",
    "She teaches from a simple conviction: the body holds knowledge the mind reaches only slowly. Kathak gives that knowledge a way to surface through rhythm, story and attention.",
  ],
  credentials: [
    "Lucknow Gharana, classical lineage",
    "BFA in Performing Arts",
    "Performer at national cultural festivals",
    "Mentor to 200+ students of all ages",
    "Advocate for heritage through the arts",
    "Founder, Tribhang · The Kathak Studio",
  ],
};

export const journey = {
  eyebrow: "Your journey",
  titleLead: "The Tribhang",
  titleAccent: "Experience",
  intro: "Six stages that begin wherever you are today.",
  steps: [
    { title: "Observe", body: "Sit in on a real class before deciding anything. Watch, listen, meet the Guru and the students.", note: "Free. No commitment." },
    { title: "Learn", body: "Begin at your own pace in a structured but unhurried curriculum, with every step explained patiently.", note: "Beginner to advanced." },
    { title: "Reflect", body: "Every few sessions we pause to write, talk or simply sit with what the practice is stirring.", note: "Part of every cycle." },
    { title: "Grow", body: "Progress shows up in technique, and also in confidence, self-awareness and how you carry yourself.", note: "Holistic growth." },
    { title: "Perform", body: "When you feel ready (your call), share your dance on stage in a joyful, low-pressure setting.", note: "Annual showcases & events." },
    { title: "Belong", body: "Eventually it stops being a class you attend and becomes a community you are part of.", note: "The real destination." },
  ],
};

export const rituals = {
  eyebrow: "What makes Tribhang different",
  titleLead: "The",
  titleAccent: "Rituals",
  titleTail: "of Tribhang",
  intro: "Intentional practices that sit alongside the choreography and give it depth.",
  items: [
    { title: "Journaling", body: "Every student keeps a private dance journal to track feelings, discoveries and questions along the way." },
    { title: "Goal Reviews", body: "Each quarter, student and Guru meet one-to-one to look back, celebrate, and set the next intentions." },
    { title: "Reflection Circles", body: "Regular group circles where students share what the practice has been opening up for them." },
    { title: "Community Conversations", body: "Open discussions about Kathak's history, its cultural meaning, and our own relationship with heritage." },
    { title: "Progress Celebrations", body: "First tatkar, first composition, first stage. Every milestone is noticed and honoured." },
    { title: "Gentle Accountability", body: "When someone struggles or goes quiet, the Guru reaches out personally. Support, never pressure." },
  ],
};

export const heritage = {
  eyebrow: "Heritage Journal",
  titleLead: "Kathak &",
  titleAccent: "Heritage",
  intro: "Five chapters in the story of a centuries-old art form.",
  chapters: [
    {
      label: "Temple Origins",
      aside: ["कथा: story", "कथक: the storyteller"],
      line: "It began with storytellers.",
      title: "Rooted in devotion",
      body: "Kathak traces back to the Kathakars, travelling storytellers of North India who brought epics like the Ramayana and Mahabharata to life through gesture, expression and rhythm, often in temple spaces as an act of worship.",
    },
    {
      label: "Guru Shishya",
      aside: ["Guru shishya parampara", "teacher to student, hand to hand"],
      line: "Knowledge carried in the body.",
      title: "An oral lineage",
      body: "For generations the form passed directly from teacher to student through demonstration and repetition rather than notation. Each lineage developed its own character and its own feel for rhythm and expression.",
    },
    {
      label: "Royal Courts",
      aside: ["Lucknow: grace, lyricism", "Jaipur: power, precision"],
      line: "The ghungroo found new stages.",
      title: "Refined in the courts",
      body: "Under court patronage Kathak absorbed new influences, developing its signature spins (chakkars) and intricate footwork (tatkar). Distinct gharanas emerged, notably the lyrical Lucknow school and the vigorous Jaipur school.",
    },
    {
      label: "Revival",
      aside: ["Sangeet Natak Akademi", "founded 1952"],
      line: "Sustained by those who refused to let it fade.",
      title: "Kept alive",
      body: "During the colonial period many classical arts were marginalised. Families and devoted practitioners kept Kathak going, and after independence it was championed again as a vital part of India's cultural identity.",
    },
    {
      label: "Tribhang Today",
      aside: ["Now, you are part of it."],
      line: "Kathak belongs to whoever is willing to learn.",
      title: "A living language",
      body: "We treat Kathak as something alive, not archived. It is a language that still speaks to love, loss, devotion and joy. Stepping into the studio means joining a very long conversation and adding your own voice to it.",
    },
  ],
  closingQuote: "Tradition is not ash to be preserved. It is a flame to be tended.",
};

export const life = {
  eyebrow: "Inside the studio",
  titleLead: "Life at",
  titleAccent: "Tribhang",
  items: [
    { kicker: "Perform", title: "Step into the light", body: "Festivals, annual showcases and intimate studio evenings. Performance is a gift, not a test." },
    { kicker: "Connect", title: "Find your people", body: "First-day nerves turn into lasting friendships that reach well beyond the studio." },
    { kicker: "Grow", title: "Become who you're becoming", body: "Whether it's a new tukda or simply showing up every week, progress here is seen and celebrated." },
    { kicker: "Belong", title: "Come home to yourself", body: "A place where you are known and your presence matters, with Kathak as the bridge." },
  ],
};

// Placeholder testimonials. Replace with real, consented student stories.
export const voices = {
  eyebrow: "From the community",
  titleLead: "Voices of",
  titleAccent: "Tribhang",
  videos: [
    { duration: "2:34", quote: "I assumed I was too old and too busy. Now Kathak is the part of my week I protect the most.", name: "Student Name", meta: "Student since 2022", image: "https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { duration: "3:10", quote: "The lessons are about technique, but also about carrying yourself with more ease.", name: "Student Name", meta: "Student since 2021", image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { duration: "1:58", quote: "I'd never danced and was nervous. A few weeks in, it felt like home.", name: "Student Name", meta: "Student since 2023", image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=600" },
  ],
  reflections: [
    { body: "I found the sense of belonging I hadn't known I was missing. The dance is lovely; the people are why I keep returning.", name: "Student Name", meta: "Working professional, Coimbatore" },
    { body: "I was sure I'd missed my chance with classical dance. A few months later I performed on stage for the first time, and it felt wonderful.", name: "Student Name", meta: "Parent, joined in her late thirties" },
    { body: "New city, no friends yet. I came to observe one class and signed up that week. The studio became my anchor.", name: "Student Name", meta: "Relocated to Coimbatore" },
    { body: "I'd wanted to learn for decades and finally started in my fifties. I was treated exactly like everyone else, and that meant a lot.", name: "Student Name", meta: "Retired teacher" },
  ],
  reviews: [
    { initial: "A", body: "A genuinely nurturing space, as a dancer and as a person.", name: "Reviewer A." },
    { initial: "V", body: "A teacher who really sees each student. Highly recommended.", name: "Reviewer V." },
    { initial: "L", body: "I was hesitant at first. Now I tell friends to at least go and watch one class.", name: "Reviewer L." },
  ],
};

export const observe = {
  eyebrow: "First step",
  titleLead: "Feel the room",
  titleAccent: "before you decide.",
  body: "We'd rather you see Tribhang for yourself before enrolling. Come and watch a class from the side, take in the atmosphere, and let the studio make its own case.",
  points: [
    "No previous dance experience needed",
    "No judgement, only gentle guidance",
    "Meet and talk with Guru Ishvarya in person",
    "Experience the studio atmosphere first-hand",
    "No sales pitch, no pressure",
  ],
  badge: "Completely free. No obligation.",
};

export const begin = {
  eyebrow: "The first step",
  titleLead: "Begin Your",
  titleAccent: "Journey",
  body: "Every introduction is read personally by Guru Ishvarya, who then invites you to observe a class before any enrolment. It's the start of a real conversation, not an automated funnel.",
  steps: [
    { title: "Your introduction arrives", body: "It goes straight to Guru Ishvarya. No bots, no assistants." },
    { title: "It's read with care", body: "Your story matters before your first step." },
    { title: "You're invited to observe", body: "Sit in on a class, free and without obligation." },
    { title: "You decide", body: "Only after feeling the room and meeting the community." },
  ],
};

export const footer = {
  quote: "Come to learn, to reconnect with heritage, or simply to find your place. The door is open.",
  // Site credit. Add Keerthana's WhatsApp (country code, no +, e.g. "919xxxxxxxxx") to make the credit a link.
  credit: {
    name: "Keerthana",
    whatsapp: "",
    message: "Hi Keerthana! I came across the Tribhang website you designed and loved it. I have an idea and would like your help with web development or a digital product. Could we have a quick chat?",
  },
  tagline: "Awakening the spirit through sacred steps. A space where Kathak becomes a journey of reflection, growth and belonging.",
};
