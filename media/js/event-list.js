var eventList = {
  attach: function(){
    $('li.event').each(function(index, item) {
      var currentItem = $(item);
      var id = $(currentItem).attr('data-id');

      $(currentItem).find('a.delete').on('click', function(ev) {
        ev.preventDefault();

        $.post('/event/' + id + '/delete', function(_, status, res) {
          if(res.status !== 200) return;

          currentItem.hide();
        });

      });

    });
  }
};
