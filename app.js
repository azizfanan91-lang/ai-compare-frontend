
const BACKEND_URL = "https://ai-compare-backend-x063.onrender.com";

// تُستعمل فقط إذا تعذّر جلب القائمة الحية من OpenRouter بالكامل (مشكل شبكة مثلاً).
// نماذج مجانية احتياطية صالحة؛ الخادم عنده fallback إضافي إذا كان أحدها مزدحما.
const FALLBACK_MODELS = [
  { id: "openrouter/free", label: "Auto (Free)" },
  { id: "google/gemma-4-31b-it:free", label: "Gemma 4 31B" },
  { id: "nvidia/nemotron-3.5-lightning:free", label: "Nemotron Lightning" }
];

const MAX_TEXT_CHARS = 12000;   // حد النص المرسل للنموذج (تحرير/تلخيص)
const MAX_DATA_CHARS = 14000;   // حد البيانات المرسلة للتحليل
const MAX_FILE_BYTES = 500 * 1024;
const DEFAULT_SELECTED = 2;     // عدد النماذج المحددة افتراضياً

let MODELS = [];

// ---------- Translations ----------
// حدود الاستعمال (كتتحدث من /api/payment/config)
let LIMITS = { trialDays: 7, freeChat: 10, freeImage: 3, premiumImage: 100 };

