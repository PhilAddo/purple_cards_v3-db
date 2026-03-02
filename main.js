//flip card function. "side" indicates the side we want to flip to
// var side = "back";
// const flipBtn = document.getElementById("flipBtn");
// flipBtn.addEventListener("click", flip);
// function flip() {
//   const flipCardInner = document.getElementById("flip-card-inner");
//   if (side == "back") {
//     flipCardInner.style.transform = "rotateY(180deg)";
//     side = "front";
//     myVideo.currentTime = 0;
//   } else if (side == "front") {
//     flipCardInner.style.transform = "rotateY(0deg)";
//     side = "back";
//   }
// }
// const supabase = window.supabase.createClient(
//   "https://dbhorszzqrczhjfamjse.supabase.co",
//   "sb_publishable_TtSyiux-4M6IgIj27VZC8Q_N_Wz1Xwl"
// );

const supabaseUrl = "https://dbhorszzqrczhjfamjse.supabase.co";
const supabaseKey = "sb_publishable_TtSyiux-4M6IgIj27VZC8Q_N_Wz1Xwl";
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);


let card = document.getElementById("card");
let blurElement = document.getElementById("blur-element");
let cardTitleBg = document.getElementById("card-title-bg");
let cardMessageBg = document.getElementById("card-message-bg");
let cardTitle = document.getElementById("card-title");
let cardMessage = document.getElementById("card-message");
let popOutEmoji = document.getElementById("pop-out-emoji");
let cursor = document.getElementById("cursor");
let switchBtn = document.getElementById("switch-btn");
let bgSound = document.getElementById("bg-sound");

let shadedBg = document.getElementById("shaded-bg");
let textBoxContainer = document.getElementById("text-box-container");
let textInput = document.getElementById("text-input");

//stores the different design stages
let designStages = [
  "titleText",
  "titleBg",
  "messageText",
  "bgMusic",
  "review",
  "end",
];
//stores the current stage
var currentStage = "titleText";
//stores the state of the background sound element
let soundState = "stopped";

goToView = "message";
let switchTimer;
function switchView() {
  clearTimeout(switchTimer);
  clearInterval(printTimer);

  if (goToView === "message") {
    cardTitleBg.style.animation = "hideTitleAnim 1s";
    cardMessageBg.style.animation = "showMessageAnim 1s";
    blurElement.style.animation = "showBlur 1s";
    goToView = "title";
    cardMessageBg.style.display = "block";
    switchBtn.value = "View Title";
    switchTimer = setTimeout(() => {
      cardTitleBg.style.opacity = 0;
      cardMessageBg.style.opacity = 1;
      cardMessageBg.style.top = "0px";
      blurElement.style.opacity = 1;
      printMessage();
    }, 1000);
  } else if (goToView === "title") {
    cardTitleBg.style.animation = "showTitleAnim 1s";
    cardMessageBg.style.animation = "hideMessageAnim 1s";
    blurElement.style.animation = "hideBlur 1s";
    goToView = "message";
    switchBtn.value = "View Message";
    switchTimer = setTimeout(() => {
      cardTitleBg.style.opacity = 1;
      cardMessageBg.style.opacity = 0;
      cardMessageBg.style.display = "none";
      blurElement.style.opacity = 0;
    }, 1000);
  }
}

function adjustPopOutEmoji() {
  let card = document.getElementById("card");

  let rect = card.getBoundingClientRect();
  let x = rect.left - 45;
  let y = rect.top - 45;

  popOutEmoji.style.left = `${x}px`;
  popOutEmoji.style.top = `${y}px`;
}

function animatePopOutEmoji() {
  popOutEmoji.style.animation = "none";
  setTimeout(() => {
    popOutEmoji.style.animation = "popOutEmojiAnim 2s";
  }, 100);
}

let message = `Message`;

let printTimer;
let messagePrinted = false;
//Prints message only once
function printMessage() {
  let cardMessage2 = document.getElementById("card-message");
  if (messagePrinted === false) {
    cardMessage2.innerHTML = "";
    let charIndex = 0;
    clearInterval(printTimer);

    printTimer = setInterval(print, 50);

    function print() {
      if (charIndex < message.length) {
        if (message[charIndex] == "\n") {
          cardMessage2.innerHTML += "<br>";
          charIndex++;
        } else {
          cardMessage2.innerHTML += message[charIndex];
          charIndex++;
        }
      } else {
        clearInterval(printTimer);
        messagePrinted = true;
      }
    }
  } else {
    cardMessage2 = message;
  }
}

