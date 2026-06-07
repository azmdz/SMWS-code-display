const REPOSITORY_URL = 'https://github.com/azmdz/SMWS-code-display';

chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: REPOSITORY_URL });
});
