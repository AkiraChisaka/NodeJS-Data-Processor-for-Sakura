const fs = require("fs")
const path = require("path")

const config = JSON.parse(fs.readFileSync("config.json", "utf8"))

for (const location of config.locations) {
    console.log(`Input: ${location.input}`)
    console.log(`Output: ${location.output}`)
}

const INPUT_LOCATION = config.locations[0].input
const OUTPUT_LOCATION = config.locations[0].output

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
            var [text_data, ja_char_count, zh_char_count] = convertTextToJSON(jpText, cnText)
            var [gpt_dict] = convertDictToJSON(diText)
            console.log(gpt_dict)
        } catch (error) {
            console.error(novelName)
            throw error
        }

        console.log(gpt_dict)

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
        schema_version: "Akira v1.000",
        novel_count: novels.length,
        line_count_total: novels.reduce((total, novel) => total + novel.line_count, 0),
        ja_char_count_total: novels.reduce((total, novel) => total + novel.ja_char_count, 0),
        zh_char_count_total: novels.reduce((total, novel) => total + novel.zh_char_count, 0),
        data: novels,
    }

    fs.writeFileSync(OUTPUT_LOCATION, JSON.stringify(outputJSON, null, 2), "utf8")
}

/**
 *
 * @param {*} jpText
 * @param {*} cnText
 * @returns An array containing the text data stored as an array, and the character count for both languages
 */
function convertTextToJSON(jpText, cnText) {
    let data = []
    let ja_char_count = 0
    let zh_char_count = 0

    let jpLines = jpText.replace(/\r\n/g, "\n").split("\n")
    let cnLines = cnText.replace(/\r\n/g, "\n").split("\n")

    if (jpLines.length !== cnLines.length) {
        throw new Error("JP and CN texts have different number of lines")
    }

    let length = jpLines.length
    for (let i = 0; i < length; i++) {
        data.push({
            id_line: i + 1,
            ja_text: jpLines[i],
            zh_text: cnLines[i],
        })
        ja_char_count += jpLines[i].length
        zh_char_count += cnLines[i].length
    }

    return [data, ja_char_count, zh_char_count]
}

/**
 *
 * @param {*} diText
 * @returns An array containing only the dictionary data, which is also an array
 */
function convertDictToJSON(diText) {
    let dict = []

    if (diText === "") {
        return [dict]
    }

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
        return [dict]
    }

    return [dict]
}