function showTextBox(applyTo) {
  let screenHeight = window.screen.height;
  shadedBg.style.height = `${screenHeight}px`;
  shadedBg.style.display = "block";
  textBoxContainer.style.display = "flex";
  applyInputTo = applyTo;

  switch (applyTo) {
    case "pop-out-emoji":
      textInput.value = popOutEmoji.innerHTML;
      textInput.placeholder = "Enter an emoji";
      break;

    case "card-title":
      textInput.value = convertForTextarea(cardTitle.innerHTML);
      textInput.placeholder = "Enter a title";
      break;

    case "card-message":
      let cardMessage2 = document.getElementById("card-message");
      textInput.value = convertForTextarea(cardMessage2.innerHTML);
      textInput.placeholder = "Enter your message";
      break;

    case "message-cursor":
      textInput.value = cursor.innerHTML;
      textInput.placeholder = "Enter an emoji";
      break;

    default:
      alert("Error at showTextBox function");
      break;
  }
}

let applyInputTo = "";
//hides text box
function hideTextBox(action) {
  textBoxContainer.style.display = "none";
  shadedBg.style.display = "none";

  if (
    action == "apply" &&
    applyInputTo == "pop-out-emoji" &&
    textInput.value != ""
  ) {
    //displays the entered emoji in the pop-out-emoji conatiner
    popOutEmoji.innerHTML = textInput.value;
    animatePopOutEmoji();
  } else if (
    action == "apply" &&
    applyInputTo == "card-title" &&
    textInput.value != ""
  ) {
    //writes the entered text as the card title
    cardTitle.innerHTML = convertForDivContainer(textInput.value);
  } else if (
    action == "apply" &&
    applyInputTo == "card-message" &&
    textInput.value != ""
  ) {
    //writes the entered text as the card message
    message = textInput.value;
    messagePrinted = false;
    printMessage();
  } else if (
    action == "apply" &&
    applyInputTo == "message-cursor" &&
    textInput.value != ""
  ) {
    //writes the entered emoji as the message cursor
    cursor.innerHTML = textInput.value;
  } else if (
    action == "apply" &&
    applyInputTo == "pop-out-emoji" &&
    textInput.value == ""
  ) {
    //writes the default pop-out-emoji
    popOutEmoji.innerHTML = "😊";
  } else if (
    action == "apply" &&
    applyInputTo == "card-title" &&
    textInput.value == ""
  ) {
    //writes the default text
    cardTitle.innerHTML = "Card Title";
  } else if (
    action == "apply" &&
    applyInputTo == "card-message" &&
    textInput.value == ""
  ) {
    //writes the default text
    cardMessage.innerHTML = "Message";
  } else if (
    action == "apply" &&
    applyInputTo == "message-cursor" &&
    textInput.value == ""
  ) {
    //writes the defailt message cursor
    cursor.innerHTML = "✍";
  }
}

function checkChars(input) {
  //checks for and removes the characters: &amp;(&), &nbsp(ending space);
  var val = "";
  for (i = 0; i < input.length; i++) {
    if (input[i] == "&" && input[i + 5] == ";") {
      i += 5;
    } else if (input[i] == "&" && input[i + 4] == ";") {
      i += 4;
      val += "and";
    } else {
      val += input[i];
    }
  }
  return val;
}

function convertForTextarea(input) {
  //converts <br> tags into line breaks (\n) and &amp; into '&' so they can be displayed in the textarea
  var val = "";
  for (i = 0; i < input.length; i++) {
    if (input[i] == "<" && input[i + 3] == ">") {
      i += 3;
      val += "\n";
    } else if (input[i] == "&" && input[i + 4] == ";") {
      i += 4;
      val += "&";
    } else {
      val += input[i];
    }
  }
  return val;
}

function convertForDivContainer(input) {
  //converts linebreaks (\n) into <br> tags so they can be displayed in the div containers
  var val = "";
  for (i = 0; i < input.length; i++) {
    if (input[i] == "\n") {
      val += "<br>";
    } else {
      val += input[i];
    }
  }
  return val;
}

