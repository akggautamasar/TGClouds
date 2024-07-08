import { z } from "zod";

const env = z
  .object({
    TELEGRAM_API_ID: z.string().transform((v) => parseInt(v)),
    TELEGRAM_API_HASH: z.string(),
  })
  .parse(process.env);

  export default env