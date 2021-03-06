/**
 * 
 * Utilities for the ClassTranscribe FrontEnd
 * 
 */
import { v4 as uuid } from 'uuid';
// import * as loggerToExport from './logger';
// export const logger = loggerToExport;
export const user = {}
export { env } from './env';
export { CTPrompt, prompt } from './prompt';
export { elem } from './use-elem';
export { uurl } from './use-url';
export { links } from './links';
export { default as timestr } from './use-time';
export { default as CTError, InvalidDataError } from './use-error';

export * from './constants';

export function _buildID(preflix, id, delimiter='-') {
  return (preflix ? `${preflix}${delimiter}` : '') + (id || uuid());
}

/**
 * Function used to convert a data array to options for selections
 * @param {Any[]} array - source for the options
 * @param {String} tag - prefix tag for each item
 */
export function _getSelectOptions(array, tag) {
  if (!Array.isArray(array)) return [];
  const options = [];
  array.forEach((item) => {
    if (!item || !item.id) return;
    let text = '';
    if ((tag === 'depart' || tag === 'term') && item.uniName) {
      text = `${item.name} (${item.uniName})`;
    } else {
      text = item.name || tag + item.courseNumber;
    }
    options.push({ text, value: item.id });
  });
  return options;
}

/**
 * Copy text to clipboard
 * @param {String} text - text to be copied
 * @returns {Boolean} - return true if successed
 */
export async function _copyTextToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy the text to clipboard.');
    return false;
  }
}

export function _readFileAsBinary(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function(e) {
      // binary data
      resolve(e.target.result);
    };
    reader.onerror = function(e) {
      // error occurred
      reject(`Error : ${ e.type}`);
    };
    reader.readAsBinaryString(file);
  });
}
