package com.falow.speech;

import java.io.InputStream;

public interface SpeechToTextProvider {
    Transcript transcribe(InputStream audio, String contentType);

    class Transcript {
        private final String text;
        private final String provider;
        public Transcript(String text, String provider) { this.text = text; this.provider = provider; }
        public String getText() { return text; }
        public String getProvider() { return provider; }
    }
}