const I18N = {
  ar: {
    pageTitle: "QueryMix — قارن إجابات نماذج الذكاء الاصطناعي",
    navHome: "الرئيسية", navTools: "الأدوات", navHow: "كيف تبدأ", navPricing: "الأسعار",
    heroTitle: "قارن إجابات عدة نماذج ذكاء اصطناعي في مكان واحد",
    heroText: "اسأل سؤالاً واحداً واحصل على إجابات عدة نماذج جنباً إلى جنب، مع أدوات للتلخيص وتحليل البيانات وتوليد الصور، بالعربية والفرنسية والإنجليزية.",
    heroCta1: "ابدأ الآن", heroCta2: "استكشف الأدوات",
    tEditT: "مقارنة النماذج", tEditD: "اسأل سؤالاً واحداً واحصل على إجابات عدة نماذج جنباً إلى جنب.",
    tImgT: "توليد الصور", tImgD: "حوّل أفكارك إلى صور مذهلة بذكاء اصطناعي وبأساليب متنوعة.",
    tDataT: "تحليل البيانات", tDataD: "حلّل بياناتك واكتشف الأنماط واحصل على رؤى دقيقة تدعم قراراتك.",
    tSumT: "تلخيص المستندات", tSumD: "لخّص المستندات الطويلة واستخرج أهم النقاط بسرعة ودقة.",
    toolsTitle: "الأدوات", toolsSub: "اختر أداة وابدأ العمل.",
    workflowsTitle: "Workflows جاهزة", workflowsSub: "اختار مهمة، عمر المعلومات، وخلي الذكاء الاصطناعي يكمل الباقي.",
    wfProductT: "وصف منتج", wfProductD: "وصف مقنع جاهز للبيع",
    wfAdT: "إعلان تسويقي", wfAdD: "إعلان لـ Facebook أو Instagram",
    wfPdfT: "تلخيص PDF", wfPdfD: "استخراج أهم الأفكار والنقاط",
    wfExcelT: "تحليل البيانات", wfExcelD: "رؤى من CSV أو Excel",
    wfTranslateT: "ترجمة احترافية", wfTranslateD: "ترجمة مع الحفاظ على الأسلوب",
    wfSocialT: "منشور سوشيال", wfSocialD: "منشور جاهز للنشر",
    savedTitle: "نتائجي المحفوظة", savedSub: "رجع للنتائج المهمة أو عاود استعملها.",
    loadSavedBtn: "تحديث", savedEmpty: "مازال ما حفظتي حتى نتيجة.", saveBtn: "حفظ", savedBtn: "تم الحفظ", useSavedBtn: "استعمال", deleteSavedBtn: "حذف", saveError: "تعذّر حفظ النتيجة.",
    welcomeTitle: "مرحبا بك في QueryMix", welcomeText: "شنو بغيتي تنجز اليوم؟ اختار مهمة ونبدأو مباشرة.", welcomeSkip: "تخطي واستكشف الأدوات",
    modelsLabel: "النماذج — اختر نموذجاً أو أكثر وقارن النتائج جنب بعض", compareSelectedLabel: "عدد النماذج المختارة", selectTwo: "اختيار جوج", selectThree: "اختيار ثلاثة", responseWorking: "كيجاوب...", responseReady: "جاهز", responseFailed: "ماخدمش", responseTime: (ms) => `${(ms / 1000).toFixed(1)} ث`, 
    previewTitle: "جرب QueryMix بلا تسجيل", previewSub: "كتب سؤال واحد وشوف الجواب ديال جوج نماذج جنباً إلى جنب.", previewBadge: "تجربة مجانية", previewPh: "مثال: شرح الفرق بين الذكاء الاصطناعي والتعلم الآلي في 3 نقاط.", previewModelsLabel: "اختار النماذج", previewRun: "جرب المقارنة", previewHint: "سؤال واحد بلا تسجيل", previewGateText: "عجباتك المقارنة؟ صاوب حساب باش تسول أسئلة أخرى وتحفظ النتائج.", previewSignup: "سجّل مجاناً", shareBtn: "مشاركة", sharedBtn: "تمت المشاركة",
    copyBtn: "نسخ", copiedBtn: "تم النسخ",
    guestLabel: "سجّل الدخول لبدء التجربة المجانية",
    editPh: "اكتب سؤالك هنا...", editRun: "قارن الإجابات",
    imgPh: "صف الصورة التي تريدها بالتفصيل... (الوصف بالإنجليزية يعطي غالباً نتائج أدق)",
    imgStyle: "الأسلوب", stNone: "بدون", stReal: "واقعي", stDigital: "رسم رقمي", stAnime: "أنمي", st3d: "ثلاثي الأبعاد", stWater: "ألوان مائية",
    imgSize: "الحجم",
    imgRun: "ولّد الصورة", imgOpen: "فتح الصورة", imgLoading: "كنولدو الصورة...",
    imgRemainingLabel: (r, l) => `باقي ${r} من ${l} صور اليوم`,
    imgError: "تعذّر توليد الصورة. جرّب وصفاً آخر أو أعد المحاولة.",
    imgNote: "الصور تُولَّد على السيرفر عبر خدمة Pollinations، والوصف الذي تكتبه يُرسل إليها. بعض النماذج أبطأ من غيرها.",
    imgModelsLabel: "نماذج توليد الصور — اختر نموذجاً أو أكثر وقارن النتائج",
    imgSave: "تحميل",
    imgNoService: "خدمة توليد الصور غير متاحة الآن. حاول لاحقاً.",
    emptyImgAlert: "كتب وصف للصورة",
    uploadCsv: "رفع ملف CSV", uploadTxt: "رفع ملف نصي",
    dataPh: "الصق بياناتك هنا (CSV أو جدول منسوخ) أو ارفع ملفاً...",
    dataQPh: "ماذا تريد أن تعرف؟ (اختياري)",
    dataRun: "حلّل البيانات",
    dataNote: "التحليل يتم بواسطة نموذج لغوي، فالأرقام تقريبية وتحتاج مراجعتك.",
    emptyDataAlert: "الصق بياناتك أو ارفع ملفاً",
    sumPh: "الصق النص الطويل هنا أو ارفع ملفاً نصياً...",
    sumLen: "الطول", lenShort: "قصير", lenMedium: "متوسط", lenLong: "مفصّل",
    sumFmt: "الشكل", fmtPara: "فقرة", fmtBullets: "نقاط",
    sumRun: "لخّص النص",
    tAgentT: "وكلاء ذكيون", tAgentD: "اختر وكيلاً متخصصاً (مترجم، كاتب، مبرمج...) وقارن إجابات النماذج.",
    agentLabel: "الوكيل", agentPh: "اكتب طلبك للوكيل هنا...", agentRun: "اسأل الوكيل",
    emptyAgentAlert: "اكتب طلبك أولاً",
    emptyTextAlert: "الصق النص أولاً",
    fileTooBig: "الملف كبير جداً (الحد 500 كيلوبايت)",
    fileReadErr: "تعذّرت قراءة الملف", pdfNoText: "هذا الـPDF ما فيهش نص قابل للاستخراج. جرّب ملفاً آخر.",
    truncated: "النص طويل، تمت معالجة الجزء الأول منه فقط.",
    howTitle: "كيف تبدأ",
    s1t: "أنشئ حسابك", s1d: "سجّل دخولك وابدأ رحلتك مع QueryMix مجاناً لمدة 7 أيام.",
    s2t: "اختر الأداة", s2d: "تصفح الأدوات واختر ما يناسب احتياجاتك.",
    s3t: "أدخل بياناتك", s3d: "قدّم المعلومات المطلوبة للحصول على أفضل نتيجة.",
    s4t: "احصل على النتائج", s4d: "استلم النتائج وصدّرها أو شاركها بسهولة.",
    pricingTitle: "الأسعار", pricingSub: "ابدأ مجاناً، وترقّى عندما تحتاج.",
    freePlan: "التجربة المجانية", freePer: "/ 7 أيام",
    freeLi1: () => `${LIMITS.trialDays} أيام تجربة مجانية: ${LIMITS.freeChat} محادثات و${LIMITS.freeImage} صور فـ النهار`, freeLi2: "كل الأدوات الأربع", freeLi3: "بدون بطاقة بنكية",
    freeBtn: "ابدأ مجاناً",
    premPer: "/ الشهر",
    premLi1: () => `استخدام موسّع مع كل النماذج: حتى ${LIMITS.premiumImage} صورة فـ النهار (حد استخدام عادل)`, premLi2: "كل الأدوات الأربع", premLi3: "الدفع الآمن عبر Gumroad",
    ctaTitle: "جاهز للانطلاق؟", ctaText: "انضم إلى المستخدمين الذين ينجزون أعمالهم بسرعة وذكاء مع QueryMix.",
    ctaBtnText: "ابدأ الآن مجاناً",
    loginTitle: "تسجيل الدخول",
    signupTitle: "صاوب حساب جديد",
    emailPlaceholder: "الإيميل ديالك",
    passwordPlaceholder: "كلمة السر",
    loginBtn: "دخول",
    signupBtn: "تسجيل",
    switchToSignupText: "ما عندكش حساب؟",
    switchToSignupLink: "صاوب واحد",
    switchToLoginText: "عندك حساب من قبل؟",
    switchToLoginLink: "دخول",
    fillFields: "عمر الإيميل وكلمة السر",
    working: "كيخدم...",
    forgotLink: "نسيتي كلمة السر؟",
    forgotTitle: "نسيتي كلمة السر؟",
    forgotHint: "كتب الإيميل ديالك وغنصيفطو ليك رابط باش تبدل كلمة السر.",
    forgotBtn: "صيفط الرابط",
    forgotSent: "إلا كان هاد الإيميل مسجل عندنا، غادي توصلك رسالة فيها الرابط (شوف حتى Spam). الرابط صالح ساعة وحدة.",
    resetTitle: "كلمة سر جديدة",
    resetNewPw: "كلمة السر الجديدة (8 على الأقل)",
    resetBtn: "بدل كلمة السر",
    resetDone: "تبدلات كلمة السر. دابا تقدر تدخل.",
    resetGoLogin: "دخول",
    resetBadLink: "الرابط ماشي صالح ولا سالا. عاود طلب رابط جديد.",
    genericError: "وقع مشكل",
    connError: "خطأ فـ الاتصال بالسيرفر. يمكن السيرفر كيبدا (جرب مرة أخرى بعد 30 ثانية).",
    logoutBtn: "خروج",
    premiumLabel: "مشترك",
    chatUsageLabel: (r, l) => `المحادثات: باقي ${r} من ${l} اليوم`,
    trialLabel: (d) => d === 1 ? "باقي يوم واحد فـ التجربة المجانية" : `باقي ${d} أيام فـ التجربة المجانية`,
    trialEndedLabel: "خلصات التجربة المجانية — اشترك باش تكمل",
    runningBtn: "كيخدم...",
    noModelAlert: "ختار على الأقل نموذج واحد",
    limitReachedShort: "وصلتي للحد اليومي",
    providerLimitShort: "النماذج المجانية مشغولة مؤقتا", fallbackBadge: "نموذج بديل",
    errorPrefix: "خطأ: ",
    connErrorPrefix: "خطأ فـ الاتصال: ",
    loadingModels: "كنحملو النماذج المجانية...",
    subscribeTitle: "الاشتراك الشهري",
    subscribeLinkText: "اشترك الآن",
    checkSubText: "تحققت من الدفع؟ اضغط هنا",
    checkingSub: "كنتحققو من الاشتراك...",
    subSuccess: "تفعل الاشتراك بنجاح! 🎉",
    subNotYet: "مازال ماوصلش تأكيد الدفع، استنى شوية وعاود جرب (ممكن ياخد دقيقة)",
    subCheckError: "خطأ فـ الاتصال بالسيرفر",
    paymentNotReady: "الدفع ماشي معمر مزيان دابا، عاود جرب من بعد"
  },
  fr: {
    pageTitle: "QueryMix — Comparez les réponses des modèles d'IA",
    navHome: "Accueil", navTools: "Outils", navHow: "Comment ça marche", navPricing: "Tarifs",
    heroTitle: "Comparez les réponses de plusieurs modèles d'IA au même endroit",
    heroText: "Posez une question et comparez les réponses de plusieurs modèles côte à côte, avec des outils de résumé, d'analyse de données et de génération d'images, en arabe, français et anglais.",
    heroCta1: "Commencer", heroCta2: "Explorer les outils",
    tEditT: "Comparer les modèles", tEditD: "Posez une question et comparez les réponses de plusieurs modèles.",
    tImgT: "Génération d'images", tImgD: "Transformez vos idées en images surprenantes, dans divers styles.",
    tDataT: "Analyse de données", tDataD: "Analysez vos tableaux, repérez les tendances et obtenez des pistes utiles.",
    tSumT: "Résumé de documents", tSumD: "Résumez de longs documents et extrayez l'essentiel, rapidement et avec précision.",
    toolsTitle: "Outils", toolsSub: "Choisissez un outil et lancez-vous.",
    workflowsTitle: "Workflows prêts", workflowsSub: "Choisissez une tâche, ajoutez vos informations et laissez l'IA faire le reste.",
    wfProductT: "Description produit", wfProductD: "Une description qui vend",
    wfAdT: "Publicité marketing", wfAdD: "Annonce pour Facebook ou Instagram",
    wfPdfT: "Résumé PDF", wfPdfD: "Les idées et points essentiels",
    wfExcelT: "Analyse de données", wfExcelD: "Des insights depuis CSV ou Excel",
    wfTranslateT: "Traduction pro", wfTranslateD: "Traduire en gardant le style",
    wfSocialT: "Post réseaux sociaux", wfSocialD: "Un post prêt à publier",
    savedTitle: "Mes résultats enregistrés", savedSub: "Retrouvez et réutilisez vos meilleurs résultats.",
    loadSavedBtn: "Actualiser", savedEmpty: "Aucun résultat enregistré.", saveBtn: "Enregistrer", savedBtn: "Enregistré", useSavedBtn: "Utiliser", deleteSavedBtn: "Supprimer", saveError: "Impossible d'enregistrer le résultat.",
    welcomeTitle: "Bienvenue sur QueryMix", welcomeText: "Que voulez-vous accomplir aujourd'hui ? Choisissez une tâche pour commencer.", welcomeSkip: "Passer et explorer les outils",
    modelsLabel: "Modèles — choisissez-en un ou plusieurs et comparez les résultats côte à côte", compareSelectedLabel: "Modèles sélectionnés", selectTwo: "Choisir 2", selectThree: "Choisir 3", responseWorking: "Réponse en cours...", responseReady: "Terminé", responseFailed: "Échec", responseTime: (ms) => `${(ms / 1000).toFixed(1)} s`, 
    previewTitle: "Essayez QueryMix sans inscription", previewSub: "Posez une question et comparez deux modèles côte à côte.", previewBadge: "Essai gratuit", previewPh: "Exemple : expliquez la différence entre IA et apprentissage automatique en 3 points.", previewModelsLabel: "Choisissez les modèles", previewRun: "Essayer la comparaison", previewHint: "Une question sans inscription", previewGateText: "Vous aimez la comparaison ? Créez un compte pour poser d’autres questions et enregistrer vos résultats.", previewSignup: "Créer un compte", shareBtn: "Partager", sharedBtn: "Partagé",
    copyBtn: "Copier", copiedBtn: "Copié",
    guestLabel: "Connectez-vous pour démarrer l'essai gratuit",
    editPh: "Écrivez votre question ici...", editRun: "Comparer les réponses",
    imgPh: "Décrivez l'image souhaitée en détail... (une description en anglais donne souvent de meilleurs résultats)",
    imgStyle: "Style", stNone: "Aucun", stReal: "Réaliste", stDigital: "Illustration numérique", stAnime: "Anime", st3d: "3D", stWater: "Aquarelle",
    imgSize: "Taille",
    imgRun: "Générer l'image", imgOpen: "Ouvrir l'image", imgLoading: "Génération de l'image...",
    imgRemainingLabel: (r, l) => `${r} sur ${l} images restantes aujourd'hui`,
    imgError: "Impossible de générer l'image. Essayez une autre description ou réessayez.",
    imgNote: "Les images sont générées côté serveur via le service Pollinations ; votre description lui est envoyée. Certains modèles sont plus lents que d'autres.",
    imgModelsLabel: "Modèles d'image — choisissez-en un ou plusieurs et comparez",
    imgSave: "Télécharger",
    imgNoService: "Le service de génération d'images est indisponible pour le moment.",
    emptyImgAlert: "Écrivez une description",
    uploadCsv: "Importer un CSV", uploadTxt: "Importer un fichier texte",
    dataPh: "Collez vos données ici (CSV ou tableau copié) ou importez un fichier...",
    dataQPh: "Que voulez-vous savoir ? (facultatif)",
    dataRun: "Analyser les données",
    dataNote: "L'analyse est faite par un modèle de langage : les chiffres sont approximatifs et à vérifier.",
    emptyDataAlert: "Collez vos données ou importez un fichier",
    sumPh: "Collez le long texte ici ou importez un fichier texte...",
    sumLen: "Longueur", lenShort: "Court", lenMedium: "Moyen", lenLong: "Détaillé",
    sumFmt: "Format", fmtPara: "Paragraphe", fmtBullets: "Puces",
    sumRun: "Résumer le texte",
    tAgentT: "Agents IA", tAgentD: "Choisissez un agent spécialisé (traducteur, rédacteur, développeur...) et comparez les réponses.",
    agentLabel: "Agent", agentPh: "Écrivez votre demande à l'agent ici...", agentRun: "Demander à l'agent",
    emptyAgentAlert: "Écrivez d'abord votre demande",
    emptyTextAlert: "Collez d'abord un texte",
    fileTooBig: "Fichier trop volumineux (limite 500 Ko)",
    fileReadErr: "Impossible de lire le fichier", pdfNoText: "Ce PDF ne contient pas de texte extractible. Essayez un autre fichier.",
    truncated: "Texte long : seule la première partie a été traitée.",
    howTitle: "Comment ça marche",
    s1t: "Créez votre compte", s1d: "Inscrivez-vous et démarrez votre parcours avec QueryMix, gratuitement pendant 7 jours.",
    s2t: "Choisissez l'outil", s2d: "Parcourez les outils et choisissez celui qu'il vous faut.",
    s3t: "Saisissez vos données", s3d: "Fournissez le texte, le fichier ou la description.",
    s4t: "Obtenez les résultats", s4d: "Recevez les résultats, copiez-les ou partagez-les facilement.",
    pricingTitle: "Tarifs", pricingSub: "Commencez gratuitement, passez à Premium quand vous voulez.",
    freePlan: "Essai gratuit", freePer: "/ 7 jours",
    freeLi1: () => `Essai gratuit de ${LIMITS.trialDays} jours : ${LIMITS.freeChat} discussions et ${LIMITS.freeImage} images par jour`, freeLi2: "Les quatre outils", freeLi3: "Sans carte bancaire",
    freeBtn: "Commencer gratuitement",
    premPer: "/ mois",
    premLi1: () => `Usage étendu avec tous les modèles : jusqu'à ${LIMITS.premiumImage} images par jour (usage équitable)`, premLi2: "Les quatre outils", premLi3: "Paiement sécurisé via Gumroad",
    ctaTitle: "Prêt à démarrer ?", ctaText: "Rejoignez les utilisateurs qui avancent plus vite avec QueryMix.",
    ctaBtnText: "Commencer gratuitement",
    loginTitle: "Connexion",
    signupTitle: "Créer un compte",
    emailPlaceholder: "Votre email",
    passwordPlaceholder: "Mot de passe",
    loginBtn: "Connexion",
    signupBtn: "S'inscrire",
    switchToSignupText: "Pas de compte ?",
    switchToSignupLink: "Créer un compte",
    switchToLoginText: "Déjà un compte ?",
    switchToLoginLink: "Connexion",
    fillFields: "Remplissez l'email et le mot de passe",
    working: "Chargement...",
    forgotLink: "Mot de passe oublié ?",
    forgotTitle: "Mot de passe oublié ?",
    forgotHint: "Saisissez votre e-mail et nous vous enverrons un lien pour changer votre mot de passe.",
    forgotBtn: "Envoyer le lien",
    forgotSent: "Si cet e-mail est enregistré, vous recevrez un message avec le lien (vérifiez aussi les spams). Le lien est valable 1 heure.",
    resetTitle: "Nouveau mot de passe",
    resetNewPw: "Nouveau mot de passe (8 caractères min.)",
    resetBtn: "Changer le mot de passe",
    resetDone: "Mot de passe modifié. Vous pouvez vous connecter.",
    resetGoLogin: "Connexion",
    resetBadLink: "Lien invalide ou expiré. Demandez un nouveau lien.",
    genericError: "Une erreur est survenue",
    connError: "Erreur de connexion au serveur. Le serveur démarre peut-être (réessayez dans 30 secondes).",
    logoutBtn: "Déconnexion",
    premiumLabel: "Abonné",
    chatUsageLabel: (r, l) => `${r} conversations restantes sur ${l} aujourd'hui`,
    trialLabel: (d) => d === 1 ? "1 jour restant dans l'essai gratuit" : `${d} jours restants dans l'essai gratuit`,
    trialEndedLabel: "Essai gratuit terminé — abonnez-vous pour continuer",
    runningBtn: "Chargement...",
    noModelAlert: "Sélectionnez au moins un modèle",
    limitReachedShort: "Limite quotidienne atteinte",
    providerLimitShort: "Modèles gratuits temporairement saturés", fallbackBadge: "modèle de secours",
    errorPrefix: "Erreur : ",
    connErrorPrefix: "Erreur de connexion : ",
    loadingModels: "Chargement des modèles gratuits...",
    subscribeTitle: "Abonnement mensuel",
    subscribeLinkText: "S'abonner maintenant",
    checkSubText: "Vous avez payé ? Cliquez ici",
    checkingSub: "Vérification de l'abonnement...",
    subSuccess: "Abonnement activé avec succès ! 🎉",
    subNotYet: "La confirmation du paiement n'est pas encore arrivée, réessayez dans une minute",
    subCheckError: "Erreur de connexion au serveur",
    paymentNotReady: "Le paiement n'est pas encore configuré, réessayez plus tard"
  },
  en: {
    pageTitle: "QueryMix — Compare AI model answers",
    navHome: "Home", navTools: "Tools", navHow: "How it works", navPricing: "Pricing",
    heroTitle: "Compare answers from several AI models in one place",
    heroText: "Ask one question and compare answers from several models side by side, with tools for summaries, data analysis and image generation, in Arabic, French and English.",
    heroCta1: "Get started", heroCta2: "Explore tools",
    tEditT: "Compare models", tEditD: "Ask one question and compare answers from several models side by side.",
    tImgT: "Image generation", tImgD: "Turn your ideas into striking images in a range of styles.",
    tDataT: "Data analysis", tDataD: "Analyze your tables, spot patterns and get useful insights.",
    tSumT: "Document summarizing", tSumD: "Summarize long documents and pull out the key points, fast and accurately.",
    toolsTitle: "Tools", toolsSub: "Pick a tool and get to work.",
    workflowsTitle: "Ready-made workflows", workflowsSub: "Choose a task, add your information, and let AI do the rest.",
    wfProductT: "Product description", wfProductD: "A description that sells",
    wfAdT: "Marketing ad", wfAdD: "An ad for Facebook or Instagram",
    wfPdfT: "Summarize PDF", wfPdfD: "Extract the key ideas and points",
    wfExcelT: "Analyze data", wfExcelD: "Insights from CSV or Excel",
    wfTranslateT: "Professional translation", wfTranslateD: "Translate while keeping the style",
    wfSocialT: "Social media post", wfSocialD: "A post ready to publish",
    savedTitle: "My saved results", savedSub: "Return to important results and reuse them.",
    loadSavedBtn: "Refresh", savedEmpty: "No saved results yet.", saveBtn: "Save", savedBtn: "Saved", useSavedBtn: "Use", deleteSavedBtn: "Delete", saveError: "Couldn't save this result.",
    welcomeTitle: "Welcome to QueryMix", welcomeText: "What would you like to accomplish today? Choose a task to get started.", welcomeSkip: "Skip and explore the tools",
    modelsLabel: "Models — pick one or more and compare results side by side", compareSelectedLabel: "Selected models", selectTwo: "Pick 2", selectThree: "Pick 3", responseWorking: "Responding...", responseReady: "Ready", responseFailed: "Failed", responseTime: (ms) => `${(ms / 1000).toFixed(1)}s`, 
    previewTitle: "Try QueryMix without signing up", previewSub: "Ask one question and compare two models side by side.", previewBadge: "Free preview", previewPh: "Example: explain the difference between AI and machine learning in 3 points.", previewModelsLabel: "Choose models", previewRun: "Try the comparison", previewHint: "One question, no sign-up", previewGateText: "Like the comparison? Create an account to ask more questions and save your results.", previewSignup: "Sign up free", shareBtn: "Share", sharedBtn: "Shared",
    copyBtn: "Copy", copiedBtn: "Copied",
    guestLabel: "Log in to start your free trial",
    editPh: "Type your question here...", editRun: "Compare answers",
    imgPh: "Describe the image you want in detail... (English descriptions often work best)",
    imgStyle: "Style", stNone: "None", stReal: "Realistic", stDigital: "Digital art", stAnime: "Anime", st3d: "3D", stWater: "Watercolor",
    imgSize: "Size",
    imgRun: "Generate image", imgOpen: "Open image", imgLoading: "Generating your image...",
    imgRemainingLabel: (r, l) => `${r} of ${l} images left today`,
    imgError: "Couldn't generate the image. Try a different description or try again.",
    imgNote: "Images are generated on the server through the Pollinations service; your description is sent to it. Some models are slower than others.",
    imgModelsLabel: "Image models — pick one or more and compare",
    imgSave: "Download",
    imgNoService: "Image generation is unavailable right now.",
    emptyImgAlert: "Write an image description",
    uploadCsv: "Upload CSV", uploadTxt: "Upload text file",
    dataPh: "Paste your data here (CSV or a copied table) or upload a file...",
    dataQPh: "What do you want to know? (optional)",
    dataRun: "Analyze data",
    dataNote: "Analysis is done by a language model, so numbers are approximate and worth double-checking.",
    emptyDataAlert: "Paste your data or upload a file",
    sumPh: "Paste the long text here or upload a text file...",
    sumLen: "Length", lenShort: "Short", lenMedium: "Medium", lenLong: "Detailed",
    sumFmt: "Format", fmtPara: "Paragraph", fmtBullets: "Bullet points",
    sumRun: "Summarize text",
    tAgentT: "AI agents", tAgentD: "Pick a specialist agent (translator, writer, coder...) and compare the models' answers.",
    agentLabel: "Agent", agentPh: "Write your request to the agent here...", agentRun: "Ask the agent",
    emptyAgentAlert: "Write your request first",
    emptyTextAlert: "Paste some text first",
    fileTooBig: "File is too large (500 KB limit)",
    fileReadErr: "Couldn't read the file", pdfNoText: "This PDF has no extractable text. Try another file.",
    truncated: "Long text: only the first part was processed.",
    howTitle: "How it works",
    s1t: "Create your account", s1d: "Sign up and start your journey with QueryMix, free for 7 days.",
    s2t: "Choose a tool", s2d: "Browse the tools and pick what fits your need.",
    s3t: "Enter your input", s3d: "Provide the text, file or description.",
    s4t: "Get your results", s4d: "Receive results, then copy or share them easily.",
    pricingTitle: "Pricing", pricingSub: "Start free, upgrade when you need to.",
    freePlan: "Free trial", freePer: "/ 7 days",
    freeLi1: () => `${LIMITS.trialDays}-day free trial: ${LIMITS.freeChat} chats and ${LIMITS.freeImage} images per day`, freeLi2: "All four tools", freeLi3: "No credit card needed",
    freeBtn: "Start free",
    premPer: "/ month",
    premLi1: () => `Extended use with every model: up to ${LIMITS.premiumImage} images per day (fair use)`, premLi2: "All four tools", premLi3: "Secure payment via Gumroad",
    ctaTitle: "Ready to start?", ctaText: "Join the users getting more done, faster, with QueryMix.",
    ctaBtnText: "Start free now",
    loginTitle: "Log In",
    signupTitle: "Create Account",
    emailPlaceholder: "Your email",
    passwordPlaceholder: "Password",
    loginBtn: "Log In",
    signupBtn: "Sign Up",
    switchToSignupText: "No account?",
    switchToSignupLink: "Sign up",
    switchToLoginText: "Already have an account?",
    switchToLoginLink: "Log in",
    fillFields: "Fill in email and password",
    working: "Working...",
    forgotLink: "Forgot password?",
    forgotTitle: "Forgot your password?",
    forgotHint: "Enter your email and we'll send you a link to reset your password.",
    forgotBtn: "Send link",
    forgotSent: "If this email is registered, you'll get a message with the link (check spam too). The link is valid for 1 hour.",
    resetTitle: "New password",
    resetNewPw: "New password (min. 8 characters)",
    resetBtn: "Change password",
    resetDone: "Password changed. You can now sign in.",
    resetGoLogin: "Sign in",
    resetBadLink: "Invalid or expired link. Request a new one.",
    genericError: "Something went wrong",
    connError: "Server connection error. The server may be waking up (try again in 30 seconds).",
    logoutBtn: "Log out",
    premiumLabel: "Subscribed",
    chatUsageLabel: (r, l) => `${r} of ${l} chats left today`,
    trialLabel: (d) => d === 1 ? "1 day left in your free trial" : `${d} days left in your free trial`,
    trialEndedLabel: "Free trial ended — subscribe to continue",
    runningBtn: "Working...",
    noModelAlert: "Select at least one model",
    limitReachedShort: "Daily limit reached",
    providerLimitShort: "Free models temporarily at capacity", fallbackBadge: "backup model",
    errorPrefix: "Error: ",
    connErrorPrefix: "Connection error: ",
    loadingModels: "Loading free models...",
    subscribeTitle: "Monthly subscription",
    subscribeLinkText: "Subscribe now",
    checkSubText: "Already paid? Click here",
    checkingSub: "Checking your subscription...",
    subSuccess: "Subscription activated! 🎉",
    subNotYet: "Payment confirmation hasn't arrived yet, try again in a minute",
    subCheckError: "Server connection error",
    paymentNotReady: "Payments aren't set up yet, try again later"
  }
};

