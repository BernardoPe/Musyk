import { EmbedBuilder } from "discord.js"
import { GuildQueueStatisticsMetadata } from "discord-player"

function playerAnalyticsEmbed(stats: any): EmbedBuilder[] {
	const globalInfo = new EmbedBuilder()
	globalInfo.setTitle("Player Analytics")
	globalInfo.setDescription("Player statistics")
	globalInfo.addFields(
		{ name: "Instances", value: stats.instances.toString(), inline: true },
		{ name: "Players", value: stats.queuesCount.toString(), inline: true }
	)
	const queuesInfo = queuesInfoEmbed(stats.queues)
	return [globalInfo, ...queuesInfo]
}

function queuesInfoEmbed(queues: GuildQueueStatisticsMetadata[]) {
	const embeds = []
	let count = 1
	for (const queue of queues) {
		const queueInfo = new EmbedBuilder()
		queueInfo.setTitle("Queue Analytics")
		queueInfo.setDescription(`Queue statistics for guild ${count++}`)
		queueInfo.addFields(
			{
				name: "Event Loop Lag (ms)",
				value: queue.latency.eventLoop.toPrecision(2).toString(),
				inline: true,
			},
			{
				name: "Tracks Count",
				value: queue.tracksCount.toString(),
				inline: true,
			},
			{
				name: "History Size",
				value: queue.historySize.toString(),
				inline: true,
			},
			{
				name: "Rss (MB)",
				value: (queue.memoryUsage.rss / (1024 * 1024)).toFixed(2).toString(),
				inline: true,
			},
			{
				name: "Heap Total (MB)",
				value: (queue.memoryUsage.heapTotal / (1024 * 1024)).toFixed(2).toString(),
				inline: true,
			},
			{
				name: "Heap Used (MB)",
				value: (queue.memoryUsage.heapUsed / (1024 * 1024)).toFixed(2).toString(),
				inline: true,
			}
		)
		embeds.push(queueInfo)
	}
	return embeds
}

export { playerAnalyticsEmbed }
