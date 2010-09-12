// Extensions to the native objects.
// Author: Chungmin Lee (lemonedo@gmail.com)
// Date: 2010-07-21 00:26:43 +0900

var lang = {

Array: {
    // from MDC
    /**
     * @param e {object} element to locate in the array
     * @param from {object} index at which to begin the search
     * @return {number} the first index at which a given element can be fouond
     *     in the array, or -1 if it is not present
     */
    indexOf: function (e, from) {
        var len = this.length >>> 0;
        // Number(from) || 0 -- not work in RhinoUnit 1.2.1
        var from = from ? Number(from) : 0;
        from = (from < 0) ? Math.ceil(from) : Math.floor(from);
        if (from < 0)
            from += len;
        for (; from < len; from++)
            if (from in this && this[from] === e)
                return from;
        return -1;
    },
    peek: function () {
        return this[this.length - 1];
    }
}

};


if (!Array.prototype.indexOf)
    Array.prototype.indexOf = lang.Array.indexOf;
if (!Array.prototype.peek)
    Array.prototype.peek = lang.Array.peek;
