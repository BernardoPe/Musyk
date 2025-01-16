import { EmbedBuilder } from "discord.js"
import { GuildQueueStatisticsMetadata } from "discord-player"
import langs from "../../langs"

function playerAnalyticsEmbed(stats: {
    queuesCount: number;
    queryCacheEnabled: boolean;
    queues: GuildQueueStatisticsMetadata[];
}): EmbedBuilder[] {
	const globalInfo = new EmbedBuilder()
	globalInfo.setTitle(langs.en.embeds.analytics.global_title)
	globalInfo.setDescription(langs.en.embeds.analytics.global_description)
	globalInfo.addFields({
		name: langs.en.embeds.analytics.fields.players,
		value: stats.queuesCount.toString(),
		inline: true,
	})
	const queuesInfo = queuesInfoEmbed(stats.queues)
	return [globalInfo, ...queuesInfo]
}

function queuesInfoEmbed(queues: GuildQueueStatisticsMetadata[]) {
	const embeds = []
	let count = 1
	for (const queue of queues) {
		const queueInfo = new EmbedBuilder()
		queueInfo.setTitle(langs.en.embeds.analytics.title)
		queueInfo.setDescription(langs.en.embeds.analytics.description.replace("{guild}", `${count++}`))
		queueInfo.addFields(
			{
				name: langs.en.embeds.analytics.fields.event_loop_lag,
				value: queue.latency.eventLoop.toPrecision(2).toString(),
				inline: true,
			},
			{
				name: langs.en.embeds.analytics.fields.tracks_count,
				value: queue.tracksCount.toString(),
				inline: true,
			},
			{
				name: langs.en.embeds.analytics.fields.history_size,
				value: queue.historySize.toString(),
				inline: true,
			},
			{
				name: langs.en.embeds.analytics.fields.rss,
				value: (queue.memoryUsage.rss / (1024 * 1024)).toFixed(2).toString(),
				inline: true,
			},
			{
				name: langs.en.embeds.analytics.fields.heap_total,
				value: (queue.memoryUsage.heapTotal / (1024 * 1024)).toFixed(2).toString(),
				inline: true,
			},
			{
				name: langs.en.embeds.analytics.fields.heap_used,
				value: (queue.memoryUsage.heapUsed / (1024 * 1024)).toFixed(2).toString(),
				inline: true,
			}
		)
		embeds.push(queueInfo)
	}
	return embeds
}

export { playerAnalyticsEmbed }
