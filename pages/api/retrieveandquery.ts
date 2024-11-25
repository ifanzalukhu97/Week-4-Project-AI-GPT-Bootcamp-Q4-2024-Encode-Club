// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import {
  IndexDict,
  OpenAI,
  RetrieverQueryEngine,
  TextNode,
  VectorStoreIndex,
  serviceContextFromDefaults,
} from "llamaindex";
import {Character} from "@/types";

type Input = {
  query: string;
  topK?: number;
  nodesWithEmbedding: {
    text: string;
    embedding: number[];
  }[];
  temperature: number;
  topP: number;
};

type Output = {
  error?: string;
  payload?: {
    response: Character[];
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Output>,
) {
  console.clear();

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { topK, nodesWithEmbedding, temperature, topP }: Input =
    req.body;

  const embeddingResults = nodesWithEmbedding.map((config) => {
    return new TextNode({ text: config.text, embedding: config.embedding });
  });
  const indexDict = new IndexDict();
  for (const node of embeddingResults) {
    indexDict.addNode(node);
  }

  const index = await VectorStoreIndex.init({
    indexStruct: indexDict,
    serviceContext: serviceContextFromDefaults({
      llm: new OpenAI({
        model: "gpt-3.5-turbo-16k",
        temperature: temperature,
        topP: topP,
      }),
    }),
  });

  index.vectorStore.add(embeddingResults);
  if (!index.vectorStore.storesText) {
    await index.docStore.addDocuments(embeddingResults, true);
  }
  await index.indexStore?.addIndexStruct(indexDict);
  index.indexStruct = indexDict;

  const retriever = index.asRetriever();
  retriever.similarityTopK = topK ?? 2;

  const queryEngine = new RetrieverQueryEngine(retriever);

  const prompt = `
  Please provide the following information in JSON format:
  [
    {
      "id": Object ID / Number,
      "name": "Object Name",
      "description": "Object Description",
      "personality": "Object Personality"
    }
  ]
  Query: List the name, description, and personality of every character
  `;

  const result = await queryEngine.query(prompt);

  // Parse and convert response to Character
  const characterData: Character[] = JSON.parse(result.response);

  res.status(200).json({
    payload: {
      response: characterData
    }
  });
}
