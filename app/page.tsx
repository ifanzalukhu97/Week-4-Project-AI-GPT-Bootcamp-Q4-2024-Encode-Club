"use client";

import { useState } from "react";
import { useChat } from "ai/react";
import { CharacterTable } from "@/components/character-table";
import { Character } from '@/types'

export default function Chat() {
  const [characters, setCharacters] = useState<Character[]>([
  ]);
  const { messages, append, isLoading } = useChat();

  const genres = [
    { emoji: "🧙", value: "Fantasy" },
    { emoji: "🕵️", value: "Mystery" },
    { emoji: "💑", value: "Romance" },
    { emoji: "🚀", value: "Sci-Fi" },
  ];
  const tones = [
    { emoji: "😊", value: "Happy" },
    { emoji: "😢", value: "Sad" },
    { emoji: "😏", value: "Sarcastic" },
    { emoji: "😂", value: "Funny" },
  ];

  const [state, setState] = useState({
    genre: "",
    tone: "",
    characters: [] as Character[],
  });

  const handleChange = ({
                          target: { name, value },
                        }: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [name]: value,
    });
  };

  const handleCharacterChange = (character: Character) => {
    setState((prevState) => {
      const isSelected = prevState.characters.some((char) => char.id === character.id);
      const newCharacters = isSelected
          ? prevState.characters.filter((char) => char.id !== character.id)
          : [...prevState.characters, character];
      return { ...prevState, characters: newCharacters };
    });
  };

  const generatePrompt = () => {
    const characterDescriptions = state.characters.map(
        (char) => `${char.name} (${char.description}, ${char.personality})`
    ).join(", ");
    return `Generate a ${state.genre} story in a ${state.tone} tone featuring the characters: ${characterDescriptions}`;
  };

  return (
      <main className="mx-auto w-full max-w-7xl p-8">
        <CharacterTable characters={characters} setCharacters={setCharacters} />

        <div className="mt-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white">Story Telling App</h2>
            <p className="text-zinc-400 mt-2">
              Customize the story by selecting the genre and tone.
            </p>
          </div>

          {/* Grid layout for the three main sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Characters Section */}
            <div className="bg-gray-800/50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Characters</h3>
              <div className="grid grid-cols-1 gap-3">
                {characters.map((character) => (
                    <div
                        key={character.id}
                        className="bg-gray-700/50 rounded-lg p-3 flex items-center"
                    >
                      <input
                          id={`character-${character.id}`}
                          type="checkbox"
                          value={character.name}
                          onChange={() => handleCharacterChange(character)}
                          className="h-4 w-4"
                      />
                      <label
                          className="ml-3 text-white"
                          htmlFor={`character-${character.id}`}
                      >
                        {character.name}
                      </label>
                    </div>
                ))}
              </div>
            </div>

            {/* Genre Section */}
            <div className="bg-gray-800/50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Genre</h3>
              <div className="grid grid-cols-1 gap-3">
                {genres.map(({ value, emoji }) => (
                    <div
                        key={value}
                        className="bg-gray-700/50 rounded-lg p-3 flex items-center"
                    >
                      <input
                          id={value}
                          type="radio"
                          value={value}
                          name="genre"
                          onChange={handleChange}
                          className="h-4 w-4"
                      />
                      <label className="ml-3 text-white" htmlFor={value}>
                        {`${emoji} ${value}`}
                      </label>
                    </div>
                ))}
              </div>
            </div>

            {/* Tones Section */}
            <div className="bg-gray-800/50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Tones</h3>
              <div className="grid grid-cols-1 gap-3">
                {tones.map(({ value, emoji }) => (
                    <div
                        key={value}
                        className="bg-gray-700/50 rounded-lg p-3 flex items-center"
                    >
                      <input
                          id={value}
                          type="radio"
                          name="tone"
                          value={value}
                          onChange={handleChange}
                          className="h-4 w-4"
                      />
                      <label className="ml-3 text-white" htmlFor={value}>
                        {`${emoji} ${value}`}
                      </label>
                    </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50 transition-colors"
                disabled={isLoading || !state.genre || !state.tone || state.characters.length === 0}
                onClick={() => append({
                  role: "user",
                  content: generatePrompt(),
                })}
            >
              Generate Story
            </button>

            <div
                hidden={messages.length === 0 || messages[messages.length - 1]?.content.startsWith("Generate")}
                className="mt-6 bg-gray-800/50 rounded-xl p-6 text-white"
            >
              {messages[messages.length - 1]?.content}
            </div>
          </div>
        </div>
      </main>
  );
}
