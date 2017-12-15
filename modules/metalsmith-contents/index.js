
import Contents from '../contents-node'

/**
 * A Metalsmith plugin that loads items from Contents, and inserts them into the
 * Metalsmith files dictionary, so that you can use them in templates.
 *
 * @param {Object} options
 * @return {Function}
 */

function plugin(options = {}) {
  const { team, collection, buildPath, transformItem } = options

  if (!team) throw new Error('You must pass a `team` option.')
  if (!collection) throw new Error('You must pass a `collection` option.')

  const contents = new Contents({ host: 'https://cdn.contents.io' })

  const run = async (files, metalsmith) => {
    const col = await contents.collections.findBySlugs(team, collection, { expand: 'fields' })
    const items = await contents.items.listByCollectionSlugs(team, collection)
    const body_field = col.fields.find(f => f.id == col.body_field.id)

    const createPath = buildPath || ((i, c) => `${c.slug}/${i.slug}.html`)
    const transItem = transformItem || ((i) => {
      const t = { ...i }
      delete t.collection
      return t
    })

    items.forEach((item) => {
      item = transItem(item)
      const path = createPath(item, col)
      const body = body_field ? item.properties[body_field.key] : ''
      files[path] = item
      files[path].contents = Buffer.from(body)
    })
  }

  return (files, metalsmith, done) => {
    run(files, metalsmith)
      .then(() => done())
      .catch(err => done(err))
  }
}

/**
 * Export.
 *
 * @type {Function}
 */

export default plugin
