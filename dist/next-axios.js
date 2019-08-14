/*!
 * name: next-axios
 * url: https://github.com/afeiship/next-axios
 * version: 1.1.0
 * date: 2019-08-14T12:17:15.626Z
 * license: MIT
 */

(function() {
  var global = global || window || self || Function('return this')();
  var nx = global.nx || require('next-js-core2');
  var axios = global.axios || require('axios');
  var ERROR_MSG = '[nx.Axios]: Please implment the method!';
  var contentType = nx.contentType || require('next-content-type');
  var nxStubSingleton = nx.stubSingleton || require('next-stub-singleton');
  var CancelToken = axios.CancelToken;

  var NxAxios = nx.declare('nx.Axios', {
    statics: nx.mix(null, nxStubSingleton()),
    methods: {
      axios: axios,
      init: function() {
        this.setDefaults();
        this.setRequestInterceptor();
        this.setResponseInterceptor();
      },
      setDefaults: function(inOptions) {
        var headers = this.headers();
        var options = inOptions || {
          baseURL: './',
          timeout: 30000,
          headers: {
            common: headers,
            get: headers,
            post: headers,
            delete: headers,
            put: headers,
            patch: headers,
            head: headers
          }
        };
        nx.mix(axios.defaults, options);
      },
      setRequestInterceptor: function() {},
      setResponseInterceptor: function() {
        var self = this;
        axios.interceptors.response.use(
          function(response) {
            return self.success(response);
          },
          function(error) {
            self.error(error);
            // nx.error(error);
          }
        );
      },
      headers: function() {
        return { 'Content-Type': contentType('json') };
      },
      success: function(inResponse) {
        return this.toData(inResponse);
      },
      error: function(inError) {
        console.log(ERROR_MSG, inError);
      },
      toData: function(inResponse) {
        return inResponse;
      },
      isSuccess: function(inResponse) {
        return !inResponse.errorCode;
      },
      request: function(inOptions) {
        var resource = inOptions.resource;
        var source = CancelToken.source();
        var additional = resource ? { cancelToken: source.token } : null;
        var options = nx.mix(additional, inOptions);
        // resource:[ context, path ]
        resource && nx.set(resource[0], resource[1], { destroy: source.cancel });
        return axios.request(options);
      },
      'get,delete,head,post,put,patch': function(inMethod) {
        return function(inName, inData, inConfig) {
          return axios[inMethod](inName, inData, inConfig);
        };
      }
    }
  });

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = NxAxios;
  }
})();

//# sourceMappingURL=next-axios.js.map
