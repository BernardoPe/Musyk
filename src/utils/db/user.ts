import { PrismaClient } from "@prisma/client"
import { withAccelerate } from "@prisma/extension-accelerate"
import { User } from "discord.js"
import { SearchQueryType } from "discord-player"

const prisma = new PrismaClient().$extends(withAccelerate())

async function getOrCreateUserInfo(user: User) {
	const res = await prisma.user.findUnique({
		where: {
			userId: user.id,
		},
		select: {
			userId: true,
			playerConfig: true,
		},
	})

	if (res) return res

	const res2 = await prisma.user.create({
		data: {
			userId: user.id,
		},
	})

	return {
		userId: res2.userId,
		playerConfig: null,
	}
}

async function updateUserSearchEngine(user: User, searchEngine: SearchQueryType) {
	await prisma.server.update({
		where: {
			serverId: user.id,
		},
		data: {
			playerConfig: {
				update: {
					searchEngine,
				},
			},
		},
	})
}

async function updateUserVolume(user: User, volume: number) {
	await prisma.server.update({
		where: {
			serverId: user.id,
		},
		data: {
			playerConfig: {
				update: {
					volume,
				},
			},
		},
	})
}

async function updateUserLeaveOnEnd(user: User, leaveOnEnd: boolean) {
	await prisma.server.update({
		where: {
			serverId: user.id,
		},
		data: {
			playerConfig: {
				update: {
					leaveOnEnd,
				},
			},
		},
	})
}

async function updateUserLeaveOnEndCooldown(user: User, leaveOnEndCooldown: number) {
	await prisma.server.update({
		where: {
			serverId: user.id,
		},
		data: {
			playerConfig: {
				update: {
					leaveOnEndCooldown,
				},
			},
		},
	})
}

export { prisma, getOrCreateUserInfo, updateUserSearchEngine, updateUserVolume }
