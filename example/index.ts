import { Elysia, t } from 'elysia'
import cache from '../src/index';

new Elysia()
.use(cache({
  max: 200
}))

.get('/set', ({ query, cache }) => {
  const key = query.key
  const value = query.value
  cache.set(key, value)
  
  return new Response('done')
}, { 
  query: t.Object({
  key: t.String(),
  value: t.Any()
})})

.get('/get', ({ query, cache }) => {
  const key = query.key
  const value = cache.get(key)

  return {
    value: value || null
  }
}, { 
  query: t.Object({
  key: t.String()
})})

.get('/', () => {
  return {
    hello: 'world'
  }
})

.listen(3001)