let popOutEmojiInputBtn = `
<input
type="button"
class="input-btn"
value="Click to add pop-out emoji"
onclick="showTextBox('pop-out-emoji');"
/>`;

let titleInputBtn = `
<input
type="button"
class="input-btn"
value="Click to add title"
onclick="showTextBox('card-title');"
/>`;

let messageInputBtn = `
<input
type="button"
class="input-btn"
value="Click to add message"
onclick="showTextBox('card-message');"
/>`;

let cursorInputBtn = `
<input
type="button"
class="input-btn"
value="Click to add cursor emoji"
onclick="showTextBox('message-cursor');"
/>`;

let fontComponent = `
<div class="design-stage-content">
            <span class="design-stage-content-label">Font: </span>
            <div class="design-stage-elements-container">
              <span
                class="font-text"
                style="font-family: Arial, Helvetica, sans-serif"
                id="font1"
                >Arial</span
              >
              <span
                class="font-text"
                style="font-family: 'Times New Roman', Times, serif"
                id="font2"
                >Times</span
              >
              <span
                class="font-text"
                style="font-family: 'Courier New', Courier, monospace"
                id="font3"
                >Monospace</span
              >
              <span
                class="font-text"
                style="font-family: 'Brush Script MT', cursive"
                id="font4"
                >Cursive</span
              >
              <span
                class="font-text"
                style="font-family: Caveat, serif"
                id="font5"
                >Caveat</span
              >
            </div>
          </div>`;

let colorComponent = `
<div class="design-stage-content">
<span class="design-stage-content-label">Color: </span>
<div class="design-stage-elements-container" id="color-container">
  <span class="color-circle" style="color: white" id="color1">⬤</span>
<span class="color-circle" style="color: SeaGreen" id="color2">⬤</span>
<span class="color-circle" style="color: FireBrick" id="color3">⬤</span>
<span class="color-circle" style="color: Coral" id="color4">⬤</span>
<span class="color-circle" style="color: Crimson" id="color5">⬤</span>
<span class="color-circle" style="color: DarkSalmon" id="color6">⬤</span>
<span class="color-circle" style="color: Purple" id="color7">⬤</span>
<span class="color-circle" style="color: DodgerBlue" id="color8">⬤</span>
<span class="color-circle" style="color: Pink" id="color9">⬤</span>
<span class="color-circle" style="color: RoyalBlue" id="color10">⬤</span>
<span class="color-circle" style="color: IndianRed" id="color11">⬤</span>
<span class="color-circle" id="color12" style="display: none;">⬤</span>
<span class="color-circle" id="add-color-btn">+</span>
<input type="color" style="display: none;" id="col-selector">
</div>
</div>`;

let gradientComponent = `
<div class="design-stage-content">
<span class="design-stage-content-label">Gradient: </span>
<div class="design-stage-elements-container">
<span class="color-circle" style="background: -webkit-linear-gradient(45deg, #ff512f, #f09819); -webkit-background-clip: text;  -webkit-text-fill-color: transparent;" id="gradient1">⬤</span>
<span class="color-circle" style="background: -webkit-linear-gradient(25deg, #d64c7f, #ee4758 50%); -webkit-background-clip: text;  -webkit-text-fill-color: transparent;" id="gradient2">⬤</span>
<span class="color-circle" style="background: -webkit-linear-gradient(45deg, #8e2de2, #4a00e0); -webkit-background-clip: text;  -webkit-text-fill-color: transparent;" id="gradient3">⬤</span>
<span class="color-circle" style="background: -webkit-linear-gradient(45deg, #00b09b, #96c93d); -webkit-background-clip: text;  -webkit-text-fill-color: transparent;" id="gradient4">⬤</span>
<span class="color-circle" style="background: -webkit-linear-gradient(45deg, gray, black); -webkit-background-clip: text;  -webkit-text-fill-color: transparent;" id="gradient5">⬤</span>
<span class="color-circle" style="background: -webkit-linear-gradient(45deg, violet, purple); -webkit-background-clip: text;  -webkit-text-fill-color: transparent;" id="gradient6">⬤</span>
</div>
</div>`;

