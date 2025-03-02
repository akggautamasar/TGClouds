import Dexie, { type EntityTable } from 'dexie';
interface FileCache {
	id: number;
	data: Blob;
	cacheKey: string;
}

const fileCacheDb = new Dexie('FileCache') as Dexie & {
	fileCache: EntityTable<FileCache, 'id'>;
};

fileCacheDb.version(1).stores({
	fileCache: '++id, data, cacheKey'
});

export type { FileCache };
export { fileCacheDb };
