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
  }
}

export default StorageManager
