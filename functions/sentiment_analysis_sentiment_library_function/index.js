var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const aposToLexForm = require('apos-to-lex-form');
const natural = require('natural');
const SpellCorrector = require('spelling-corrector');
const SW = require('stopword');

//const router = express.Router();

const spellCorrector = new SpellCorrector();
spellCorrector.loadDictionary();

app.post('/s-analyzer', function(req, res, next) {
    console.log('in function s-analyzer');
    const { review } = req.body;
    /* NORMALIZATION */

    // negation handling
    // convert apostrophe=connecting words to lex form
    const lexedReview = aposToLexForm(review);

    // casing
    const casedReview = lexedReview.toLowerCase();

    // removing
    const alphaOnlyReview = casedReview.replace(/[^a-zA-Z\s]+/g, '');

    // tokenize review
    const { WordTokenizer } = natural;
    const tokenizer = new WordTokenizer();
    const tokenizedReview = tokenizer.tokenize(alphaOnlyReview);

    // spell correction
    tokenizedReview.forEach((word, index) => {
        tokenizedReview[index] = spellCorrector.correct(word);
    })

    // remove stopwords
    const filteredReview = SW.removeStopwords(tokenizedReview);

    const { SentimentAnalyzer, PorterStemmer } = natural;
    const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');

    const analysis = analyzer.getSentiment(filteredReview);
    console.log('Analysis is     ' + analysis);
    res.send({ analysis });
});

module.exports = app;