const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $("#progress");
const nextSongBtn = $(".btn-next");
const prevSongBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playList =  $(".playlist");
const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  songs: [
    {
      name: "500 Miles",
      singer: "Justin Timberlake",
      path: "https://audio.jukehost.co.uk/60r5S2rNFQpCSnKirIGNlzveSs6klXAv",
      image: "https://i1.sndcdn.com/artworks-000112928659-83o8mj-t500x500.jpg",
    },
    {
      name: "Tiễn Em Lần Cuối",
      singer: "Trung Hành",
      path: "https://audio.jukehost.co.uk/aLNQRm4NYccoi6rXztg3ED2IiBBq7W5d",
      image:
        "https://avatar-ex-swe.nixcdn.com/singer/avatar/2014/03/31/3/9/8/6/1396249140056_600.jpg",
    },
    {
      name: "LK Người Tình Ngàn Dặm",
      singer: "Ngọc Lan Trang",
      path: "https://audio.jukehost.co.uk/LIAT2DoIiPbvxadiX6CdtPeuh8mWk7Ol",
      image:
        "https://images2.thanhnien.vn/zoom/700_438/528068263637045248/2023/7/9/ngoc-lan-trang-1688897249072488991546-216-0-1069-1364-crop-1688897495755158013134.jpeg",
    },
    {
      name: "Self Control",
      singer: "Laura Branigan",
      path: "https://audio.jukehost.co.uk/QdT6rBnVGgliy48Hw6u8UrjgyNkHzUgo",
      image: "https://www.djprince.no/covers/laura.jpg",
    },
    {
      name: "Cheri Cheri Lady",
      singer: "Modern Talking",
      path: "https://audio.jukehost.co.uk/G3UvJpmWYX90v2YJaZvAnk7AvFxv7576",
      image:
        "https://photo-resize-zmp3.zmdcdn.me/w320_r1x1_jpeg/cover/c/a/b/5/cab58a4408a7c356d5db85b1fa31487f.jpg",
    },
    {
      name: "Brother Louie",
      singer: "Modern Talking",
      path: "https://audio.jukehost.co.uk/nl1jkex593GkE0fhRh1BkJqaexRBmmER",
      image:
        "https://photo-resize-zmp3.zmdcdn.me/w320_r1x1_jpeg/cover/c/a/b/5/cab58a4408a7c356d5db85b1fa31487f.jpg",
    },
    {
      name: "You are My Heart, You are My Soul",
      singer: "Modern Talking",
      path: "https://audio.jukehost.co.uk/Ov9BVMZmWRW8Vs54pZZqf48baFBvhdmt",
      image:
        "https://photo-resize-zmp3.zmdcdn.me/w320_r1x1_jpeg/cover/c/a/b/5/cab58a4408a7c356d5db85b1fa31487f.jpg",
    },
  ],
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
            <div class="song ${index === this.currentIndex ? 'active' : ''} " data-index" = ${index}">
                <div class="thumb"  style = "background-image:url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `;
    });
   playList.innerHTML = htmls.join("");
  },

  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },

  handldeEvents: function () {
    const cdWidth = cd.offsetWidth;
    const _this = this;

    //Xử lý CD quay /dừng
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000, //10s
      iterations: Infinity,
    });
    cdThumbAnimate.pause();
    //Xử lý phóng to thu nhỏ CD
    document.onscroll = function () {
      const scrollTop = window.scrollY.toFixed();
      const newCdWidth = cdWidth - scrollTop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    //Xử lý pause, play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      audio.onplay = function () {
        _this.isPlaying = true;
        player.classList.add("playing");
        cdThumbAnimate.play();
      };
      audio.onpause = function () {
        _this.isPlaying = false;
        player.classList.remove("playing");
        cdThumbAnimate.pause();
      };

      //Khi triến độ bài hát thay đổi
      audio.ontimeupdate = function () {
        if (audio.duration) {
          const progressPercent = Math.floor(
            (audio.currentTime / audio.duration) * 100
          );
          progress.value = progressPercent;
        }
      };

      //Xử lý khi tua song
      progress.onchange = function (e) {
        const seekTime = (audio.duration / 100) * e.target.value;
        audio.currentTime = seekTime;
      };

      //Next song
      nextSongBtn.onclick = function () {
        if (_this.isRandom) {
          _this.playRandomSong();
        } else {
          _this.nextSong();
        }
        audio.play();
        _this.render();
        _this.scrollToActiveSong();
      };

      //Prev song
      prevSongBtn.onclick = function () {
        if (_this.isRandom) {
          _this.playRandomSong();
        } else {
          _this.prevSong();
        }
        audio.play();
        _this.render();
        _this.scrollToActiveSong();
      };

      //Xử lý bật tắt randomSong
      randomBtn.onclick = function () {
        _this.isRandom = !_this.isRandom;
        randomBtn.classList.toggle("active", _this.isRandom);
      };
      //Xử lý lặp lại song
      repeatBtn.onclick = function () {
        _this.isRepeat = !_this.isRepeat;
        repeatBtn.classList.toggle("active", _this.isRepeat)
      }
      //Xử lý nextSong khi audio ended
      audio.onended = function () {
        if (_this.isRepeat) {
          audio.play();
        } else {
          nextSongBtn.click();
        }
      };
    };

    //Lăng nghe hành vi click vào playLít
    playList.onclick = function (e) {
      const songNode = e.target.closest('.song:not(.active)');
      if (songNode) {
        _this.currentIndex = songNode.getAttribute('data-index');
        _this.loadCurrentSong();
        audio.play();
        _this.render();
      }
    }
  },
  
  scrollToActiveSong: function () {
    setTimeout(() => {
      $('.song.active').scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      })
    }, 300);
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },

  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },

  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },

  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex == this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },

  start: function () {
    // Định nghĩa các thuộc tính cho object
    this.defineProperties();

    //Lắng nghe / xử lý các sự kiện trong DOM Events
    this.handldeEvents();

    //Load thông tin bài hát đầu tiên vào UI
    this.loadCurrentSong();

    //Render playlist
    this.render();
  },
};
app.start();
