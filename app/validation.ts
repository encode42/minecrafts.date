import { z } from "zod";

export const Types = z.array(z.string().max(25));

export const SetQuery = z.object({
    "search": z.string().max(25).optional(),
    "types": Types.optional()
});

export const VersionsGet = z.string().max(25).optional();

export const VersionsList = z.object({
    "types": Types.optional()
});
