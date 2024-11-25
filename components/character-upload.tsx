import {ChangeEvent, useId, useState} from "react";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {LinkedSlider} from "@/components/ui/linkedslider";
import {Textarea} from "@/components/ui/textarea";
import {Character, CharacterTableProps} from "@/types";

const DEFAULT_CHUNK_SIZE = 1024;
const DEFAULT_CHUNK_OVERLAP = 20;
const DEFAULT_TOP_K = 2;
const DEFAULT_TEMPERATURE = 0.1;
const DEFAULT_TOP_P = 1;

export default function CharacterUpload({setCharacters}: CharacterTableProps) {
    const sourceId = useId();
    const [text, setText] = useState("");
    const [needsNewIndex, setNeedsNewIndex] = useState(true);
    const [buildingIndex, setBuildingIndex] = useState(false);
    const [runningQuery, setRunningQuery] = useState(false);
    const [nodesWithEmbedding, setNodesWithEmbedding] = useState([]);
    const [chunkSize, setChunkSize] = useState(DEFAULT_CHUNK_SIZE.toString());
    //^ We're making all of these strings to preserve things like the user typing "0."
    const [chunkOverlap, setChunkOverlap] = useState(
        DEFAULT_CHUNK_OVERLAP.toString(),
    );
    const [topK] = useState(DEFAULT_TOP_K.toString());
    const [temperature] = useState(
        DEFAULT_TEMPERATURE.toString(),
    );
    const [topP] = useState(DEFAULT_TOP_P.toString());
    const [answer, setAnswer] = useState("");

    const isValidCharacterArray = (data: any[]): data is Character[] => {
        return data.every(item =>
            typeof item.id === 'number' &&
            typeof item.name === 'string' &&
            typeof item.description === 'string' &&
            typeof item.personality === 'string'
        );
    };

    return (
        <>
            <div className="flex flex-col space-y-4">
                <div className="space-y-2">
                    <Label>Settings:</Label>
                    <div>
                        <LinkedSlider
                            label="Chunk Size:"
                            description={
                                "The maximum size of the chunks we are searching over, in tokens. " +
                                "The bigger the chunk, the more likely that the information you are looking " +
                                "for is in the chunk, but also the more likely that the chunk will contain " +
                                "irrelevant information."
                            }
                            min={1}
                            max={3000}
                            step={1}
                            value={chunkSize}
                            onChange={(value: string) => {
                                setChunkSize(value);
                                setNeedsNewIndex(true);
                            }}
                        />
                    </div>
                    <div>
                        <LinkedSlider
                            label="Chunk Overlap:"
                            description={
                                "The maximum amount of overlap between chunks, in tokens. " +
                                "Overlap helps ensure that sufficient contextual information is retained."
                            }
                            min={1}
                            max={600}
                            step={1}
                            value={chunkOverlap}
                            onChange={(value: string) => {
                                setChunkOverlap(value);
                                setNeedsNewIndex(true);
                            }}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor={sourceId}>Upload source text file:</Label>
                    <Input
                        id={sourceId}
                        type="file"
                        accept=".txt"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                    const fileContent = event.target?.result as string;
                                    setText(fileContent);
                                    setNeedsNewIndex(true);
                                };
                                if (file.type != "text/plain") {
                                    console.error(`${file.type} parsing not implemented`);
                                    setText("Error");
                                } else {
                                    reader.readAsText(file);
                                }
                            }
                        }}
                    />

                    {
                        text && (
                            <Textarea
                                value={text}
                                readOnly
                                placeholder="File contents will appear here"
                                className="h-32"
                            />
                        )
                    }

                </div>

                <div className="space-y-2">
                    <Button
                        className="w-full"
                        disabled={!needsNewIndex || buildingIndex || runningQuery}
                        onClick={async () => {
                            setBuildingIndex(true);
                            setNeedsNewIndex(false);
                            // Post the text and settings to the server
                            const result = await fetch("/api/splitandembed", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    document: text,
                                    chunkSize: parseInt(chunkSize),
                                    chunkOverlap: parseInt(chunkOverlap),
                                }),
                            });

                            const {error, payload} = await result.json();

                            if (error) {
                                setAnswer(error);
                            }

                            if (payload) {
                                setNodesWithEmbedding(payload.nodesWithEmbedding);
                                setAnswer("Nodes with embeddings successfully extracted.");
                            }

                            setBuildingIndex(false);
                        }}
                    >
                        {buildingIndex ? "Building Vector index..." : "Build index"}
                    </Button>

                    {!buildingIndex && !needsNewIndex && !runningQuery && (
                        <>
                            <div className="my-2 space-y-2">
                                <div className="flex w-full space-x-2">
                                    <Button
                                        className="w-full"
                                        type="submit"
                                        disabled={needsNewIndex || buildingIndex || runningQuery}
                                        onClick={async () => {
                                            setAnswer("Running query...");
                                            setRunningQuery(true);
                                            // Post the query and nodesWithEmbedding to the server
                                            const result = await fetch("/api/retrieveandquery", {
                                                method: "POST",
                                                headers: {
                                                    "Content-Type": "application/json",
                                                },
                                                body: JSON.stringify({
                                                    nodesWithEmbedding,
                                                    topK: parseInt(topK),
                                                    temperature: parseFloat(temperature),
                                                    topP: parseFloat(topP),
                                                }),
                                            });

                                            const {error, payload} = await result.json();

                                            if (error) {
                                                setAnswer(error);
                                            }

                                            if (payload) {
                                                const characterData = payload.response;

                                                if (Array.isArray(characterData) && isValidCharacterArray(characterData)) {
                                                    setCharacters(characterData);
                                                    setAnswer("Characters successfully extracted and added to the table.");
                                                } else {
                                                    setAnswer("Invalid character data format received.");
                                                }
                                            }

                                            setRunningQuery(false);
                                        }}
                                    >
                                        Extract Characters from the Uploaded File
                                    </Button>
                                </div>
                            </div>
                            <div className="my-2 flex h-1/4 flex-auto flex-col space-y-2">
                                <Label>Answer:</Label>
                                <Textarea
                                    className="flex-1"
                                    readOnly
                                    value={answer}
                                />
                            </div>
                        </>
                    )}
                </div>

            </div>
        </>
    );
}
