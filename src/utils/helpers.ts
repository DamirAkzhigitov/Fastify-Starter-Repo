const getUniqueID = () => {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }
  return s4() + s4() + '-' + s4()
}

const getUser = (cookie: string | null | undefined) => {
  console.log('cookie: ', cookie)

  return cookie ? cookie.split('=')[1] : null
}

export { getUser, getUniqueID }
