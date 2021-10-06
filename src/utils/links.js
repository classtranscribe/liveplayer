import { env } from 'utils/env';
import { uurl } from './use-url';


export class ClassTranscribeLinks {
  /**
   * Set document.title
   * @param {String} title title to set document.title
   * @param {Boolean} replace true if replace the whole document.title
   */
  title(title, replace = false) {
    let completeTitle = '';
    if (!replace) {
      completeTitle = title ? `${title} | ClassTranscribe` : 'ClassTranscribe';
    }

    document.title = completeTitle;
  }

  // //////////////////////////////////////////////////////////////////////////////
  // Links to pages of ClassTranscribe
  // //////////////////////////////////////////////////////////////////////////////

  /**
   * return current location
   */
  currentUrl() {
    return window.location.href;
  }

  /**
   * to `/`
   */
  home() {
    return '/';
  }

  /**
   * to `/watch?id=<media_id>[&begin=<begin_time>`
   * @param {String} id - media id
   * @param {Object} params - search query
   */
  watch(id, params = {}) {
    if (params.begin) {
      params.begin = Math.floor(Number(params.begin));
      if (params.begin <= 0) {
        params.begin = undefined;
      }
    }
    return `/video${uurl.createSearch({ id, ...params })}`;
  }

  /**
   * to `/404`
   */
  notfound404() {
    return '/404';
  }
  
  /**
   * to `mailto:classtranscribe@illinois.edu`
   */
  contactUs() {
    return 'mailto:classtranscribe@illinois.edu';
  }
}

export const links = new ClassTranscribeLinks();