const LANG_NAMES = { ar: "Arabic", fr: "French", en: "English" };

let currentLang = "ar";
let token = null;
let userEmail = null;
let isSignupMode = false;
let selectedModels = new Set();
let previewSelectedModels = new Set();
const PREVIEW_MODEL_IDS = ["openrouter/free", "google/gemma-4-31b-it:free", "nvidia/nemotron-3.5-lightning:free"];
let lastUsage = null;
let subscribeLinkReady = false;
let running = false;
let activeTool = "edit";

const $ = (id) => document.getElementById(id);

function t(key, ...args) {
  const val = I18N[currentLang][key];
  return typeof val === "function" ? val(...args) : val;
}

// ---------- وكلاء جاهزون: تعليمات مخصصة تتبعت مع كل طلب ----------
const AGENTS = [
  { id: "translator", n: { ar: "مترجم محترف", fr: "Traducteur pro", en: "Pro translator" },
    d: { ar: "يترجم النص مع الحفاظ على المعنى والأسلوب. اذكر اللغة المطلوبة في طلبك.", fr: "Traduit en gardant le sens et le style. Indiquez la langue cible.", en: "Translates while keeping meaning and tone. State the target language." },
    i: "You are a professional translator. Translate the user's text into the language they ask for (if none is specified, translate Arabic or French to English, and anything else to Arabic). Preserve meaning, tone and formatting. Output only the translation, then at most one short note if a phrase is ambiguous." },
  { id: "writer", n: { ar: "كاتب محتوى", fr: "Rédacteur", en: "Content writer" },
    d: { ar: "يكتب مقالات ومنشورات وإيميلات واضحة وجذابة.", fr: "Rédige articles, posts et emails clairs et engageants.", en: "Writes clear, engaging articles, posts and emails." },
    i: "You are an experienced content writer. Write clear, engaging, well-structured text that fits the requested purpose and audience. If key details are missing, make reasonable assumptions and state them in one line at the end." },
  { id: "coder", n: { ar: "مبرمج مساعد", fr: "Assistant développeur", en: "Coding assistant" },
    d: { ar: "يكتب ويشرح ويصلح الكود. أرسل الكود أو الخطأ مع اللغة المستعملة.", fr: "Écrit, explique et corrige du code. Envoyez le code ou l'erreur.", en: "Writes, explains and debugs code. Send the code or error." },
    i: "You are a senior software engineer. Give correct, minimal, working code in fenced code blocks, then a brief explanation. When debugging, identify the root cause first. Never invent APIs; say so if unsure." },
  { id: "tutor", n: { ar: "معلم شخصي", fr: "Tuteur personnel", en: "Personal tutor" },
    d: { ar: "يشرح أي موضوع بخطوات بسيطة وأمثلة.", fr: "Explique tout sujet pas à pas avec des exemples.", en: "Explains any topic step by step with examples." },
    i: "You are a patient tutor. Explain the topic simply, step by step, with one or two concrete examples, then end with a short question that checks understanding. Adapt the level to the user's wording." },
  { id: "marketer", n: { ar: "خبير تسويق", fr: "Expert marketing", en: "Marketing expert" },
    d: { ar: "يقترح أفكار إعلانات وعناوين وخطط محتوى لمشروعك.", fr: "Propose idées de pubs, titres et plans de contenu.", en: "Suggests ad ideas, headlines and content plans." },
    i: "You are a practical digital-marketing consultant. Give concrete, actionable ideas (headlines, hooks, channels, a simple plan) tailored to the user's product and audience. Be concise and avoid generic advice." },
  { id: "career", n: { ar: "مستشار مهني", fr: "Conseiller carrière", en: "Career advisor" },
    d: { ar: "يساعدك فـ السيرة الذاتية ورسائل التحفيز ومقابلات العمل.", fr: "Aide pour CV, lettres de motivation et entretiens.", en: "Helps with CVs, cover letters and interviews." },
    i: "You are a career advisor and recruiter. Help with CVs, cover letters and interview preparation. Be specific, honest and professional, and never invent experience or qualifications the user did not mention." }
];

