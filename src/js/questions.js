import { getRequest, postRequest, deleteRequest, URL, getQuestions } from "./request";
import { renderServerQuestions, renderNoQuestions } from "./render";

if (window.location.pathname === "/questions.html") {
  // всё что происходит, когда мы запукаем страницу questions.html

  var $typeSelect = document.querySelector(".header__filter-type"); // нода фильтра типа;
  var $themeSelect = document.querySelector(".header__filter-theme"); // нода фильтра темы;
  $typeSelect.value = localStorage.getItem("type") || $typeSelect.value; // пулучаем value из локалстореджа, если его нет , то value = себе
  localStorage.setItem("type", $typeSelect.value); // cетим в локал сторедж, нужно для первого запуска приложения, пока нет ничего в localStorage.
  $themeSelect.value = localStorage.getItem("theme") || $themeSelect.value; // пулучаем value из локалстореджа, если его нет , то value = себе
  localStorage.setItem("theme", $themeSelect.value); // cетим в локал сторедж, нужно для первого запуска приложения, пока нет ничего в localStorage.
  listenTypeSelect(); // Добавляем слушателя селекту типов
  listenThemeSelect(); // Добавляем слушателя селекту тем
  getAndRender();  // сделали гет запрос и отрисовали

  var $modal = document.querySelector(".modal"); // нода модального окна
  var $modalDelete = document.querySelector('.modalDeleteConfirmation') //нода модалки на удаление вопроса
  var $closeX = document.querySelector(".close"); // нода кнопки крестика в модальном окне
  var $questionCreateButton = document.querySelector(".questionCreateButton");

  $questionCreateButton.addEventListener("click", showModal); // прослушка клика кнопки Создания вопроса
  $closeX.addEventListener("click", hideModal); // слушатель у крестика модального окна

  function showModal() {
    $modal.classList.remove("hide");
    var $formCreateButton = document.querySelector(".questionCreate"); // нода кнопки ОТПРАВИТЬ ВОПРОС
    /*   $formCancelButton.addEventListener("click", hideModal); // нода кнопки вернуться */
    $formCreateButton.addEventListener("click", createQueston);
    function createQueston(event) {
      // функция клика кнопки ОТПРАВИТЬ ВОПРОС
      event.preventDefault();

      var $text = document.querySelector(".question");
      var $theme = document.querySelector(".theme");
      var flag = formTextValidation($text) && answerValidation(); // в флаг запимсываем значение вернувшееся после выполнения валидации

      // создаем объект, который будет отправлять на сервер
      var objDate = new Date();
      var obj = {};
      obj["questionText"] = $text.value;
      obj["theme"] = $theme.value;
      obj["date"] = objDate.getTime();
      obj[
        "stringDate"
      ] = `${objDate.toLocaleDateString()} | ${objDate.toLocaleTimeString()}`;
      obj["type"] = checkType();
      obj["answer"] = checkAnswer();
      //если прошла валидаци - нас пустет в иф
      if (flag) {
        clearModal();
        hideModal();
        postRequest(URL, `?questions&type=${$typeSelect.value}`, obj).then(
          function () {
            getAndRender();
          }
        );
      }
    }
  }

  function checkAnswer() {
    // проверяем какая из кнопок чекнута
    var $trueRadio = document.querySelector(".TRUERadio");
    var $falseRadio = document.querySelector(".FALSERadio");

    if ($trueRadio.checked) {
      return true;
    } else return false;
  }

  function checkType() {
    // проверяем какой из типов выбран и записываем его в массив типов, если не выбрано ничего - выбираем JSON
    var JSON = document.querySelector(".question__type-JSON");
    var XML = document.querySelector(".question__type-XML");
    var YAML = document.querySelector(".question__type-YAML");
    var CSV = document.querySelector(".question__type-CSV");

    var result = [];

    if (JSON.checked) {
      result.push("JSON");
    }
    if (XML.checked) {
      result.push("XML");
    }
    if (YAML.checked) {
      result.push("YAML");
    }
    if (CSV.checked) {
      result.push("CSV");
    }
    if (!JSON.checked && !XML.checked && !YAML.checked && !CSV.checked) {
      result.push("JSON");
    }
    return result;
  }

  function answerValidation() {
    //валидация ответов, они должны быть выбраны!
    var $trueRadio = document.querySelector(".TRUERadio");
    var $falseRadio = document.querySelector(".FALSERadio");
    if ($trueRadio.checked || $falseRadio.checked) {
      return true;
    } else {
      errorText("Выберите вариант ответа!");
      return false;
    }
  }

  function formTextValidation($node) {
    // валидируем форму, не должен быть пустой
    var $text = document.querySelector(".question");
    if ($node.isEqualNode($text)) {
      if ($node.value === "") {
        errorText("Напишите текст вопроса");
        return false;
      }
    }
    return true;
  }

  function errorText(errorText) {
    // отрисовка текста ошибки в modalHead
    var $modalMessage = document.querySelector(".modalMessage");
    return ($modalMessage.textContent = errorText);
  }
  function clearModal() {
    // функция очистки инпутов и анчекинга чекбоксов радиобатанов
    var $text = document.querySelector(".question");
    var $trueRadio = document.querySelector(".TRUERadio");
    var $falseRadio = document.querySelector(".FALSERadio");
    var $JSON = document.querySelector(".question__type-JSON");
    var $XML = document.querySelector(".question__type-XML");
    var $YAML = document.querySelector(".question__type-YAML");
    var $CSV = document.querySelector(".question__type-CSV");
    $text.value = "";
    $trueRadio.checked = false;
    $falseRadio.checked = false;
    $JSON.checked = false;
    $XML.checked = false;
    $YAML.checked = false;
    $CSV.checked = false;
  }
  function hideModal() {
    // функция скрытия модального окна
    $modal.classList.add("hide");
  }
  window.onclick = function (event) {
    // модальное окно закрыть за пределеами модального окна
    if ($modal) {
      if (event.target === $modal) {
        $modal.classList.add("hide");
      }
    }
  };
  var objDelete = {} //инициализация объекта для удаления
  function listenDeleteButtons() {
    var $questionDeleteButtons = document.querySelectorAll(".questions__edit");
    /* добавить на все обработчики */
    for (var i = 0; i < $questionDeleteButtons.length; i++) {
      $questionDeleteButtons[i].addEventListener("click", function(event) { 
        //добавляем в объект ключи date and type  
        objDelete.date = Number(
          event.target.parentElement.parentElement.getAttribute("date")
        );
        objDelete.type = event.target.parentElement.parentElement
          .getAttribute("type")
          .split(",");
          //вызываем функцию показа модалки
      showDeleteModal()
    })
  }

  function showDeleteModal (){
    $modalDelete.classList.remove("hide");
    var $confirmButton = document.querySelector(".confirmButton"); // нода кнопки confirm
    var $cancelButton = document.querySelector(".cancelButton"); // нода кнопки cancel
    $confirmButton.addEventListener('click', deleteConfirm); // слушатель кнопки confirm
    $cancelButton.addEventListener('click', hideDeleteModal); // слушатель кнопки cancel
  }
//в deleteConfirm в deleteRequest передаем objDelete и перерендериваем страницу и прячем модалку
  function deleteConfirm(){ 
        deleteRequest(URL, `?questions&type=${$typeSelect.value}`, objDelete).then(
          function () {
            getAndRender();}
            );
        hideDeleteModal()
  }
 } 

 function hideDeleteModal (){
  $modalDelete.classList.add("hide");
 }
  function listenTypeSelect() {
    $typeSelect.addEventListener("change", typeSelectGetRequest);
  }
  function listenThemeSelect() {
    $themeSelect.addEventListener("change", themeSelectGetRequest);
  }
  function themeSelectGetRequest(){
    localStorage.setItem("theme", `${$themeSelect.value}`);
    getAndRender();
  }
  function typeSelectGetRequest() {
    // сетим новое значение, если у нас изменилось value select'a типа
    localStorage.setItem("type", `${$typeSelect.value}`);
    getAndRender();
  }
  function getAndRender(){
    getRequest(URL, `?questions&type=${$typeSelect.value}&theme=${$themeSelect.value}`) // запрос на получение данных из нужного файла
    .then(function (responce) {
      return JSON.parse(responce);
    })
    .then(function (data) {
      if (data.length === 0) {
        // если файл пустой - отрисует страницу без вопросов
        renderNoQuestions();
      } else {
        getQuestions(data).then(function(){
          listenDeleteButtons();
        })
      }
    })
    .catch(function (error) {
      console.log(error);
      // отлавливаем ошибки в промисе, если она будет - отрисует нет вопросов *____ в дальнейшем можно отрисовывать страницу ошибка сервера*
      renderNoQuestions();
    });
  }
}