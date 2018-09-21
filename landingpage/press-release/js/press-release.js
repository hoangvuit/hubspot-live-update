var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    host: 'https://www.youtube.com',
      videoId: 'wigQBRwvYGA',
      events: {
        'onReady': onPlayerReady
      }
  });
}

function onPlayerReady(event) {
  $('#play-btn').on('click', function(e){
    e.preventDefault();
    $(this).hide();
    event.target.playVideo();
  });
}
