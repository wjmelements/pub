Media = {
    isImg: function(fileName) {
        var periodIndex = fileName.lastIndexOf('.');
        var suffix = fileName.substr(periodIndex+1);
        switch (suffix) {
            case "jpg":
            case "jpeg":
            case "png":
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
            default:
                console.log("unknown content type for " + suffix);
                return;
        }

    }
}
