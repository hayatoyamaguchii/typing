const startButton = document.getElementById("start-button");
const timerDisplay = document.getElementById("timer");
const scoreDisplay = document.getElementById("score");
const averageTimeDisplay = document.getElementById("average-time");
const letterDisplay = document.getElementById("letter");
const romajiLetterDisplay = document.getElementById("romaji-letter");
const inputLetterDisplay = document.getElementById("input-letter");

let timeLeft = 10;
let score = 0;
let currentLetter = "";
let expectedRomajiList = [];
let currentRomajiInput = "";
let gameInterval;
let startTime = 0;
let reactionTimes = [];

const hiraganaList = [
    "あ",
    "い",
    "う",
    "え",
    "お",
    "か",
    "き",
    "く",
    "け",
    "こ",
    "さ",
    "し",
    "す",
    "せ",
    "そ",
    "た",
    "ち",
    "つ",
    "て",
    "と",
    "な",
    "に",
    "ぬ",
    "ね",
    "の",
    "は",
    "ひ",
    "ふ",
    "へ",
    "ほ",
    "ま",
    "み",
    "む",
    "め",
    "も",
    "や",
    "ゆ",
    "よ",
    "ら",
    "り",
    "る",
    "れ",
    "ろ",
    "わ",
    "を",
    "ん",
    "が",
    "ぎ",
    "ぐ",
    "げ",
    "ご",
    "ざ",
    "じ",
    "ず",
    "ぜ",
    "ぞ",
    "だ",
    "ぢ",
    "づ",
    "で",
    "ど",
    "ば",
    "び",
    "ぶ",
    "べ",
    "ぼ",
    "ぱ",
    "ぴ",
    "ぷ",
    "ぺ",
    "ぽ",
];

const romajiToHiragana = {
    a: ["あ"],
    i: ["い"],
    u: ["う"],
    e: ["え"],
    o: ["お"],
    ka: ["か"],
    ki: ["き"],
    ku: ["く"],
    ke: ["け"],
    ko: ["こ"],
    sa: ["さ"],
    si: ["し"],
    shi: ["し"],
    su: ["す"],
    se: ["せ"],
    so: ["そ"],
    ta: ["た"],
    ti: ["ち"],
    chi: ["ち"],
    tu: ["つ"],
    tsu: ["つ"],
    te: ["て"],
    to: ["と"],
    na: ["な"],
    ni: ["に"],
    nu: ["ぬ"],
    ne: ["ね"],
    no: ["の"],
    ha: ["は"],
    hi: ["ひ"],
    hu: ["ふ"],
    fu: ["ふ"],
    he: ["へ"],
    ho: ["ほ"],
    ma: ["ま"],
    mi: ["み"],
    mu: ["む"],
    me: ["め"],
    mo: ["も"],
    ya: ["や"],
    yi: ["い"],
    yu: ["ゆ"],
    yo: ["よ"],
    ra: ["ら"],
    ri: ["り"],
    ru: ["る"],
    re: ["れ"],
    ro: ["ろ"],
    wa: ["わ"],
    wo: ["を"],
    nn: ["ん"],
    ln: ["ん"],
    xn: ["ん"],
    ga: ["が"],
    gi: ["ぎ"],
    gu: ["ぐ"],
    ge: ["げ"],
    go: ["ご"],
    za: ["ざ"],
    zi: ["じ"],
    ji: ["じ"],
    zu: ["ず"],
    ze: ["ぜ"],
    zo: ["ぞ"],
    da: ["だ"],
    di: ["ぢ"],
    du: ["づ"],
    de: ["で"],
    do: ["ど"],
    ba: ["ば"],
    bi: ["び"],
    bu: ["ぶ"],
    be: ["べ"],
    bo: ["ぼ"],
    pa: ["ぱ"],
    pi: ["ぴ"],
    pu: ["ぷ"],
    pe: ["ぺ"],
    po: ["ぽ"],
};