let imagesComponent = `
<div class="design-stage-content">
<span class="design-stage-content-label">Image: </span>
<div class="design-stage-elements-container" id="image-container">
<img src="images/sunflower_pic.jpg" alt="sunflowers" class="image-element" id="pic1">
<img src="images/mother_pic.jpg" alt="mother_pic" class="image-element" id="pic2">
<img src="images/father_pic.jpg" alt="father_pic" class="image-element" id="pic3">
<img src="images/balloons_pic.jpg" alt="balloons_pic" class="image-element" id="pic4">
<img src="images/bday_cake_pic.jpg" alt="bday_cake_pic" class="image-element" id="pic5">
<img src="images/flower_pic.jpg" alt="flower_pic" class="image-element" id="pic6">
<img src="images/cherry-blossom_pic.jpg" alt="cherry-blossom_pic" class="image-element" id="pic7">
</div>
</div>`;

let musicComponent = `
<div>
  <div class="design-stage-content">

              <div class="design-stage-content-label">Music: </div>
              <div class="design-stage-elements-container">
                <center>
                  <select id="musicSelect" style="text-align: center;" onchange="setMusic();">
                    <option>Select</option>
                    <option>wedding-day.mp3</option>
                    <option>acoustic-vibe.mp3</option>
                    <option>music.wav</option>
                    <option>awaken-136824.mp3</option>
                    <option>happy-birthday-to-you-bnsa.mp3</option>
                    <option>happy-15th-birthday.mp3</option>
                    <option>inspired-ambient-141686.mp3</option>
                  </select>
                </center>
              </div>
  </div>
            <center>
              <audio id="sound-control" controls>
                <source src="#" type="audio/wav">
                </audio>
              </center> 
</div>`;

//selects fonts and applies them to the card
function getFonts() {
  const titleText = document.getElementById("title-text");
  const messageText = document.getElementById("message-text");
  const font1 = document
    .getElementById("font1")
    .addEventListener("click", function () {
      currentStage == "titleText"
        ? (cardTitle.style.fontFamily = "Arial,Helvetica,sans-serif")
        : (cardMessage.style.fontFamily = "Arial,Helvetica,sans-serif");
    });
  const font2 = document
    .getElementById("font2")
    .addEventListener("click", function () {
      currentStage == "titleText"
        ? (cardTitle.style.fontFamily = "'Times New Roman',Times,serif")
        : (cardMessage.style.fontFamily = "'Times New Roman',Times,serif");
    });
  const font3 = document
    .getElementById("font3")
    .addEventListener("click", function () {
      currentStage == "titleText"
        ? (cardTitle.style.fontFamily = "'Courier New',Courier,monospace")
        : (cardMessage.style.fontFamily = "'Courier New',Courier,monospace");
    });
  const font4 = document
    .getElementById("font4")
    .addEventListener("click", function () {
      currentStage == "titleText"
        ? (cardTitle.style.fontFamily = "'Brush Script MT', cursive")
        : (cardMessage.style.fontFamily = "'Brush Script MT', cursive");
    });
  const font5 = document
    .getElementById("font5")
    .addEventListener("click", function () {
      currentStage == "titleText"
        ? (cardTitle.style.fontFamily = "Caveat,serif")
        : (cardMessage.style.fontFamily = "Caveat,serif");
    });
}
// getFonts();

