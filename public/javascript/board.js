window.addEventListener('DOMContentLoaded', function() {

    let navURL = "";
    let category = "";
    let authentication = false;

    function httpGetRequest(url, responseType, method, data) {
      return new Promise((resolve, reject) => {
          try {
          const xhr = new XMLHttpRequest();
          const mth = method || "GET";
          console.log('mth:',mth);
          xhr.open(mth, url);
          (method === 'POST') && xhr.setRequestHeader("Content-Type", "application/json");
          console.log(url.split("?")[0]);
          xhr.responseType = responseType || "json";
          xhr.onerror = event => {
              reject(`Network error: ${event}`);
          };
          xhr.onload = () => {
              if (xhr.status === 200) {
              resolve({...xhr.response, url:url.split("?")[0], query : navURL});
              } else {
              reject(`XHR load error: ${xhr.statusText}`);
              }
          };
          console.log(data);
          xhr.send(data);
          } catch (err) {
          reject(err.message);
          }
      });
    };

    httpGetRequest('/auth', 'json', 'GET')
    .then( response => {
      if(response.result === 1) {
        authentication = true;
        const loginImg = document.querySelector('.header_right > a > img');
        loginImg.setAttribute('src', "/assets/iconmonstr-log-out-8-32.png");

        const login = document.querySelector('.header_right > a');
        login.setAttribute('id', '/auth/logout');
      }
    })
    .catch( err => {

    })

    const headerRight = document.querySelector('header > .header_right');
    const headerSearch = document.querySelector('.header_search > img');
    const wrapContent = document.querySelector('.wrap_content');
    const paginationContent = document.querySelector( '.pagination_content' );
    const gnb = document.querySelector('.wrap_gnb > .gnb ul');
   
    headerRight.addEventListener('click', function(target) {

      if ( authentication ) {

        httpGetRequest('/auth/logout')
        .then( response => {
          if(response.result === 1 ) {
            authentication = false;
            location.href = '/';
          }
        })
        .catch( err => {

        });

      } else {
        const content = document.querySelector('content');
        content.innerHTML = "";
        content.insertAdjacentHTML('afterbegin', getLoginForm());
        document.querySelector('.login_content input:last-child').addEventListener('click', function(target) {

        const data = {
          userid: document.querySelector('.login_content input:nth-child(1)').value,
          password : document.querySelector('.login_content input:nth-child(2)').value
        };

        httpGetRequest('/auth/login', 'json', 'POST', JSON.stringify(data))
        .then( response => {
          
          (response.result === 1 ) && (() =>{ 
            location.href = '/';
          })(); 
          console.log(response);
        })
        .catch( err => {
          console.log(err);
        });
        });
      }
    });

    headerSearch.addEventListener('click', function(target) {
      const search_txt = document.querySelector('.header_search > input');
      navURL = "query="+search_txt.value;
      httpGetRequest('/posts?'+navURL)
        .then( (result) => {
          paintPosts(result);
          paintPagination(result);
        });
    });

    gnb.addEventListener('click', function(target) {
      navURL = "";
      category = target.target.id;
      httpGetRequest('/posts'+category+'?'+navURL)
        .then( (result) => {
          
          paintPosts(result);
          paintPagination(result);
        });
    });

    wrapContent.addEventListener('click', function(target) {
      const element = target.target;
      console.dir(element);
      if(element.parentElement.className !== 'post_title') {
        return;
      }
      
      wrapContent.innerHTML = "";
      paginationContent.innerHTML = "";
    
      httpGetRequest('/auth/login')
        .then( (result) => {
          console.log(result);
          if(result.result !== 1) {
            wrapContent.insertAdjacentHTML('afterbegin', getLoginForm());

            document.querySelector('.login_content input:last-child').addEventListener('click', function(target) {

              const data = {
                userid: document.querySelector('.login_content input:nth-child(1)').value,
                password : document.querySelector('.login_content input:nth-child(2)').value
              };

              httpGetRequest('/auth/login', 'json', 'POST', JSON.stringify(data))
              .then( response => {
                (response.result === 1 ) && (() =>{ 
                  location.href = '/';
                 })(); 
              })
              .catch( err => {
                console.log(err);
              });
            });

          } else {
            wrapContent.insertAdjacentHTML('afterbegin', getMediaForm(encodeURI(element.innerText+'.mp4')));
          }
        }); 

    });

    paginationContent.addEventListener('click', function(target) {
      httpGetRequest(target.target.id)
        .then( (result) => {
          paintPosts(result);
          paintPagination(result);
        });
    });

    httpGetRequest('/posts')
    .then( (result) => {

      navURL = "";
      category = "";

      paintPosts(result);
      paintPagination(result);
    });

    const paintPosts = function( json ) {
      wrapContent.innerHTML = "";
      const ul = document.createElement('ul');
        json.items.forEach((item) => {
        ul.insertAdjacentHTML('beforeend', setPostContent(item));
      });
      wrapContent.appendChild(ul);
    }
    
    const paintPagination = function ( json ) {
    
      console.dir(json);
      paginationContent.innerHTML = "";

      const ul = document.createElement('ul');
      paginationContent.appendChild(ul);

      json.prev && ul.insertAdjacentHTML('beforeend', getPageBox(json.url + '?pageNo='+json.prev+'&'+json.query, '<<'));

      for( let i = json.first; i <= json.last; i++ ) {
        ul.insertAdjacentHTML('beforeend', getPageBox(json.url + '?pageNo='+i+'&'+json.query, i));
      }

      json.next && ul.insertAdjacentHTML('beforeend', getPageBox(json.url + '?pageNo='+json.next+'&'+json.query, '>>'));
    }
  });

  const getPageBox = function ( url, arrow) {
      return '<li> \
                <a href="#" id="'+url+'">'+arrow+'</a>\
              </li>';
  }

  const setPostContent = function( json ) {
    return '<li> \
      <div class="post_title"> \
        <a href="#">'+json.title+'</a> \
      </div>\
      <div class="post_summary"> \
      Billy\
      </div>\
      <div class="post_author">'+json.created+'</div>\
    </li>';
  }

  const getLoginForm = function() {
    return  '<div class="login_wrap">\
              <div class="login_form"> \
                <div class="login_header"> \
                  <h1>로그인</h1>         \
                </div>                      \
                <div class="login_content">     \
                    <input class="text_full" name="userid" type="text" placeholder="아이디">\
                    <input class="text_full" name="password" type="password" placeholder="비밀번호">\
                    <input name="autologin" type="checkbox">로그인 유지\
                    <input class="text_full" type="button" value="로그인">\
                </div> \
              </div>\
            </div>';
  }

  const getMediaForm = function(path) {

    const fullPath = '/stream/'+path;
    return '<div> \
              <video width="100%" height="auto" controls> \
                <source src="'+fullPath+'" type="video/mp4"> \
                </source>\
              </video>\
            </div>';
  }