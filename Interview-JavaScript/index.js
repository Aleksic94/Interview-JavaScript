document.addEventListener("DOMContentLoaded", app);

const data = {
  alldata: [],
};

const currentFilter = {
  startIndex: 0,
  pageSize: 0,
  page: 0,
  total: 0,
};

const pageElements = {
  cardsContainer: null,
  loadMoreButton: null,
  switchTheme: null,
  body: null,
};

function app() {
  fetch("/data.json").then((res) => {
    return res.json().then((value) => {
      if (value && Array.isArray(value)) {
        data.alldata = value.map((r, index) => ({ ...r, id: index }));

        pageElements.cardsContainer =
          document.querySelector("#cards-container");

        pageElements.loadMoreButton = document.querySelector("#loadMoreButton");

        pageElements.switchTheme = document.querySelectorAll("#togg-input");

        pageElements.body = document.querySelector("body");

        pageElements.loadMoreButton.removeEventListener(
          "click",
          loadMoreButtonClickedHandler
        );
        pageElements.loadMoreButton.addEventListener(
          "click",
          loadMoreButtonClickedHandler
        );

        for (let checkbox of pageElements.switchTheme) {
          checkbox.removeEventListener("change", toggleThemeHandler);
          checkbox.addEventListener("change", toggleThemeHandler);
        }

        currentFilter.pageSize = 4;
        currentFilter.page = 0;
        currentFilter.startIndex = 0;
        currentFilter.total = data.alldata.length;

        drawCards();
      }
    });
  });
}

const drawCards = (filteredItems) => {
  let cards = filteredItems ? filteredItems : data.alldata;
  let endIndex = currentFilter.pageSize * (currentFilter.page + 1);
  let cardsToAdd = cards.slice(currentFilter.startIndex, endIndex);
  currentFilter.startIndex = endIndex;

  if (endIndex >= cards.length) {
    pageElements.loadMoreButton.style.display = "none";
  } else {
    pageElements.loadMoreButton.style.display = "block";
  }

  cardsToAdd.forEach((el) => {
    addElement(el);
  });
};

const toggleThemeHandler = () => {
  pageElements.body.classList.toggle("dark");
};

const loadMoreButtonClickedHandler = () => {
  currentFilter.page = currentFilter.page + 1;

  drawCards();
};

function addElement(element) {
  const markup = `
  		<div id="${element.id}" class="card">
		  <div class="profileInfo">
		    <img class="profileImg" src="${element.profile_image}"/>
			<div>
				<span class="text-bold text-lg">${element.name}</span>
				<div class="text-sm">${element.date.split(" ")[0]}</div>
			</div>
		  </div>
		  <div class="card-content">
		  	<img class="contentImg" 
				src="${element.image}"/>
			 <div class="caption-container">
			 	<p class="text-ellipsis">${element.caption}</p>
			 </div>
		  </div>
		  <div class="card-footer">
			<span>${element.likes} Likes</span>
		  </div>
		</div>`;

  document
    .querySelector("#cards-container")
    .appendChild(createElementFromHTML(markup));
}

function createElementFromHTML(htmlString) {
  var div = document.createElement("div");
  div.innerHTML = htmlString.trim();
  return div.firstChild;
}
