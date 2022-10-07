import { serve, serveStatic } from "https://deno.land/x/sift@0.6.0/mod.ts";
import {
  Calendar,
  Event,
  EventConfig,
} from "https://deno.land/x/simple_ics@0.0.11/mod.ts";
import { z } from "https://deno.land/x/zod@v3.19.1/mod.ts";

const buildICS = (config: EventConfig) => {
  const event = new Event(config);
  const calendar = new Calendar([event]);
  const ics = calendar.toString();
  return ics;
};

const dateSchema = z.preprocess((arg) => {
  if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
}, z.date());

const stringSchema = z.string();

const handleEvent = async (req: Request) => {
  const form = await req.formData();

  const title = form.get("title") || "Event Title";
  const desc = form.get("desc") || "Description";

  const now = new Date();
  const then = new Date();
  then.setHours(now.getHours() + 1);

  const beginDate = form.get("start") || now;
  const endDate = form.get("end") || then;

  const _beginDate = dateSchema.safeParse(beginDate);
  const _endDate = dateSchema.safeParse(endDate);
  const _title = stringSchema.safeParse(title);
  const _desc = stringSchema.safeParse(desc);

  if (
    _beginDate.success &&
    _endDate.success &&
    _title.success &&
    _desc.success
  ) {
    const ics = buildICS({
      title: _title.data,
      desc: _desc.data,
      beginDate: _beginDate.data,
      endDate: _endDate.data,
    });

    return new Response(ics, { headers: { "Content-Type": "text/calendar" } });
  }

  return new Response("Invalid form", { status: 400 });
};

serve({
  "/": (req) => Response.redirect(`${req.url}cal`, 302),
  "/cal": serveStatic("view.html", { baseUrl: import.meta.url }),
  "/view.js": serveStatic("view.js", { baseUrl: import.meta.url }),
  "/mvp": serveStatic("mvp.html", { baseUrl: import.meta.url }),
  "/mvp.css": serveStatic("mvp.css", { baseUrl: import.meta.url }),
  "/style.css": serveStatic("style.css", { baseUrl: import.meta.url }),
  "/event": handleEvent,
});
