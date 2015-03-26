MainController = function($scope,$http,DataAccessObject,Page){
  var self = this; 

  // scope variables
  self.dao = new DataAccessObject('document_id','theme_id');
  self.Page = Page;
  self.scope = $scope;
  self.scope.appData  = null;
  self.scope.currentView  = 'CREATOR';
  self.widgets = {};
  
  //TODO move this to a seperate function ? 
  //main ui logic
  async.waterfall([
    //get Data first
    function(callback){
        self.initData(callback); 
    },
    function(callback){
      self.setupViews(callback);
    }
  ],
  function(err,result){
    if(err != null || err != undefined){
      //TODO handle error here
    } else {
      console.log("Complete");
    }
  });
};
MainController.prototype.setupViews = function(callback){
  var self = this;
  console.log('App Data is');
  console.log(self.scope.appData);
  async.eachSeries(self.scope.appData.app.pages,function(pageData,callback){
    self.widgets[pageData.bg_uniq_id] = (new self.Page(self.scope,self.widgets,pageData.bg_uniq_id));
    self.widgets[pageData.bg_uniq_id].setup(callback);
  
  }, function(err){
      if(self.scope.appData.app.pages.length > 0){
        self.switchToPage(self.scope.appData.app.pages[0].bg_uniq_id);
      }
    callback(err); 
  }); 
}
MainController.prototype.switchToPage = function(page_bg_uniq_id) {
  var self = this;
  $('.device_iframe').hide();
  self.activePage = page_bg_uniq_id;
  ACTIVE_PAGE_BG_UNIQ_ID = self.activePage;
  $('#device_page_iframe_' + page_bg_uniq_id).show();
};

MainController.prototype.initData = function(callback){
    var self = this;
    self.dao.getData().then(function(){
      self.scope.appData = self.dao.data;
      callback(null);
    },function(err){
      callback(err);
    });
}

creatorApp.controller('MainController',MainController);
