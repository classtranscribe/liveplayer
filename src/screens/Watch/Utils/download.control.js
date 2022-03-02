
export const downloadControl = {
  // eslint-disable-next-line no-unused-vars
  async webVTT(path = '', lang = '', onSuccess, onError) {
    try {
      // fileDownload(data, `transcription-${lang.toLowerCase()}.vtt`);
      if (onSuccess) onSuccess();
    } catch (error) {
      if (onError) onError();
    }
  },

  epub() {},
};
