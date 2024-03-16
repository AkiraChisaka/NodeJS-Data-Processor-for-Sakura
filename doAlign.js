require("dotenv").config()
const fs = require("fs")
const { JP_INPUT_LOCATION, CN_INPUT_LOCATION, DI_INPUT_LOCATION, OUTPUT_LOCATION } = process.env

let outputJSON = {
    id_novel: 1,
    gpt_dict: [
        // Examples
        // {
        //     src: "",
        //     dst: "",
        //     info: "",
        // },
        // {
        //     src: "",
        //     dst: "",
        //     info: "",
        // },
    ],
    data: [
        // Examples
        // {
        //     id_line: 1,
        //     ja_text: "xxxx",
        //     zh_text: "yyyy",
        // },
        // {
        //     id_line: 2,
        //     ja_text: "xxxx",
        //     zh_text: "yyyy",
        // },
    ],
}

let jpText = fs.readFileSync(JP_INPUT_LOCATION, "utf8")
let cnText = fs.readFileSync(CN_INPUT_LOCATION, "utf8")
let diText = fs.readFileSync(DI_INPUT_LOCATION, "utf8")

// console.log(jpText)

addTextToJSON(jpText, cnText)

addDictToJSON(diText)

// let jpData = {
//     a1: "あ",
//     a2: "い",
//     b: {
//         b1: "う",
//         b2: "え",
//     },
// }

fs.writeFileSync(OUTPUT_LOCATION, JSON.stringify(outputJSON, null, 2), "utf8")

function addTextToJSON(jpText, cnText) {
    let jpLines = jpText.replace(/\r\n/g, "\n").split("\n")
    let cnLines = cnText.replace(/\r\n/g, "\n").split("\n")

    if (jpLines.length !== cnLines.length) {
        console.error("JP and CN texts have different number of lines")
        process.exit(1)
    }

    length = jpLines.length

    for (let i = 0; i < length; i++) {
        outputJSON.data.push({
            id_line: i + 1,
            ja_text: jpLines[i],
            zh_text: cnLines[i],
        })
    }
}

function addDictToJSON(diText) {
    let diLines = diText.replace(/\r\n/g, "\n").split("\n")
    console.log(diLines)

    diLines.forEach((line) => {
        let parts = line.split("==")
        let src = parts[0].trim().replace(/\t/g, "")

        parts = parts[1].split("--")
        let dst = parts[0].trim().replace(/\t/g, "")
        let info = parts[1].trim().replace(/\t/g, "")

        outputJSON.gpt_dict.push({
            src: src,
            dst: dst,
            info: info,
        })
    })
}
