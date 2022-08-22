import { z } from "zod";

export const SetQuery = z.object({
    "search": z.string().max(25).optional(),
    "types": z.array(z.string().max(25).nullable()).optional()
});
