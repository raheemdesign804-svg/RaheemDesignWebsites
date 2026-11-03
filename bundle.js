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

  // Replace <style>...</style> block with latest css
  const styleStart = html.indexOf('<style>');
  const styleEnd = html.indexOf('</style>');
  if (styleStart !== -1 && styleEnd !== -1) {
    html = html.substring(0, styleStart) + '<style>\n' + css + '\n</style>' + html.substring(styleEnd + 8);
  } else {
    const cssTarget = '<link rel="stylesheet" href="css/style.css">';
    if (html.includes(cssTarget)) {
      html = html.replace(cssTarget, '<style>\n' + css + '\n</style>');
    }
  }

  if (file === 'admin.html') {
    // admin.html has its own second <script> block, the first one is cms.js
    const firstScriptStart = html.indexOf('<script>');
    const firstScriptEnd = html.indexOf('</script>');
    if (firstScriptStart !== -1 && firstScriptEnd !== -1) {
      html = html.substring(0, firstScriptStart) + '<script>\n' + jsCms + '\n</script>' + html.substring(firstScriptEnd + 9);
    }
  } else {
    // For other files, replace the inlined script block with cms.js + main.js
    const scriptStart = html.indexOf('<script>');
    const scriptEnd = html.lastIndexOf('</script>');
    if (scriptStart !== -1 && scriptEnd !== -1) {
      const combinedJs = jsCms + '\n\n' + jsMain;
      html = html.substring(0, scriptStart) + '<script>\n' + combinedJs + '\n</script>' + html.substring(scriptEnd + 9);
    }
  }

  fs.writeFileSync(filePath, html, 'utf8');
  console.log('Re-bundled:', file);
});

console.log('All files updated successfully with latest CSS & JS!');
