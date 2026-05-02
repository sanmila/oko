const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');

const inputDir = path.join(__dirname, 'corrections');
const outputDir = path.join(__dirname, 'corrections_txt');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.docx'));

async function processFiles() {
    for (const file of files) {
        const inputPath = path.join(inputDir, file);
        const outputPath = path.join(outputDir, file.replace('.docx', '.txt'));
        try {
            const result = await mammoth.extractRawText({path: inputPath});
            fs.writeFileSync(outputPath, result.value);
            console.log(`Extracted: ${file}`);
        } catch (e) {
            console.error(`Error on ${file}:`, e.message);
        }
    }
}

processFiles();
