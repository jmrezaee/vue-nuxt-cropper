import pkg from '../../../package.json'
const pre = pkg.name

export default {
  methods: {
    // generate css class
    c (className) {
      return className ? `${pre}${className}` : `${pre}`
    },
  },
}