function renderAgents() {
  const sel = $("agentSel");
  if (!sel) return;
  const cur = sel.value || AGENTS[0].id;
  sel.innerHTML = "";
  AGENTS.forEach(a => {
    const o = document.createElement("option");
    o.value = a.id;
    o.textContent = a.n[currentLang] || a.n.en;
    sel.appendChild(o);
  });
  sel.value = cur;
  const a = AGENTS.find(x => x.id === sel.value) || AGENTS[0];
  $("agentDesc").textContent = a.d[currentLang] || a.d.en;
}

function setLanguage(lang) {
  if (!I18N[lang]) return;
  currentLang = lang;
  try { localStorage.setItem("qm_lang", lang); } catch (e) {}
  const root = $("htmlRoot");
  root.lang = lang;
  root.dir = lang === "ar" ? "rtl" : "ltr";

  $("pageTitle").textContent = t("pageTitle");
  document.querySelectorAll("[data-i18n]").forEach(el => {
    if (el.classList.contains("run") && running) return;
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-ph]").forEach(el => {
    const txt = t(el.dataset.i18nPh);
    el.placeholder = txt;
    el.setAttribute("aria-label", txt);
  });
  renderAgents();
  $("authEmail").placeholder = t("emailPlaceholder");
  $("authEmail").setAttribute("aria-label", t("emailPlaceholder"));
  $("authPassword").placeholder = t("passwordPlaceholder");
  $("authPassword").setAttribute("aria-label", t("passwordPlaceholder"));

  document.querySelectorAll(".lang-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.lang === lang);
    b.setAttribute("aria-pressed", b.dataset.lang === lang ? "true" : "false");
  });

  renderAuthMode();
  updateNav();
  renderUsage();
  renderImgUsage(lastImgUsage);
  if (!MODELS.length) {
    $("modelChips").innerHTML = `<span class="muted">${t("loadingModels")}</span>`;
  }
}

document.querySelectorAll(".lang-btn").forEach(btn => {
  btn.onclick = () => setLanguage(btn.dataset.lang);
});

// ---------- Nav ----------
$("menuBtn").onclick = () => $("links").classList.toggle("open");
document.querySelectorAll(".links a").forEach(a => a.onclick = () => $("links").classList.remove("open"));

function updateNav() {
  $("authBtn").textContent = token ? t("logoutBtn") : "👤 " + t("loginTitle");
  $("userEmailLabel").textContent = token ? (userEmail || "") : "";
}

$("authBtn").onclick = () => { token ? logout() : openAuth(false); };

// ---------- Tools tabs ----------
function setTool(name) {
  activeTool = name;
  document.querySelectorAll(".tab").forEach(b => b.setAttribute("aria-selected", b.dataset.tool === name));
  document.querySelectorAll("[data-panel]").forEach(p => p.classList.toggle("hidden", p.dataset.panel !== name));
  $("modelsBox").classList.toggle("hidden", name === "image");
}
document.querySelectorAll(".tab").forEach(b => b.onclick = () => setTool(b.dataset.tool));
document.querySelectorAll(".feat").forEach(b => b.onclick = () => {
  setTool(b.dataset.tool);
  $("tools").scrollIntoView();
});

const WORKFLOW_PROMPTS = {
  product: "Act as an ecommerce copywriter. Create a persuasive product description in the user's language. Include: a short headline, 5 benefits, key features, ideal customer, a clear call to action, and SEO keywords. Do not invent facts. Replace the bracketed fields with the real product information:\n\nProduct name: [write here]\nFeatures and specifications: [write here]\nTarget customer: [write here]\nPrice or offer: [optional]",
  ad: "Create 3 marketing ad variations in the user's language for the product or service below. For each variation include: primary text, headline, short description, call to action, and a suggested audience. Keep the tone clear and persuasive without making unsupported claims.\n\nProduct/service: [write here]\nMain benefit: [write here]\nPlatform: Facebook / Instagram / TikTok\nTarget audience: [write here]",
  translate: "Translate the text below from [source language] to [target language]. Preserve the meaning, tone, names, numbers, formatting, and cultural nuance. Return only the polished translation, followed by a short note listing any ambiguous terms.\n\nText:\n[write or paste text here]",
  social: "Write 5 ready-to-publish social media posts in the user's language about the topic below. Give each a different hook, a concise body, a call to action, and 3 relevant hashtags. Avoid clickbait and unsupported claims.\n\nTopic or product: [write here]\nAudience: [write here]\nPlatform: Instagram / Facebook / LinkedIn\nTone: [professional, friendly, educational, etc.]"
};

