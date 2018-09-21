(function ($) { 
  $(document).ready(function(){
    var saveArticle = function(postID){
      var savedArticles = $.cookie('saved-articles') || '';
      savedArticles += postID + '-';
      $.cookie('saved-articles', savedArticles, { path: '/' });
    };
    var unsaveArticle = function(postID){
      var savedArticles = $.cookie('saved-articles');
      var modified = savedArticles.replace(postID + '-', '');
      $.cookie('saved-articles', modified, { path: '/' });
    };
    var loadSavedArticles = function(){
      var savedArticleIDs =  $.cookie('saved-articles');
      if (savedArticleIDs){
        var articles = savedArticleIDs.split('-');
        $.each(articles, function(){
          var article = this;
          if (article !== ''){
            $('#' + article).addClass('saved').find('.save-post').addClass('unsave-post');
          }
        });
      }
    };

    // load saved articles
    loadSavedArticles();

    // header
    $('.hamburger').click(function(e) {
      e.preventDefault();
      $('body').toggleClass('mobile-nav-opened');
    });
    $('.main-mobile-nav-container').find('.has-sub > a').off('click').on('click', function(e){
      e.preventDefault();
      $(this).closest('li').toggleClass('expanded');
    });

    // footer
    $('#site-footer').find('ul li:first-child').off('click').on('click', function(e){
      $(this).closest('ul').toggleClass('expanded');
    });

    // content
    $('#popular-posts').slick({
      dots: true,
      infinite: true,
      speed: 500,
      autoplaySpeed: 5000,
      autoplay: true,
      cssEase: 'ease',
      arrows: false,
      fade: true,
      lazyLoad: 'ondemand'
    });

    $('#search-tool').find('a').on('click', function(){
      $('body').toggleClass('show-search-box');
      document.getElementById("search-post").focus();
      return false;
    });

    $('body').on('click', '.save-post a', function(){
      var postID;
      var container = $(this).closest('.post').length > 0 ? $(this).closest('.post') : $('.post-tools-wrapper');
      if ($(this).parent().hasClass('unsave-post')){
        container.toggleClass('saved');
        $(this).parent().removeClass('unsave-post');
        postID = container.attr('id');
        unsaveArticle(postID);
        if (window.location.href.indexOf('tag/saved-articles') !== -1){
          var post = $(this).closest('.post');
          post.addClass('zoom-out');
          window.setTimeout(function(){
            post.remove();
          }, 290);
        }
      } else {
        container.toggleClass('saved');
        $(this).parent().addClass('unsave-post');
        postID = container.attr('id');
        saveArticle(postID);
      }
      var savedArticles = $.cookie('saved-articles') || '';
      var articles = savedArticles.split('-');
      num_saved = articles.filter(function(x){
        return (x !== (undefined || null || ''));
      });
      $('.num_saved').text(" ("+num_saved.length+")");
      return false;
    });

    var stickedPoint = $('.intro-block').offset().top + $('.intro-block').height();
    $(window).on('scroll', function(){
      var scrollTop = $(window).scrollTop();
      if (scrollTop + 76 >= stickedPoint){
        $('.main-nav-container').addClass('sticked');
        $('body').removeClass('show-table-of-contents');
      } else {
        $('.main-nav-container').removeClass('sticked');
        $('body').addClass('show-table-of-contents');
      }
    });

    // load 6 thumbnails
    var posts = $('.posts-list').find('.post');
    posts.each(function(){
      var blogPost = $(this);
      var imgSrc = $(blogPost.find('noscript').text()).get(0).src;
      blogPost.find('.img').css('background-image', 'url(' + imgSrc + ')');
    });

    // share btn for mobile
    $('.share-btn a').on('click', function(e){
      e.stopPropagation();
      e.preventDefault();
      $('body').toggleClass('show-share-menu');
    });
    $('body').on('click', function(){
      $(this).removeClass('show-share-menu');
    });

    // table of content
    var toc = $('#table-of-contents');
    if (toc.length > 0){
      toc.find('a[data-role="trigger-toc"]').on('click', function(e){
        e.preventDefault();
        $('body').toggleClass('show-table-of-contents');
      });

      var h2s = $('.post-body').find('h2');
      if (h2s.length > 0){
        var tocContainer = toc.find('ul');
        h2s.each(function(){
          var h2 = $(this);
          var tocItem = $('<li><a href="#">' + h2.text() + '</a></li>');
          tocItem.on('click', function (e) { 
            e.preventDefault();
            $('html, body').animate({
              scrollTop: h2.offset().top - 80
            });
          });
          tocContainer.append(tocItem);
        });
        toc.show();
        // active table of content item
        var h2OffsetArr = [];
        $(window).on('resize', function(){
          h2OffsetArr = h2s.map(function(){
            return $(this).offset().top;
          });
        }).on('scroll', function(){
          var scrollTop = $(window).scrollTop();
          h2OffsetArr.each(function(index, offset){
            if (offset < scrollTop + 80){
              tocContainer.find('li').removeClass('active');
              $(tocContainer.find('li').get(index)).addClass('active');
            }
          });
        }).trigger('resize');
      }
    }

    // popup
    $('#feedback-btn').on('click', function(e){
      e.preventDefault();
      $('body').addClass('show-feedback-popup');
    });
    $('#feedback-popup').find('[data-action="close-popup"]').on('click', function(e){
      e.preventDefault();
      $('body').removeClass('show-feedback-popup');
    });
    $('#feedback-popup').on('click', function(){
      $('body').removeClass('show-feedback-popup');
    }).find('.popup-content').on('click', function(e){
      e.stopPropagation();
    });
    $(document).on('keyup', function(e){
      if (e.keyCode === 27){
        $('body').removeClass('show-feedback-popup');
      }
    });
  });
})(jQuery);

// load more function
(function($){
  var savedArticles = localStorage.getItem('saved-articles') || '';
  var currentPage = 2;
  var postPerPage = 6;
  var nextPageUrl = $(document).find('link[rel="next"]');
  
  var blogOutOfPosts = false;
  
  var fetching = false;
  
  var postContainer = $("#recent-posts");
  var loadMoreBtn = $('.load-more a');

  if (nextPageUrl.length === 0){
    loadMoreBtn.hide();
  }
 
  loadMoreBtn.on('click', function(e){
    e.preventDefault();
    loadMoreBtn.addClass('loading');
    if(fetching){
      return;
    }
    
    fetch();
  });
 
  var fetch = function(){
    fetching = true;
    var nextPageHref = nextPageUrl.attr('href');
    var ajaxUrl = nextPageHref.substr(0, nextPageHref.lastIndexOf('/') + 1) + currentPage;

    $.get(ajaxUrl, function(data){
      loadMoreBtn.removeClass('loading');
      var page = $(data);
      globalPage = page;
      var posts = page.find('.recent-posts .post');

      // There were no posts
      var nextUrl = page.filter('link[rel="next"]');
      if (nextUrl.length === 0){
        blogOutOfPosts = true;
        loadMoreBtn.hide();
      }

      posts.each(function(){
        var blogPost = $(this);
        var imgSrc = $(blogPost.find('noscript').text()).get(0).src;
        blogPost.addClass('loaded').find('.img').css('background-image', 'url(' + imgSrc + ')');
        var id = blogPost.attr('id');
        if (savedArticles.indexOf(id) !== -1){
          blogPost.addClass('saved').find('.save-post').addClass('unsave-post');
        }
        postContainer.append(blogPost);
      });
      
      setTimeout(function(){
        currentPage += 1;
        fetching = false;
      }, 100);
    });
  };
})(jQuery);
