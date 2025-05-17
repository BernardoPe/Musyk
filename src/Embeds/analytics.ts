import { EmbedBuilder } from "discord.js"
import { GuildQueueStatisticsMetadata } from "discord-player"
import { Language } from "../Langs"

function playerAnalyticsEmbed(
	stats: {
        queuesCount: number;
        queryCacheEnabled: boolean;
        queues: GuildQueueStatisticsMetadata[];
    },
	lang: Language
): EmbedBuilder[] {
	const globalInfo = new EmbedBuilder()
	globalInfo.setTitle(lang.embeds.analytics.global_title)
	globalInfo.setDescription(lang.embeds.analytics.global_description)
	globalInfo.addFields({
		name: lang.embeds.analytics.fields.players,
		value: stats.queuesCount.toString(),
		inline: true,
	})
	const queuesInfo = queuesInfoEmbed(stats.queues, lang)
	return [globalInfo, ...queuesInfo]
}

function queuesInfoEmbed(queues: GuildQueueStatisticsMetadata[], lang: Language) {
	const embeds = []
	let count = 1
	for (const queue of queues) {
		const queueInfo = new EmbedBuilder()
		queueInfo.setTitle(lang.embeds.analytics.title)
		queueInfo.setDescription(lang.embeds.analytics.description.replace("{guild}", `${count++}`))
		queueInfo.addFields(
			{
				name: lang.embeds.analytics.fields.event_loop_lag,
				value: queue.latency.eventLoop.toPrecision(2).toString(),
				inline: true,
			},
			{
				name: lang.embeds.analytics.fields.tracks_count,
				value: queue.tracksCount.toString(),
				inline: true,
			},
			{
				name: lang.embeds.analytics.fields.history_size,
				value: queue.historySize.toString(),
				inline: true,
			},
			{
				name: lang.embeds.analytics.fields.rss,
				value: (queue.memoryUsage.rss / (1024 * 1024)).toFixed(2).toString(),
				inline: true,
			},
			{
				name: lang.embeds.analytics.fields.heap_total,
				value: (queue.memoryUsage.heapTotal / (1024 * 1024)).toFixed(2).toString(),
				inline: true,
			},
			{
				name: lang.embeds.analytics.fields.heap_used,
				value: (queue.memoryUsage.heapUsed / (1024 * 1024)).toFixed(2).toString(),
				inline: true,
			}
		)
		embeds.push(queueInfo)
	}
	return embeds
}

export { playerAnalyticsEmbed }
