import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import {
  registerMainMenuItem,
  inlineButton,
  inlineKeyboard,
  confirmKeyboard,
} from "../toolkit/index.js";

registerMainMenuItem({ label: "🎨 Design specs", data: "design:specs", order: 10 });

const composer = new Composer<Ctx>();

composer.callbackQuery("design:specs", async (ctx) => {
  await ctx.answerCallbackQuery();
  ctx.session.step = "design_awaiting_typo";
  await ctx.reply("What typography style do you prefer? (e.g. bold serif, clean sans-serif, script)", {
    reply_markup: { force_reply: true, selective: false },
  });
});

composer.on("message:text", async (ctx, next) => {
  const step = ctx.session.step;
  if (step === "design_awaiting_typo") {
    ctx.session.designTypo = ctx.message.text.trim();
    ctx.session.step = "design_awaiting_icon";
    await ctx.reply("What icon style works for you? (e.g. minimalist, detailed illustration, abstract)", {
      reply_markup: { force_reply: true, selective: false },
    });
    return;
  }
  if (step === "design_awaiting_icon") {
    ctx.session.designIcon = ctx.message.text.trim();
    ctx.session.step = "design_awaiting_palette";
    await ctx.reply("What color palette should we use? (e.g. warm earth tones, classic red and black, custom hex codes)", {
      reply_markup: { force_reply: true, selective: false },
    });
    return;
  }
  if (step === "design_awaiting_palette") {
    ctx.session.designPalette = ctx.message.text.trim();
    ctx.session.step = "design_confirming";
    const text =
      `Design specs collected:\n\n` +
      `Typography: ${ctx.session.designTypo}\n` +
      `Icon style: ${ctx.session.designIcon}\n` +
      `Color palette: ${ctx.session.designPalette}\n\n` +
      `Confirm to generate initial mockup?`;
    await ctx.reply(text, {
      reply_markup: confirmKeyboard("design:confirm"),
    });
    return;
  }
  return next();
});

composer.callbackQuery("design:confirm:yes", async (ctx) => {
  await ctx.answerCallbackQuery();
  ctx.session.step = undefined;
  await ctx.editMessageText("Design specs saved. Initial mockup is being generated — you'll be notified when it's ready.", {
    reply_markup: inlineKeyboard([[inlineButton("⬅️ Back to menu", "menu:main")]]),
  });
});

composer.callbackQuery("design:confirm:no", async (ctx) => {
  await ctx.answerCallbackQuery();
  ctx.session.step = undefined;
  ctx.session.designTypo = undefined;
  ctx.session.designIcon = undefined;
  ctx.session.designPalette = undefined;
  await ctx.reply("Design specs cleared. Tap 🎨 Design specs to start over.");
});

export default composer;
