import { serve } from "https://deno.land/std@0.140.0/http/server.ts";

serve(() => {
  return new Response("TODO", { headers: { "content-type": "text/plain" } });
});
