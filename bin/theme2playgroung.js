const { execSync } = require('child_process');
const fs = require('fs');
const ldjs = require('ldjson-stream');
const path = require('path');
const xmlJson = require('xml-json');

const exts = {
  svgz: '.svgz',
  theme: '.theme',
};
const inputDataDir = path.resolve('orig', 'ktuberling-15.08.2');
const playgroundFile = path.resolve(
  'src',
  'assets',
  'data',
  'playgrounds.json',
);
const playgrounds = [];
const picsFiles = fs.readdirSync(path.resolve(inputDataDir, 'pics'));


const copySvg = (origFile, svgFile, isZipped) => {
  const cmd = isZipped ?
    `gunzip -c ${origFile} > ${svgFile}` : `cp ${origFile} ${svgFile}`;

  execSync(cmd);
};


const parseDesktopFile = (fileName) => {
  const ret = {
    localization: {},
    name: null,
  };

  const content = fs
    .readFileSync(path.resolve(inputDataDir, 'pics', fileName), 'utf8');

  content
    .split('\n')
    .map(line => line.trim().split('='))
    .map((str) => {
      const translation = str[1];

      if (0 < str.length) {
        if ('Name' === str[0]) {
          ret.name = translation;
        } else {
          const lang = /^Name\[(.+)\]$/gi.exec(str[0]);
          if (lang) {
            ret.localization[lang[1]] = translation;
          }
        }
      }
      return undefined;
    });

  return ret;
};


const isFileType = (name, ext) =>
  name.length - ext.length === name.lastIndexOf(ext);


const parseThemeFile = (file, cont) => {
  const themeFile = path.resolve(inputDataDir, 'pics', file);

  fs.createReadStream(themeFile)
    .pipe(xmlJson('playground'))
    .pipe(ldjs.serialize())
    .on('data', (data) => {
      const json = JSON.parse(data);
      const { gameboard } = json;
      const isZipped = isFileType(gameboard, exts.svgz);
      const svgFile = isZipped ?
        gameboard.substr(0, gameboard.length - 1) : gameboard;
      const desktop = parseDesktopFile(json.desktop);

      copySvg(
        path.resolve(inputDataDir, 'pics', gameboard),
        path.resolve('src', 'assets', 'data', 'svg', svgFile),
        isZipped,
      );

      cont({
        bgcolor: json.bgcolor,
        file: svgFile,
        items: json.object,
        localization: desktop.localization,
        name: desktop.name,
      });
    });
};


const parseTheme = (ind) => {
  if (ind < picsFiles.length) {
    const fileName = picsFiles[ind];

    if (true === isFileType(fileName, exts.theme)) {
      parseThemeFile(fileName, (playground) => {
        playgrounds.push(playground);
        parseTheme(ind + 1);
      });
    } else {
      parseTheme(ind + 1);
    }
  } else {
    fs.writeFileSync(playgroundFile, JSON.stringify(playgrounds, 0, 2));
  }
};


parseTheme(0);
