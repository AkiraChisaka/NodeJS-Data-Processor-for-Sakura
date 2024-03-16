require("dotenv").config()
const fs = require("fs")
const path = require("path")
const { JP_INPUT_LOCATION, CN_INPUT_LOCATION, DI_INPUT_LOCATION, INPUT_LOCATION, OUTPUT_LOCATION } = process.env

main()

function main() {
    let filenames = fs.readdirSync(INPUT_LOCATION)
    let novelNames = [...new Set(filenames.map((filename) => filename.slice(0, -7)))]

    let novels = novelNames.map((novelName, index) => {
        let jpText = fs.readFileSync(path.join(INPUT_LOCATION, `${novelName} JP.txt`), "utf8")
        let cnText = fs.readFileSync(path.join(INPUT_LOCATION, `${novelName} CN.txt`), "utf8")
        let diText = fs.readFileSync(path.join(INPUT_LOCATION, `${novelName} DI.txt`), "utf8")

        let text_data = convertTextToJSON(jpText, cnText)
        let gpt_dict = convertDictToJSON(diText)

        return {
            id_novel: index + 1,
            line_count: text_data.length,
            gpt_dict: gpt_dict,
            text_data: text_data,
        }
    })

    let outputJSON = {
        novel_count: novels.length,
        line_count_total: novels.reduce((total, novel) => total + novel.line_count, 0),
        data: novels,
    }

    fs.writeFileSync(OUTPUT_LOCATION, JSON.stringify(outputJSON, null, 2), "utf8")
}

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
