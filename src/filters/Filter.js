class Filter {
  constructor (params = {}, filters = [], prefix = '') {
    this.params = Object.assign({}, params)
    this.filters = Array.from(filters)
    this.prefix = prefix
  }

  filterParams () {
    let res = {}
    let name
    this.filters.forEach((item) => {
      if (this.params.hasOwnProperty(item) && !!this.params[item]) {
        if (this.prefix && !['page', 'page_size'].includes(item)) {
          name = `${this.prefix}_${item}`
        } else {
          name = item
        }
        res[name] = this.params[item]
      }
    })

    return res
  }
}

export default Filter
