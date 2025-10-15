const e=`# Whisper 기반의 Multilingual language recognition\r
\r
- faster-whisper\r
\r
\r
    \`\`\`python\r
    # https://github.com/SYSTRAN/faster-whisper/blob/master/faster_whisper/transcribe.py#L469\r
\r
    (\r
        language,\r
        language_probability,\r
        all_language_probs,\r
    ) = self.model.detect_language(\r
        features=np.concatenate(\r
            features\r
            + [\r
                np.full((self.model.model.n_mels, 1), -1.5, dtype="float32")\r
            ],\r
            axis=1,\r
        ),  # add a dummy feature to account for empty audio\r
        language_detection_segments=language_detection_segments,\r
        language_detection_threshold=language_detection_threshold,\r
    )\r
    \`\`\``;export{e as default};
