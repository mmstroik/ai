import { z } from 'zod/v4';

/**
 * Schema for search results returned by tools.
 * Tools can return this structure to enable automatic citation support.
 */
export const searchResults_20250609OutputSchema = z.array(
  z.object({
    /**
     * The source URL or identifier for this search result
     */
    source: z.string(),

    /**
     * The title of the search result
     */
    title: z.string(),

    /**
     * The content text of the search result
     */
    content: z.string(),

    /**
     * Optional citation configuration for this result
     */
    citations: z
      .object({
        enabled: z.boolean(),
      })
      .optional(),
  }),
);

export type SearchResults_20250609Output = z.infer<
  typeof searchResults_20250609OutputSchema
>;
