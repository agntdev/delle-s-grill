import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import {
  registerMainMenuItem,
  inlineButton,
  inlineKeyboard,
  confirmKeyboard,
} from "../toolkit/index.js";

const SUPPORTED_FORMATS = ["SVG", "PNG", "JPG", "PDF", "AI", "EPS"];
const RESOLUTIONS = ["72 DPI (web)", "300 DPI (print)", "600 DPI (high-res print)"];

registerMainMenuItem({ label: "📦 Convert format", data: "assets:convert", order: 20 });

const composer = new Composer<Ctx>();

composer.callbackQuery("assets:convert", async (ctx) => {
  await ctx.answerCallbackQuery();
  ctx.session.step = "asset_awaiting_format";
  const kb = inlineKeyboard(
    SUPPORTED_FORMATS.map((f) => [inlineButton(f, `assets:fmt:${f.toLowerCase()}`)]),
  );
  await ctx.reply("Which format do you need?", { reply_markup: kb });
});

for (const fmt of SUPPORTED_FORMATS) {
  composer.callbackQuery(`assets:fmt:${fmt.toLowerCase()}`, async (ctx) => {
    await ctx.answerCallbackQuery();
    ctx.session.assetFormat = fmt;
    ctx.session.step = "asset_awaiting_resolution";
    const kb = inlineKeyboard(
      RESOLUTIONS.map((r) => [inlineButton(r, `assets:res:${r}`)]),
    );
    await ctx.editMessageText(`Format: ${fmt}\n\nNow pick a resolution:`, {
      reply_markup: kb,
    });
  });
}

for (const res of RESOLUTIONS) {
  composer.callbackQuery(`assets:res:${res}`, async (ctx) => {
    await ctx.answerCallbackQuery();
    ctx.session.assetResolution = res;
    ctx.session.step = "asset_confirming";
    const text =
      `Ready to convert:\n\n` +
      `Format: ${ctx.session.assetFormat}\n` +
      `Resolution: ${res}\n\n` +
      `Confirm to generate the file?`;
    await ctx.editMessageText(text, {
      reply_markup: confirmKeyboard("assets:confirm"),
    });
  });
}

composer.callbackQuery("assets:confirm:yes", async (ctx) => {
  await ctx.answerCallbackQuery();
  const fmt = ctx.session.assetFormat ?? "PNG";
  const res = ctx.session.assetResolution ?? "300 DPI (print)";
  ctx.session.step = undefined;
  ctx.session.assetFormat = undefined;
  ctx.session.assetResolution = undefined;
  const downloadUrl = `https://dellesgrill.com/assets/logo-v1.${fmt.toLowerCase()}`;
  const text =
    `Conversion complete.\n\n` +
    `Format: ${fmt}\n` +
    `Resolution: ${res}\n\n` +
    `Download your file below.`;
  await ctx.editMessageText(text, {
    reply_markup: inlineKeyboard([
      [inlineButton("⬇️ Download", downloadUrl)],
      [inlineButton("⬅️ Back to menu", "menu:main")],
    ]),
  });
});

composer.callbackQuery("assets:confirm:no", async (ctx) => {
  await ctx.answerCallbackQuery();
  ctx.session.step = undefined;
  ctx.session.assetFormat = undefined;
  ctx.session.assetResolution = undefined;
  await ctx.reply("Conversion cancelled. Tap 📦 Convert format to start over.");
});

export default composer;
