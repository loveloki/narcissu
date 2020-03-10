//存储相关操作

const StorageManager = {
  set: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value))
  },
  get: (key) => {
    return JSON.parse(localStorage.getItem(key))
  },
  remove: (key) => {
    localStorage.removeItem(key)
  },
  clear: () => {
    localStorage.clear()
  },
  all: () => {
    const list = {}
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      const value = StorageManager.get(key)

      list[key] = value
    }

    return list
  }
}

export default StorageManager
