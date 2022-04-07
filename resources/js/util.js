function openExternalLink(url) {
    var s = window.open(url, '_blank');

    if (s && s.focus) {
        s.focus();
    }
    else if (!s) {
        window.location.href = url;
    }
}

export { openExternalLink };