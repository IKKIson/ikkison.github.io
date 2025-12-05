# Whisper 기반의 Multilingual language recognition

- faster-whisper


    ```python
    # https://github.com/SYSTRAN/faster-whisper/blob/master/faster_whisper/transcribe.py#L469

    (
        language,
        language_probability,
        all_language_probs,
    ) = self.model.detect_language(
        features=np.concatenate(
            features
            + [
                np.full((self.model.model.n_mels, 1), -1.5, dtype="float32")
            ],
            axis=1,
        ),  # add a dummy feature to account for empty audio
        language_detection_segments=language_detection_segments,
        language_detection_threshold=language_detection_threshold,
    )
    ```