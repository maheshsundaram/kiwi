import { serve, serveStatic } from "https://deno.land/x/sift@0.6.0/mod.ts";
import {
  Calendar,
  Event,
  EventConfig,
} from "https://deno.land/x/simple_ics@0.0.11/mod.ts";

serve({
  "/": (req) => Response.redirect(`${req.url}cal`, 302),
  "/cal": serveStatic("view.html", { baseUrl: import.meta.url }),
  "/mvp.css": serveStatic("mvp.css", { baseUrl: import.meta.url }),
  "/style.css": serveStatic("style.css", { baseUrl: import.meta.url }),
  "/event": (_req) => {
    const cfg1: EventConfig = {
      title: "Write Typescript",
      beginDate: [2022, 9, 6, 9, 30],
      endDate: [2022, 9, 6, 10],
      desc: "Implement a module to generate .ics files",
    };
    const evt1 = new Event(cfg1);
    const calendar = new Calendar([evt1]);
    const ics = calendar.toString();
    return new Response(ics, { headers: { "Content-Type": "text/calendar" } });
  },
});

// - Build out view component
// - Build function with ical

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
