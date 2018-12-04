(() => {

  class Pagination {
    constructor(itemsPerPage, page) {
      this.itemsPerPage = itemsPerPage;
      this.page = page;
    }

    get startIndex() {
      return this.itemsPerPage * this.page;
    }

    get endIndex() {
      return this.itemsPerPage * (this.page + 1);
    }
  }

  module.exports = Pagination;

})();