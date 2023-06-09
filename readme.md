# JavaScript Library Project

## Introduction

This is a JavaScript Library that I made as a project while doing the Odin Project curriculum. This project uses HTML, CSS and JavaScript to achieve this goal. There is a myriad of functionality including, adding books, sorting books by type or ascending/decending order. This project required alot of DOM manipulation and looping.

You can see the live server at this link --> [JavaScript Library by BSR](https://bradleysreynolds.github.io/javascript-library/)

You can see the source code for this project --> [Source Code](https://github.com/BradleySReynolds/javascript-library)

Lastly, feel free to check out my personal website --> [www.bradleysreynolds.com](https://bradleysreynolds.com/)

## HTML

HTML sectio was pretty basic. I imported Roboto from Google Fonts and linked the CDN from fontawesome. There were 3 mains sections: the header, the main section, which contains all the books, and the hidden modal which is revealed by the JavaScript code.

The header contains the main header, the add button which will contain the functionailty to add books to the main section, the sorting options which contains two select inputs which can decide how to sort the books -- by title, author, and pages -- or by asending or decending order, and lastly a stats section that tells the user how many books are in the library, how many are read and how many were not read.

Within the main container there is nothing initially, but using the add button funcitonality the user can add books to this main container.

Lastly the hidden modal contains all the inputs that allow the user to put in all the information about the book they want to put in their library.

## CSS

The styling was realatively basic. Some key concepts i used were flex box display, grid-box display, relative, fixed and absolute positioning. Also, I experienced using the `display: none` for the modal, which then would appear using DOM manipulation in JavaScript.

## JavaScript

### Selectors

I started with a variety of Selectors: the main selectors, which includes primary dom elements such as main, header and modal; button selectors, such as the new book button and exit button on the modal; input selectors, which I had to assign 8 different values and I used destructuring, I imagine there is an easier way to do this and if I come back to this project in the future then I may find a better way to do this; lastly, there are the statistic selectors which track the amound of books, amount of read books and amount of unread books.

```
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
```

Some default values include the inputs array which contains a list of the previously assigned inputs and the books array which will ultimately contain all of the books that the user puts into the library.

```
const inputs = [
    iptTitle,
    iptAuthor,
    iptPages,
    iptLang,
    iptPub,
    iptStatus];
```

### renderBooks() and setStats()

Next we the primary functions: setStats and renderBooks. For the setStats function there are three dom values to change: books, read books and unread books. For the total books I just set the dom element to `books.length`. For the read and unread books I used the filter method to make a new list only container the read/unread books, then took the length:

```
notReadList = books
            .filter((ele) => ele.status === "Have Not Read")
            .length
```

Next is the `renderBooks` function. It starts by setting the `innerHTML` to an empty string, so there are not any duplicate books. Next I create a titles array which will contain all the titles and adjust them using `books[i].title.replaceAll(" ", "")` because when assigning classes in JavaScript there won't be any spaces; I will later use this to match elements when removing elements and rendering books.

Next, I needed to create a variety of elements for the containers, the main `book-card` and buttons. After that I had to add values to some variables, classes to others -- such as `readBtn.className = read-btn read-btn-${i}` which gives a general class and a specific one -- and buttons that will dictate the actios of the container.

Finally there is the primary insertion of the HTML using `.inserAdjacentHTML`:

```
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
```

Within each `renderBooks()` function is two main functions: the removal function and the toggle read function. The former is simple by targeting the event I can easily remove the element from the DOM: `e.target.closest(".book-card").remove()`. Even though the element is removed from the DOM it still needs to be removed from the `books` array and `titles` array so that they don't render when the `renderBooks()` function is ran. I did this just using the `filter` method along with an `index` variable found using the `titles` array:

```
    // Remove Books from Books Array and Titles Array
    let index = titles.indexOf(e.target.closest(".book-card").classList[1]);
    books = books.filter((_, i) => i !== index);
    titles = titles.filter((ele) => ele !== titles[index]);
```

The latter function, the 'toggle read' function, is used to mark a book as read or not read. First, I again declared an index value that selects the index of the selected class using this code:

```
let index =
    titles.indexOf(e.target.closest(".book-card").classList[1]);
```

Then I used a terniary operator to determine whether a book was read or not, then adjusted the DOM and specific class accordingly:

```
//   Checks Whether Specific Book Card is Read or Not Read
books[index].status === "Have Read"
    ? (books[index].status = "Have Not Read")
    : (books[index].status = "Have Read");
```

Finally, the DOM and Stats are rendered.

### Event Listeners

Towards the end of the document there are a variety of event listeners that add additional and important functionality to the page. So I will go through them one by one.

the `submitBtn` function takes the user data from the modal and pushes a new object into the `books` array and then calls the `renderBooks()` and only does so when all inputs have some sort of data in them; this is done using the `every()` method which returns true or false if all values in an array meet a specific condition:

```
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
```

Then the function renders the new book, sets all the inputs back to empty, hides the modal and returns both main and header back to their initial styling.

The `newBookBtn` function opens the modal and sets the header and main to a blur setting to put more focus on the modal for the inputs.

the `clearBtn` function simply clears all the values in the modal while the modal is open.

The `exit` function closes the modal and returns the header and main to their initial styling.

The `sort` function allows the user to sort their books in three different ways: by author, by title or by number. First I created a `newOrder` array and a `copyBooks` array the former which is empty and the latter which is an array with the rest parameter of `books`. Next I use the `forEach` method to push all the selected type of value into the `newOrder` array:

```
 //   Populate the New Order Array
  books.forEach((ele) => newOrder.push(ele[e.target.value]));
```

Then I used another terniary function to check whether the values in the `newOrder` array are numbers or strings because the sorting for each is different. i used the `some()` method that says if there is ever a number in `newOrder` array then this sort function will be used:

```
newOrder.sort((a, b) => {
        return a - b;
      })
```

But, otherwise if its just a string the nwe can use the basic `sort()` method to sort items alphabetically.

Then I used the `forEach()` method again to loop throught the `copyBooks` array to do the sorting on the DOM. I do this by finding the element in `books` with the with:

```
    // Find the Index of Each Value in the Sorted,
    // New Order Array and Swap it to that Index in the Books Array
    books[newOrder.indexOf(ele[e.target.value])] = copyBooks[i];
```

Then with the same index value I set that element in `newOrder` to `filler` string so that there are not duplicate values. Lastly, I set `ascdec.value = asc` so that the initial sort is in ascending form and then I render the DOM.

The last function is the `ascdec` which stands for ascend or desend. Which simply takes whatever the current sort order is and uses the `.reverse` method on the array.
