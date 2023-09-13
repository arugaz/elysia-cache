import { Elysia, t } from 'elysia'
import { cache } from '../src/index'
import { describe, expect, it } from 'bun:test'

const req = (path = '') => new Request(`http://localhost:3001${path}`)

describe('LRU Cache', () => {
  const app = new Elysia()
    .use(cache())
    .get('/set', ({ query, cache }) => {
      const key = query.key
      const value = query.value

      cache.set(key, value)

      return {
        done: true
      }
    }, { query: t.Object({ key: t.String(), value: t.String() }) })

    .get('/has', ({ query, cache }) => {
      const key = query.key

      const value = cache.has(key)

      return {
        done: true,
        value: value
      }
    }, { query: t.Object({ key: t.String() }) })

    .get('/get', ({ query, cache }) => {
      const key = query.key

      const value = cache.get(key)

      return {
        done: true,
        value: value
      }
    }, { query: t.Object({ key: t.String() }) })
    
    .listen(3001)

  const key = 'test'
  const value = 'value123'

  it('create cache object', async () => {
    const res = await app.handle(req(`/set?${new URLSearchParams({ key, value }).toString()}`))
    const json = await res.json()

    expect(json.done).toBe(true)
  })

  it('check cache object', async () => {
    const res = await app.handle(req(`/has?${new URLSearchParams({ key }).toString()}`))
    const json = await res.json()

    expect(json.done).toBe(true)
    expect(json.value).toBe(true)
  })

  it('get cache object', async () => {
    const res = await app.handle(req(`/get?${new URLSearchParams({ key }).toString()}`))
    const json = await res.json()

    expect(json.done).toBe(true)
    expect(json.value).toBe(value)
  })

  it('fail get cache object diff key', async () => {
    const res = await app.handle(req(`/get?${new URLSearchParams({ key: 'none' }).toString()}`))
    const json = await res.json()

    expect(json.done).toBe(true)
    expect(json.value).toBe(null)
  })
})