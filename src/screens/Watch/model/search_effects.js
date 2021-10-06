import { elem } from 'utils';
import _ from 'lodash';
import {
  ARRAY_INIT,
  ARRAY_EMPTY,
  SEARCH_HIDE,
  SEARCH_BEGIN,
  SEARCH_RESULT,
} from '../Utils/constants.util';
import { shortcuts } from '../Utils/data';
import { isEarlier, isLater } from '../Utils/helpers';
/*
 // Function used to update `search` state
  updateSearch(search) {
    const newSearch = { ...this.search_, ...search };
    this.search_ = newSearch;
    this.setSearch(newSearch);
  }
  
  // in progress. need to return a list of transID
  async getInCourseResult(value) {
    const { offeringId } = setup.playlist();
    if (!offeringId) return [];
    const data = await setup.getPlaylists(offeringId)
    const ok = await setup.getPlaylist(data[1].id)
    return ok;
  }
*/
function getShortcutResults(value) {
  let shortcuts_ = shortcuts.map((catag) => catag.rows);
  shortcuts_ = _.flatten(shortcuts_);
  return false;
}
// Function used to get search results from videos in current offering
const getPlaylistResults = async (value, playlist) => {
  
}
// Function used to add <span> tag around the searched value in a text
function highlightSearchedWords(results = [], value = '', key = 'text') {
  return false;
}
// Function used to get search results from captions in current video
function getInVideoTransSearchResults(value, watch) {
  return false;
}
// Function used to get search results from captions in current offering
async function getInCourseTransSearchResults(value, playlist, lang) {
  return false;
}
export default {
  *search_open({ payload }, { call, put, select, take }) {
    const { watch } = yield select();
    if (watch.search.status !== SEARCH_HIDE) {
      elem.focus('watch-search-input');
      return;
    }
    const status = watch.search.hasResult ? SEARCH_RESULT : SEARCH_BEGIN;
    yield put({ type: 'setSearch', payload: { status } });
  },
  *search_close({ payload }, { put }) {
    yield put({ type: 'setSearch', payload: { status: SEARCH_HIDE } });
  },
  // Function used to get search results from captions and videos
  *search_getResults({ payload: value }, { call, put, select, take }) {
    if (!value) {
      return yield put({ type: 'resetSearch' })
    }
    const { watch } = yield select();
    // caption results in this video
    const {
      inVideoTransResultsEarlier,
      inVideoTransResultsLater,
    } = getInVideoTransSearchResults(value, watch);

    // shortcut results
    const shortcutResults = getShortcutResults(value);
    yield put({
      type: 'setSearch', payload: {
        value,
        status: SEARCH_RESULT,
        inVideoTransResults: [inVideoTransResultsEarlier, inVideoTransResultsLater],
        shortcutResults,
        playlistResults: ARRAY_INIT,
        inCourseTransResults: ARRAY_INIT,
      }
    });

    // playlist results
    const playlistResults = yield call(getPlaylistResults, value, watch.playlist);
    // caption results in this offering
    const inCourseTransResults =
      yield call(getInCourseTransSearchResults, value, watch.playlist, watch.currTrans?.language);
    yield put({ type: 'setSearch', payload: { inCourseTransResults, hasResult: true, playlistResults } });
    // send user action to logs
    // uEvent.filtertrans(value);
  }
}