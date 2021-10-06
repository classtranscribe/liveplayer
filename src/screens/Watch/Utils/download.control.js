
export const downloadControl = {
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
