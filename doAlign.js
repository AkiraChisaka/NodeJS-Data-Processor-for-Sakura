require("dotenv").config()
const fs = require("fs")
const path = require("path")
const { JP_INPUT_LOCATION, CN_INPUT_LOCATION, DI_INPUT_LOCATION, INPUT_LOCATION, OUTPUT_LOCATION } = process.env

// let outputJSON = {
//     id_novel: 1,
//     gpt_dict: [
//         // Examples
//         // {
//         //     src: "",
//         //     dst: "",
//         //     info: "",
//         // },
//         // {
//         //     src: "",
//         //     dst: "",
//         //     info: "",
//         // },
//     ],
//     data: [
//         // Examples
//         // {
//         //     id_line: 1,
//         //     ja_text: "xxxx",
//         //     zh_text: "yyyy",
//         // },
//         // {
//         //     id_line: 2,
//         //     ja_text: "xxxx",
//         //     zh_text: "yyyy",
//         // },
//     ],
// }

// Main

// let jpText = fs.readFileSync(JP_INPUT_LOCATION, "utf8")
// let cnText = fs.readFileSync(CN_INPUT_LOCATION, "utf8")
// let diText = fs.readFileSync(DI_INPUT_LOCATION, "utf8")

// // console.log(jpText)

// outputJSON.data.push(...convertTextToJSON(jpText, cnText))

// outputJSON.gpt_dict.push(...convertDictToJSON(diText))

// fs.writeFileSync(OUTPUT_LOCATION, JSON.stringify(outputJSON, null, 2), "utf8")

let filenames = fs.readdirSync(INPUT_LOCATION)
let novelNames = [...new Set(filenames.map((filename) => filename.slice(0, -7)))]

let novels = novelNames.map((novelName, index) => {
    let jpText = fs.readFileSync(path.join(INPUT_LOCATION, `${novelName} JP.txt`), "utf8")
    let cnText = fs.readFileSync(path.join(INPUT_LOCATION, `${novelName} CN.txt`), "utf8")
    let diText = fs.readFileSync(path.join(INPUT_LOCATION, `${novelName} DI.txt`), "utf8")

    let data = convertTextToJSON(jpText, cnText)
    let gpt_dict = convertDictToJSON(diText)

    return {
        id_novel: index + 1,
        gpt_dict: gpt_dict,
        data: data,
    }
})

fs.writeFileSync(OUTPUT_LOCATION, JSON.stringify(novels, null, 2), "utf8")

// End of main

function convertTextToJSON(jpText, cnText) {
    let data = []
    let jpLines = jpText.replace(/\r\n/g, "\n").split("\n")
    let cnLines = cnText.replace(/\r\n/g, "\n").split("\n")

    if (jpLines.length !== cnLines.length) {
        throw new Error("JP and CN texts have different number of lines")
    }

    length = jpLines.length

    for (let i = 0; i < length; i++) {
        data.push({
            id_line: i + 1,
            ja_text: jpLines[i],
            zh_text: cnLines[i],
        })
    }

    return data
}

function convertDictToJSON(diText) {
    let dict = []
    let diLines = diText.replace(/\r\n/g, "\n").split("\n")
    // console.log(diLines)

    diLines.forEach((line) => {
        let parts = line.split("==")
        let src = parts[0].trim().replace(/\t/g, "")

        parts = parts[1].split("--")
        let dst = parts[0].trim().replace(/\t/g, "")
        let info = parts[1].trim().replace(/\t/g, "")

        dict.push({
            src: src,
            dst: dst,
            info: info,
        })
    })

    return dict
}
