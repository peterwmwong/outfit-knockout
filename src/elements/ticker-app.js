import Event from '../models/github/Event';

Polymer('ticker-app',{
  ready(){
    this.githubEvents = Event.query({type:'user', user:'polymer'});
  },

  onCoreHeaderTransform(e){
    // custom transformation: scale header's title
    var titleStyle = this.$.titleText.style;
    var d = e.detail;
    var m = d.height - d.condensedHeight;
    var scale = Math.max(0.75, (m - d.y) / (m / 0.25)  + 0.75);
    titleStyle.webkitTransform = titleStyle.transform =
        'scale(' + scale + ') translateZ(0)';
  }

});
