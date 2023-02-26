"use strict";
//MODEL
class Model {
  constructor() {
    this.categories = [];
    this.numOfCategories = 5;
    this.score = 0;
    this.currentClue = {};
  }

  addCategories(categoriesArr) {
    this.categories = categoriesArr;
  }

  increaseScore(cluePoints) {
    this.score += cluePoints;
  }

  updateCurrClue(clickedClue) {
    console.log(clickedClue.target);
    const clickedCatID = clickedClue.target.getAttribute("data-cat-id");
    const clickedClueID = clickedClue.target.getAttribute("id");
    const clickedCluePoints = Number(
      clickedClue.target.getAttribute("data-points")
    );
    const currCat = this.categories.find((cat) => cat.id == clickedCatID);
    const currClue = currCat.clues.find((clue) => clue.id == clickedClueID);
    this.currentClue = currClue;
    this.currentClue.value = clickedCluePoints;
    console.log(this.currentClue);
  }

  checkAnswer(userAnswer) {
    const lowerCaseUserAnswer = userAnswer.toLowerCase();
    const lowerCaseAnswer = this.currentClue.answer.toLowerCase();
    return lowerCaseAnswer.includes(lowerCaseUserAnswer);
  }
}

//VIEW
class View {
  constructor() {
    this.$gameBoard = $("#game-board");
    this.$startResetBttn = $("#start-reset-bttn");
    this.$spinContainer = $("#spin-container");
    this.$clueWindow = $("#clue-window");
    this.$clueBox = $("#clue-box");
    this.$clueText = $("#clue-text");
    this.$answerInput = $("#player-answer");
    this.$answerButton = $("#submit-answer");
    this.$score = $("#score");
  }
  makeGameBoard(cats) {
    for (const cat of cats) {
      this._makeCatColumn(cat);
    }
  }

  _makeCatColumn(cat) {
    const clueArr = cat.clues;
    let clueIndex = 0;
    let value = 200;

    const $newCatColumm = $("<div>").addClass("category-container");
    const $newCatCell = $("<div>").addClass("category-cell").text(cat.title);
    $newCatColumm.append($newCatCell);

    _.times(5, () => {
      const workingClue = clueArr[clueIndex];
      const $newClueCell = $("<div>")
        .addClass("clue")
        .text("$" + value)
        .attr({
          id: workingClue.id,
          "data-points": value,
          "data-cat-id": workingClue.category_id,
        });
      $newCatColumm.append($newClueCell);
      clueIndex += 1;
      value += 200;
    });

    this.$gameBoard.append($newCatColumm);
  }

  toggleSpinner() {
    this.$spinContainer.toggle();
  }

  initClueWindow(clueText, clueID) {
    this.$answerInput.val("");
    this.$clueText.text("");
    const $selectedClue = $(`#${clueID}`);
    $selectedClue.text("");
    this.toggleClueWindow();
    setTimeout(() => {
      this.toggleClueText();
      this.$clueText.text(clueText);
    }, 1000);
  }
  closeClueWindow() {
    this.toggleClueText();
    this.toggleClueWindow();
  }
  toggleClueWindow() {
    this.$clueWindow.toggle();
    this.$clueWindow.toggleClass("grow");
  }

  toggleClueText() {
    this.$clueBox.toggle();
  }

  clearTable() {
    this.$gameBoard.empty();
  }

  updateScore(score) {
    this.$score.text("");
    this.$score.text(`${score}`);
  }
  getAnswerValue() {
    return $("#player-answer").val();
  }
  disableClue(clueID) {
    const $selectedClue = $(`#${clueID}`);
    $selectedClue.addClass("clicked");
  }
  toggleBoardNoClick() {
    this.$gameBoard.toggleClass("clicked");
  }
}

//CONTROLLER
class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.view.$startResetBttn.on("click", () => this._initGame());
    this.view.$gameBoard.on("click", () => this._handleClueClick(event));
    this.view.$answerButton.on("click", () => this._handleAnswerCheck());
  }
  async _initGame() {
    this.model.score = 0;
    this.view.updateScore(0);
    this.view.clearTable();
    this.view.toggleSpinner();
    await this._getData();
    this.view.toggleSpinner();
    this.view.makeGameBoard(this.model.categories);
  }
  async _getData() {
    let categories = [];
    const arrOfPromises = Array.from(
      { length: this.model.numOfCategories },
      (v, i) => i
    ).map(async () => {
      let category = await this._getRandomCat();
      while (this._checkClueCount(category)) {
        category = await this._getRandomCat();
      }
      return category;
    });
    const results = await Promise.all(arrOfPromises);
    categories = results;
    this.model.addCategories(categories);
  }

  async _getRandomCat() {
    const randomID = Math.floor(Math.random() * 28163);
    let response = await axios.get("https://jservice.io/api/category", {
      params: {
        id: randomID,
      },
    });
    return response.data;
  }

  _checkClueCount(recievedCat) {
    return recievedCat.clues_count < 5;
  }
  _handleClueClick(event) {
    if (event.target.classList.contains("clue")) {
      this.view.disableClue(event.target.id);
      this.view.toggleBoardNoClick();
      this.model.updateCurrClue(event);
      this.view.initClueWindow(
        this.model.currentClue.question,
        this.model.currentClue.id
      );
    }
  }
  _handleAnswerCheck() {
    this.model.checkAnswer(this.view.getAnswerValue())
      ? this._handleCorrectAnswer()
      : this._handleIncorrectAnswer();
    this.view.toggleBoardNoClick();
  }
  _handleCorrectAnswer() {
    this.model.increaseScore(this.model.currentClue.value);
    this.view.updateScore(this.model.score);
    setTimeout(() => this.view.closeClueWindow(), 3000);
  }
  _handleIncorrectAnswer() {
    setTimeout(() => this.view.closeClueWindow(), 3000);
  }
}

new Controller(new Model(), new View());
