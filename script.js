//////////////////////// MAIN SELECTORS ///////////////////////////////////

// Element Selectors
const main = document.getElementById("main");
const header = document.querySelector(".header");
const modal = document.querySelector(".modal");
const sort = document.querySelector(".sort-options");
const ascdec = document.querySelector(".asc-dec");

// Button Selectors
const newBookBtn = document.querySelector(".add-book");
const exit = document.querySelector(".exit");

// Input Selectors
const [
  iptTitle,
  iptAuthor,
  iptPages,
  iptLang,
  iptPub,
  iptStatus,
  submitBtn,
  clearBtn,
] = [
  document.querySelector(".title"),
  document.querySelector(".author"),
  document.querySelector(".pages"),
  document.querySelector(".lang"),
  document.querySelector(".pub"),
  document.querySelector(".status"),
  document.querySelector(".submit"),
  document.querySelector(".clear"),
];

// Statistic Selectors
const [total, read, notRead] = [
  document.querySelector(".total"),
  document.querySelector(".read"),
  document.querySelector(".not-read"),
];

const inputs = [iptTitle, iptAuthor, iptPages, iptLang, iptPub, iptStatus];

let books = [];

////////////////////////////// PRIMARY FUNCTIONS ////////////////////////////////

const setStats = () => {
  // Determines the Amount of Unread Books
  let notReadList = books.filter(
    (ele) => ele.status === "Have Not Read"
  ).length;

  // Determines the Amount of Read Books
  let readList = books.filter((ele) => ele.status === "Have Read").length;

  // Rendering the DOM
  total.textContent = `${books.length}`;
  read.textContent = `${readList}`;
  notRead.textContent = `${notReadList}`;
};

const renderBooks = () => {
  // Empties the Main Container
  main.innerHTML = "";

  //   Titles Array is Used for Matching DOM Elements to Object Values
  let titles = [];
  books.forEach((ele) => titles.push(ele.title.replaceAll(" ", "")));

  //   Renders Each Element in the books Array
  books.forEach((ele, i) => {
    // Creating Elements and Containers for Each Book and Its Functions
    let bookCard = document.createElement("div");
    let btnContainer = document.createElement("div");
    btnContainer.className = "book-btns";

    // Buttons are Declared Earlier to Prevent Referencing Error
    [removeBtn, readBtn] = [
      document.createElement("button"),
      document.createElement("button"),
    ];
    btnContainer.appendChild(removeBtn);
    btnContainer.appendChild(readBtn);

    removeBtn.className = "remove-btn";
    removeBtn.innerHTML = "Remove";
    readBtn.className = `read-btn read-btn-${i}`;
    readBtn.innerHTML = `Toggle Read`;

    // Create Book-Card Container with Class Name Matching Element in Title Array
    bookCard.classList.add("book-card");
    bookCard.classList.add(`${ele.title.replaceAll(" ", "")}`);

    // Inserts Book-Card into the DOM
    bookCard.insertAdjacentHTML(
      "beforeend",
      `<h2>${ele.title}</h2>
        <h3>By ${ele.author}</h3>
        <p>${ele.pages} Pages</p>
        <p>Written in ${ele.lang}</p>
        <p>Published on ${ele.pub}</p>
        <p>Book Status: ${ele.status}`
    );

    // Inserts Buttons to DOM
    bookCard.insertAdjacentElement("beforeend", btnContainer);

    // Remove Card Functionality Attached to Each Book Card
    removeBtn.addEventListener("click", (e) => {
      e.target.closest(".book-card").remove();

      //   Remove Books from Books Array and Titles Array
      let index = titles.indexOf(e.target.closest(".book-card").classList[1]);
      books = books.filter((_, i) => i !== index);
      titles = titles.filter((ele) => ele !== titles[index]);

      //   Set Stats
      setStats();
    });

    // Allows Books to be Dynamically Marked as Read/Not Read
    readBtn.addEventListener("click", (e) => {
      // Index Variable Selects Whichever Book Card is Targeted
      let index = titles.indexOf(e.target.closest(".book-card").classList[1]);

      //   Checks Whether Specific Book Card is Read or Not Read
      books[index].status === "Have Read"
        ? (books[index].status = "Have Not Read")
        : (books[index].status = "Have Read");

      // Render DOM and Stats
      setStats();
      renderBooks();
    });

    // Adds Book Card to Main Container
    main.appendChild(bookCard);
  });
};

/////////////////////////////// EVENT LISTENERS ///////////////////////////////////

// Takes User Information and Creats New Book Card
submitBtn.addEventListener("click", (e) => {
  // Prevent Submit Button from Reloading Page
  e.preventDefault();

  // Checks that no Input is Empty
  if (inputs.every((ele) => ele.value)) {
    books.push({
      title: iptTitle.value,
      author: iptAuthor.value,
      pages: Number(iptPages.value),
      lang: iptLang.value,
      pub: iptPub.value,
      status: iptStatus.value,
    });

    // Render DOM
    renderBooks();
    setStats();

    // Set Values Back to Empty
    inputs.forEach((ele) => (ele.value = ""));

    // Hide Modal
    modal.style.display = "none";

    // Set initial Styling
    main.style.filter = "blur(0)";
    header.style.filter = "blur(0)";
  }
});

// Clears Inputs on Modal
clearBtn.addEventListener("click", (e) => {
  e.preventDefault;
  inputs.forEach((ele) => (ele.value = ""));
});

// Open Modal for Inputs
newBookBtn.addEventListener("click", () => {
  // Show Modal
  modal.style.display = "initial";

  // Blur Styling
  main.style.filter = "blur(4px)";
  header.style.filter = "blur(4px)";
});

// Exit Modal Function
exit.addEventListener("click", () => {
  // Hide Modal
  modal.style.display = "none";

  // Set initial Styling
  main.style.filter = "blur(0)";
  header.style.filter = "blur(0)";

  //   Clear Inputs
  inputs.forEach((ele) => (ele.value = ""));
});

// Sort Functionality
sort.addEventListener("change", (e) => {
  // New Order Array Allows Function to Independently Sort Values
  let newOrder = [];

  //   Copy Books Array allows Function to Have Copy of Books and not Mutate Original Books Array
  let copyBooks = [...books];

  //   Populate the New Order Array
  books.forEach((ele) => newOrder.push(ele[e.target.value]));

  //   Since Array can Have Different Data Types,
  //   which affects the Sorting Funtion, if Statement Checks if Number
  newOrder.some((ele) => typeof ele === "number")
    ? newOrder.sort((a, b) => {
        return a - b;
      })
    : newOrder.sort();

  //   Switch Values Around in the Books Array
  copyBooks.forEach((ele, i) => {
    // Find the Index of Each Value in the Sorted,
    // New Order Array and Swap it to that Index in the Books Array
    books[newOrder.indexOf(ele[e.target.value])] = copyBooks[i];

    // Set Used Values to Filler so that the Render is not Effected by Duplicates
    newOrder[newOrder.indexOf(ele[e.target.value])] = "filler";
  });

  //   Anytime the Sort Function is Used, Set the order to Ascending
  ascdec.value = "asc";

  //   Render the DOM
  renderBooks();
});

// Sort Functions in Asending/Desending Order
ascdec.addEventListener("change", (e) => {
  books = books.reverse();
  renderBooks();
});
