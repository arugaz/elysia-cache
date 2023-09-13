import { Elysia } from 'elysia'

interface CacheConfig {
  max?: number
}

export const cache = ({
  max = 100
}: CacheConfig = {
  max: 100
}) => {

  var size = 0,
  cache = Object.create(null),
  _cache = Object.create(null)

  const update = (key: string | number, value: any) => {
    cache[key] = value
    size ++
    if(size >= max) {
      size = 0
      _cache = cache
      cache = Object.create(null)
    }
  }
  
  return new Elysia({
    name: 'elysia-cache'
  }).derive(() => ({
    cache: {
      has (key: string | number) {
        return cache[key] !== undefined || _cache[key] !== undefined
      },
      remove (key: string | number) {
        if(cache[key] !== undefined) cache[key] = undefined
        if(_cache[key] !== undefined) _cache[key] = undefined
      },
      get (key: string | number) {
        var v = cache[key]
        if(v !== undefined) return v
        if((v = _cache[key]) !== undefined) {
          update(key, v)
          return v
        }
        return null
      },
      set (key: string | number, value: any) {
        if(cache[key] !== undefined) cache[key] = value
        else update(key, value)
      },
      clear () {
        cache = Object.create(null)
        _cache = Object.create(null)
      }
    }
    }))
}

export default cache