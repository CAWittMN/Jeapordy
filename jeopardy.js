"use strict";
// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

//let categories = [];

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */
//MODEL
class Model {
  constructor() {
    this.categories = [];
    this.player = "";
    this.numOfCategories = 6;
    this.score = 0;
    this.currentClue = {};
  }
  addCategories(catArray) {
    this.categories = catArray;
  }
  increaseScore(clueValue) {
    this.score += clueValue;
  }
  updateCurrClue(clue) {
    this.currentClue = clue;
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
    for (let cat of cats) {
      this._makeCatColumn(cat);
    }
  }

  _makeCatColumn(cat) {
    console.log(cat);
    const clueArr = cat.clues;
    let clueIndex = 0;

    const $newCatColumm = $("<div>").addClass("catagory-container");
    const $newCatCell = $("<div>").addClass("category-cell").text(cat.title);
    $newCatColumm.append($newCatCell);

    _.times(5, () => {
      const $newClueCell = $("<div>")
        .addClass("clue")
        .text(/*clueArr[clueIndex].value*/ "test")
        .attr("id", clueArr[clueIndex].id);
      $newCatColumm.append($newClueCell);
      clueIndex += 1;
    });

    this.$gameBoard.append($newCatColumm);
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
    this.handleInit();

    //console.log(this.randomcat);
  }
  handleInit() {
    this.model.addCategories(
      _.times(this.model.numOfCategories, () => this._getRandomCat())
    );
    this.view.makeGameBoard(this.model.categories);
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
}

$("#start-reset-bttn").on("click", () => new Control(new Model(), new View()));
