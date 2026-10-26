import { Flashcard, IELTSDiagnosticQuestion } from '../types';

export const DIAGNOSTIC_QUESTIONS: IELTSDiagnosticQuestion[] = [
  {
    id: 1,
    skill: 'Grammar',
    question: 'Choose the correct form: "By the time we arrived at the seminar, the keynote speaker _______ his presentation."',
    options: [
      'has already begun',
      'had already begun',
      'already began',
      'was already beginning'
    ],
    correctIndex: 1,
    explanation: 'The Past Perfect ("had already begun") is required because this event was completed before another past event ("we arrived").',
    uzbekNote: 'O‘tgan zamonda boshqa bir voqeadan oldin sodir bo‘lgan ish-harakat uchun Past Perfect (had + V3) ishlatiladi.'
  },
  {
    id: 2,
    skill: 'Collocations',
    question: 'Which adjective collocates naturally with "evidence" in academic writing?',
    options: [
      'deep evidence',
      'compelling evidence',
      'tall evidence',
      'heavy evidence'
    ],
    correctIndex: 1,
    explanation: '"Compelling evidence" is a high-level academic collocation meaning convincing and powerful proof.',
    uzbekNote: '"Compelling evidence" — inkor etib bo‘lmas, juda ishonchli dalil degani. Akademik maqolalarda ko‘p uchraydi.'
  },
  {
    id: 3,
    skill: 'Vocabulary',
    question: 'What is the precise meaning of the Band 9 academic word "ubiquitous"?',
    options: [
      'Extremely dangerous',
      'Present, appearing, or found everywhere',
      'Obsolete or forgotten',
      'Complicated and hard to solve'
    ],
    correctIndex: 1,
    explanation: '"Ubiquitous" refers to something that seems to be everywhere at once (e.g., "Smartphones have become ubiquitous in modern life").',
    uzbekNote: '"Ubiquitous" — hamma joyda mavjud, keng tarqalgan (masalan, zamonaviy hayotda smartfonlar).'
  },
  {
    id: 4,
    skill: 'Grammar',
    question: 'Complete the sentence with inversion: "Rarely _______ such unprecedented technological advancement."',
    options: [
      'humanity witnessed',
      'did humanity witness',
      'has humanity witnessed',
      'humanity has witnessed'
    ],
    correctIndex: 2,
    explanation: 'Negative adverbs at the beginning of a sentence (Rarely, Seldom, Never) require subject-auxiliary inversion ("has humanity witnessed").',
    uzbekNote: 'Inversiya (so‘z tartibi almashishi): "Rarely" kabi inkor so‘zlar gap boshida kelsa, yordamchi fe‘l egadan oldinga o‘tadi.'
  },
  {
    id: 5,
    skill: 'Reading',
    question: 'In an academic IELTS passage: "The hypothesis was refuted by subsequent empirical trials." What happened to the hypothesis?',
    options: [
      'It was confirmed beyond doubt',
      'It was proven false or wrong by experiments',
      'It was delayed until next year',
      'It was celebrated by researchers'
    ],
    correctIndex: 1,
    explanation: '"Refuted" means proven false with evidence.',
    uzbekNote: '"Refuted" — dalillar bilan rad etildi, asossiz deb topildi degani.'
  },
  {
    id: 6,
    skill: 'Collocations',
    question: 'Which phrase is the most natural Band 8+ transition in IELTS Writing Task 2?',
    options: [
      'As a matter of common sense',
      'Notwithstanding the aforementioned drawbacks',
      'According to me and my friends',
      'To finish up my small essay'
    ],
    correctIndex: 1,
    explanation: '"Notwithstanding the aforementioned drawbacks" is sophisticated academic phrasing for conceding opposing viewpoints.',
    uzbekNote: '"Notwithstanding the aforementioned drawbacks" — "Yuqorida qayd etilgan kamchiliklarga qaramay" degan akademik bog‘lovchi.'
  }
];

