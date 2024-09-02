# Proscenium Version 1

## Overview

**Proscenium** is a versatile tool that translates both text and large files into the desired language using state-of-the-art Natural Language Processing (NLP) models and cloud-based APIs. Version 1 of Proscenium leverages **BERT NLM** and the **Google Translation API** to provide fast, accurate translations, ensuring high fidelity in both small text segments and large, complex documents.

## Features

- **Text Translation**: Easily translate small text inputs into any supported language.
- **File Translation**: Upload large files (such as PDFs, DOCX, and more) for seamless translation.
- **BERT NLM Powered**: Utilizes the powerful BERT language model for improved contextual understanding of text, ensuring accurate translations.
- **Google API Integration**: Taps into the Google Cloud Translation API for extensive language support and reliable performance.

## Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/proscenium.git
cd proscenium
```

## Configuration
Modify the config.py file to add your Google API key and adjust other settings as needed.
```bash
GOOGLE_API_KEY = 'your-google-api-key'
BERT_MODEL = 'bert-base-multilingual-cased'
```
## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.
