const fs = require('fs');
const path = require('path');

const directoryPath = __dirname;
const templateName = 'cafe-cozy';

function getCSSFile(directory, template) {
  const files = fs.readdirSync(directory);
  const cssFile = files.find(file => file === `${template}.css`);

  if (!cssFile) {
    throw new Error('CSS file not found.');
  }

  return cssFile;
}

const cssFile = getCSSFile(directoryPath, templateName);
const filePath = path.join(directoryPath, cssFile);

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  // Initialize result with the content of data
  let result = data;
  
  // Now replace the actual color hex codes in SVG URLs
  result = result.replace(/%23dd9833/gi, 'hsla(var(--accent-hsl)%2C%201)');
  result = result.replace(/%23353C2E/gi, 'hsla(var(--black-hsl)%2C%201)');

  // Existing replacements
  result = result.replace(/#FFFFFF/gi, 'hsla(var(--white-hsl), 1)');
  result = result.replace(/#F5F5F5/gi, 'hsla(var(--lightAccent-hsl), 1)');
  result = result.replace(/#F29C13/gi, 'hsla(var(--accent-hsl), 1)');
  result = result.replace(/#12203A/gi, 'hsla(var(--darkAccent-hsl), 1)');
  result = result.replace(/#0A1221/gi, 'hsla(var(--black-hsl), 1)');

  // Media query replacements
  result = result.replace(/@media @mobile/gi, '@media only screen and (max-width: 750px)');
  result = result.replace(/@media @tablet/gi, '@media only screen and (min-width:751px) and (max-width:1200px)');
  result = result.replace(/@media @tablet-strict/gi, '@media only screen and (min-width: 751px) and (max-width: 949px)');
  result = result.replace(/@media @tablet-desktop/gi, '@media only screen and (min-width: 751px)');
  result = result.replace(/@media @desktop/gi, '@media only screen and (min-width: 950px)');
  result = result.replace(/@media @desktop-strict/gi, '@media only screen and (min-width: 950px) and (max-width: 1199px)');
  result = result.replace(/@media @desktop-xl/gi, '@media only screen and (min-width: 1200px)');
  result = result.replace(/@media @awkward/gi, '@media only screen and (max-width:1350px) and (min-width:1000px)');

  // Font variable replacements
  result = result.replace(/@header/gi, 'var(--heading-font-font-family)');
  result = result.replace(/@body/gi, 'var(--body-font-font-family)');

  fs.writeFile(filePath, result, 'utf8', (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`CSS variables have been replaced successfully in ${cssFile}!`);
  });
});