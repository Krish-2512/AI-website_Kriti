/**
 * Multinomial Naive Bayes Probabilistic Intent & Domain Classifier
 * Implements Bayes' Theorem with Laplace Smoothing (alpha=1)
 * P(Class | Document) = P(Class) * Product( P(Word_i | Class) )
 */

const TRAINING_CORPUS = {
  "E-Commerce": [
    "shop store product buy cart checkout discount price apparel clothing sneakers merchandise anime luxury deal orders catalog",
    "ecommerce marketplace fashion sale items inventory shipping delivery tracking customer reviews payment gateway retail dropship"
  ],
  "FinTech & Crypto": [
    "crypto bitcoin btc ethereum solana trading wallet token defi blockchain exchange investment portfolio stocks banking neobank finance",
    "liquidity yield swap transfer payments ledger gas fee transactions smart contract non custodial automated market maker"
  ],
  "B2B SaaS & Cloud": [
    "saas cloud platform api workflow automation analytics b2b dashboard enterprise monitoring microservices integration developer tools",
    "collaboration slack webhook docker kubernetes telemetry uptime sla infrastructure database devops multi-tenant subscription"
  ],
  "Developer & Designer Portfolio": [
    "portfolio developer engineer designer resume cv personal website projects github showcase skills full stack frontend backend",
    "case study experience bio about me contact work hire me awards certifications visual design illustrations photography"
  ],
  "Restaurant & Hospitality": [
    "restaurant cafe food bistro dining menu chef pizza sushi coffee bakery table reservation delicious cuisine breakfast dinner",
    "farm to table organic wine pairings dessert cocktails michelin gourmet tasting booking party catering order online"
  ],
  "Fitness & Healthcare": [
    "gym fitness workout workout routine personal trainer muscle health crossfit yoga wellness nutrition medical clinic doctor clinic",
    "biometric bmi calories schedule strength training cardio athletic membership consultation recovery injury therapy"
  ]
};

class NaiveBayesClassifier {
  constructor() {
    this.classes = Object.keys(TRAINING_CORPUS);
    this.classDocCounts = {};
    this.wordCounts = {};
    this.vocab = new Set();
    this.totalWordsInClass = {};
    this.totalDocs = 0;

    this.train();
  }

  tokenize(text) {
    return (text || "").toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/).filter(Boolean);
  }

  train() {
    for (const className of this.classes) {
      this.classDocCounts[className] = TRAINING_CORPUS[className].length;
      this.totalDocs += TRAINING_CORPUS[className].length;
      this.wordCounts[className] = {};
      this.totalWordsInClass[className] = 0;

      for (const doc of TRAINING_CORPUS[className]) {
        const tokens = this.tokenize(doc);
        for (const token of tokens) {
          this.vocab.add(token);
          this.wordCounts[className][token] = (this.wordCounts[className][token] || 0) + 1;
          this.totalWordsInClass[className]++;
        }
      }
    }
  }

  predict(text) {
    const tokens = this.tokenize(text);
    if (tokens.length === 0) {
      return {
        predictedDomain: "B2B SaaS & Cloud",
        confidence: 0.85,
        probabilities: this.classes.map(c => ({ class: c, probability: 0.16 }))
      };
    }

    const logProbabilities = {};
    const vocabSize = this.vocab.size;

    for (const className of this.classes) {
      // Prior probability: P(Class)
      const prior = Math.log(this.classDocCounts[className] / this.totalDocs);
      let logLikelihood = 0;

      // Likelihood with Laplace Smoothing (alpha = 1): P(w | Class) = (count + 1) / (total_words + |V|)
      for (const token of tokens) {
        const wordCount = this.wordCounts[className][token] || 0;
        const probWordGivenClass = (wordCount + 1) / (this.totalWordsInClass[className] + vocabSize);
        logLikelihood += Math.log(probWordGivenClass);
      }

      logProbabilities[className] = prior + logLikelihood;
    }

    // Softmax normalization to convert log-likelihoods to standard probabilities
    const maxLog = Math.max(...Object.values(logProbabilities));
    const expScores = {};
    let sumExp = 0;

    for (const className of this.classes) {
      const exp = Math.exp(logProbabilities[className] - maxLog);
      expScores[className] = exp;
      sumExp += exp;
    }

    const probabilities = this.classes.map(c => ({
      class: c,
      probability: Math.round((expScores[c] / sumExp) * 1000) / 1000,
      percentage: Math.round((expScores[c] / sumExp) * 100)
    })).sort((a, b) => b.probability - a.probability);

    const topClass = probabilities[0];

    return {
      predictedDomain: topClass.class,
      confidence: topClass.probability,
      confidencePercent: `${topClass.percentage}%`,
      formula: "P(Domain | Prompt) ∝ P(Domain) * ∏ P(Word_i | Domain)",
      probabilities
    };
  }
}

export const naiveBayesModel = new NaiveBayesClassifier();
