import { Composer } from "grammy";

// SCAFFOLD — generated from the bot blueprint BEFORE the agent runs.
// Keep a LIVE registration (.command / .callbackQuery / …) so this feature is
// never an empty stub. Replace the reply body with real logic + copy; if you
// change the user-facing text, update tests/specs to match EXACTLY.
// Do NOT rewrite src/bot.ts — buildBot() already auto-loads this module.
// Menu: wire this into /start via registerMainMenuItem({ label: "Submit Design Specs", data: "design:specs" }) if the toolkit exposes it.

const composer = new Composer();

composer.callbackQuery("design:specs", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply("Provide text/visual requirements for logo");
});

export default composer;
