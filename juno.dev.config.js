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

                /**
                 * Users
                 * name: string
                 * hash: hashed password
                 * groups: [uuid, ...]
                 */
                {
                    collection: 'users',
                    read: 'private',
                    write: 'private',
                    memory: 'stable',
                    mutablePermissions: false
                },

                /**
                 * Groups
                 * name: string
                 * organization: uuid
                 * users: [uuid, ...]
                 * boards: [uuid, ...]
                 */
                {
                    collection: 'groups',
                    read: 'private',
                    write: 'private',
                    memory: 'stable',
                    mutablePermissions: false
                },

                /**
                 * Organizations
                 * name: string
                 * index: int
                 */
                {
                    collection: 'organizations',
                    read: 'private',
                    write: 'private',
                    memory: 'stable',
                    mutablePermissions: false
                },
            ],
            storage: [
                {
                    collection: 'files',
                    read: 'managed',
                    write: 'managed',
                    memory: 'stable',
                    mutablePermissions: true
                }
            ]
        }
    }
}));
