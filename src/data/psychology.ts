import { BookSummary } from "../types";

export const PSYCHOLOGY_BOOKS: BookSummary[] = [
  {
    id: "dreams",
    titleAr: "تفسير الأحلام",
    titleEn: "The Interpretation of Dreams",
    authorAr: "سيجموند فرويد",
    authorEn: "Sigmund Freud",
    year: 1899,
    categoryAr: "مدرسة التحليل النفسي",
    categoryEn: "Psychoanalysis",
    overviewAr: "يعتبر هذا الكتاب حجر الأساس لمدرسة التحليل النفسي. يطرح فيه فرويد نظريته الثورية بأن الأحلام ليست مجرد تشويش بيولوجي، بل هي 'الطريق الملكي إلى اللاشعور'. يرى فرويد أن العقل الباطن يخزن الرغبات المكبوتة والصدمات القديمة، وتعمل الأحلام كمتنفس رمزي للتعبير عنها وتخفيف التوتر النفسي دون إيقاظ الوعي.",
    overviewEn: "This landmark book introduced the theory of psychoanalysis. Freud argues that dreams are 'the royal road to the unconscious,' serving as a coded pathway to repressed desires, anxieties, and childhood memories that the waking mind actively suppresses.",
    keyConcepts: [
      {
        title: "اللاشعور (العقل الباطن)",
        description: "مستودع ضخم للذكريات المكبوتة، الدوافع الفطرية، والمخاوف التي توجه سلوكنا دون وعي منا، ويشبه جبل الجليد الغارق تحت الماء.",
        icon: "Moon"
      },
      {
        title: "صراعات الهو والأنا والأنا الأعلى",
        description: "يتكون الجهاز النفسي من 'الهو' (الغرائز واللذة)، و'الأنا الأعلى' (الضمير والقيم المجتمعية)، و'الأنا' (المصلح الواقعي الذي يوازن بينهما).",
        icon: "Layers"
      },
      {
        title: "آليات الدفاع النفسي",
        description: "حيل غير واعية يستخدمها الأنا لحماية نفسه من القلق الناتج عن الصراعات النفسية، مثل الكبت، الإسقاط، والتبرير والإنكار.",
        icon: "Shield"
      }
    ],
    quotes: [
      {
        text: "الأحلام هي الطريق الملكي المؤدي إلى معرفة أنشطة العقل الباطن.",
        context: "من الفصل الرابع، عند شرح كيفية عمل آليات الرمز والتكثيف في الأحلام."
      },
      {
        text: "المكبوتات تظل حية وتسعى دائماً للتعبير عن نفسها في سلوكياتنا اليومية وأحلامنا.",
        context: "شرح نظرية العقد النفسية وتأثير الطفولة المبكرة."
      }
    ],
    mindMapNodes: [
      { id: "core", label: "تفسير الأحلام", type: "core", x: 50, y: 50 },
      { id: "unconscious", label: "اللاشعور", type: "main", x: 20, y: 30 },
      { id: "dreams_path", label: "الأحلام كرموز", type: "sub", x: 15, y: 15 },
      { id: "defense", label: "آليات الدفاع", type: "main", x: 80, y: 30 },
      { id: "repression", label: "الكبت والإسقاط", type: "sub", x: 85, y: 15 },
      { id: "personality", label: "الجهاز النفسي", type: "main", x: 50, y: 80 },
      { id: "ego", label: "الهو، الأنا، الأنا الأعلى", type: "sub", x: 50, y: 95 }
    ],
    mindMapEdges: [
      { from: "core", to: "unconscious" },
      { from: "unconscious", to: "dreams_path" },
      { from: "core", to: "defense" },
      { from: "defense", to: "repression" },
      { from: "core", to: "personality" },
      { from: "personality", to: "ego" }
    ]
  },
  {
    id: "meaning",
    titleAr: "الإنسان يبحث عن المعنى",
    titleEn: "Man's Search for Meaning",
    authorAr: "فيكتور فرانكل",
    authorEn: "Viktor Frankl",
    year: 1946,
    categoryAr: "علم النفس الوجودي والعلاج بالمعنى",
    categoryEn: "Existential Psychology & Logotherapy",
    overviewAr: "يوثق هذا الكتاب المذهل تجربة الطبيب النفسي فرانكل داخل معسكرات الاعتقال النازية. ويخلص إلى نظرية وجودية عميقة مفادها أن الدافع الأساسي والأعمق للإنسان ليس المتعة أو القوة، بل هو 'البحث عن معنى لحياته'. ويوضح أن الإنسان يمتلك دائماً حرية اختيار موقفه وتفكيره تجاه أي ظرف خارجي مهما كان قاسياً.",
    overviewEn: "This profound book details Frankl's survival in Nazi concentration camps and introduces logotherapy. He argues that the primary human drive is not pleasure or power, but the search for meaning, and that we retain the freedom to choose our attitude in any circumstance.",
    keyConcepts: [
      {
        title: "العلاج بالمعنى (Logotherapy)",
        description: "مدرسة علاجية تركز على مساعدة المريض في العثور على غاية وهدف شخصي لحياته للتغلب على الفراغ الوجودي.",
        icon: "Compass"
      },
      {
        title: "الحرية الأخيرة للإنسان",
        description: "قدرة الفرد على اختيار موقفه العقلي والروحي تجاه معاناته وظروفه الصعبة، حتى لو سُلبت منه حريته الجسدية بالكامل.",
        icon: "Sparkles"
      },
      {
        title: "المعنى في العمل والمحبّة والمعاناة",
        description: "ثلاث طرق رئيسية لاكتشاف المعنى: خلق عمل أو إنجاز، تجربة الحب والاتصال بالآخرين، ومواجهة المعاناة الحتمية بشجاعة وكرامة.",
        icon: "Heart"
      }
    ],
    quotes: [
      {
        text: "إن أولئك الذين لديهم سبب للعيش، يمكنهم تحمل أي طريقة للعيش تقريباً.",
        context: "اقتباس شهير لنيتشه استشهد به فرانكل كثيراً لوصف كيف نجا السجناء الذين كان لديهم أمل وهدف مستقبلي."
      },
      {
        text: "حين لا نعود قادرين على تغيير موقف ما، نصبح أمام تحدي تغيير أنفسنا.",
        context: "حول قبول القدر وتحويل المعاناة إلى انتصار إنساني داخلي."
      }
    ],
    mindMapNodes: [
      { id: "core", label: "الإنسان يبحث عن المعنى", type: "core", x: 50, y: 50 },
      { id: "logotherapy", label: "العلاج بالمعنى", type: "main", x: 25, y: 35 },
      { id: "existential_vacuum", label: "الفراغ الوجودي", type: "sub", x: 15, y: 20 },
      { id: "inner_freedom", label: "الحرية الداخلية", type: "main", x: 75, y: 35 },
      { id: "attitude", label: "اختيار الموقف عقلياً", type: "sub", x: 85, y: 20 },
      { id: "finding_meaning", label: "مصادر المعنى", type: "main", x: 50, y: 80 },
      { id: "love_work_suffering", label: "العمل، الحب، المعاناة", type: "sub", x: 50, y: 95 }
    ],
    mindMapEdges: [
      { from: "core", to: "logotherapy" },
      { from: "logotherapy", to: "existential_vacuum" },
      { from: "core", to: "inner_freedom" },
      { from: "inner_freedom", to: "attitude" },
      { from: "core", to: "finding_meaning" },
      { from: "finding_meaning", to: "love_work_suffering" }
    ]
  },
  {
    id: "fast_slow",
    titleAr: "التفكير السريع والبطيء",
    titleEn: "Thinking, Fast and Slow",
    authorAr: "دانيال كانمان",
    authorEn: "Daniel Kahneman",
    year: 2011,
    categoryAr: "علم النفس المعرفي واقتصاد السلوك",
    categoryEn: "Cognitive Psychology & Behavioral Economics",
    overviewAr: "يقدم الحائز على جائزة نوبل خلاصة أبحاثه حول العقل البشري، موضحاً أنه يعمل بنظامين متكاملين للتفكير: النظام الأول السريع والحدسي والمسؤول عن معظم قراراتنا اليومية، والنظام الثاني البطيء والتحليلي الذي يستلزم جهداً وتركيزاً. ويكشف كيف يقع النظام الأول في أخطاء فادحة وتحيزات إدراكية دون وعينا.",
    overviewEn: "Nobel laureate Daniel Kahneman explains the two systems that drive the way we think: System 1 (fast, intuitive, emotional) and System 2 (slow, deliberative, logical). He exposes how cognitive biases influence our decisions in business and personal life.",
    keyConcepts: [
      {
        title: "النظام الأول (التفكير السريع)",
        description: "نظام لا واعي، فوري، يتطلب مجهوداً شبه منعدم. يعتمد على الحدس والخبرات السابقة، رائع للمواقف البسيطة والطارئة ولكنه مليء بالتحيزات البصرية والفكرية.",
        icon: "Zap"
      },
      {
        title: "النظام الثاني (التفكير البطيء)",
        description: "نظام واعي، بطيء، يتطلب تركيزاً عصبياً وحسابياً كبيراً. يُستدعى للمشكلات الصعبة والتدقيق الرياضي والمنطقي، ولكنه يتسم بالكسل ويفضل تفويض المهام للنظام الأول.",
        icon: "Brain"
      },
      {
        title: "الانحياز التأكيدي والتمثيل",
        description: "الميل الطبيعي للعقل للبحث عن معلومات تؤيد فرضياته السابقة وتجاهل الأدلة المخالفة، بجانب اختصار المواقف المعقدة في قوالب جاهزة مضللة.",
        icon: "Target"
      }
    ],
    quotes: [
      {
        text: "نحن نجهل جهلنا، ومع ذلك فإننا نادراً ما ندرك كم نحن نجهل!",
        context: "من الفصل الخاص بالثقة المفرطة والوهم المعرفي."
      },
      {
        text: "النظام الأول يعمل بالترابط المباشر، بينما النظام الثاني هو من يعيد فحص هذا الترابط.",
        context: "شرح كيفية اتخاذ القرارات الاقتصادية والشخصية."
      }
    ],
    mindMapNodes: [
      { id: "core", label: "التفكير السريع والبطيء", type: "core", x: 50, y: 50 },
      { id: "system1", label: "النظام 1 (السريع)", type: "main", x: 25, y: 30 },
      { id: "intuitive", label: "الحدس والكسل العقلي", type: "sub", x: 15, y: 15 },
      { id: "system2", label: "النظام 2 (البطيء)", type: "main", x: 75, y: 30 },
      { id: "analytical", label: "المنطق والتركيز المجهد", type: "sub", x: 85, y: 15 },
      { id: "biases", label: "التحيزات الإدراكية", type: "main", x: 50, y: 80 },
      { id: "confirmation_bias", label: "الانحياز التأكيدي والتمثيل", type: "sub", x: 50, y: 95 }
    ],
    mindMapEdges: [
      { from: "core", to: "system1" },
      { from: "system1", to: "intuitive" },
      { from: "core", to: "system2" },
      { from: "system2", to: "analytical" },
      { from: "core", to: "biases" },
      { from: "biases", to: "confirmation_bias" }
    ]
  },
  {
    id: "influence",
    titleAr: "التأثير: علم نفس الإقناع",
    titleEn: "Influence: The Psychology of Persuasion",
    authorAr: "روبرت سيالديني",
    authorEn: "Robert Cialdini",
    year: 1984,
    categoryAr: "علم النفس الاجتماعي والسلوك الاستهلاكي",
    categoryEn: "Social Psychology & Consumer Behavior",
    overviewAr: "يشرح روبرت سيالديني في هذا الكتاب الكلاسيكي الأسلحة النفسية الستة التي يستخدمها 'محترفو الإقناع' (مثل رجال المبيعات والمسوقين) لدفعنا للموافقة وإصدار رد فعل نعم تلقائي. يوضح الكتاب كيف يمكن استغلال هذه المبادئ الفطرية لتوجيه سلوكيات الجماهير والأفراد بذكاء.",
    overviewEn: "Robert Cialdini explains the six psychological principles of persuasion that influence human behavior, particularly how we are convinced to say 'yes' automatically, and how to defend ourselves against manipulation.",
    keyConcepts: [
      {
        title: "المعاملة بالمثل والدليل الاجتماعي",
        description: "المعاملة بالمثل تدفعنا لرد الجميل لمن قدم لنا خدمة ولو بسيطة. الدليل الاجتماعي يدفعنا لتقليد الآخرين في تصرفاتهم عند الحيرة (سلوك القطيع).",
        icon: "Users"
      },
      {
        title: "الالتزام والاتساق والقبول",
        description: "يريد الإنسان بطبيعته إظهار الاتساق بين أفعاله الحالية ووعوده السابقة. كما يميل للموافقة على طلبات الأشخاص الذين يحبهم أو يشبهونه.",
        icon: "UserCheck"
      },
      {
        title: "السلطة والندرة",
        description: "نميل لطاعة الخبراء ومن يرتدون زياً رسمياً أو يملكون ألقاباً هامة. وتزداد قيمتنا ورغبتنا في الأشياء عندما نعلم أنها محدودة الكمية والوقت.",
        icon: "Award"
      }
    ],
    quotes: [
      {
        text: "عندما يتحرك الجميع في نفس الاتجاه، فهناك احتمال كبير بأن لا أحد يفكر حقاً.",
        context: "في الفصل المخصص للدليل الاجتماعي (Social Proof) وكيف يحدث الخداع الجماعي."
      },
      {
        text: "طريقة حب شيء ما هي إدراك أنه قد يضيع منك في أي لحظة.",
        context: "حول مبدأ الندرة (Scarcity) وكيف يعمل في الإعلانات والمبيعات."
      }
    ],
    mindMapNodes: [
      { id: "core", label: "علم نفس الإقناع", type: "core", x: 50, y: 50 },
      { id: "recip_social", label: "التبادل والمحاكاة", type: "main", x: 20, y: 35 },
      { id: "social_proof", label: "سلوك القطيع الاجتماعي", type: "sub", x: 10, y: 20 },
      { id: "commit_liking", label: "الالتزام والمحبة", type: "main", x: 80, y: 35 },
      { id: "consistency", label: "الاتساق مع الوعود", type: "sub", x: 90, y: 20 },
      { id: "auth_scarcity", label: "السلطة والندرة", type: "main", x: 50, y: 80 },
      { id: "fom_effect", label: "تأثير فوات الفرص وفزع الندرة", type: "sub", x: 50, y: 95 }
    ],
    mindMapEdges: [
      { from: "core", to: "recip_social" },
      { from: "recip_social", to: "social_proof" },
      { from: "core", to: "commit_liking" },
      { from: "commit_liking", to: "consistency" },
      { from: "core", to: "auth_scarcity" },
      { from: "auth_scarcity", to: "fom_effect" }
    ]
  },
  {
    id: "human_nature",
    titleAr: "فهم الطبيعة البشرية",
    titleEn: "Understanding Human Nature",
    authorAr: "ألفرد أدلر",
    authorEn: "Alfred Adler",
    year: 1927,
    categoryAr: "علم النفس الفردي وعلم الاجتماع",
    categoryEn: "Individual Psychology",
    overviewAr: "يطرح فيه أدلر نظريته في علم النفس الفردي، مؤكداً أن سلوك الإنسان ليس محكوماً بالغرائز الجنسية فقط كفرويد، بل يهدف إلى تحقيق مكانة اجتماعية والتغلب على 'عقدة النقص' الفطرية. يوضح كيف يتشكل نمط الحياة والشخصية في الطفولة بالأسرة ويؤثر على المستقبل والغاية.",
    overviewEn: "Alfred Adler presents his concept of individual psychology, arguing that human behavior is motivated by social goals and the drive to overcome feelings of inferiority and achieve a sense of belonging and community.",
    keyConcepts: [
      {
        title: "مشاعر وعقدة النقص (Inferiority Complex)",
        description: "شعور طبيعي يولد مع كل طفل لصغر حجمه وضعفه أمام الكبار، ويتحول لدافع إيجابي للتطور، أو عقدة سلبية إذا تم كبته أو تضخيمه.",
        icon: "Compass"
      },
      {
        title: "السعي نحو التفوق والكمّال",
        description: "القوة المحركة للذات البشرية لتعويض النقص والتغلب على مصاعب الحياة ونيل القبول والنجاح.",
        icon: "Target"
      },
      {
        title: "الاهتمام الاجتماعي والأسرة",
        description: "مقياس الصحة النفسية لدى أدلر هو رغبة الفرد ومساهمته في رفاهية المجتمع. ويتأثر نمط حياته بترتيب ولادته في الأسرة بشكل مباشر.",
        icon: "Users"
      }
    ],
    quotes: [
      {
        text: "أن تكون إنساناً يعني أن تشعر بالنقص وتحاول التغلب عليه لتنمو.",
        context: "من مقدمة الكتاب حول منشأ الشخصية البشرية والتطور."
      },
      {
        text: "لا تكمن أهمية ترتيب الولادة في الرقم نفسه، بل في التوقعات والمناخ الاجتماعي الذي يحيط بالطفل.",
        context: "شرح تأثيرات الطفل الأكبر، والأوسط، والأصغر، والوحيد."
      }
    ],
    mindMapNodes: [
      { id: "core", label: "فهم الطبيعة البشرية", type: "core", x: 50, y: 50 },
      { id: "inferiority", label: "عقدة النقص", type: "main", x: 25, y: 35 },
      { id: "compensation", label: "التعويض والتطوير", type: "sub", x: 15, y: 20 },
      { id: "social_interest", label: "الاهتمام الاجتماعي", type: "main", x: 75, y: 35 },
      { id: "community", label: "المساهمة في المجتمع", type: "sub", x: 85, y: 20 },
      { id: "birth_order", label: "ترتيب الولادة بالأسرة", type: "main", x: 50, y: 80 },
      { id: "lifestyle", label: "نمط الحياة المتشكل بالطفولة", type: "sub", x: 50, y: 95 }
    ],
    mindMapEdges: [
      { from: "core", to: "inferiority" },
      { from: "inferiority", to: "compensation" },
      { from: "core", to: "social_interest" },
      { from: "social_interest", to: "community" },
      { from: "core", to: "birth_order" },
      { from: "birth_order", to: "lifestyle" }
    ]
  }
];
