"use client";
import { useEffect, useRef } from 'react';

const AudioPlayer = () => {
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const audioElement = audioRef.current;

        if (audioElement) {
            audioElement.play().catch((error) => {
                console.error("Error playing audio:", error);
            });
        }

        return () => {
            if (audioElement) {
                audioElement.pause();
                audioElement.currentTime = 0; // Reset to start
            }
        };
    }, []);

    return (
        <audio ref={audioRef} loop muted>
            <source src="/audio1.mp3" type="audio/mpeg" />
            Your browser does not support the audio element.
        </audio>
    );
};

export default AudioPlayer;
