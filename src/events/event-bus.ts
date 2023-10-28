export const eventBus = {
  on(event: string, callback: (data: any) => void) {
    // @ts-ignore
    document.addEventListener(event, (e) => callback(e.detail));
  },

  dispatch(event: string, data: any) {
    document.dispatchEvent(new CustomEvent(event, { detail: data }));
  },

  remove(event: string, callback: (data: any) => void) {
    document.removeEventListener(event, callback);
  },
};
