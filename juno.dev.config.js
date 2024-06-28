import {defineDevConfig} from '@junobuild/config';

/** @type {import('@junobuild/config').JunoDevConfig} */
export default defineDevConfig(() => ({
    satellite: {
        collections: {
            db: [

                /**
                 * Categories
                 * name: string
                 * index: int
                 */
                {
                    collection: 'categories',
                    read: 'private',
                    write: 'private',
                    memory: 'stable',
                    mutablePermissions: false
                },

                /**
                 * Boards
                 * category: uuid4
                 * name: string
                 * json: serialized board data
                 */
                {
                    collection: 'boards',
                    read: 'private',
                    write: 'private',
                    memory: 'stable',
                    mutablePermissions: false
                },

            ],
            storage: [
                {
                    collection: 'images',
                    read: 'managed',
                    write: 'managed',
                    memory: 'stable',
                    mutablePermissions: true
                }
            ]
        }
    }
}));
