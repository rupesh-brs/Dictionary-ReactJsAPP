import React, { useState } from 'react';
import axios from 'axios';
import './App.css';



const App = () => {
    const [word, setWord] = useState('');
    const [meaning, setMeaning] = useState('');

    const fetchDefinition = async () => {
        try {
            const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            const wordData = response.data[0];
            let output = `<strong>${wordData.word}</strong><br>`;

            // Display audio
            const audioPhonetics = wordData.phonetics
                .filter(phonetic => phonetic.audio)
                .map(phonetic => `
                    <audio controls style="width: 200px;">
                        <source src="${phonetic.audio}" type="audio/mpeg">
                        Your browser does not support the audio element.
                    </audio><br>
                    <strong>${phonetic.text || ''}</strong><br>
                `).join('');

            output += audioPhonetics;

            // Display meanings
            wordData.meanings.forEach(meaning => {
                output += `<strong>${meaning.partOfSpeech}</strong><br>`;
                output += meaning.synonyms.length > 0
                    ? `<strong>${meaning.synonyms.join(', ')}</strong><br>`
                    : `<strong>None</strong><br>`;
                output += `<strong></strong><br>`;
                meaning.definitions.forEach(def => {
                    output += `- ${def.definition} ${def.example ? `(Example: ${def.example})` : ''}<br>`;
                });
                output += `<br>`;
            });

            setMeaning(output);
        } catch (error) {
            console.error('Error:', error);
            setMeaning("Error fetching data.");
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mt-3 px-5">Dictionary App</h1>
            <div className="inp">
                <input
                    type="text"
                    placeholder="Enter A Word."
                    value={word}
                    onChange={(e) => setWord(e.target.value)}
                    className="form-control"
                />
                <button onClick={fetchDefinition} className="btn btn-primary mt-2" id="search">Search</button>
            </div>
            <div id="meaning" className="mt-4" dangerouslySetInnerHTML={{ __html: meaning }}></div>
        </div>
    );
};

export default App;
