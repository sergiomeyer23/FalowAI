package com.falow.speech;

import java.io.InputStream;
import org.springframework.stereotype.Component;

@Component
public class UnavailableSpeechToTextProvider implements SpeechToTextProvider {
    @Override
    public Transcript transcribe(InputStream audio, String contentType) {
        throw new IllegalStateException("Speech-to-text provider is not configured");
    }
}
