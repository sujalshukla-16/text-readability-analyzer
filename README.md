# Text Readability Analyzer

A web-based text readability analysis tool that evaluates the difficulty of written content using multiple established readability metrics and combines their classifications to produce an overall readability result.

## Overview

Text Readability Analyzer accepts a sentence or paragraph and analyzes its readability using three different metrics:

- Flesch Reading Ease
- Flesch-Kincaid Grade Level
- Coleman-Liau Index

The application also calculates basic text statistics such as the number of sentences, words, syllables, average sentence length, and average syllables per word.

The classifications from the three readability metrics are combined using a simple ensemble-style voting approach to determine the final readability level:

- **Easy**
- **Medium**
- **Hard**

## Features

- Analyze sentences and paragraphs
- Count sentences, words, and syllables
- Calculate average sentence length
- Calculate average syllables per word
- Calculate Flesch Reading Ease score
- Calculate Flesch-Kincaid Grade Level
- Calculate Coleman-Liau Index
- Display the classification from each metric
- Combine the three classifications into a final readability result
- Responsive and professional web interface
- Light and dark theme support
- Clear text and results easily
- Flask-based backend API
- Interactive frontend using JavaScript

## How It Works

The application follows this process:

```text
User enters text
       ↓
Frontend sends text to Flask API
       ↓
Text preprocessing
       ↓
Sentence & word tokenization
       ↓
Syllable estimation
       ↓
Readability metrics calculated
       ↓
Each metric produces Easy / Medium / Hard classification
       ↓
Three classifications combined
       ↓
Final readability result returned
       ↓
Results displayed on the frontend
```
