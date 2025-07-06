import { anthropic } from '@ai-sdk/anthropic';
import { streamText, tool, stepCountIs } from 'ai';
import 'dotenv/config';
import { z } from 'zod/v4';

async function main() {
  const result = streamText({
    model: anthropic('claude-3-5-sonnet-latest'),
    prompt: 'What are the latest developments in AI safety research? Please search for information and provide a comprehensive answer with proper citations.',
    stopWhen: stepCountIs(5),
    tools: {
      searchKnowledgeBase: tool({
        description: 'Search the knowledge base for relevant information',
        inputSchema: z.object({
          query: z.string().describe('The search query'),
        }),
        execute: async ({ query }) => {
          return [
            {
              type: 'text' as const,
              text: 'Recent research has shown significant progress in constitutional AI approaches to safety. These methods involve training AI systems to follow a set of principles or constitution. Key findings include improved alignment and reduced harmful outputs.',
              providerOptions: {
                anthropic: {
                  searchResult: {
                    source: 'https://arxiv.org/abs/2024.01234',
                    title: 'Advances in AI Safety: Constitutional AI Methods',
                    citations: { enabled: true },
                  },
                },
              },
            },
            {
              type: 'text' as const,
              text: 'OpenAI has published new safety guidelines for large language models. The updates focus on red teaming, evaluation frameworks, and deployment protocols.',
              providerOptions: {
                anthropic: {
                  searchResult: {
                    source: 'https://openai.com/research/safety-updates-2024',
                    title: 'OpenAI Safety Updates 2024',
                    citations: { enabled: true },
                  },
                },
              },
            },
          ];
        },
      }),
    },
  });

  let citationCount = 0;

  for await (const part of result.fullStream) {
    switch (part.type) {
      case 'text':
        process.stdout.write(part.text);
        break;

      case 'source':
        if (part.sourceType === 'url' && part.providerMetadata?.anthropic) {
          const meta = part.providerMetadata.anthropic;
          console.log(
            `\n[${++citationCount}] "${meta.citedText}" from ${part.title} (${part.url})`,
          );
        }
        break;
    }
  }

  console.log(`\n\nCitations: ${citationCount}, Sources: ${(await result.sources).length}`);
}

main().catch(console.error);