function applyWorkflow(kind) {
  if (!guard(false)) return;
  $("tools").scrollIntoView({ behavior: "smooth", block: "start" });
  if (kind === "pdf") {
    setTool("summary");
    $("sumFmtSel").value = "bullets";
    setTimeout(() => $("sumFile").click(), 250);
    return;
  }
  if (kind === "excel") {
    setTool("data");
    $("dataQ").value = "Give a clear executive summary, key statistics, trends, anomalies, and 3 practical actions based only on the uploaded data.";
    setTimeout(() => $("dataFile").click(), 250);
    return;
  }
  setTool("edit");
  $("editText").value = WORKFLOW_PROMPTS[kind] || "";
  $("editText").focus();
}
document.querySelectorAll("[data-workflow]").forEach(b => {
  b.addEventListener("click", () => applyWorkflow(b.dataset.workflow));
});

const WELCOME_KEY = "querymix_welcome_seen_v1";
function closeWelcome(markSeen = true) {
  if (markSeen) {
    try { localStorage.setItem(WELCOME_KEY, "1"); } catch (e) {}
  }
  $("welcomeModal").classList.remove("open");
}
function maybeShowWelcome() {
  if (!token) return;
  let seen = false;
  try { seen = localStorage.getItem(WELCOME_KEY) === "1"; } catch (e) {}
  if (!seen) $("welcomeModal").classList.add("open");
}
$("welcomeClose").onclick = () => closeWelcome();
$("welcomeSkip").onclick = () => closeWelcome();
$("welcomeModal").onclick = e => { if (e.target.id === "welcomeModal") closeWelcome(); };
document.querySelectorAll("[data-welcome-workflow]").forEach(b => {
  b.addEventListener("click", () => {
    const kind = b.dataset.welcomeWorkflow;
    closeWelcome();
    applyWorkflow(kind);
  });
});

// ---------- Auth modal ----------
const authTitle = $("authTitle");
const authSubmitBtn = $("authSubmitBtn");
const switchText = $("switchText");
const switchLink = $("switchLink");
const authError = $("authError");

function openAuth(signup) {
  isSignupMode = !!signup;
  renderAuthMode();
  $("modal").classList.add("open");
  $("authEmail").focus();
}
function closeAuth() { $("modal").classList.remove("open"); authError.textContent = ""; }
$("mClose").onclick = closeAuth;
$("modal").onclick = (e) => { if (e.target.id === "modal") closeAuth(); };
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAuth(); });
["authEmail", "authPassword"].forEach(id => $(id).addEventListener("keydown", (e) => {
  if (e.key === "Enter") authSubmitBtn.click();
}));

function renderAuthMode() {
  if (isSignupMode) {
    authTitle.textContent = t("signupTitle");
    authSubmitBtn.textContent = t("signupBtn");
    switchText.textContent = t("switchToLoginText");
    switchLink.textContent = t("switchToLoginLink");
    $("authPassword").autocomplete = "new-password";
  } else {
    authTitle.textContent = t("loginTitle");
    authSubmitBtn.textContent = t("loginBtn");
    switchText.textContent = t("switchToSignupText");
    switchLink.textContent = t("switchToSignupLink");
    $("authPassword").autocomplete = "current-password";
  }
  $("forgotLink").hidden = isSignupMode;
  authError.textContent = "";
}

switchLink.onclick = () => { isSignupMode = !isSignupMode; renderAuthMode(); };

authSubmitBtn.onclick = async () => {
  const email = $("authEmail").value.trim();
  const password = $("authPassword").value;
  authError.textContent = "";

  if (!email || !password) { authError.textContent = t("fillFields"); return; }

  authSubmitBtn.disabled = true;
  authSubmitBtn.textContent = t("working");

  try {
    const endpoint = isSignupMode ? "/api/auth/signup" : "/api/auth/login";
    const res = await fetch(BACKEND_URL + endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (!res.ok) {
      authError.textContent = data.error || t("genericError");
      authSubmitBtn.disabled = false;
      authSubmitBtn.textContent = isSignupMode ? t("signupBtn") : t("loginBtn");
      return;
    }

    token = data.token;
    userEmail = data.email;
    saveSession(token, userEmail);
    showApp();
  } catch (err) {
    authError.textContent = t("connError");
  }

  authSubmitBtn.disabled = false;
  authSubmitBtn.textContent = isSignupMode ? t("signupBtn") : t("loginBtn");
};


// ---------- نسيت كلمة السر ----------
let resetToken = null;
function openReset(mode) {            // mode: "forgot" | "reset"
  $("forgotBox").hidden = mode !== "forgot";
  $("resetBox").hidden = mode !== "reset";
  $("rMsg").textContent = ""; $("rMsg").className = "err";
  $("rEmail").value = ""; $("rPassword").value = "";
  $("rGoLogin").hidden = true;
  $("rForgotBtn").disabled = false; $("rResetBtn").disabled = false;
  closeAuth();
  $("resetModal").classList.add("open");
  (mode === "forgot" ? $("rEmail") : $("rPassword")).focus();
}
function closeReset() { $("resetModal").classList.remove("open"); }
$("rClose").onclick = closeReset;
$("resetModal").onclick = (e) => { if (e.target.id === "resetModal") closeReset(); };
$("forgotLink").onclick = () => {
  openReset("forgot");
  $("rEmail").value = $("authEmail").value.trim();
};
$("rGoLogin").onclick = () => { closeReset(); openAuth(false); };

$("rForgotBtn").onclick = async () => {
  const email = $("rEmail").value.trim();
  const msg = $("rMsg");
  msg.className = "err"; msg.textContent = "";
  if (!email) { msg.textContent = t("fillFields"); return; }
  $("rForgotBtn").disabled = true;
  try {
    const res = await fetch(BACKEND_URL + "/api/auth/forgot", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, lang: currentLang })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) { msg.textContent = data.error || t("genericError"); $("rForgotBtn").disabled = false; return; }
    msg.className = "ok-msg"; msg.textContent = t("forgotSent");
  } catch (e) { msg.textContent = t("connError"); $("rForgotBtn").disabled = false; }
};

$("rResetBtn").onclick = async () => {
  const password = $("rPassword").value;
  const msg = $("rMsg");
  msg.className = "err"; msg.textContent = "";
  if (!password) { msg.textContent = t("fillFields"); return; }
  $("rResetBtn").disabled = true;
  try {
    const res = await fetch(BACKEND_URL + "/api/auth/reset", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: resetToken, password })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) { msg.textContent = data.error || t("resetBadLink"); $("rResetBtn").disabled = false; return; }
    msg.className = "ok-msg"; msg.textContent = t("resetDone");
    $("rGoLogin").hidden = false; resetToken = null;
  } catch (e) { msg.textContent = t("connError"); $("rResetBtn").disabled = false; }
};

(function () {
  const m = /^#reset=([a-f0-9]{64})$/.exec(location.hash || "");
  if (m) {
    resetToken = m[1];
    try { history.replaceState(null, "", location.pathname + location.search); } catch (e) {}
    openReset("reset");
  }
})();

// حفظ الجلسة فـ localStorage (نفس المفاتيح القديمة)
function saveSession(tok, email) {
  try {
    localStorage.setItem("azizart_token", tok);
    localStorage.setItem("azizart_email", email);
  } catch (e) {}
}
function clearSession() {
  try {
    localStorage.removeItem("azizart_token");
    localStorage.removeItem("azizart_email");
  } catch (e) {}
}
function loadSession() {
  try {
    return { token: localStorage.getItem("azizart_token"), email: localStorage.getItem("azizart_email") };
  } catch (e) {
    return { token: null, email: null };
  }
}

function logout() {
  token = null;
  userEmail = null;
  lastUsage = null;
  subscribeLinkReady = false;
  $("subscribeLink").removeAttribute("href");
  $("subscribeStatus").textContent = "";
  ["editResults", "dataResults", "sumResults", "imgResults"].forEach(id => $(id).innerHTML = "");
  $("limitBanner").classList.add("hidden");
  clearSession();
  updateNav();
  renderUsage();
  renderImgUsage(null);
}

// ---------- Models ----------
const modelChips = $("modelChips");

function renderModelChips() {
  modelChips.innerHTML = "";
  MODELS.forEach(m => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.textContent = m.label;
    chip.setAttribute("aria-pressed", selectedModels.has(m.id));
    chip.onclick = () => {
      if (selectedModels.has(m.id)) selectedModels.delete(m.id);
      else selectedModels.add(m.id);
      chip.setAttribute("aria-pressed", selectedModels.has(m.id));
      updateModelCount();
    };
    modelChips.appendChild(chip);
  });
  updateModelCount();
}
function updateModelCount() {
  const count = $("modelCount");
  if (count) count.textContent = `${selectedModels.size}/3`;
}
function selectModelPreset(amount) {
  selectedModels = new Set(MODELS.slice(0, Math.min(amount, MODELS.length)).map(m => m.id));
  renderModelChips();
}
$("selectTwoBtn").onclick = () => selectModelPreset(2);
$("selectThreeBtn").onclick = () => selectModelPreset(3);

// اكتشاف تلقائي حي: القائمة المختارة يدوياً كتبطل بسرعة حيت OpenRouter كيبدّل
// النماذج المجانية باستمرار (كيحيد قدام وكيزيد جداد). فبدّلنا القائمة الثابتة
// بفحص حي + فلترة للنماذج الغير مخصصة للدردشة (حماية/ترتيب/تضمين...).
const FAMOUS_PREFIXES = [
  "meta-llama/", "google/", "qwen/", "nvidia/", "mistralai/",
  "moonshotai/", "deepseek/", "microsoft/", "openrouter/"
];
const EXCLUDE_KEYWORDS = [
  "lyria", "whisper", "tts", "embed", "moderation", "dall-e", "musicgen",
  "nano-omni", "3-super", "safety", "guard", "rerank", "reward", "classif"
];
// أولوية ترتيب تقريبية: أول من يطابق بادئة فهاد اللائحة كيطلع فالقمة
// openrouter/free (الموجه التلقائي) فالقمة حيت كيوجّه تلقائياً لأي نموذج
// خدام فتلك اللحظة، فهو أثبت استقراراً من تثبيت نموذج معين قد يكون مزدحم
const SORT_PRIORITY = ["openrouter/", "deepseek/", "meta-llama/", "qwen/", "google/", "mistralai/"];

