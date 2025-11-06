const TTS = (text, rate = 0.69) => {
  if (!text) return;

  const synth = window.speechSynthesis;
  const toSpeak = new SpeechSynthesisUtterance(text);

  toSpeak.rate = rate;

  if (synth.speaking) {
    return;
  }

  if (window.stopRecognition) {
    window.stopRecognition();
  }

  const voices = synth.getVoices();
  if (voices[156]) {
    toSpeak.voice = voices[156];
  } else{
    toSpeak.voice = voices[3];
  }

  
  toSpeak.onend = () => {
    if (window.startRecognition) {
        window.startRecognition();
    }
  };

  synth.speak(toSpeak);
};




export const stopTTS = () => {
  const synth = window.speechSynthesis;
  if (synth.speaking) {
    synth.cancel();
  }
};

export default TTS;
