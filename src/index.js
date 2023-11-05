
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { SearchService } from './SearchService';


const elements = {
  form: document.querySelector('.search-form'),
  cardList: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('.load-more-hidden'),
};


elements.btnLoadMore.style.display = 'none';


let quantityImg = 0;
let page = 1;


elements.form.addEventListener('submit', handlSubmit);
elements.cardList.addEventListener('click', markupCardList);
elements.btnLoadMore.addEventListener('click', loadMoreBotton);


async function handlSubmit(evt) {
  
  evt.preventDefault();
  page = 1;
  elements.cardList.innerHTML = '';
  const searchQuery = evt.target.elements.searchQuery.value.trim();
  localStorage.setItem('input-value', searchQuery);
  if (!searchQuery) {
    return Notify.failure('Enter your search details.');
  }
elements.btnLoadMore.style.display = 'block';
  try {
    const data = await SearchService(page, searchQuery);
    quantityImg += data.hits.length;
    elements.cardList.insertAdjacentHTML(
      'beforeend',
      cardListMarkup(data.hits)
    );
    if (data.totalHits !== 0) {
      Notify.info(`"Hooray! We found ${data.totalHits} images."`);
    }
    if (data.totalHits > quantityImg) {
      elements.btnLoadMore.style.display = 'block';
    }
  } catch (error) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

}


async function markupCardList(evt) {
  evt.preventDefault();
  gallery.next();
}


async function loadMoreBotton() {
  try {
    const inputValue = localStorage.getItem('input-value');
    page += 1;
    const data = await SearchService(page, inputValue);
    quantityImg += data.hits.length;
    const cardsCreate = cardListMarkup(data.hits);
    elements.cardList.insertAdjacentHTML('beforeend', cardsCreate);

    if (data.hits.length < 40 || data.totalHits <= quantityImg) {
      elements.btnLoadMore.style.display = 'none';
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
    
  } catch (error) {
    Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    elements.btnLoadMore.style.display = 'none'; 
  }
}


function cardListMarkup(arr) {
  return arr
    .map(
      ({
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class ="photo-card">
       <img class="card-img" src="${webformatURL}" alt="${tags}" loading="lazy" />
       <div class="info">
       <p class="likes">
         <b class="span">
         </b>
         Likes: ${likes}
       </p>
       <p class="views">
         <b class="span">
          Views:
          </b>
         ${views}
       </p>
       <p class="comments">
         <b class="span">
         Comments:
         </b>
         ${comments}
       </p>
       <p class="downloads">
         <b class="span">
          Downloads:
          </b>
         ${downloads}
       </p>
     </div>
    </div>`

      }
    )
    .join('');
}