async function loadFreeModels() {
  modelChips.innerHTML = `<span class="muted">${t("loadingModels")}</span>`;
  try {
    const res = await fetch("https://openrouter.ai/api/v1/models");
    const data = await res.json();

    const free = (data.data || []).filter(m => {
      const p = m.pricing || {};
      const isFree = parseFloat(p.prompt || "0") === 0 && parseFloat(p.completion || "0") === 0;
      const arch = m.architecture || {};
      const outputs = Array.isArray(arch.output_modalities) ? arch.output_modalities : ["text"];
      const isChatText = outputs.includes("text");
      const isFamous = FAMOUS_PREFIXES.some(pfx => m.id.startsWith(pfx));
      const isExcluded = EXCLUDE_KEYWORDS.some(k => m.id.toLowerCase().includes(k));
      return isFree && isChatText && isFamous && !isExcluded;
    });

    if (free.length === 0) throw new Error("no free models returned");

    MODELS = free
      .map(m => ({ id: m.id, label: (m.name || m.id).replace(/\s*\(free\)\s*$/i, "") }))
      .sort((a, b) => {
        const rank = (id) => { const i = SORT_PRIORITY.findIndex(p => id.startsWith(p)); return i === -1 ? 99 : i; };
        const r = rank(a.id) - rank(b.id);
        if (r !== 0) return r;
        return a.label.localeCompare(b.label);
      })
      .slice(0, 8);
  } catch (err) {
    MODELS = FALLBACK_MODELS;
  }

  selectedModels = new Set(MODELS.slice(0, DEFAULT_SELECTED).map(m => m.id));
  const autoRouter = MODELS.find(m => m.id === "openrouter/free");
  if (autoRouter) selectedModels.add(autoRouter.id); // الأكثر استقراراً، نضمنو وجوده دائماً
  renderModelChips();
}

// ---------- Free Playground Preview ----------
function previewLabel(id) {
  const found = MODELS.find(m => m.id === id);
  if (found) return found.label;
  return id === 'openrouter/free' ? 'Auto Free' : id.split('/').pop().replace(/:free$/i, '');
}
function renderPreviewModelChips() {
  const box = $('previewModelChips');
  if (!box) return;
  box.innerHTML = '';
  const available = PREVIEW_MODEL_IDS.filter(id => MODELS.some(m => m.id === id) || id === 'openrouter/free');
  if (!previewSelectedModels.size) previewSelectedModels = new Set(available.slice(0, 2));
  available.forEach(id => {
    const chip = document.createElement('button');
    chip.type = 'button'; chip.className = 'chip'; chip.textContent = previewLabel(id);
    chip.setAttribute('aria-pressed', previewSelectedModels.has(id));
    chip.onclick = () => {
      if (previewSelectedModels.has(id)) {
        if (previewSelectedModels.size > 1) previewSelectedModels.delete(id);
      } else if (previewSelectedModels.size < 3) previewSelectedModels.add(id);
      chip.setAttribute('aria-pressed', previewSelectedModels.has(id));
    };
    box.appendChild(chip);
  });
}
function addShareButton(button, getText) {
  button.onclick = async () => {
    const text = getText();
    try {
      if (navigator.share) await navigator.share({ title: 'QueryMix', text });
      else { await navigator.clipboard.writeText(text); button.textContent = t('sharedBtn'); setTimeout(() => button.textContent = t('shareBtn'), 1500); }
    } catch (e) {}
  };
}
function renderPreviewResults(results) {
  const box = $('previewResults'); box.innerHTML = '';
  results.forEach(item => {
    const card = document.createElement('div'); card.className = 'res';
    const head = document.createElement('div'); head.className = 'res-head';
    const title = document.createElement('h4'); title.textContent = previewLabel(item.model);
    const actions = document.createElement('div'); actions.style.display = 'flex'; actions.style.gap = '6px';
    const copy = document.createElement('button'); copy.className = 'copy'; copy.type = 'button'; copy.textContent = t('copyBtn');
    copy.onclick = async () => { try { await navigator.clipboard.writeText(item.text); copy.textContent = t('copiedBtn'); setTimeout(() => copy.textContent = t('copyBtn'), 1500); } catch (e) {} };
    const share = document.createElement('button'); share.className = 'share'; share.type = 'button'; share.textContent = t('shareBtn');
    addShareButton(share, () => `${previewLabel(item.model)}\n\n${item.text}\n\n— QueryMix`);
    actions.append(copy, share); head.append(title, actions);
    const body = document.createElement('div'); body.className = 'body'; body.textContent = item.text;
    card.append(head, body); box.appendChild(card);
  });
}
$('previewSignupBtn').onclick = () => openAuth(true);
$('previewRun').onclick = async () => {
  const prompt = $('previewPrompt').value.trim();
  if (!prompt) { $('previewPrompt').focus(); return; }
  const button = $('previewRun'); button.disabled = true; button.textContent = t('working');
  $('previewResults').innerHTML = `<div class="muted" style="grid-column:1/-1">${t('working')}</div>`;
  try {
    const res = await fetchWithTimeout(BACKEND_URL + '/api/preview', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ prompt, models:[...previewSelectedModels] }) }, 90000);
    const data = await res.json();
    if (res.status === 429 && data.preview_used) { openAuth(true); throw new Error(data.error); }
    if (!res.ok) throw new Error(data.error || t('genericError'));
    renderPreviewResults(data.results || []);
    $('previewGate').classList.remove('hidden');
    button.textContent = t('previewRun');
    button.disabled = true;
  } catch (err) {
    $('previewResults').innerHTML = `<div class="banner" style="grid-column:1/-1">${err.message}</div>`;
    button.disabled = false; button.textContent = t('previewRun');
  }
};

// ---------- App state ----------
function showApp() {
  closeAuth();
  updateNav();
  refreshUsage();
  refreshImageUsage();
  loadSavedResults();
  setTimeout(maybeShowWelcome, 350);
}

function sessionExpired() {
  logout();
  openAuth(false);
}

function renderSavedResults(results) {
  const box = $("savedList");
  box.replaceChildren();
  if (!token) {
    const empty = document.createElement("div");
    empty.className = "saved-empty";
    empty.textContent = t("guestLabel");
    box.appendChild(empty);
    return;
  }
  if (!results.length) {
    const empty = document.createElement("div");
    empty.className = "saved-empty";
    empty.textContent = t("savedEmpty");
    box.appendChild(empty);
    return;
  }
  results.forEach(item => {
    const row = document.createElement("div");
    row.className = "saved-item";
    const info = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = item.title || t("savedTitle");
    const meta = document.createElement("small");
    meta.textContent = `${item.model || item.kind || "AI"} · ${new Date(item.created_at).toLocaleDateString()}`;
    info.append(title, meta);
    const actions = document.createElement("div");
    actions.className = "saved-actions";
    const use = document.createElement("button");
    use.type = "button";
    use.textContent = t("useSavedBtn");
    use.onclick = () => {
      setTool("edit");
      $("editText").value = item.content || "";
      $("tools").scrollIntoView({ behavior: "smooth", block: "start" });
      $("editText").focus();
    };
    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = t("deleteSavedBtn");
    remove.onclick = async () => {
      remove.disabled = true;
      const res = await fetch(BACKEND_URL + "/api/saved-results/" + encodeURIComponent(item.id), {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token }
      });
      if (res.status === 401) return sessionExpired();
      if (res.ok) loadSavedResults(); else remove.disabled = false;
    };
    actions.append(use, remove);
    row.append(info, actions);
    box.appendChild(row);
  });
}

async function loadSavedResults() {
  const box = $("savedList");
  if (!token) return renderSavedResults([]);
  try {
    const res = await fetch(BACKEND_URL + "/api/saved-results", {
      headers: { "Authorization": "Bearer " + token }
    });
    if (res.status === 401) return sessionExpired();
    const data = await res.json();
    renderSavedResults(data.results || []);
  } catch (err) {
    box.replaceChildren();
    const note = document.createElement("div");
    note.className = "saved-empty";
    note.textContent = t("genericError");
    box.appendChild(note);
  }
}

async function saveResultToLibrary(result, button) {
  if (!token) return openAuth(true);
  button.disabled = true;
  try {
    const res = await fetch(BACKEND_URL + "/api/saved-results", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
      body: JSON.stringify(result)
    });
    if (res.status === 401) return sessionExpired();
    if (!res.ok) throw new Error("save failed");
    button.textContent = t("savedBtn");
    button.classList.add("saved-state");
    loadSavedResults();
  } catch (err) {
    button.disabled = false;
    alert(t("saveError"));
  }
}

$("loadSavedBtn").onclick = loadSavedResults;

function isLocked() {
  return !!token && !!lastUsage && !lastUsage.is_premium && !lastUsage.in_trial;
}

function syncButtons() {
  const lock = isLocked();
  document.querySelectorAll(".run").forEach(b => { b.disabled = running || lock; });
}

function renderUsage() {
  const pill = $("usagePill");
  const actions = $("subActions");
  const premOk = $("premiumOk");
  const banner = $("trialBanner");
  banner.classList.add("hidden");

  if (!token) {
    pill.textContent = t("guestLabel");
    actions.classList.remove("hidden");
    premOk.classList.add("hidden");
    syncButtons();
    return;
  }

  const d = lastUsage;
  if (!d) { pill.textContent = "..."; syncButtons(); return; }

  if (d.is_premium) {
    pill.textContent = t("premiumLabel");
    actions.classList.add("hidden");
    premOk.classList.remove("hidden");
  } else if (d.in_trial) {
    pill.textContent = d.chat_limit == null
      ? t("trialLabel", d.trial_days_left)
      : t("chatUsageLabel", d.chat_remaining, d.chat_limit);
    actions.classList.remove("hidden");
    premOk.classList.add("hidden");
  } else {
    pill.textContent = t("trialEndedLabel");
    banner.textContent = t("trialEndedLabel");
    banner.classList.remove("hidden");
    actions.classList.remove("hidden");
    premOk.classList.add("hidden");
  }
  syncButtons();
}

