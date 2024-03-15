require("dotenv").config()

const DEFAULT_JP_FILE_LOCATION = process.env.DEFAULT_JP_FILE_LOCATION

const fs = require("fs")

// To read a file
// fs.readFile(DEFAULT_JP_FILE_LOCATION, "utf8", (err, data) => {
//     if (err) {
//         console.error(err)
//         return
//     }
//     console.log(data)

//     // To write to a file
//     fs.writeFile(DEFAULT_JP_FILE_LOCATION, "Your content here", (err) => {
//         if (err) {
//             console.error(err)
//             return
//         }
//         //file written successfully
//     })
// })

try {
    // To read the file
    const data = fs.readFileSync(DEFAULT_JP_FILE_LOCATION, "utf8")
    console.log(data)

    // To write the file
    fs.writeFileSync(DEFAULT_JP_FILE_LOCATION, "Your content here")
    //file written successfully
} catch (err) {
    console.error(err)
}