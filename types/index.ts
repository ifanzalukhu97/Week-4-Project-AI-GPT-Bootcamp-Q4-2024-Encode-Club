export interface Character {
    id: number;
    name: string;
    description: string;
    personality: string;
  }

export interface CharacterTableProps {
    characters: Character[];
    setCharacters: (characters: Character[]) => void;
}