async function refreshUsage() {
  if (!token) return;
  try {
    const res = await fetch(BACKEND_URL + "/api/usage", {
      headers: { "Authorization": "Bearer " + token }
    });
    if (res.status === 401) { sessionExpired(); return; }
    lastUsage = await res.json();
    renderUsage();
    if (!lastUsage.is_premium) setupSubscribeLink();
  } catch (err) {
    // silent fail
  }
}

// عند فتح الصفحة: استرجاع الجلسة المحفوظة
(function restoreSession() {
  const saved = loadSession();
  if (saved.token && saved.email) {
    token = saved.token;
    userEmail = saved.email;
    showApp();
  }
})();

// تحديث أرقام الحدود فـ صفحة الأسعار من السيرفر (بلا تسجيل دخول)
(async function loadPublicLimits() {
  try {
    const r = await fetch(BACKEND_URL + "/api/payment/config");
    const d = await r.json();
    const u = d && d.usageLimits;
    if (!u) return;
    LIMITS = {
      trialDays: u.trialDays || LIMITS.trialDays,
      freeChat: u.freeChatDailyLimit || LIMITS.freeChat,
      freeImage: u.freeImageDailyLimit || LIMITS.freeImage,
      premiumImage: u.premiumImageDailyLimit || LIMITS.premiumImage
    };
    setLanguage(currentLang);
  } catch (e) {}
})();

// ---------- Gumroad Subscription (نفس المنطق القديم بلا تغيير) ----------
async function setupSubscribeLink() {
  if (subscribeLinkReady || !token) return;

  const statusEl = $("subscribeStatus");
  const linkEl = $("subscribeLink");

  try {
    const configRes = await fetch(BACKEND_URL + "/api/payment/config");
    const config = await configRes.json();

    if (!config.productUrl) {
      statusEl.textContent = t("paymentNotReady");
      statusEl.className = "sub-status error";
      return;
    }

    const urlWithEmail = config.productUrl +
      (config.productUrl.includes("?") ? "&" : "?") +
      "email=" + encodeURIComponent(userEmail);

    linkEl.href = urlWithEmail;
    subscribeLinkReady = true;
  } catch (err) {
    statusEl.textContent = t("paymentNotReady");
    statusEl.className = "sub-status error";
  }
}

$("subscribeLink").addEventListener("click", (e) => {
  if (!token) { e.preventDefault(); openAuth(true); return; }
  if (!subscribeLinkReady) {
    e.preventDefault();
    const statusEl = $("subscribeStatus");
    statusEl.textContent = t("paymentNotReady");
    statusEl.className = "sub-status error";
    setupSubscribeLink();
  }
});

$("checkSubBtn").onclick = async () => {
  if (!token) { openAuth(true); return; }
  const statusEl = $("subscribeStatus");
  statusEl.textContent = t("checkingSub");
  statusEl.className = "sub-status";

  try {
    const res = await fetch(BACKEND_URL + "/api/usage", {
      headers: { "Authorization": "Bearer " + token }
    });
    if (res.status === 401) { sessionExpired(); return; }
    const data = await res.json();

    if (data.is_premium) {
      statusEl.textContent = t("subSuccess");
      statusEl.className = "sub-status success";
      refreshUsage();
    } else {
      statusEl.textContent = t("subNotYet");
      statusEl.className = "sub-status";
    }
  } catch (err) {
    statusEl.textContent = t("subCheckError");
    statusEl.className = "sub-status error";
  }
};

function goStart() {
  if (token) $("tools").scrollIntoView();
  else openAuth(true);
}
$("freeBtn").onclick = goStart;
$("ctaBtn").onclick = goStart;

// ---------- Shared helpers ----------
// يتحقق من الدخول والتجربة قبل أي أداة
function guard(needModels) {
  if (!token) { openAuth(true); return false; }
  if (isLocked()) { $("pricing").scrollIntoView(); return false; }
  if (needModels && selectedModels.size === 0) { alert(t("noModelAlert")); return false; }
  return true;
}

function clip(text, max) {
  return text.length > max ? { text: text.slice(0, max), cut: true } : { text, cut: false };
}

// fetch بمهلة زمنية باش الطلب ما يبقاش معلق للأبد إلا تعطل السيرفر
async function fetchWithTimeout(url, options = {}, ms = 60000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

let pdfJsPromise = null;
function loadPdfJs() {
  if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
  if (pdfJsPromise) return pdfJsPromise;
  pdfJsPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.onload = () => window.pdfjsLib ? resolve(window.pdfjsLib) : reject(new Error("PDF.js unavailable"));
    script.onerror = () => reject(new Error("PDF.js failed to load"));
    document.head.appendChild(script);
  });
  return pdfJsPromise;
}

function bindFile(inputId, areaId) {
  $(inputId).addEventListener("change", async () => {
    const f = $(inputId).files[0];
    if (!f) return;
    if (f.size > MAX_FILE_BYTES) { alert(t("fileTooBig")); $(inputId).value = ""; return; }
    const isPdf = inputId === "sumFile" && (f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
    if (isPdf) {
      try {
        const pdfLib = await loadPdfJs();
        pdfLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        const pdf = await pdfLib.getDocument({ data: await f.arrayBuffer() }).promise;
        const pages = [];
        for (let pageNo = 1; pageNo <= pdf.numPages; pageNo++) {
          const page = await pdf.getPage(pageNo);
          const content = await page.getTextContent();
          pages.push(content.items.map(item => item.str).join(" "));
        }
        $(areaId).value = pages.join("\n\n").trim();
        if (!$(areaId).value) alert(t("pdfNoText"));
      } catch (err) {
        alert(t("fileReadErr"));
      } finally {
        $(inputId).value = "";
      }
      return;
    }
    const r = new FileReader();
    r.onload = () => { $(areaId).value = String(r.result); };
    r.onerror = () => alert(t("fileReadErr"));
    r.readAsText(f);
    $(inputId).value = "";
  });
}
bindFile("dataFile", "dataText");
bindFile("sumFile", "sumText");

// يرسل نفس الطلب لكل النماذج المختارة، واحداً تلو الآخر (كما كان سابقاً)
async function runOnModels(prompt, resultsEl, btn, noteText) {
  const limitBanner = $("limitBanner");
  limitBanner.classList.add("hidden");
  resultsEl.innerHTML = "";

  if (noteText) {
    const n = document.createElement("div");
    n.className = "muted";
    n.style.gridColumn = "1 / -1";
    n.textContent = noteText;
    resultsEl.appendChild(n);
  }

  running = true;
  syncButtons();
  btn.textContent = t("runningBtn");

  const activeModels = MODELS.filter(m => selectedModels.has(m.id));
  const cards = new Map();

  activeModels.forEach(m => {
    const card = document.createElement("div");
    card.className = "res";
    const head = document.createElement("div");
    head.className = "res-head";
    const h = document.createElement("h4");
    h.textContent = m.label;
    const copy = document.createElement("button");
    copy.type = "button";
    copy.className = "copy hidden";
    copy.textContent = t("copyBtn");
    const save = document.createElement("button");
    save.type = "button";
    save.className = "copy hidden";
    save.textContent = t("saveBtn");
    const share = document.createElement("button");
    share.type = "button";
    share.className = "share hidden";
    share.textContent = t("shareBtn");
    head.append(h, copy, share, save);
    const meta = document.createElement("div");
    meta.className = "res-meta";
    meta.innerHTML = `<span class="res-dot"></span><span>${t("responseWorking")}</span>`;
    const body = document.createElement("div");
    body.className = "body muted";
    body.textContent = t("working");
    card.classList.add("loading");
    card.append(head, meta, body);
    resultsEl.appendChild(card);
    cards.set(m.id, { card, meta, body, copy, share, save, startedAt: performance.now() });
  });

  // كل نموذج كيخدم بوحدو وفنفس الوقت: فشل واحد ما كيوقفش الباقي، والمقارنة كتسالي أسرع
  let expired = false;
  const runOne = async (m) => {
    const { card, meta, body, copy, share, save, startedAt } = cards.get(m.id);
    try {
      const res = await fetchWithTimeout(BACKEND_URL + "/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ model: m.id, prompt })
      }, 60000);
      const data = await res.json();

      if (res.status === 401) { if (!expired) { expired = true; sessionExpired(); } return; }

      if (res.status === 429) {
        body.textContent = t("limitReachedShort");
        card.classList.remove("loading"); card.classList.add("failed");
        meta.innerHTML = `<span class="res-dot"></span><span>${t("responseFailed")}</span>`;
        limitBanner.textContent = data.error;
        limitBanner.classList.remove("hidden");
        return;
      }

      if (res.status === 503 && data.provider_limit) {
        // حد المزودين: رسالة قصيرة فـ البطاقة وبانر واحد فوق، بدل تكرار نفس الخطأ فـ كل نموذج
        body.textContent = t("providerLimitShort");
        card.classList.remove("loading"); card.classList.add("failed");
        meta.innerHTML = `<span class="res-dot"></span><span>${t("responseFailed")}</span>`;
        limitBanner.textContent = data.error;
        limitBanner.classList.remove("hidden");
        return;
      }

      if (data.error) {
        body.textContent = t("errorPrefix") + data.error;
        card.classList.remove("loading"); card.classList.add("failed");
        meta.innerHTML = `<span class="res-dot"></span><span>${t("responseFailed")}</span>`;
      } else {
        body.textContent = data.text;
        body.classList.remove("muted");
        card.classList.remove("loading"); card.classList.add("done");
        meta.innerHTML = `<span class="res-dot"></span><span>${t("responseReady")} · ${t("responseTime", performance.now() - startedAt)}${data.fallback ? " · " + t("fallbackBadge") : ""}</span>`;
        copy.classList.remove("hidden");
        share.classList.remove("hidden");
        addShareButton(share, () => `${m.label}\n\n${data.text}\n\n— QueryMix`);
        copy.onclick = async () => {
          try {
            await navigator.clipboard.writeText(body.textContent);
            copy.textContent = t("copiedBtn");
            setTimeout(() => { copy.textContent = t("copyBtn"); }, 1500);
          } catch (e) {}
        };
        save.classList.remove("hidden");
        save.onclick = () => saveResultToLibrary({
          kind: "chat",
          title: m.label,
          content: data.text,
          model: m.id
        }, save);
      }
    } catch (err) {
      body.textContent = t("connErrorPrefix") + err.message;
      card.classList.remove("loading"); card.classList.add("failed");
      meta.innerHTML = `<span class="res-dot"></span><span>${t("responseFailed")}</span>`;
    }
  };
  await Promise.all(activeModels.map(runOne));

  running = false;
  btn.textContent = t(btn.dataset.i18n);
  syncButtons();
  refreshUsage();
}

