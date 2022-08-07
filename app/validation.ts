import { z } from "zod";

export const SearchQuery = z.object({
    "query": z.string().min(0).max(25)
});
