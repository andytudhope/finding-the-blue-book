(() => {
    const scriptUrl = document.currentScript.src;
    const names = 'one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty twenty-one'.split(' ');
    let snapshot;
    window.loadChapter = async function (number, iframeId) {
        const iframe = document.getElementById(iframeId);
        if (!iframe || iframe.tagName !== 'IFRAME') return;
        try {
            snapshot ||= fetch(new URL('../data/chapters.json', scriptUrl)).then(response => {
                if (!response.ok) throw new Error('Chapter mapping unavailable');
                return response.json();
            });
            const chapter = (await snapshot).chapters[names[number - 1]];
            if (!chapter || chapter.chapter !== number) throw new Error('Unknown chapter');
            const url = new URL(chapter.url);
            if (url.protocol !== 'https:' || url.username || url.password) throw new Error('Invalid chapter URL');
            document.getElementById(`${iframe.id}-error`)?.remove();
            iframe.src = url.href;
        } catch (error) {
            snapshot = undefined;
            if (!document.getElementById(`${iframe.id}-error`)) {
                const message = document.createElement('p');
                message.id = `${iframe.id}-error`;
                message.setAttribute('role', 'alert');
                message.textContent = 'This chapter could not be loaded. Please reload the page to try again.';
                iframe.before(message);
            }
            console.error('Could not load chapter', number, error);
        }
    };
    document.querySelectorAll('iframe[id]').forEach(iframe => {
        const number = names.indexOf(iframe.id) + 1;
        if (number) window.loadChapter(number, iframe.id);
    });
})();
