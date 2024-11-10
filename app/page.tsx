"use client";

import { useState } from "react";
import { useChat } from "ai/react";

interface Character {
  id: string;
  name: string;
  description: string;
  personality: string;
}

function Chat() {
  const { messages, append, isLoading } = useChat();

  const initialCharacters: Character[] = [
    {
      id: "1",
      name: "Charlie",
      description: "A clumsy wedding planner who falls in love at every wedding",
      personality: "Hopeless romantic with terrible luck and perfect comic timing"
    },
    {
      id: "2",
      name: "Sofia",
      description: "A successful chef who can't cook when she's in love",
      personality: "Confident and witty, but becomes hilariously awkward around her crush"
    },
    {
      id: "3",
      name: "James",
      description: "A professional matchmaker who can't find his own soulmate",
      personality: "Great at giving love advice, terrible at taking it, prone to slapstick situations"
    }
  ];

  const [characters, setCharacters] = useState<Character[]>(initialCharacters);
  const [newCharacter, setNewCharacter] = useState<Omit<Character, 'id'>>({
    name: '',
    description: '',
    personality: ''
  });

  // Add character management functions
  const addCharacter = () => {
    if (newCharacter.name) {
      setCharacters([...characters, { ...newCharacter, id: crypto.randomUUID() }]);
      setNewCharacter({ name: '', description: '', personality: '' });
    }
  };

  const deleteCharacter = (id: string) => {
    setCharacters(characters.filter(char => char.id !== id));
  };

  // The story generation to include characters
  const generateStory = () => {
    const charactersPrompt = characters.length > 0
        ? `Include these characters in the story:\n${characters.map(char =>
            `- ${char.name}: ${char.description}. Personality: ${char.personality}`
        ).join('\n')}`
        : '';

    append({
      role: "user",
      content: `Generate a ${state.genre} story in a ${state.tone} tone. ${charactersPrompt}`
    });
  };

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
    genre: "Romance",  // Default genre
    tone: "Funny" // Default tone
  });

  const handleChange = ({
                          target: { name, value },
                        }: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [name]: value,
    });
  };

  return (
      <main className="mx-auto w-full p-24 flex flex-col">
        <div className="p4 m-4">
          <div className="flex flex-col items-center justify-center space-y-8 text-white">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">Story Telling App</h2>
              <p className="text-zinc-500 dark:text-zinc-400">
                Customize the story by selecting the genre and tone.
              </p>
            </div>

            <div className="flex gap-8 w-full justify-center">
              {/* Genre Section */}
              <div className="flex-1 space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-6 max-w-md">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-xl font-semibold">Genre</h3>
                  <span className="text-sm text-gray-400">Choose your story type</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {genres.map(({value, emoji}) => (
                      <div
                          key={value}
                          className={`p-4 rounded-lg transition-all duration-200 cursor-pointer ${
                              state.genre === value
                                  ? 'bg-blue-500 bg-opacity-50 shadow-lg transform scale-105'
                                  : 'bg-gray-600 bg-opacity-25 hover:bg-opacity-40'
                          }`}
                      >
                        <input
                            id={`genre-${value}`}
                            type="radio"
                            value={value}
                            name="genre"
                            onChange={handleChange}
                            checked={state.genre === value}
                            className="hidden"
                        />
                        <label
                            className="flex items-center gap-2 cursor-pointer w-full h-full"
                            htmlFor={`genre-${value}`}
                        >
                          <span className="text-2xl">{emoji}</span>
                          <span className="font-medium">{value}</span>
                        </label>
                      </div>
                  ))}
                </div>
              </div>

              {/* Tone Section */}
              <div className="flex-1 space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-6 max-w-md">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-xl font-semibold">Tone</h3>
                  <span className="text-sm text-gray-400">Set the mood</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {tones.map(({value, emoji}) => (
                      <div
                          key={value}
                          className={`p-4 rounded-lg transition-all duration-200 cursor-pointer ${
                              state.tone === value
                                  ? 'bg-purple-500 bg-opacity-50 shadow-lg transform scale-105'
                                  : 'bg-gray-600 bg-opacity-25 hover:bg-opacity-40'
                          }`}
                      >
                        <input
                            id={`tone-${value}`}
                            type="radio"
                            name="tone"
                            value={value}
                            onChange={handleChange}
                            checked={state.tone === value}
                            className="hidden"
                        />
                        <label
                            className="flex items-center gap-2 cursor-pointer w-full h-full"
                            htmlFor={`tone-${value}`}
                        >
                          <span className="text-2xl">{emoji}</span>
                          <span className="font-medium">{value}</span>
                        </label>
                      </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4 mt-4">
              <h3 className="text-xl font-semibold">Characters</h3>

              {/* Characters Table */}
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full bg-opacity-25 bg-gray-800 rounded-lg">
                  <thead>
                  <tr className="border-b border-gray-600">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Personality</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-600">
                  {characters.map(char => (
                      <tr key={char.id} className="hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-medium text-white">{char.name}</span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-300">{char.description}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm italic text-gray-300">{char.personality}</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                              onClick={() => deleteCharacter(char.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>

              {/* Character Input Form */}
              <div className="space-y-4 bg-opacity-25 bg-gray-800 rounded-lg p-6">
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-white">Add New Character</h4>
                  <p className="text-sm text-gray-400">Create a unique character for your story</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <input
                        type="text"
                        placeholder="Character Name"
                        className="w-full p-2 rounded text-gray-900 bg-white"
                        value={newCharacter.name}
                        onChange={e => setNewCharacter({...newCharacter, name: e.target.value})}
                    />
                    <p className="text-xs text-gray-400 ml-1">Enter a memorable name for your character</p>
                  </div>

                  <div className="space-y-1">
                    <input
                        type="text"
                        placeholder="Description"
                        className="w-full p-2 rounded text-gray-900 bg-white"
                        value={newCharacter.description}
                        onChange={e => setNewCharacter({...newCharacter, description: e.target.value})}
                    />
                    <p className="text-xs text-gray-400 ml-1">Describe their role or background story</p>
                  </div>

                  <div className="space-y-1">
                    <input
                        type="text"
                        placeholder="Personality"
                        className="w-full p-2 rounded text-gray-900 bg-white"
                        value={newCharacter.personality}
                        onChange={e => setNewCharacter({...newCharacter, personality: e.target.value})}
                    />
                    <p className="text-xs text-gray-400 ml-1">Define their traits and behaviors</p>
                  </div>

                  <button
                      onClick={addCharacter}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
                  >
                    Add Character
                  </button>
                </div>
              </div>
            </div>

            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 mt-4"
                disabled={isLoading || !state.genre || !state.tone}
                onClick={generateStory}
            >
              Generate Story
            </button>

            <div
                hidden={
                    messages.length === 0 ||
                    messages[messages.length - 1]?.content.startsWith("Generate")
                }
                className="bg-opacity-25 bg-gray-700 rounded-lg p-4"
            >
              {messages[messages.length - 1]?.content}
            </div>
          </div>
        </div>
      </main>
  );
}

export default Chat;
