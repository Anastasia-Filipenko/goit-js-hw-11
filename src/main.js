const API_KEY = '32445891-4e5aca6c6794ec22921e6fc5b';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.form');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');

function showLoader() {
  loader.style.display = 'inline-block';
}
function hideLoader() {
  loader.style.display = 'none';
}
const galleryLightbox = new SimpleLightbox('.gallery_list a', {
  captions: true,
  captionType: 'attr',
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});

function render(images) {
  const markup = images.hits.reduce(
    (
      html,
      { webformatURL, largeImageURL, tags, likes, views, comments, downloads }
    ) =>
      html +
      `
         <li class='gallery_list'>
          <a href="${largeImageURL}"><img class='gallery_img'src="${webformatURL}" alt="${tags}" /></a>
          <p class='gallery_info'>Likes <span>${likes}</span></p>
          <p class='gallery_info'>Views <span>${views}</span></p>
          <p class='gallery_info'>Comments <span>${comments}</span></p>
          <p class='gallery_info'>Downloads <span>${downloads}</span></p>
        </li>`,
    ''
  );

  gallery.innerHTML = markup;

  galleryLightbox.refresh();
}

form.addEventListener('submit', e => {
  e.preventDefault();

  const inputValue = form.querySelector('.form_input').value;

  gallery.innerHTML = '';
  showLoader();
  fetch(
    'https://pixabay.com/api/?key=' +
      API_KEY +
      '&q=' +
      inputValue +
      '&image_type=photo&orientation=horizontal&safesearch=true&per_page=50'
  )
    .then(response => {
      if (!response.ok) {
        throw new Error('Error');
      }
      return response.json();
    })
    .then(images => {
      hideLoader();
      if (!images.total) {
        iziToast.error({
          message:
            'Sorry, there are no images matching your search query. Please try again!',
          position: 'topRight',
        });
      }
      render(images);
    })
    .catch(error => {
      hideLoader();
      console.log(error);
    });
});
