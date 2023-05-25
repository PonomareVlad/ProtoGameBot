import {Bot, session} from "grammy";
import {freeStorage} from "@grammyjs/storage-free";
import {conversations, createConversation,} from "@grammyjs/conversations";

export const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);

bot.use(session({
    initial: () => ({count: 0}),
    storage: freeStorage(bot.token),
}));

bot.use(conversations());

bot.use(createConversation(test));

bot.command("cancel", async ctx => {
    await ctx.conversation.exit();
    await ctx.reply("Leaving.");
});

bot.command("test", async ctx => ctx.conversation.enter("test"));

bot.on("message:text", async ctx => ctx.reply(ctx.msg.text));

async function test(conversation, ctx) {
    await ctx.reply("How many favorite movies do you have?");
    const count = await conversation.form.number();
    const movies = [];
    for (let i = 0; i < count; i++) {
        await ctx.reply(`Tell me number ${i + 1}!`);
        const titleCtx = await conversation.waitFor(":text");
        movies.push(titleCtx.msg.text);
    }
    await ctx.reply("Here is a better ranking!");
    movies.sort();
    await ctx.reply(movies.map((m, i) => `${i + 1}. ${m}`).join("\n"));
}

export default bot;
