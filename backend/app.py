from flask import Flask, request, jsonify
from flask_cors import CORS
import nltk
import os

nltk.data.path.append(os.path.expanduser("~/nltk_data"))
nltk.data.path.append("/opt/render/nltk_data")

app = Flask(__name__)
CORS(app)


def count_syllables(word):
    word = word.lower()
    vowels = "aeiou"

    count = 0
    previous_was_vowel = False

    for letter in word:
        if letter in vowels:
            if not previous_was_vowel:
                count += 1
            previous_was_vowel = True
        else:
            previous_was_vowel = False

    # Handle a silent 'e' at the end of a word
    if word.endswith("e") and not word.endswith(("le", "ye")) and count > 1:
        count -= 1

    # Every word should have at least one syllable
    if count == 0:
        count = 1

    return count


def calculate_fkgl(asl, asw):
    return (0.39 * asl) + (11.8 * asw) - 15.59


def calculate_coleman_liau(words, sentences):
    letters = sum(len(word) for word in words)

    L = (letters / len(words)) * 100
    S = (len(sentences) / len(words)) * 100

    return (0.0588 * L) - (0.296 * S) - 15.8


def classify_flesch(score):
    if score >= 80:
        return 1
    elif score >= 50:
        return 2
    else:
        return 3


def classify_fkgl(score):
    if score <= 6:
        return 1
    elif score <= 9:
        return 2
    else:
        return 3


def classify_coleman_liau(score):
    if score <= 6:
        return 1
    elif score <= 12:
        return 2
    else:
        return 3


def ensemble_classification(flesch, fkgl, coleman_liau):
    flesch_vote = classify_flesch(flesch)
    fkgl_vote = classify_fkgl(fkgl)
    coleman_vote = classify_coleman_liau(coleman_liau)

    average_vote = (flesch_vote + fkgl_vote + coleman_vote) / 3

    if average_vote <= 1.5:
        return "Easy"
    elif average_vote <= 2.5:
        return "Medium"
    else:
        return "Hard"


def analyze_text(text):
    sentences = nltk.sent_tokenize(text)

    words = nltk.word_tokenize(text)
    words = [word for word in words if word.isalpha()]

    total_syllables = 0

    for word in words:
        total_syllables += count_syllables(word)

    return sentences, words, total_syllables

@app.route("/healthz", methods=["GET"])
def health_check():
    return jsonify({
        "status": "healthy"
    }), 200

@app.route("/analyze", methods=["POST"])
def analyze():

    data = request.get_json(silent=True)

    if not data:
        return jsonify({
            "error": "Invalid request."
        }), 400

    text = data.get("text", "").strip()

    if not text:
        return jsonify({
            "error": "Please enter some text."
        }), 400

    sentences, words, total_syllables = analyze_text(text)

    if not words or not sentences:
        return jsonify({
            "error": "Unable to analyze the given text."
        }), 400

    asl = len(words) / len(sentences)

    asw = total_syllables / len(words)

    fkgl = calculate_fkgl(asl, asw)

    coleman_liau = calculate_coleman_liau(words, sentences)

    readability_score = (
        206.835
        - (1.015 * asl)
        - (84.6 * asw)
    )

    classification = ensemble_classification(
        readability_score,
        fkgl,
        coleman_liau
    )

    flesch_vote = classify_flesch(readability_score)
    fkgl_vote = classify_fkgl(fkgl)
    coleman_vote = classify_coleman_liau(coleman_liau)

    categories = {
        1: "Easy",
        2: "Medium",
        3: "Hard"
    }

    return jsonify({
        "sentences": len(sentences),
        "words": len(words),
        "syllables": total_syllables,

        "average_sentence_length": round(asl, 2),
        "average_syllables_per_word": round(asw, 2),

        "flesch_score": round(readability_score, 2),
        "fkgl_score": round(fkgl, 2),
        "coleman_liau_score": round(coleman_liau, 2),

        "flesch_classification": categories[flesch_vote],
        "fkgl_classification": categories[fkgl_vote],
        "coleman_liau_classification": categories[coleman_vote],

        "final_readability": classification
    })

if __name__ == "__main__":
    import os
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5000))
    )