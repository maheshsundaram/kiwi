import { serve } from "https://deno.land/std@0.140.0/http/server.ts";

serve(() => {
  return new Response("TODO", { headers: { "content-type": "text/plain" } });
});

// Routes
//
// GET / => redirects to /cal
// GET /cal => html/jsx form
// GET /event?<...params>
//
// /event query params
//
// start
// duration
// title
// description
// timezone
//
// Features
//
// 1. I can send a GET to /event with params and get back content-type text/calendar with the ICS data
// 2. I can visit / or /cal in the browser and see a form to build the event, then click a link to download the ICS data
