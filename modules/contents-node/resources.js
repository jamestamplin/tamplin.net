
/**
 * All of the API resources and methods.
 *
 * @type {Object}
 */

export default {

  collections: {

    find: 'findById',

    findById: {
      method: 'GET',
      path: '/collections/:collectionId',
    },

    findBySlugs: {
      method: 'GET',
      path: '/teams/:teamSlug/collections/:collectionSlug',
    },

  },

  items: {

    list: 'listByCollectionId',

    listByCollectionId: {
      method: 'GET',
      path: '/collections/:collectionId/items',
    },

    listByCollectionSlugs: {
      method: 'GET',
      path: '/teams/:teamSlug/collections/:collectionSlug/items',
    },

  },

  webhooks: {

    find: 'findById',
    update: 'updateById',
    delete: 'deleteById',

    findById: {
      method: 'GET',
      path: '/webhooks/:webhookId',
    },

    listByCollectionId: {
      method: 'GET',
      path: '/collections/:collectionId/webhooks',
    },

    listByTeamId: {
      method: 'GET',
      path: '/teams/:teamId/webhooks',
    },

    listByEventId: {
      method: 'GET',
      path: '/events/:eventId/webhooks',
    },

    updateById: {
      method: 'PATCH',
      path: '/webhooks/:webhookId',
    },

    deleteById: {
      method: 'DELETE',
      path: '/webhooks/:webhookId',
    },

  },

}
