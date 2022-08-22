import { z } from "zod";

export const Version = z.string().max(25);
export const Types = z.array(Version);

export const SetQuery = z.object({
    "search": Version.optional(),
    "types": Types.optional()
});

export const Versions = z.object({
    "types": Types.optional()
});

export const VersionsList = z.object({
    "types": Types.optional()
});
