class Utils {
  createUUID = function () {
    // http://www.ietf.org/rfc/rfc4122.txt
    function _p8(s = false) {
      var p = (Math.random().toString(16) + "000000000").substr(2, 8);
      return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
    }
    return _p8() + _p8(true) + _p8(true) + _p8();
  };
}

const utils = new Utils();

export { utils };
