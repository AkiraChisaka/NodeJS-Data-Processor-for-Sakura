require("dotenv").config()
const fs = require("fs")
const path = require("path")
const { INPUT_LOCATION, OUTPUT_LOCATION } = process.env

main()

function main() {
    let filenames = fs.readdirSync(INPUT_LOCATION)
    let novelNames = [...new Set(filenames.map((filename) => filename.slice(0, -7)))]

    let novels = novelNames.map((novelName, index) => {
        let jpText = fs.readFileSync(path.join(INPUT_LOCATION, `${novelName} JP.txt`), "utf8")
        let cnText = fs.readFileSync(path.join(INPUT_LOCATION, `${novelName} CN.txt`), "utf8")
        let diText = ""

        try {
            diText = fs.readFileSync(path.join(INPUT_LOCATION, `${novelName} DI.txt`), "utf8")
        } catch (error) {
            if (error.code !== "ENOENT") {
                throw error
            }
        }

        try {
            var { text_data, ja_char_count, zh_char_count } = convertTextToJSON(jpText, cnText)
            var { gpt_dict } = convertDictToJSON(diText)
        } catch (error) {
            console.error(novelName)
            throw error
        }

        return {
            id_novel: index + 1,
            line_count: text_data.length,
            ja_char_count,
            zh_char_count,
            gpt_dict,
            text_data,
        }
    })

    let outputJSON = {
        novel_count: novels.length,
        line_count_total: novels.reduce((total, novel) => total + novel.line_count, 0),
        ja_char_count_total: novels.reduce((total, novel) => total + novel.ja_char_count, 0),
        zh_char_count_total: novels.reduce((total, novel) => total + novel.zh_char_count, 0),
        data: novels,
    }

    fs.writeFileSync(OUTPUT_LOCATION, JSON.stringify(outputJSON, null, 2), "utf8")
}

function convertTextToJSON(jpText, cnText) {
    let text_data = []
    let ja_char_count = 0
    let zh_char_count = 0

    let jpLines = jpText.replace(/\r\n/g, "\n").split("\n")
    let cnLines = cnText.replace(/\r\n/g, "\n").split("\n")

    if (jpLines.length !== cnLines.length) {
        throw new Error("JP and CN texts have different number of lines")
    }

    let length = jpLines.length
    for (let i = 0; i < length; i++) {
        text_data.push({
            id_line: i + 1,
            ja_text: jpLines[i],
            zh_text: cnLines[i],
        })
        ja_char_count += jpLines[i].length
        zh_char_count += cnLines[i].length
    }

    return { text_data, ja_char_count, zh_char_count }
}

function convertDictToJSON(diText) {
    if (diText === "") {
        return { dict: [] }
    }

    let dict = []
    let diLines = diText.replace(/\r\n/g, "\n").split("\n")
    // console.log(diLines)

    try {
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
    } catch (error) {
        return { dict: [] }
    }

    return { dict }
}
