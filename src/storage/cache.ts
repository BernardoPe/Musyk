enum CacheType {
	Server,
	User,
}

const serverCache = new Map<string, any>()
const userCache = new Map<string, any>()

async function doCachedQuery<T>(id: string, cacheType: CacheType, ttl: number, request: () => Promise<T>): Promise<T> {
	const cache = cacheType === CacheType.Server ? serverCache : userCache
	if (cache.has(id)) {
		return cache.get(id)!
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