// ---------- Tool 1: مقارنة النماذج (سؤال عام، بلا تعليمات تحرير) ----------
$("editRun").onclick = () => {
  if (!guard(true)) return;
  const raw = $("editText").value.trim();
  if (!raw) { alert(t("emptyTextAlert")); return; }
  const { text, cut } = clip(raw, MAX_TEXT_CHARS);
  runOnModels(text, $("editResults"), $("editRun"), cut ? t("truncated") : "");
};

// ---------- Tool 2: تلخيص النصوص ----------
const SUM_LEN = {
  short: "in 2 to 3 sentences",
  medium: "in one short paragraph of about 100 words",
  long: "in a detailed summary of about 250 words"
};

$("sumRun").onclick = () => {
  if (!guard(true)) return;
  const raw = $("sumText").value.trim();
  if (!raw) { alert(t("emptyTextAlert")); return; }
  const { text, cut } = clip(raw, MAX_TEXT_CHARS);
  const len = SUM_LEN[$("sumLenSel").value];
  const fmt = $("sumFmtSel").value === "bullets" ? "as clear bullet points" : "as flowing prose";
  const prompt = `Summarize the following text ${len}, ${fmt}. Reply in the same language as the text. Use only information found in the text; do not add facts or opinions.\n\nText:\n"""\n${text}\n"""`;
  runOnModels(prompt, $("sumResults"), $("sumRun"), cut ? t("truncated") : "");
};

// ---------- الوكلاء ----------
$("agentSel").onchange = renderAgents;
$("agentRun").onclick = () => {
  if (!guard(true)) return;
  const raw = $("agentText").value.trim();
  if (!raw) { alert(t("emptyAgentAlert")); return; }
  const a = AGENTS.find(x => x.id === $("agentSel").value) || AGENTS[0];
  const { text, cut } = clip(raw, MAX_TEXT_CHARS);
  const prompt = `${a.i}\nUnless the user asks otherwise, reply in the same language as the user's request.\n\nUser request:\n"""\n${text}\n"""`;
  runOnModels(prompt, $("agentResults"), $("agentRun"), cut ? t("truncated") : "");
};

// ---------- Tool 3: تحليل البيانات ----------
function describeData(text) {
  const lines = text.split(/\r?\n/).filter(l => l.trim() !== "");
  const first = lines[0] || "";
  const counts = { ",": 0, ";": 0, "\t": 0, "|": 0 };
  for (const ch of first) if (ch in counts) counts[ch]++;
  const best = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  const cols = best[1] > 0 ? best[1] + 1 : 1;
  return { rows: lines.length, cols };
}

$("dataRun").onclick = () => {
  if (!guard(true)) return;
  const raw = $("dataText").value.trim();
  if (!raw) { alert(t("emptyDataAlert")); return; }
  const info = describeData(raw);
  const { text, cut } = clip(raw, MAX_DATA_CHARS);
  const question = $("dataQ").value.trim() ||
    "Describe the dataset, give key statistics, point out notable patterns or anomalies, and finish with 3 actionable insights.";
  const prompt =
`You are a careful data analyst. The dataset below has about ${info.rows} lines (including a header if present) and about ${info.cols} columns.${cut ? " Only the first part of the data is shown, so say clearly that your findings are based on a partial sample." : ""}
Task: ${question}
Rules: use only the data provided; show briefly how you got each number; never invent values; say so if the data is insufficient to answer. Reply in ${LANG_NAMES[currentLang]}.

Data:
"""
${text}
"""`;
  runOnModels(prompt, $("dataResults"), $("dataRun"), cut ? t("truncated") : "");
};

// ---------- Tool 4: توليد الصور (عدة نماذج، عبر السيرفر) ----------
// المفتاح السري لخدمة الصور يبقى فـ السيرفر (Render) ولا يظهر أبداً فـ المتصفح.
// ---------- Tool 4: توليد الصور (عبر السيرفر، نماذج بعدة مزودين مع fallback تلقائي) ----------
const IMG_STYLES = {
  none: "",
  real: "photorealistic, high detail, natural lighting",
  digital: "digital illustration, vibrant colors, detailed",
  anime: "anime style, clean lines, expressive",
  "3d": "3D render, soft lighting, high quality",
  water: "watercolor painting, soft textures"
};
const MAX_IMG_MODELS = 3;
// تُستعمل فقط إذا تعذّر الوصول لـ /api/images/models فـ السيرفر، باش الأداة تبقى خدامة
const FALLBACK_IMAGE_MODELS = [
  { id: "flux", label: "FLUX.1 Schnell" },
  { id: "sdxl", label: "Stable Diffusion XL" },
  { id: "dreamshaper", label: "DreamShaper" },
  { id: "pollinations-flux", label: "Flux (Free)" },
  { id: "zimage", label: "Z-Image Turbo" },
  { id: "sana", label: "Sana" },
  { id: "flux-klein", label: "FLUX Klein" },
  { id: "sdxl-lightning", label: "SDXL Lightning" }
];
let IMAGE_MODELS = [];
let selectedImgModels = new Set();

function renderImgChips() {
  const box = $("imgModelChips");
  box.innerHTML = "";
  IMAGE_MODELS.forEach(m => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.textContent = m.label || m.id;
    chip.setAttribute("aria-pressed", selectedImgModels.has(m.id));
    chip.onclick = () => {
      if (selectedImgModels.has(m.id)) selectedImgModels.delete(m.id);
      else if (selectedImgModels.size < MAX_IMG_MODELS) selectedImgModels.add(m.id);
      else return;
      chip.setAttribute("aria-pressed", selectedImgModels.has(m.id));
    };
    box.appendChild(chip);
  });
}

async function loadImageModels() {
  try {
    const res = await fetch(BACKEND_URL + "/api/images/models");
    if (!res.ok) throw new Error("no image service");
    const data = await res.json();
    IMAGE_MODELS = (data.models || [])
      .filter(m => m && m.key)
      .map(m => ({ id: m.key, label: m.name || m.key }));
    if (!IMAGE_MODELS.length) throw new Error("empty");
  } catch (e) {
    // السيرفر ما عندوش هاد المسار بعد (أو تعطل)، نستعملو قائمة احتياطية باش الأداة تخدم
    IMAGE_MODELS = FALLBACK_IMAGE_MODELS;
  }
  selectedImgModels = new Set(IMAGE_MODELS.slice(0, 2).map(m => m.id));
  renderImgChips();
}

let lastImgUsage = null;

function renderImgUsage(d) {
  lastImgUsage = d;
  const pill = $("imgUsagePill");
  if (!token) { pill.textContent = t("guestLabel"); return; }
  if (!d) { pill.textContent = "..."; return; }
  pill.textContent = t("imgRemainingLabel", d.remaining, d.limit);
}

async function refreshImageUsage() {
  if (!token) { renderImgUsage(null); return; }
  try {
    const res = await fetch(BACKEND_URL + "/api/images/usage", {
      headers: { "Authorization": "Bearer " + token }
    });
    if (res.status === 401) { renderImgUsage(null); return; }
    const data = await res.json();
    renderImgUsage(data);
  } catch (e) { /* صامت */ }
}

$("imgRun").onclick = async () => {
  if (!guard(false)) return;
  const p = $("imgPrompt").value.trim();
  if (!p) { alert(t("emptyImgAlert")); return; }
  const models = IMAGE_MODELS.filter(m => selectedImgModels.has(m.id));
  if (models.length === 0) { alert(t("noModelAlert")); return; }

  const style = IMG_STYLES[$("imgStyleSel").value] || "";
  const full = style ? `${p}, ${style}` : p;

  const out = $("imgResults");
  out.innerHTML = "";

  const btn = $("imgRun");
  running = true;
  syncButtons();
  btn.textContent = t("runningBtn");

  const cards = new Map();
  models.forEach(m => {
    const card = document.createElement("div");
    card.className = "res";
    const head = document.createElement("div");
    head.className = "res-head";
    const title = document.createElement("h4");
    title.textContent = m.label || m.id;
    const save = document.createElement("button");
    save.type = "button";
    save.className = "copy hidden";
    save.textContent = t("imgSave");
    head.append(title, save);
    const body = document.createElement("div");
    body.className = "body ph muted";
    body.textContent = t("imgLoading");
    card.append(head, body);
    out.appendChild(card);
    cards.set(m.id, { body, save });
  });

  let lastUsage = null;
  for (const m of models) {
    const { body, save } = cards.get(m.id);
    try {
      const res = await fetchWithTimeout(BACKEND_URL + "/api/images/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
        body: JSON.stringify({ model: m.id, prompt: full })
      }, 90000);

      const data = await res.json().catch(() => ({}));

      if (res.status === 401) { sessionExpired(); break; }
      if (!res.ok) throw new Error(data.error || t("imgError"));
      if (!data.image) throw new Error(t("imgError"));

      const img = document.createElement("img");
      img.src = data.image;
      img.alt = p;
      body.className = "body";
      body.replaceChildren(img);
      save.classList.remove("hidden");
      save.onclick = () => {
        const a = document.createElement("a");
        a.href = data.image;
        a.download = `querymix-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      };
      if (typeof data.remaining === "number") lastUsage = { remaining: data.remaining };
    } catch (err) {
      body.className = "body ph bad";
      body.textContent = err.message || t("imgError");
    }
  }

  running = false;
  btn.textContent = t("imgRun");
  syncButtons();
  if (lastUsage) refreshImageUsage();
};


// ---------- Init ----------
setTool("edit");
(function () {
  let initial = "ar";
  try {
    const saved = localStorage.getItem("qm_lang");
    if (saved && I18N[saved]) initial = saved;
    else {
      const n = (navigator.language || "").slice(0, 2);
      if (n === "fr" || n === "en") initial = n;
    }
  } catch (e) {}
  setLanguage(initial);
})();
loadFreeModels();
loadImageModels();
refreshImageUsage();
