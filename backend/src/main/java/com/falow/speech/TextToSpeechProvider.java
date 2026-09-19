package com.falow.speech;

public interface TextToSpeechProvider {
    SpeechAudio synthesize(String text, String language);

    class SpeechAudio {
        private final byte[] content;
        private final String contentType;
        public SpeechAudio(byte[] content, String contentType) { this.content = content; this.contentType = contentType; }
        public byte[] getContent() { return content; }
        public String getContentType() { return contentType; }
    }
}