//selects colors and applies them to the card background
function getColors() {
  let pageBg = document.getElementById("page-bg");
  const color1 = document
    .getElementById("color1")
    .addEventListener("click", function () {
      card.style.background = "";
      pageBg.style.background = "";
      card.style.backgroundColor = "white";
      pageBg.style.backgroundColor = "white";
    });
  const color2 = document
    .getElementById("color2")
    .addEventListener("click", function () {
      card.style.background = "";
      pageBg.style.background = "";
      card.style.backgroundColor = "SeaGreen";
      pageBg.style.backgroundColor = "SeaGreen";
    });
  const color3 = document
    .getElementById("color3")
    .addEventListener("click", function () {
      card.style.background = "";
      pageBg.style.background = "";
      card.style.backgroundColor = "FireBrick";
      pageBg.style.backgroundColor = "FireBrick";
    });
  const color4 = document
    .getElementById("color4")
    .addEventListener("click", function () {
      card.style.background = "";
      pageBg.style.background = "";
      card.style.backgroundColor = "Coral";
      pageBg.style.backgroundColor = "Coral";
    });
  const color5 = document
    .getElementById("color5")
    .addEventListener("click", function () {
      card.style.background = "";
      pageBg.style.background = "";
      card.style.backgroundColor = "Crimson";
      pageBg.style.backgroundColor = "Crimson";
    });
  const color6 = document
    .getElementById("color6")
    .addEventListener("click", function () {
      card.style.background = "";
      pageBg.style.background = "";
      card.style.backgroundColor = "DarkSalmon";
      pageBg.style.backgroundColor = "DarkSalmon";
    });
  const color7 = document
    .getElementById("color7")
    .addEventListener("click", function () {
      card.style.background = "";
      pageBg.style.background = "";
      card.style.backgroundColor = "Purple";
      pageBg.style.backgroundColor = "Purple";
    });
  const color8 = document
    .getElementById("color8")
    .addEventListener("click", function () {
      card.style.background = "";
      pageBg.style.background = "";
      card.style.backgroundColor = "DodgerBlue";
      pageBg.style.backgroundColor = "DodgerBlue";
    });
  const color9 = document
    .getElementById("color9")
    .addEventListener("click", function () {
      card.style.background = "";
      pageBg.style.background = "";
      card.style.backgroundColor = "Pink";
      pageBg.style.backgroundColor = "Pink";
    });
  const color10 = document
    .getElementById("color10")
    .addEventListener("click", function () {
      card.style.background = "";
      pageBg.style.background = "";
      card.style.backgroundColor = "RoyalBlue";
      pageBg.style.backgroundColor = "RoyalBlue";
    });
  const color11 = document
    .getElementById("color11")
    .addEventListener("click", function () {
      card.style.background = "";
      pageBg.style.background = "";
      card.style.backgroundColor = "IndianRed";
      pageBg.style.backgroundColor = "IndianRed";
    });

  //used to get and click color selector
  const colSelector = document.getElementById("col-selector");
  const colSelectorAdd = document
    .getElementById("col-selector")
    .addEventListener("input", addSelectorColor);
  const addColorBtn = document
    .getElementById("add-color-btn")
    .addEventListener("click", clickColSelector);
  function clickColSelector() {
    colSelector.click();
  }
  function addSelectorColor() {
    card.style.background = "";
    pageBg.style.background = "";
    card.style.backgroundColor = colSelector.value;
    pageBg.style.backgroundColor = colSelector.value;
  }
  //removes background image if user is editing the card background and clicks on color elements
  const removeBgImage = document
    .getElementById("color-container")
    .addEventListener("click", function () {
      if (currentStage == "titleBg") {
        card.style.backgroundImage = "url('')";
      }
    });
}
// getColors();

//selects gradients and applies them to the card background
function getGradients() {
  let pageBg = document.getElementById("page-bg");
  const gradient1 = document
    .getElementById("gradient1")
    .addEventListener("click", function () {
      pageBg.style.background = "linear-gradient(to right, #ff512f, #f09819)";
      card.style.background = "linear-gradient(to right, #ff512f, #f09819)";
    });
  const gradient2 = document
    .getElementById("gradient2")
    .addEventListener("click", function () {
      pageBg.style.background = "linear-gradient(25deg, #d64c7f, #ee4758 50%)";
      card.style.background = "linear-gradient(25deg, #d64c7f, #ee4758 50%)";
    });
  const gradient3 = document
    .getElementById("gradient3")
    .addEventListener("click", function () {
      pageBg.style.background = "linear-gradient(to right, #8e2de2, #4a00e0)";
      card.style.background = "linear-gradient(to right, #8e2de2, #4a00e0)";
    });
  const gradient4 = document
    .getElementById("gradient4")
    .addEventListener("click", function () {
      pageBg.style.background = "linear-gradient(to right, #00b09b, #96c93d)";
      card.style.background = "linear-gradient(to right, #00b09b, #96c93d)";
    });
  const gradient5 = document
    .getElementById("gradient5")
    .addEventListener("click", function () {
      pageBg.style.background = "linear-gradient(45deg, gray, black)";
      card.style.background = "linear-gradient(45deg, gray, black)";
    });
  const gradient6 = document
    .getElementById("gradient6")
    .addEventListener("click", function () {
      pageBg.style.background = "linear-gradient(45deg, violet, purple)";
      card.style.background = "linear-gradient(45deg, violet, purple)";
    });
}
// getGradients();

