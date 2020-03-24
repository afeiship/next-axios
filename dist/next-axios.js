/*!
 * name: @feizheng/next-axios
 * url: https://github.com/afeiship/next-axios
 * version: 3.0.0
 * date: 2020-03-24T09:17:41.969Z
 * license: MIT
 */

(function() {
  var global = global || window || self || Function('return this')();
  var axios = global.axios || require('axios');
  var nx = global.nx || require('@feizheng/next-js-core2');
  var contentType = nx.contentType || require('@feizheng/next-content-type');
  var nxStubSingleton = nx.stubSingleton || require('@feizheng/next-stub-singleton');
  var ERROR_MSG = '[nx.Axios]: Please implment the method!';

  var NxAxios = nx.declare('nx.Axios', {
    statics: nx.mix(null, nxStubSingleton()),
    methods: {
      axios: axios,
      init: function() {
        this.setDefaults();
        this.setRequestInterceptor();
        this.setResponseInterceptor();
        this.onInit();
      },
      onInit: function() {
        // @template method
      },
      onRequest: function() {
        // @template method
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
            if (self.isSuccess(response)) {
              return self.success(response);
            } else {
              self.error(response);
              return Promise.reject(response);
            }
          },
          function(error) {
            self.error(error);
            return Promise.reject(error);
          }
        );
      },
      isSuccess: function(inResponse) {
        return !!inResponse.success;
      },
      headers: function() {
        return { 'Content-Type': contentType('json') };
      },
      success: function(inResponse) {
        return this.data(inResponse);
      },
      error: function(inError) {
        console.log(ERROR_MSG, inError);
      },
      data: function(inResponse) {
        return inResponse;
      },
      request: function(inOptions) {
        this.onRequest(inOptions);
        return axios.request(inOptions);
      },
      'get,delete,head,post,put,patch': function(inMethod) {
        return function(inName, inData, inConfig) {
          var addtional = inMethod === 'get' ? { params: inData } : { data: inData };
          return this.request(
            nx.mix(
              {
                method: inMethod,
                url: inName
              },
              addtional,
              inConfig
            )
          );
        };
      }
    }
  });

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = NxAxios;
  }
})();

//# sourceMappingURL=next-axios.js.map
