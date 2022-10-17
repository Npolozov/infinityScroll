import { refs } from './js/refs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { UnsplashAPI } from './js/UnsplashAPI';
import { createMarkup } from './js/createMarkup';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const unsplash = new UnsplashAPI();

let lightbox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

const handleSubmit = async event => {
  event.preventDefault();

  const {
    elements: { searchQuery },
  } = event.currentTarget;

  const query = searchQuery.value;
  if (!query) {
    Notify.failure('Ввдедіть дані для пошуку!!!');
    return;
  }

  unsplash.searchQuery = query;
  clearPage();

  try {
    const { hits, totalHits } = await unsplash.getPhotos();
    if (hits.length === 0) {
      Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    const markup = createMarkup(hits);
    refs.galleryReg.insertAdjacentHTML('beforeend', markup);

    lightbox.refresh();

    unsplash.calculateTotalPages(totalHits);

    Notify.success(`Hooray! We found ${totalHits} images.`);

    if (unsplash.isShowLoadMore) {
      const turget = document.querySelector('.photo-card:last-child');
      io.observe(turget);
    }
  } catch (error) {
    Notify.failure(error.message);
    clearPage();
  }
};

const callback = function (entries, observer) {
  entries.forEach(async entry => {
    if (entry.isIntersecting) {
      unsplash.incrementPage();
      io.unobserve(entry.target);

      try {
        const { hits } = await unsplash.getPhotos();
        const markup = createMarkup(hits);
        refs.galleryReg.insertAdjacentHTML('beforeend', markup);
        lightbox.refresh();
        if (unsplash.isShowLoadMore) {
          const turget = document.querySelector('.photo-card:last-child');
          io.observe(turget);
        }
      } catch (error) {
        Notify.failure(error.message);
        clearPage();
      }
    }
  });
};

const options = {
  root: null,
  rootMargin: '100px',
  threshold: 1.0,
};

const io = new IntersectionObserver(callback, options);

function clearPage() {
  unsplash.resetPage();
  refs.galleryReg.innerHTML = '';
  refs.btnLoadMore.classList.add('is-hidden');
}

refs.form.addEventListener('submit', handleSubmit);
