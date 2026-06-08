import type { ServerInfo } from "@/storage/repositories/server.ts"
import type { UserInfo } from "@/storage/repositories/user.ts"

const CacheType = {
	Server: "Server",
	User: "User",
} as const
type CacheType = (typeof CacheType)[keyof typeof CacheType]

type CachedValue = ServerInfo | UserInfo

const serverCache = new Map<string, ServerInfo>()
const userCache = new Map<string, UserInfo>()

async function doCachedQuery<T extends CachedValue>(
	id: string,
	cacheType: CacheType,
	ttl: number,
	request: () => Promise<T>
): Promise<T> {
	const cache: Map<string, CachedValue> = cacheType === CacheType.Server ? serverCache : userCache
	const cached = cache.get(id)
	if (cached) {
		return cached as T
	}
	const data = await request()
	cache.set(id, data)
	if (ttl > 0) {
		setTimeout(() => cache.delete(id), ttl)
	}
	return data
}

function invalidateCache(id: string, cacheType: CacheType) {
	const cache = cacheType === CacheType.Server ? serverCache : userCache
	cache.delete(id)
}

export { doCachedQuery, invalidateCache, CacheType }
