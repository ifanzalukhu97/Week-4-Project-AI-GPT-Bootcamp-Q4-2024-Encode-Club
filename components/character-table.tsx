'use client'

import { useState } from 'react'
import { Character } from '@/types'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Pencil, Trash2 } from 'lucide-react'

interface CharacterTableProps {
  characters: Character[];
  setCharacters: (characters: Character[]) => void;
}

export function CharacterTable({ characters, setCharacters }: CharacterTableProps) {
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null)
  const [newCharacter, setNewCharacter] = useState<Omit<Character, 'id'>>({
    name: '',
    description: '',
    personality: ''
  })

  const addCharacter = () => {
    if (newCharacter.name && newCharacter.description && newCharacter.personality) {
      setCharacters([...characters, { ...newCharacter, id: Date.now() }])
      setNewCharacter({ name: '', description: '', personality: '' })
    }
  }

  const updateCharacter = () => {
    if (editingCharacter) {
      setCharacters(characters.map(char => 
        char.id === editingCharacter.id ? editingCharacter : char
      ))
      setEditingCharacter(null)
    }
  }

  const deleteCharacter = (id: number) => {
    setCharacters(characters.filter(char => char.id !== id))
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{editingCharacter ? 'Edit Character' : 'Add New Character'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => {
            e.preventDefault()
            editingCharacter ? updateCharacter() : addCharacter()
          }} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name"
                value={editingCharacter ? editingCharacter.name : newCharacter.name}
                onChange={(e) => editingCharacter 
                  ? setEditingCharacter({...editingCharacter, name: e.target.value})
                  : setNewCharacter({...newCharacter, name: e.target.value})
                }
                placeholder="Character Name"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description"
                value={editingCharacter ? editingCharacter.description : newCharacter.description}
                onChange={(e) => editingCharacter
                  ? setEditingCharacter({...editingCharacter, description: e.target.value})
                  : setNewCharacter({...newCharacter, description: e.target.value})
                }
                placeholder="Character Description"
              />
            </div>
            <div>
              <Label htmlFor="personality">Personality</Label>
              <Input 
                id="personality"
                value={editingCharacter ? editingCharacter.personality : newCharacter.personality}
                onChange={(e) => editingCharacter
                  ? setEditingCharacter({...editingCharacter, personality: e.target.value})
                  : setNewCharacter({...newCharacter, personality: e.target.value})
                }
                placeholder="Character Personality"
              />
            </div>
            <Button type="submit">{editingCharacter ? 'Update' : 'Add'} Character</Button>
            {editingCharacter && (
              <Button type="button" variant="outline" onClick={() => setEditingCharacter(null)}>
                Cancel
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Characters</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Personality</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {characters.map((character) => (
                <TableRow key={character.id}>
                  <TableCell>{character.name}</TableCell>
                  <TableCell>{character.description}</TableCell>
                  <TableCell>{character.personality}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => setEditingCharacter(character)}
                        aria-label={`Edit ${character.name}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => deleteCharacter(character.id)}
                        aria-label={`Delete ${character.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}