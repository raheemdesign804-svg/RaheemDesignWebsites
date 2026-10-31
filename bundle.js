const fs = require('fs');
const path = require('path');

const css = fs.readFileSync(path.join(__dirname, 'css', 'style.css'), 'utf8');
const jsCms = fs.readFileSync(path.join(__dirname, 'js', 'cms.js'), 'utf8');
const jsMain = fs.readFileSync(path.join(__dirname, 'js', 'main.js'), 'utf8');

const files = ['index.html', 'about.html', 'services.html', 'gallery.html', 'contact.html', 'admin.html'];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');

  // Inline CSS
  const cssTarget = '<link rel="stylesheet" href="css/style.css">';
  if (html.includes(cssTarget)) {
    html = html.replace(cssTarget, '<style>\n' + css + '\n</style>');
  }

  // Inline JS
  const cmsTarget = '<script src="js/cms.js"></script>';
  if (html.includes(cmsTarget)) {
    html = html.replace(cmsTarget, '<script>\n' + jsCms + '\n</script>');
  }

  const mainTarget = '<script src="js/main.js"></script>';
  if (html.includes(mainTarget)) {
    html = html.replace(mainTarget, '<script>\n' + jsMain + '\n</script>');
  }

  fs.writeFileSync(filePath, html, 'utf8');
  console.log('Bundled:', file);
});

console.log('All files are now self-contained with CSS and JS embedded!');
