"use strict";
//MODEL
class Model {
  constructor() {
    this.categories = [];
    this.player = "";
    this.numOfCategories = 6;
    this.score = 0;
    this.currentClue = {};
  }

  addCategories(categoriesArr) {
    this.categories = categoriesArr;
  }

  increaseScore(clueValue) {
    this.score += clueValue;
  }

  updateCurrClue(clue) {
    this.currentClue = clue;
  }

  checkClueCount(recievedCat) {
    return recievedCat.clues_count < 5;
  }
}
//VIEW
class View {
  constructor() {
    this.$gameBoard = $("#game-board");
    this.$startResetBttn = $("#start-reset-bttn");
    this.$spinContainer = $("#spin-container");
  }
  makeGameBoard(cats) {
    console.log(cats);
    for (const cat of cats) {
      this._makeCatColumn(cat);
    }
  }

  _makeCatColumn(cat) {
    const clueArr = cat.clues;
    let clueIndex = 0;
    let value = 200;

    const $newCatColumm = $("<div>").addClass("catagory-container");
    const $newCatCell = $("<div>").addClass("category-cell").text(cat.title);
    $newCatColumm.append($newCatCell);

    _.times(5, () => {
      const $newClueCell = $("<div>")
        .addClass("clue")
        .text(value)
        .attr("id", clueArr[clueIndex].id)
        .attr("data-points", value);
      $newCatColumm.append($newClueCell);
      clueIndex += 1;
      value += 200;
    });

    this.$gameBoard.append($newCatColumm);
  }

  toggleSpinner() {
    this.$spinContainer.toggle();
  }

  clearTable() {
    this.$gameBoard.empty();
  }
}
//CONTROL
class Control {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.view.$startResetBttn.on("click", () => this.initGame());
    this.view.$gameBoard.on("click", () => this.handleClick(event));
  }
  async initGame() {
    this.view.clearTable();
    this.view.toggleSpinner();
    await this.getData();
    this.view.toggleSpinner();
    this.view.makeGameBoard(this.model.categories);
  }
  async getData() {
    let categories = [];
    const arrOfPromises = Array.from(
      { length: this.model.numOfCategories },
      (v, i) => i
    ).map(async () => {
      let category = await this._getRandomCat();
      console.log(this.model.checkClueCount(category));
      while (category.clues.length < 5) {
        category = await this._getRandomCat();
      }
      return category;
    });
    const results = await Promise.all(arrOfPromises);
    console.log({ results });
    categories = results;
    console.log(categories);
    this.model.addCategories(categories);
  }

  async _getRandomCat() {
    const randomID = Math.floor(Math.random() * 28163);
    //while (false) {
    let response = await axios.get("https://jservice.io/api/category", {
      params: {
        id: randomID,
      },
    });
    console.log(response.data.clues);
    console.log(response.data.clues.length);
    //if (response.data.clues.length)
    return response.data;
    //}
  }
  handleClick(event) {
    console.log(event.target);
  }
}

new Control(new Model(), new View());
