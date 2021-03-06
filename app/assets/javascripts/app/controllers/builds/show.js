Travis.Controllers.Builds.Show = SC.Object.extend({
  buildBinding: 'parent.build',
  repositoryBinding: 'parent.repository',

  init: function() {
    SC.run.later(this.updateTimes.bind(this), Travis.UPDATE_TIMES_INTERVAL);
    var self = this;

    this.view = Travis.View.create({
      controller: this,
      repositoryBinding: 'controller.repository',
      contentBinding: 'controller.build',
      matrixBinding: 'controller.matrix',
      templateName: 'app/templates/builds/show',
    });

    this.set('matrix', SC.ArrayProxy.create({ parent: this, contentBinding: 'parent.build.matrix' }));
  },

  destroy: function() {
    this.view.$().remove();
    this.view.destroy();
  },

  updateTimes: function() {
    var build  = this.get('build');
    if(build) build.updateTimes();

    var matrix = this.getPath('build.matrix');
    if(matrix) $.each(matrix.toArray(), function(ix, build) { build.updateTimes() }.bind(this));

    SC.run.later(this.updateTimes.bind(this), Travis.UPDATE_TIMES_INTERVAL);
  },

  _buildObserver: function() {
    if(this.getPath('build.isReady') && this.getPath('build.matrix.length') == 0 && this.getPath('build.log') === null) {
      this.get('build').refresh();
    }
  }.observes('build')
});
