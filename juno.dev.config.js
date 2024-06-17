import {defineDevConfig} from '@junobuild/config';

/** @type {import('@junobuild/config').JunoDevConfig} */
export default defineDevConfig(() => ({
    satellite: {
        collections: {
            db: [
                {
                    collection: 'categories',
                    read: 'private',
                    write: 'private',
                    memory: 'stable',
                    mutablePermissions: false
                },
                {
                    collection: 'boards',
                    read: 'private',
                    write: 'private',
                    memory: 'stable',
                    mutablePermissions: false
                },
            ],
            storage: [
                // {
                //     collection: 'images',
                //     read: 'managed',
                //     write: 'managed',
                //     memory: 'stable',
                //     mutablePermissions: true
                // }
            ]
        }
    }
}));
