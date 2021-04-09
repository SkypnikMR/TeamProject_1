

export function renderServerDeveloperData(serverData) {
  var $developers = document.querySelector(".userCard__items");
  for (var i = 0; i < serverData.length; i++) {
    renderandFillDevItem($developers, serverData, i); // вызываем функцию отрисовки итема, столько раз, скольк нам приехало объектов
  }
  return true;
}
function renderandFillDevItem($node, serverData, i) {
  // фукнция отрисовки одного итема на странице index.html
  $node.innerHTML += `<div class="userCard__item">
        <div class="userCard__edit">
          <img src="img/edit.png" alt="edit">
        </div>
        <div class="userCard__photoDev">
          <img src="img/1.jpg" alt="photoDev">
        </div>
        <h3 class="userCard__name">${serverData[i].name}</h3>
        <div class="userCard__line"></div>
        <h4 class="userCard__title">ОБО МНЕ</h4>
        <div class="userCard__about">
          <div class="userCard__info">
            <p>Возраст:</p>
            <p>${serverData[i].age}</p>
          </div>
          <div class="userCard__info">
            <p>Любимый цвет::</p>
            <p>${serverData[i].lovely_color}</p>
          </div>
          <div class="userCard__info">
            <p>Опыт в IT:</p>
            <p>${serverData[i].exp}</p>
          </div>
        </div>
        <h4 class="userCard__title">ХОББИ</h4>
        <div class="userCard__about">
          <div class="userCard__info">
            <p>${serverData[i].hobby} </p>
          </div>
        </div>
        <!-- Modal form  -->
  <div class="form-user">
      <form action="" class="form-user__form">
          <h4 class="userCard__title">ОБО МНЕ</h4>
          <p>Возраст:</p>
          <input type="text" class="form-user__ageform">
          <p>Любимый цвет:</p>
          <input type="text" class="form-user__likecolor">
          <p>Опыт в IT:</p>
          <input type="text" class="form-user__it">
          <h4 class="userCard__title">ХОББИ</h4>
          <input type="text" class="form-user__hobie">
          <button class="form-user__btn">Изменить</button>
      </form>
  </div>
  <!-- END Modal form  -->
      </div>`;
      if(i === serverData.length - 1){
       var $userCard = $node.querySelectorAll('.userCard__item');
        $userCard[5].classList.add('gone');
      }
}

export function renderServerQuestions(serverData) {
  // функция, отрисовки вопросов, которые мы получаем с сервера
  var $questionItems = document.querySelector(".questions__items");
  if (!Array.isArray(serverData) || serverData[0] === '' || serverData[0].date === null) {
    renderNoQuestions();
  } else {
    for (var i = 0; i < serverData.length; i++) {
      if(serverData[i] === '' || serverData[i].theme === undefined){
        continue;
      }
      createAndFillQuestionItem($questionItems, serverData, i);
      
    }
  }
}
function createAndFillQuestionItem($node, serverData, i) {
  if (i === 0) {
    $node.innerHTML = `<div class="questions__item" date = ${serverData[i].date} type = ${serverData[i].type}>
    <div class="questions__edit">
    <img src="img/X.png" alt="edit">
  </div>
    <div class = "question__text">
      <div class="questions__answer">
        <div class="questions__info">
          <p><b>Текст вопроса:</b> </p><p class="questions__result" title = "${serverData[i].questionText}">${serverData[i].questionText}</p>
        </div>
        </div>
      </div>
      <div class = "questions__themeDateAns">
        <div class="questions__info">
          <p><b>Тема вопроса:</b> </p><p class="questions__result">${serverData[i].theme}</p>
        </div>  
        <div class="questions__info">
          <p><b>Ответ на вопрос:</b> </p><p class="questions__result">${serverData[i].answer}</p>
        </div>
        <div class="questions__info">
          <p><b>Дата вопроса:</b> </p><p class="questions__result">${serverData[i].stringDate}</p>
      </div>
    </div>
  </div>`;
  } else {
    $node.innerHTML += `<div class="questions__item" date = ${serverData[i].date} type = ${serverData[i].type}>
    <div class="questions__edit">
    <img src="img/X.png" alt="edit">
  </div>
    <div class = "question__text">
      <div class="questions__answer">
        <div class="questions__info">
          <p><b>Текст вопроса:</b> </p><p class="questions__result" title = "${serverData[i].questionText}">${serverData[i].questionText}</p>
        </div>
        </div>
      </div>
      <div class = "questions__themeDateAns">
        <div class="questions__info">
          <p><b>Тема вопроса:</b> </p><p class="questions__result">${serverData[i].theme}</p>
        </div>  
        <div class="questions__info">
          <p><b>Ответ на вопрос:</b> </p><p class="questions__result">${serverData[i].answer}</p>
        </div>
        <div class="questions__info">
          <p><b>Дата вопроса:</b> </p><p class="questions__result">${serverData[i].stringDate}</p>
      </div>
    </div>
  </div>`;
  }
}

export function renderNoQuestions() {
  var $qHTMLQuestionItems = document.querySelector(".questions__items");
  $qHTMLQuestionItems.innerHTML = `<img src="./img/questions.png" alt="" srcset="">`;
}