//selects picture elements and applies them to the card background
function getImages() {
  let pageBg = document.getElementById("page-bg");
  const pic1 = document
    .getElementById("pic1")
    .addEventListener("click", function () {
      card.style.backgroundImage = "url('images/sunflower_pic.jpg')";
      pageBg.style.background = "";
    });
  const pic2 = document
    .getElementById("pic2")
    .addEventListener("click", function () {
      card.style.backgroundImage = "url('images/mother_pic.jpg')";
      pageBg.style.background = "";
    });
  const pic3 = document
    .getElementById("pic3")
    .addEventListener("click", function () {
      card.style.backgroundImage = "url('images/father_pic.jpg')";
      pageBg.style.background = "";
    });
  const pic4 = document
    .getElementById("pic4")
    .addEventListener("click", function () {
      card.style.backgroundImage = "url('images/balloons_pic.jpg')";
      pageBg.style.background = "";
    });
  const pic5 = document
    .getElementById("pic5")
    .addEventListener("click", function () {
      card.style.backgroundImage = "url('images/bday_cake_pic.jpg')";
      pageBg.style.background = "";
    });
  const pic6 = document
    .getElementById("pic6")
    .addEventListener("click", function () {
      card.style.backgroundImage = "url('images/flower_pic.jpg')";
      pageBg.style.background = "";
    });
  const pic7 = document
    .getElementById("pic7")
    .addEventListener("click", function () {
      card.style.backgroundImage = "url('images/cherry-blossom_pic.jpg')";
      pageBg.style.background = "";
    });

  //resizes and recenters the background image when user clicks on the background image container
  const resizeBg = document
    .getElementById("image-container")
    .addEventListener("click", function () {
      card.style.backgroundSize = "500px 400px";
      card.style.backgroundPosition = "center";
      let pageBg = (document.getElementById("page-bg").style.backgroundColor =
        "antiquewhite");
    });
}
// getImages();

//applies selected music to the audio element
function setMusic() {
  const soundControl = document.getElementById("sound-control");
  const musicSelect = document.getElementById("musicSelect").value;
  soundControl.src = `music/${musicSelect}`;
  bgSound.src = `music/${musicSelect}`;
  soundControl.play();
  //store selected music in the set-music container
  //sessionStorage.setItem("selectedMusic", musicSelect);
  let setMusic = document.getElementById("set-music");
  setMusic.innerHTML = musicSelect;
}
//shows the previously selected music in the music select element during editing
function showSelectedMusic() {
  let selectedMusic = document.getElementById("set-music").innerHTML;
  let musicSelect = document.getElementById("musicSelect");
  let soundControl = document.getElementById("sound-control");
  if (selectedMusic !== "") {
    musicSelect.value = selectedMusic;
    soundControl.src = `music/${musicSelect.value}`;
    bgSound.src = `music/${musicSelect.value}`;
  }
}

//plays the sound in the background
function playBgSound() {
  if (soundState == "stopped" && bgSound.source != "#") {
    soundState = "playing";
    bgSound.currentTime = 0;
    bgSound.play();
  }
  switchBtn.style.animation = "none";
  switchBtn.style.border = "2.5px solid gray";
}
function stopBgSound() {
  if (soundState === "playing") {
    bgSound.pause();
    soundState = "stopped";
  }
}

switchBtn.addEventListener("click", playBgSound);

let editingElements = document.getElementById("editing-elements");
let designBox = document.getElementById("design-box");
let designStageControls = document.getElementById("design-stage-controls");
let backBtn = document.getElementById("back-btn");
let nextBtn = document.getElementById("next-btn");
let cardControls = document.getElementById("card-controls");
let stageValue = -1;

function nextStage() {
  if (stageValue < 5) {
    stageValue++;
    currentStage = designStages[stageValue];
    changeStage();
  }
}

