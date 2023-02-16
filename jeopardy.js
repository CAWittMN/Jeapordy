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

  checkClueValues() {
    for (let cat of this.categories) {
      const clues = cat.clues;
      for (clue of clues) {
      }
    }
  }
}
//VIEW
class View {
  constructor() {
    this.$gameBoard = $("#game-board");
    this.$startResetBttn = $("#start-reset-bttn");
    this.$spinContainer = $("#spin-container");
    this._clearTable();
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

    const $newCatColumm = $("<div>").addClass("catagory-container");
    const $newCatCell = $("<div>").addClass("category-cell").text(cat.title);
    $newCatColumm.append($newCatCell);

    _.times(5, () => {
      const $newClueCell = $("<div>")
        .addClass("clue")
        .text(clueArr[clueIndex].value)
        .attr("id", clueArr[clueIndex].id);
      $newCatColumm.append($newClueCell);
      clueIndex += 1;
    });

    this.$gameBoard.append($newCatColumm);
  }

  toggleSpinner() {
    this.$spinContainer.toggle();
  }

  _clearTable() {
    this.$gameBoard.empty();
  }
}
//CONTROL
class Control {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.initGame();
  }
  async initGame() {
    this.view.toggleSpinner();
    await this.getData();
    this.view.toggleSpinner();
    this.renderView();
  }
  async getData() {
    let categories = [];
    const arrOfPromises = Array.from(
      { length: this.model.numOfCategories },
      (v, i) => i
    ).map(async () => {
      const category = await this._getRandomCat();
      console.log(category);
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

  renderView() {
    this.view.makeGameBoard(this.model.categories);
  }
}

$("#start-reset-bttn").on("click", () => new Control(new Model(), new View()));
