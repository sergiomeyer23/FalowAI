package com.falow.speech;

import org.springframework.stereotype.Component;

/**
 * The first TTS adapter is intentionally browser-side. This marker keeps the
 * backend contract ready for a hosted provider without coupling the domain to it.
 */
@Component
public class BrowserTextToSpeechProvider implements TextToSpeechProvider {
    @Override
    public SpeechAudio synthesize(String text, String language) {
        throw new UnsupportedOperationException("BrowserTextToSpeechProvider is executed by the frontend SpeechSynthesis API");
    }
}