function prevStage() {
  if (stageValue > 0) {
    stageValue--;
    currentStage = designStages[stageValue];
    changeStage();
  }
}

function changeStage() {
  switch (stageValue) {
    case 0:
      goToView = "title";
      switchView();
      backBtn.className = "inactive-btn";
      switchBtn.style.display = "none";
      cardControls.style.display = "none";
      editingElements.style.display = "block";
      designBox.style.display = "block";
      designStageControls.style.display = "block";
      designBox.innerHTML = `
      <b class="design-stage-title">Title Text</b><br />
      ${popOutEmojiInputBtn}<br><br>
      ${titleInputBtn}<br><br>
      ${fontComponent}<br>
      `;
      getFonts();
      break;

    case 1:
      goToView = "title";
      switchView();
      backBtn.className = "design-stage-controls-btn";
      designBox.innerHTML = `
      <b class="design-stage-title">Card Background</b><br />
      ${colorComponent}<br>
      ${gradientComponent}<br>
      ${imagesComponent}<br>
      `;
      getColors();
      getGradients();
      getImages();
      break;

    case 2:
      goToView = "message";
      switchView();
      designBox.innerHTML = `
      <b class="design-stage-title">Message Text</b><br />
      ${messageInputBtn}<br><br>
      ${fontComponent}<br>
      ${cursorInputBtn}<br><br>
      `;
      getFonts();
      break;

    case 3:
      switchBtn.style.display = "none";
      stopBgSound();
      designBox.innerHTML = `
        <b class="design-stage-title">Background Music</b>
        ${musicComponent}<br>
        `;
      showSelectedMusic();
      break;

    case 4:
      goToView = "title";
      switchView();
      switchBtn.style.display = "block";
      switchBtn.addEventListener("click", playBgSound);
      soundState = "stopped";
      messagePrinted = false;
      cardMessage.innerHTML = "";
      switchBtn.style.animation = "switchBtnAnim 8s linear 0s infinite";
      animatePopOutEmoji();
      designBox.innerHTML = `
          <b class="design-stage-title">Review Card</b>
          <p>Your card is almost ready! Interact with it to confirm it's working great.
          Click the "Back" button to make changes or the "Next" button to create and share 
          your card.</p><br>
          `;
      break;

    case 5:
      goToView = "title";
      switchView();
      editingElements.style.display = "none";
      designBox.style.display = "none";
      designStageControls.style.display = "none";
      cardControls.style.display = "block";
      stopBgSound();
      messagePrinted = false;
      cardMessage.innerHTML = "";
      createFile();
      break;

    default:
      alert("Error at changeStage function");
  }
}

function showPopUpMessage(message) {
  let screenHeight = window.screen.height;
  let popUpContainer = document.getElementById("pop-up-container");
  popUpContainer.style.display = "flex";
  shadedBg.style.height = `${screenHeight}px`;
  shadedBg.style.display = "block";

  popUpContainer.innerHTML = message;
}
function hidePopUpMessage() {
  let popUpContainer = document.getElementById("pop-up-container");
  popUpContainer.style.display = "none";
  shadedBg.style.display = "none";
}

function editCard() {
  stopBgSound();
  stageValue = -1;
  nextStage();
}

//file creation and handling functions
function generateRandomString() {
  const letters = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];
  const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  var randomString = null;
  randomString = "";

  for (i = 0; i < 5; i++) {
    var val = Math.ceil(Math.random() * 2);
    if (val == 1) {
      var letterInd = Math.ceil(Math.random() * 25);
      randomString += letters[letterInd];
    } else {
      var numberInd = Math.ceil(Math.random() * 9);
      randomString += numbers[numberInd];
    }
  }

  return randomString;
}

