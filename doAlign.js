require("dotenv").config()

const { JP_INPUT_LOCATION, CN_INPUT_LOCATION, DI_INPUT_LOCATION, OUTPUT_LOCATION } = process.env

const fs = require("fs")

let data = fs.readFileSync(JP_INPUT_LOCATION, "utf8")

console.log(data)

let jpData = {
    a1: "あ",
    a2: "い",
    b: {
        b1: "う",
        b2: "え",
    },
}

fs.writeFileSync(OUTPUT_LOCATION, JSON.stringify(jpData, null, 2), "utf8")
