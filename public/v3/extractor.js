const fs = require('fs');
const path = require('path');
const sourceMap = require('source-map');

async function extractSources(mapFilePath, outputDir) {
    const mapContent = JSON.parse(fs.readFileSync(mapFilePath, 'utf8'));
    const consumer = await new sourceMap.SourceMapConsumer(mapContent);

    consumer.sources.forEach((source) => {
        const sourceContent = consumer.sourceContentFor(source);
        if (sourceContent) {
            const sourcePath = path.join(outputDir, source);
            fs.mkdirSync(path.dirname(sourcePath), { recursive: true });
            fs.writeFileSync(sourcePath, sourceContent.includes("use") ? `"use client";\n${sourceContent}`:sourceContent, 'utf8');
        }
    });

    consumer.destroy();
}

const [mapFilePath, outputDir] = process.argv.slice(2);

if (!mapFilePath || !outputDir) {
    console.error('Usage: node extract-sources.js <path/to/source-map.js.map> <output/dir>');
    process.exit(1);
}

extractSources(mapFilePath, outputDir).then(() => {
    console.log('Extraction complete!');
}).catch((error) => {
    console.error('Error extracting sources:', error);
});