function createFile() {
  cardMessage.innerHTML = message; //puts the stored message into the card-mesage container
  cardMessage.style.animation = "none"; //removes the animation from the cardMessage container
  cardTitleBg.style.opacity = 1;
  cardMessageBg.style.opacity = 0;
  cardMessageBg.style.display = "none";
  blurElement.style.opacity = 0;
  var randomChars = generateRandomString();
  let cardID = "";
  const cardLink = document.getElementById("card-link");
  //cardLink.innerHTML = `<span>showCard.php?name=${docName}</span>`;
  let docBody = document.getElementById("content-container").innerHTML;
  docBody = replaceQuote(docBody);
  let docBodyObj = { content: docBody };
  docBodyObj = JSON.stringify(docBodyObj);
  //alert(docBodyObj);
  // function checkStatus(status) {
  //   if (status === "File created") {
  //     success();
  //   } else {
  //     failed();
  //   }
  // }

  

  function success() {
    showPopUpMessage(`<b>Your card is ready!</b>
<p>Click <b>Share</b> or copy the link generated to share it with others.<br>
If you wish to make further changes, click <b>Edit</b>.</p>
<p>Thanks for using <span class="logo-text">Purple Cards</span>.</p>

<input type="button" class="design-stage-controls-btn" onclick="viewCard('${cardID}')" value="Okay">
`);
  }
  function failed() {
    showPopUpMessage(`<b>Error</b>
        <p>Sorry, your card could not be created. Please try again.</p>
        <input type="button" class="design-stage-controls-btn" onclick="hidePopUpMessage();editCard();" value="Okay">
        `);
  }
  
  exeCreate();

  async function exeCreate() {
  const text = docBodyObj;

  const { data, error } = await supabaseClient
    .from("cards_table")
    .insert([{ card_data: text }])
    .select();

  if(error){
    failed();
    return;
  }

  const id = data[0].id;
  cardID = id;

  const shareLink = `file:///C:/Users/user/Desktop/Folders%20and%20Docs/WEB_PROJECTS/purple_cards_v3%20-%20db/viewCard.html?id=${id}`;
  //const shareLink = `${window.location.origin}/viewCard.html?id=${id}`;

  cardLink.innerHTML =
    `<a href="${shareLink}">${shareLink}</a>`;

  success();
}

  // fetch("createDoc.php", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
  //   },
  //   body: `docBody=${docBodyObj}&docName=${docName}`,
  // })
  //   .then((response) => response.text())
  //   .then((res) => checkStatus(res));

  //restoreProperties();
  //callDel(docName);
}

function viewCard(id) {
  hidePopUpMessage();
  window.location.href = `file:///C:/Users/user/Desktop/Folders%20and%20Docs/WEB_PROJECTS/purple_cards_v3%20-%20db/viewCard.html?id=${id}`;
}
//replaces &quot; with quote(')
function replaceQuote(value) {
  let newValue = "";
  for (i = 0; i < value.length; i++) {
    if (
      value[i] === "&" &&
      value[i + 1] === "q" &&
      value[i + 2] === "u" &&
      value[i + 3] === "o" &&
      value[i + 4] === "t" &&
      value[i + 5] === ";"
    ) {
      newValue += "'";
      i += 5;
    } else {
      newValue += value[i];
    }
  }
  return newValue;
}
//stores message content into message variable
function captureMessage() {
  message = cardMessage.innerHTML;
  cardMessage.innerHTML = "";
}
//checks if any card is stored in session storage and displays it
function getStoredCard() {
  let storedCard = sessionStorage.getItem("storedCard");
  if (storedCard !== null) {
    let cardObj = JSON.parse(storedCard);
    let contentContainer = (document.getElementById(
      "content-container"
    ).innerHTML = cardObj.content);
    //reselects elements
    card = document.getElementById("card");
    blurElement = document.getElementById("blur-element");
    cardTitleBg = document.getElementById("card-title-bg");
    cardMessageBg = document.getElementById("card-message-bg");
    cardTitle = document.getElementById("card-title");
    cardMessage = document.getElementById("card-message");
    popOutEmoji = document.getElementById("pop-out-emoji");
    cursor = document.getElementById("cursor");
    switchBtn = document.getElementById("switch-btn");
    bgSound = document.getElementById("bg-sound");
    editingElements = document.getElementById("editing-elements");
    designBox = document.getElementById("design-box");
    designStageControls = document.getElementById("design-stage-controls");
    backBtn = document.getElementById("back-btn");
    nextBtn = document.getElementById("next-btn");
    cardControls = document.getElementById("card-controls");

    switchBtn.addEventListener("click", playBgSound);
  }
}

onload = getStoredCard();
adjustPopOutEmoji();
captureMessage();
nextStage();