export const FLASHCARD_VOCAB_BANK: Flashcard[] = [
  {
    id: 'f1',
    word: 'Mitigate',
    phonetic: '/ˈmɪt.ɪ.ɡeɪt/',
    partOfSpeech: 'verb',
    definition: 'To make something less severe, serious, or painful.',
    uzbekTranslation: 'Yumshatmoq, ta’sirini kamaytirmoq, yengillashtirmoq',
    exampleSentence: 'Renewable energy investments help mitigate the catastrophic impacts of climate change.',
    level: 'B2',
    mastered: false
  },
  {
    id: 'f2',
    word: 'Exacerbate',
    phonetic: '/ɪɡˈzæs.ə.beɪt/',
    partOfSpeech: 'verb',
    definition: 'To make a problem, bad situation, or negative feeling worse.',
    uzbekTranslation: 'Kuchaytirib yubormoq, og‘irlashtirmoq, battar qilmoq',
    exampleSentence: 'Prolonged droughts will severely exacerbate food insecurity in vulnerable regions.',
    level: 'C1',
    mastered: false
  },
  {
    id: 'f3',
    word: 'Proliferation',
    phonetic: '/prəˌlɪf.əˈreɪ.ʃən/',
    partOfSpeech: 'noun',
    definition: 'Rapid increase in the number or amount of something.',
    uzbekTranslation: 'Tez ko‘payish, ommaviy tarqalish',
    exampleSentence: 'The proliferation of digital learning platforms has transformed global access to education.',
    level: 'C1',
    mastered: false
  },
  {
    id: 'f4',
    word: 'Pragmatic',
    phonetic: '/præɡˈmæt.ɪk/',
    partOfSpeech: 'adjective',
    definition: 'Dealing with things sensibly and realistically based on practical rather than theoretical considerations.',
    uzbekTranslation: 'Amaliy, realistik, foydali jihatga yo‘naltirilgan',
    exampleSentence: 'Policymakers must adopt a pragmatic approach to urban housing shortages.',
    level: 'B2',
    mastered: false
  },
  {
    id: 'f5',
    word: 'Discrepancy',
    phonetic: '/dɪˈskrep.ən.si/',
    partOfSpeech: 'noun',
    definition: 'An illogical or surprising lack of compatibility or similarity between two or more facts.',
    uzbekTranslation: 'Tafovut, nomuvofiqlik, ziddiyat',
    exampleSentence: 'Auditors uncovered a glaring discrepancy between projected revenues and actual earnings.',
    level: 'C1',
    mastered: false
  },
  {
    id: 'f6',
    word: 'Concomitant',
    phonetic: '/kənˈkɒm.ɪ.tənt/',
    partOfSpeech: 'adjective',
    definition: 'Naturally accompanying or associated.',
    uzbekTranslation: 'Bilan birga keluvchi, yo‘ldosh',
    exampleSentence: 'Rapid urbanization often carries concomitant strains on public transportation.',
    level: 'C2',
    mastered: false
  },
  {
    id: 'f7',
    word: 'Ephemeral',
    phonetic: '/ɪˈfem.ər.əl/',
    partOfSpeech: 'adjective',
    definition: 'Lasting for a very short time; fleeting.',
    uzbekTranslation: 'O‘tkinchi, qisqa muddatli, bir lahzalik',
    exampleSentence: 'Fame on social media is often ephemeral, disappearing within days.',
    level: 'C1',
    mastered: false
  },
  {
    id: 'f8',
    word: 'Indispensable',
    phonetic: '/ˌɪn.dɪˈspen.sə.bəl/',
    partOfSpeech: 'adjective',
    definition: 'Absolutely necessary; essential.',
    uzbekTranslation: 'O‘rnini bosib bo‘lmas, mutlaqo zarur',
    exampleSentence: 'Critical thinking has become an indispensable skill for the 21st-century workforce.',
    level: 'B2',
    mastered: false
  }
];

export const IELTS_SAMPLE_TASKS = [
  {
    id: 'task2-ai-workplace',
    type: 'Writing Task 2 (Essay)',
    title: 'Artificial Intelligence & The Future of Work',
    prompt: 'Some people believe that artificial intelligence will create more employment opportunities and prosperity, while others fear it will render millions of workers obsolete. Discuss both views and give your own opinion.',
    targetTimeMinutes: 40,
    minWords: 250,
    band9Guidelines: [
      'Paragraph 1: Clear paraphrase of the prompt + explicit thesis statement stating your nuanced stance.',
      'Paragraph 2: Explore the displacement and obsolescence arguments (e.g. routine automation, structural unemployment).',
      'Paragraph 3: Counterbalance with new job creation, higher productivity, and emerging technological sectors.',
      'Paragraph 4: Conclusion synthesizing both perspectives with a forward-looking recommendation.'
    ]
  },
  {
    id: 'task1-academic-energy',
    type: 'Writing Task 1 (Academic Report)',
    title: 'Global Renewable Energy Trends (2010–2025)',
    prompt: 'The chart below shows the proportion of electricity generated from solar, wind, and hydro sources across five nations between 2010 and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    targetTimeMinutes: 20,
    minWords: 150,
    band9Guidelines: [
      'Overview: A clear 1-2 sentence high-level overview identifying the dominant trends without listing every single number.',
      'Body 1: Detail the exponential surge of solar & wind generation.',
      'Body 2: Contrast with stable or plateauing hydroelectric capacity.'
    ]
  },
  {
    id: 'speaking-part2-mentor',
    type: 'Speaking Part 2 (Cue Card)',
    title: 'Describe an Inspiring Teacher or Mentor',
    prompt: 'Describe an inspiring teacher or mentor who had a profound impact on your life.\n\nYou should say:\n- Who this person was\n- When and where you met them\n- What special qualities they possessed\n- And explain why they made such an unforgettable difference to your path.',
    preparationSeconds: 60,
    speakingSeconds: 120,
    band9Guidelines: [
      'Fluency: Avoid prolonged pauses; use fillers naturally ("Now that I reflect upon it...", "What struck me most was...").',
      'Lexical Resource: Employ precise adjectives ("erudite", "unflinching patience", "pedagogical brilliance").',
      'Grammar: Seamlessly weave complex past modals ("Had it not been for her counsel, I would not have pursued...")'
    ]
  }
];
