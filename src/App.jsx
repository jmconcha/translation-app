import React, { useState } from 'react';
import axios from 'axios';
import ISO6391 from 'iso-639-1';

async function translate(text, srcLangCode, targetLangCode) {
  const encodedParams = new URLSearchParams();
  encodedParams.append("q", text);
  encodedParams.append("target", targetLangCode);
  encodedParams.append("source", srcLangCode);

  const options = {
    method: 'POST',
    url: 'https://google-translate1.p.rapidapi.com/language/translate/v2',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'Accept-Encoding': 'application/gzip',
      'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com',
      'X-RapidAPI-Key': '5a2c288efdmshf6aab829d0babd4p120e85jsn15bcd66f29ee'
    },
    data: encodedParams
  };

  const response = await axios.request(options);
  const result = response.data.data.translations[0].translatedText;

  return result;
}

function LanguageList({value, handleChange}) {
  const languages = ISO6391.getAllNames();

  return (
    <select defaultValue={value} onChange={handleChange}>
      {languages.map(language => (
        <option key={language} value={language}>{language}</option>
      ))}
    </select>
  );
}

function App() {
  const [textInput, setTextInput] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [srcLang, setSrcLang] = useState('');
  const [targetLang, setTargetLang] = useState('');

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '500px',
  }
  const textFieldStyle = {
    marginBottom: '4px',
  };
  const buttonStyle = {
    backgroundColor: 'green',
    color: 'white',
    border: 'none',
    padding: '6px 8px',
    borderRadius: '5px',
    marginBottom: '4px',
  };

  const handleChange = e => {
    setTextInput(e.target.value);
  };
  const handleClick = async () => {
    const srcLangCode = ISO6391.getCode(srcLang);
    const targetLangCode = ISO6391.getCode(targetLang);
    const result = await translate(textInput, srcLangCode, targetLangCode);
    setTranslatedText(result);
  };
  const handleSrcLangChange = (e) => {
    setSrcLang(e.target.value);
  };
  const handleTargetLangChange = (e) => {
    setTargetLang(e.target.value)
  };

  return (
    <div style={containerStyle}>
      <div>
        <input type="text" style={textFieldStyle} value={textInput} onChange={handleChange} />
        <LanguageList value={srcLang} handleChange={handleSrcLangChange} />
      </div>
      <button type="button" style={buttonStyle} onClick={handleClick}>Translate</button>
      <div>
        <input type="text" style={textFieldStyle} value={translatedText} disabled/>
        <LanguageList value={targetLang} handleChange={handleTargetLangChange} />
      </div>
    </div>
  );
}

export default App;