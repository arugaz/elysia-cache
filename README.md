# elysia-cache
Plugin for [elysia](https://github.com/elysiajs/elysia) that add support for lru cache.

## Installation
```bash
bun add elysia-cache
```

## Example
```typescript
import { Elysia } from 'elysia'
import { cache } from 'elysia-cache'

const app = new Elysia()
    .use(cache())
    .get('/set', ({ query, cache }) => {
      const key = query.key
      const value = query.value

      cache.set(key, value)

      return new Response('done')
    })
    .get('/get', ({ query, cache }) => {
      const key = query.key

      const value = cache.get(key)

      return {
        value: value
      }
    })
    .get('/flush', ({ cache }) => cache.clear())
    .listen(8080)
```

## Config
Below are configurable properties for using LRU cache plugin.

### max
The maximum object that can be stored.

## Handler
Below are the value added to the handler.

### has
A function to check cache

Type:
```typescript
has(key: string) => boolean
```

### remove
A function to delete cache from given key

Type:
```typescript
remove(key: string) => void
```

### get
A function to retrieve value in the cache, return null if the value is not in the cache.

Type:
```typescript
get(key: string | number) => any
```

### set
A function to update cache value from given key

Type:
```typescript
set(key: string | number, value: any) => void
```

### clear
A function to flush all cache

Type:
```typescript
clear() => void
```