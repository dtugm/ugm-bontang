export default {
  getInitials(inputStr) {
    if (!inputStr) {
      return '-'
    }
    let words = inputStr.split(' ')
    if (words.length === 1) {
      return words[0].slice(0, 2).toUpperCase()
    } else {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase()
    }
  },
  getInitialsUrl(inputStr) {
    return `https://ui-avatars.com/api/?name=${inputStr}&color=FFFFFF&background=1A5999`
  },
  capitalize(str = '') {
    const str_arr = str.split(' ')
    let temp_str = ''

    for (let index = 0; index < str_arr.length; index++) {
      const el = str_arr[index]
      const n_str = el.charAt(0).toUpperCase() + el.slice(1)
      temp_str = temp_str + ' ' + n_str
    }

    return temp_str
  },
  titleCase(s) {
    return s
      .replace(/^[-_]*(.)/, (_, c) => c.toUpperCase()) // Initial char (after -/_)
      .replace(/[-_]+(.)/g, (_, c) => ' ' + c.toUpperCase()) // First char after each -/_
  },

  snakeCase(str = '') {
    const strArr = str.split(' ')
    const snakeArr = strArr.reduce((acc, val) => {
      return acc.concat(val.toLowerCase())
    }, [])
    return snakeArr.join('_')
  },

  capSnakeCase(str = '') {
    // Replace spaces with underscores
    const replaced = str.replace(/\s+/g, '_')

    // Split the string into an array of words
    const words = replaced.split('_')

    // Capitalize the first letter of each word
    const capitalizedWords = words.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1),
    )

    // Join the words back together with underscores
    const result = capitalizedWords.join('_')

    return result
  },
  lowSnakeCase(str = '') {
    // Replace spaces with underscores
    const replaced = str.replace(/\s+/g, '_')

    // Split the string into an array of words
    const result = replaced.toLowerCase()

    return result
  },
  kebabCase(str) {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2') // Convert camelCase to kebab-case
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/_/g, '-') // Replace underscores with hyphens
      .toLowerCase() // Convert the whole string to lowercase
  },

  removeQueryParams(path_text) {
    return path_text.split(/[?#]/)[0] // remove query params
  },

  plainText(str) {
    return str.replace(/<[^>]+>/g, '') // Remove HTML tags
  },

  excerpt(str, excerptLength = 100) {
    if (str.length > excerptLength) {
      return str.substring(0, excerptLength) + '...'
    }
    return str
  },

  isEmpty(str) {
    return (
      str === '' ||
      str.trim() === '' ||
      str.trim().toLowerCase() === 'null' ||
      str.trim().toLowerCase() === 'undefined'
    )
  },

  encodeToBase64Url(input) {
    let base64 = btoa(input)
    // Convert to Base64 URL format
    base64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    return base64
  },
}
