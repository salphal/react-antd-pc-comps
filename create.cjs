const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

const [compName = 'demo'] = args;

let compPath = args[1];

/** 模版目录 */
const templateDirPath = path.resolve(__dirname, './lib/__template__');
/** 输出目录 */
const outputDirPath = path.resolve(__dirname, './lib');

if (!compName) {
  console.error('[ Error ]: Please check args[1]');
  process.exit(1);
}

if (compName && !compPath) {
  compPath = compName;
}

const replacements = {
  COMP_NAME: compName.length > 1 ? capitalizeFirstLetter(compName) : 'Template',
  COMP_PATH: compPath || 'template',
  compName: lowercaseFirstLetter(compName),
};

/**
 * 获取指定目录下所有文件的完整路径列表
 * @param dirPath {string} - 文件夹路径
 * @return {Promise<unknown>}
 */
async function getAllFilePathsByDirPath(dirPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, (err, fileNames) => {
      if (err) {
        reject(err);
        return;
      }
      const allFiles = [];
      (async function processFiles() {
        for (const fileName of fileNames) {
          const fullPath = path.join(dirPath, fileName);
          const stat = await fs.promises.stat(fullPath);
          if (stat.isDirectory()) {
            /** 暂时不处理子文件夹中的文件 */
            const nestedFiles = await getAllFilePathsByDirPath(fullPath);
            allFiles.push(...nestedFiles);
          } else {
            allFiles.push({
              fileName,
              fullPath,
            });
          }
        }
        resolve(allFiles);
      })();
    });
  });
}

/**
 * 替换模版文件中的变量
 * @param filePath {string} - 文件路径
 * @return {Promise<unknown>}
 */
async function replaceFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      for (const [key, value] of Object.entries(replacements)) {
        const regex = new RegExp(`\\$\\{${key}\\}`, 'g');
        data = data.replace(regex, value);
      }
      resolve(data);
    });
  });
}

/**
 * 将模版文件夹中的所有文件替换变量并输出到指定文件夹下
 * @param allFilePaths {Array<{fileName: string, fullPath: string}>} - 文件信息列表
 * @return {Promise<void>}
 */
async function convertAllFiles(allFilePaths) {
  if (!Array.isArray(allFilePaths) || !allFilePaths.length) return;

  const isCreatedDir = await createDir(outputDirPath, compPath);
  if (!isCreatedDir) return;

  for (let i = 0; i < allFilePaths.length; i++) {
    const { fileName, fullPath } = allFilePaths[i];

    if (!fileName || !fullPath) return;

    const content = await replaceFile(fullPath);
    const name = convertReallyFileName(fileName, compPath);

    const outputFullPath = path.join(outputDirPath, compPath, name);

    fs.writeFile(outputFullPath, content, 'utf-8', (err) => {
      if (err) {
        console.log(`[ Error ]: ${err}`);
      }
    });
  }
}

/**
 * 创建文件夹
 * @param folderPath {string} -
 * @param folderName {string} -
 * @return {Promise<unknown>}
 */
async function createDir(folderPath, folderName) {
  return new Promise(async (resolve, reject) => {
    const fullPath = path.join(folderPath, folderName);
    try {
      if (!fs.existsSync(fullPath)) {
        fs.mkdir(path.join(folderPath, folderName), (err) => {
          if (err) {
            console.error(`[ Error ]: Error creating folder: ${err}`);
            reject(err);
            return;
          }
          console.log(
            `[ Log ]: Folder created successfully at ${path.join(folderPath, folderName)}`,
          );
          resolve(1);
        });
      } else {
        clearAllOnDir(fullPath);
        console.log(`[ Log ]: Directory already exists: ${path.join(folderPath, folderName)}`);
        resolve(1);
      }
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * 清空文件夹下的所有文件
 * @param dirPath {string} - 文件夹路径
 */
function clearAllOnDir(dirPath) {
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    const filePath = `${dirPath}/${file}`;
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      clearAllOnDir(filePath);
    } else {
      fs.unlinkSync(filePath);
      console.log(`[ Log ]: Success delete ${file} file`);
    }
  });
}

/**
 * 将文件名第一个字母大写
 * @param fileName {string} - 文件名
 * @return {string}
 */
function capitalizeFirstLetter(fileName) {
  return fileName.replace(/(^\w)/, (match) => match.toUpperCase());
}

/**
 * 将文件名第一个字母小写
 * @param fileName {string} - 文件名
 * @return {string}
 */
function lowercaseFirstLetter(fileName) {
  return fileName.replace(/(^\w)/, (match) => match.toLowerCase());
}

/**
 * 替换模版文件名为真实文件名
 * @param fileName {string} - 文件名
 * @param compPath {string} - 文件路径
 * @return {string}
 */
function convertReallyFileName(fileName, compPath) {
  const name = fileName
    .replace(/(^[a-zA-Z]+)\./, (match) => (match === 'index.' ? 'index.' : `${compPath}.`))
    .replace(/(\.template$)/, '');
  console.log(`[ Log ]: Rename file "${fileName}" to "${name}"`);
  return name;
}

(async function create() {
  /** 获取所有模版文件信息列表 */
  const allFilePaths = await getAllFilePathsByDirPath(templateDirPath);

  if (!allFilePaths.length) {
    console.log('[ Error ]: File list is empty');
    return;
  }

  /** 转换模版文件 */
  await convertAllFiles(allFilePaths);
})();