const romajiTable = {
    あ: ["a"],
    い: ["i", "yi"],
    う: ["u", "wu"],
    え: ["e"],
    お: ["o"],
    か: ["ka"],
    き: ["ki"],
    く: ["ku"],
    け: ["ke"],
    こ: ["ko"],
    さ: ["sa"],
    し: ["si", "shi"],
    す: ["su"],
    せ: ["se"],
    そ: ["so"],
    た: ["ta"],
    ち: ["ti", "chi"],
    つ: ["tu", "tsu"],
    て: ["te"],
    と: ["to"],
    な: ["na"],
    に: ["ni"],
    ぬ: ["nu"],
    ね: ["ne"],
    の: ["no"],
    は: ["ha"],
    ひ: ["hi"],
    ふ: ["hu", "fu"],
    へ: ["he"],
    ほ: ["ho"],
    ま: ["ma"],
    み: ["mi"],
    む: ["mu"],
    め: ["me"],
    も: ["mo"],
    や: ["ya"],
    ゆ: ["yu"],
    よ: ["yo"],
    ら: ["ra"],
    り: ["ri"],
    る: ["ru"],
    れ: ["re"],
    ろ: ["ro"],
    わ: ["wa"],
    を: ["wo"],
    ん: ["nn", "xn", "ln"],
    が: ["ga"],
    ぎ: ["gi"],
    ぐ: ["gu"],
    げ: ["ge"],
    ご: ["go"],
    ざ: ["za"],
    じ: ["zi", "ji"],
    ず: ["zu"],
    ぜ: ["ze"],
    ぞ: ["zo"],
    だ: ["da"],
    ぢ: ["di"],
    づ: ["du"],
    で: ["de"],
    ど: ["do"],
    ば: ["ba"],
    び: ["bi"],
    ぶ: ["bu"],
    べ: ["be"],
    ぼ: ["bo"],
    ぱ: ["pa"],
    ぴ: ["pi"],
    ぷ: ["pu"],
    ぺ: ["pe"],
    ぽ: ["po"],
};

const getRandomLetter = () => {
    return hiraganaList[Math.floor(Math.random() * hiraganaList.length)];
};

const updateLetter = () => {
    currentLetter = getRandomLetter();
    expectedRomajiList = romajiTable[currentLetter] || ["?"];
    currentRomajiInput = "";

    letterDisplay.textContent = currentLetter;
    romajiLetterDisplay.textContent = expectedRomajiList.join(" / ");
    inputLetterDisplay.textContent = "";

    startTime = Date.now();
};

const updateAverageTime = () => {
    if (reactionTimes.length > 0) {
        const averageTime = (
            reactionTimes.reduce((a, b) => a + b, 0) /
            reactionTimes.length /
            1000
        ).toFixed(3);
        averageTimeDisplay.textContent = `平均反応時間: ${averageTime}秒`;
    } else {
        averageTimeDisplay.textContent = `平均反応時間: N/A`;
    }
};

const startGame = () => {
    timeLeft = 10;
    score = 0;
    reactionTimes = [];
    scoreDisplay.textContent = `スコア: ${score}`;
    averageTimeDisplay.textContent = `平均反応時間: N/A`;
    timerDisplay.textContent = `残り時間: ${timeLeft}秒`;
    updateLetter();

    document.addEventListener("keydown", handleKeyPress);

    gameInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `残り時間: ${timeLeft}秒`;

        if (timeLeft <= 0) {
            clearInterval(gameInterval);
            document.removeEventListener("keydown", handleKeyPress);

            const finalAverageTime =
                reactionTimes.length > 0
                    ? (
                          reactionTimes.reduce((a, b) => a + b, 0) /
                          reactionTimes.length /
                          1000
                      ).toFixed(2)
                    : "N/A";

            alert(
                `終了！\nスコア: ${score}\n平均反応時間: ${finalAverageTime}秒`
            );
        }
    }, 1000);
};

const handleKeyPress = (event) => {
    const pressedKey = event.key.toLowerCase();
    currentRomajiInput += pressedKey;
    inputLetterDisplay.textContent = currentRomajiInput;

    if (
        expectedRomajiList.some((romaji) =>
            romaji.startsWith(currentRomajiInput)
        )
    ) {
        if (expectedRomajiList.includes(currentRomajiInput)) {
            const reactionTime = Date.now() - startTime;
            reactionTimes.push(reactionTime);
            score++;
            scoreDisplay.textContent = `スコア: ${score}`;

            updateAverageTime(); // 平均反応時間を更新
            updateLetter();
        }
    } else {
        currentRomajiInput = "";
        inputLetterDisplay.textContent = "";
    }
};

document.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !gameInterval) {
        startGame();
    }
});

startButton.addEventListener("click", startGame);
