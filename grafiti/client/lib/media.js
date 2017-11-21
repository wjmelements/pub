Media = {
    isImg: function(fileName) {
        var periodIndex = fileName.lastIndexOf('.');
        var suffix = fileName.substr(periodIndex+1);
        switch (suffix) {
            case "jpg":
            case "jpeg":
            case "png":
            case "webp":
            case "ico":
                // TODO add more
                return true;
            default:
                return false;
        }
    },
    contentType(fileName) {
        var periodIndex = fileName.lastIndexOf('.');
        var suffix = fileName.substr(periodIndex+1);
        switch (suffix) {
            // TODO add more
            case "jpg":
            case "jpeg":
                return "image/jpeg";
            case "png":
                return "image/png";
            case "webp":
                return "image/webp";
            case "ico":
                return "image/x-icon";
            default:
                console.log("unknown content type for " + suffix);
                return;
        }

    },
    contentHelp(fileName) {
        var periodIndex = fileName.lastIndexOf('.');
        var suffix = fileName.substr(periodIndex+1);
        switch (suffix) {
          case "webp":
            return " WebP is state-of-the-art image compression from Google. Ensure your browser supports WebP."
          default:
            return "";
        }
    }
}
