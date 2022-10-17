import axios from 'axios';
const URL = 'https://pixabay.com/api';
const API_KEY = '30576193-c13648781b6f89bf6b7ef27da';
export class UnsplashAPI {
  #page = 1;
  #searchQuery = '';
  #totalPages = 0;
  #perPage = 20;
  #params = {
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  };

  async getPhotos() {
    const url = `${URL}/?key=${API_KEY}&q=${this.#searchQuery}&page=${
      this.#page
    }&per_page=${this.#perPage}`;

    const { data } = await axios.get(url, this.#params);

    return data;
  }

  set searchQuery(newQuery) {
    this.#searchQuery = newQuery;
  }

  get searchQuery() {
    return this.#searchQuery;
  }

  resetPage() {
    this.#page = 1;
  }

  incrementPage() {
    this.#page += 1;
  }

  calculateTotalPages(totalHits) {
    this.#totalPages = Math.ceil(totalHits / this.#perPage);
  }

  get isShowLoadMore() {
    return this.#page < this.#totalPages;
  }
}
