import _ from 'lodash';
import { isSafari, isIPad13, isIPhone13 } from 'react-device-detect';


export default {
    media_: null,
    playlist_: {},
    playlists_: {},
    externalFunctions: {},
    init(props, dispatch) {
        this.dispatch = dispatch;
    },

    /**
     * Functions for setting data
     * ************************************************************************
     */

    /**
     * Helper functions
     * ************************************************************************
     */

    findNeighbors(mediaId, playlist) {
        const { medias } = playlist || {};
        if (!medias) return {};
        // medias = (medias || []).slice().reverse()
        const currIdx = _.findIndex(medias, { id: mediaId });
        const nextIdx = currIdx + 1;
        const prevIdx = currIdx - 1;
        const next = medias[nextIdx] || null;
        const prev = medias[prevIdx] || null;
        return { next, prev };
    },

    /**
     * Funcitons for setup watch page
     * ************************************************************************
     */


    async getPlaylist(playlistId) {
        return false;
    },

    async getPlaylists(offeringId) {
        return false;
    },

    async getMediaWatchHistories(mediaId) {
        return false;
    },
};
