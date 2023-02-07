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
    this.players = [];
    this.numOfCat = 0;
    this.score = 0;
    this.currentClue = {};
    this.currPlayer = 0;
  }
  addCategories(catArray) {
    this.categories = catArray;
    console.log(this.categories);
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

    this.$catContainer = $("<div>").addClass("catagories");
    this.$catCell = $("<div>").addClass("category");
    this.$clueContainerRow = $("<div>").addClass("clue-row");
    this.$clueCell = $("<div>").addClass("clue").text("?");
    this._clearTable();
  }
  boundInit(handler) {
    this.$startResetBttn.on("click", (event) => {
      handler();
    });
  }
  makeGameBoard(handler) {}
  _clearTable() {
    this.$gameBoard.empty();
  }
}
//CONTROL
class Control {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.randomcat = this.getRandomCat();
    this.view.boundInit(this.handleSetCategories);
    //console.log(this.randomcat);
  }
  handleSetCategories = () => {
    const categories = this.getRandomCat();
    this.model.addCategories(categories);
    console.log(categories);
  };

  async getRandomCat() {
    const randomID = Math.floor(Math.random() * 28163);
    let response = await axios.get("https://jservice.io/api/category", {
      params: {
        id: randomID,
      },
    });
    return response.data;
  }
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

function getCategory(catId) {}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {}

/** On click of start / restart button, set up game. */
$("#start-reset-bttn").on("click", () => new Control(new Model(), new View()));

// TODO

/** On page load, add event handler for clicking clues */

// TODO
