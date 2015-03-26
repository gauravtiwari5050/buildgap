creatorApp.factory('Page',function($http,$timeout,Header,Content,TabbedFooter){
    var Page = function(scope,widgets,page_uniq_id){
      var self =  this;
      self.scope = scope;
      self.timeout = $timeout;
      self.page_uniq_id = page_uniq_id;
      self.widgets = widgets;
      self.pageJquery = null;
      self.pageContents = null;
      self.pageData = _.find(self.scope.appData.app.pages,function(page){
        return page.bg_uniq_id === self.page_uniq_id; 
       });
      self.header = new Header();
      //self.pageContent = new Content();
      //self.pageFooter = new TabbedFooter();
      self.setupWatcher();
    }
    Page.prototype.setupWatcher = function(){
      var self = this;
      self.scope.$watch(
        function(){
          return _.find(self.scope.appData.app.pages,function(page){
            return page.bg_uniq_id === self.page_uniq_id; 
          });
        },
        function(newVal,oldVal){
          //TODO act here 
      },
      true
      );
    }

    Page.prototype.setup = function(callback){
      var self = this;
      async.waterfall([
        //get Data first
        function(cb){
            self.loadMainIframe(cb); 
        },
        function(cb){
            self.setupMainIframeData(cb); 
        }
      ],
      function(err,result){
        if(err != null || err != undefined){
          callback(null);
        } else {
          callback(null);
        }
      });
    }
    Page.prototype.loadMainIframe  = function(callback){
      var self = this;
      //TODO what if loadIframe fails ?
      var iframe_html = renderTemplate('device_page_iframe_template', {bg_uniq_id: self.pageData.bg_uniq_id});
      $('#device_iframe_holder').append(iframe_html);
      console.log("Waiting for device page iframe load");
      $('#device_page_iframe_' + self.pageData.bg_uniq_id).load(function(){
        callback(null);
      });
    };
    Page.prototype.setupMainIframeData = function(callback){ //TODO error handling
      var self = this;
      self.pageJquery = document.getElementById('device_page_iframe_' + self.pageData.bg_uniq_id).contentWindow.jQuery; 
      self.pageContents = $( '#device_page_iframe_' + self.pageData.bg_uniq_id ).contents();
      //TODO null checks for above variables
      callback();
    };
    Page.prototype.loadMainContents = function(callback){
      var self = this;

      //TODO use a template for this ?
      this.pageContents.find('body').html('<div data-bgmanage-type="page" data-role="page" data-bg-uniq-id="' +  self.data.bg_uniq_id+ '" id="' + 'DEVICE_PAGE'+ '"></div>');
        async.series(
          [
            function(cb){
              //CONTINUE
              self.header.load(self.data.bg_uniq_id,self.pageJquery,self.pageContents,self.data['header'],cb ); 
              //cb(null);
            }

          ],
      function(){
        self.pageJquery('#' + 'DEVICE_PAGE').page({theme:self.data.data_theme_swatch});
        self.pageJquery.mobile.changePage('#' + 'DEVICE_PAGE');
        callback();
        
        });  
    }
    return Page;
});
