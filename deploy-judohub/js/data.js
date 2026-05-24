const TECHNIQUES = [

  // ── TE-WAZA ─────────────────────────────────────────────────────────────────
  {name:"Ippon-seoi-nage",       en:"One-arm shoulder throw",            cat:"Nage-waza",sub:"Te-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=OmKfUXAAdZ0"},
  {name:"Morote-seoi-nage",      en:"Two-arm shoulder throw",            cat:"Nage-waza",sub:"Te-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=UjtL1h9htb8"},
  {name:"Eri-seoi-nage",         en:"Collar shoulder throw",             cat:"Nage-waza",sub:"Te-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=vOpRNSg1O14"},
  {name:"Seoi-otoshi",           en:"Shoulder drop",                     cat:"Nage-waza",sub:"Te-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=vu1TMVNnq34"},
  {name:"Tai-otoshi",            en:"Body drop",                         cat:"Nage-waza",sub:"Te-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=DUiZ8JZkGx8"},
  {name:"Kata-guruma",           en:"Shoulder wheel",                    cat:"Nage-waza",sub:"Te-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=cnHRhSy8yi4"},
  {name:"Te-guruma",             en:"Hand wheel",                        cat:"Nage-waza",sub:"Te-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=P-4HUgB_rK4"},
  {name:"Sumi-otoshi",           en:"Corner drop",                       cat:"Nage-waza",sub:"Te-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=lLU9wv52ni0"},
  {name:"Uki-otoshi",            en:"Floating drop",                     cat:"Nage-waza",sub:"Te-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=6H5tmncOY4Q"},
  {name:"Yama-arashi",           en:"Mountain storm",                    cat:"Nage-waza",sub:"Te-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=MGlyKmSuzdc"},
  {name:"Kibisu-gaeshi",         en:"Heel trip reversal",                cat:"Nage-waza",sub:"Te-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=tJylJYfBliA"},
  {name:"Kuchiki-taoshi",        en:"Single leg takedown",               cat:"Nage-waza",sub:"Te-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=ZNL47q1aJNY"},
  {name:"Morote-gari",           en:"Two-leg reap",                      cat:"Nage-waza",sub:"Te-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=BHLQS4K85bs"},
  {name:"Sukui-nage",            en:"Scooping throw",                    cat:"Nage-waza",sub:"Te-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=vU6aJ2kFxoI"},
  {name:"Obi-otoshi",            en:"Belt drop",                         cat:"Nage-waza",sub:"Te-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=ff8U2TVZIYI"},
  {name:"Tsubame-gaeshi",        en:"Swallow counter",                   cat:"Nage-waza",sub:"Te-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=GwweWqqFB5g"},
  {name:"Uchi-makikomi",         en:"Inner wraparound",                  cat:"Nage-waza",sub:"Te-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=5BowcjduxVc"},
  {name:"Daki-age",              en:"High lift",                         cat:"Nage-waza",sub:"Te-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=5lFXv3crN30"},
  {name:"Seoi-nage",             en:"Shoulder throw (overview)",         cat:"Nage-waza",sub:"Te-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=eWEW9SfI5xg"},
  {name:"Ippon-seoi-otoshi",     en:"One-arm shoulder drop",             cat:"Nage-waza",sub:"Te-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=VJ5WmoX0JPU"},
  {name:"Morote-seoi-otoshi",    en:"Two-arm shoulder drop",             cat:"Nage-waza",sub:"Te-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=9XbIoHXggT4"},

  // ── KOSHI-WAZA ──────────────────────────────────────────────────────────────
  {name:"O-goshi",               en:"Major hip throw",                   cat:"Nage-waza",sub:"Koshi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=yhu1mfy2vJ4"},
  {name:"Uki-goshi",             en:"Floating hip",                      cat:"Nage-waza",sub:"Koshi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=bPKwtB4lyOQ"},
  {name:"Tsuri-goshi",           en:"Lifting hip throw",                 cat:"Nage-waza",sub:"Koshi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=51Htlp7xEvE"},
  {name:"Koshi-guruma",          en:"Hip wheel",                         cat:"Nage-waza",sub:"Koshi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=SU7Id6uVJ44"},
  {name:"Tsurikomi-goshi",       en:"Lifting pulling hip throw",         cat:"Nage-waza",sub:"Koshi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=McfzA0yRVt4"},
  {name:"Harai-goshi",           en:"Sweeping hip throw",                cat:"Nage-waza",sub:"Koshi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=qTo8HlAAkOo"},
  {name:"Hane-goshi",            en:"Spring hip throw",                  cat:"Nage-waza",sub:"Koshi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=M9_7De6A1kk"},
  {name:"Sode-tsurikomi-goshi",  en:"Sleeve lifting pulling hip throw",  cat:"Nage-waza",sub:"Koshi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=QsmAxpmYLOI"},
  {name:"Utsuri-goshi",          en:"Hip shift",                         cat:"Nage-waza",sub:"Koshi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=4pQd_bEnlf0"},
  {name:"Ushiro-goshi",          en:"Rear hip throw",                    cat:"Nage-waza",sub:"Koshi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=ORIYstuxYT8"},
  {name:"O-tsuri-goshi",         en:"Major lifting hip throw",           cat:"Nage-waza",sub:"Koshi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=oB3hwIbdzqM"},
  {name:"O-guruma",              en:"Large wheel",                       cat:"Nage-waza",sub:"Koshi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=SnZciTAY9vc"},

  // ── ASHI-WAZA ───────────────────────────────────────────────────────────────
  {name:"Deashi-harai",          en:"Advancing foot sweep",              cat:"Nage-waza",sub:"Ashi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=4BUUvqxi_Kk"},
  {name:"Okuri-ashi-harai",      en:"Sliding foot sweep",                cat:"Nage-waza",sub:"Ashi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=nw1ZdRjrdRI"},
  {name:"Harai-tsurikomi-ashi",  en:"Lifting pulling foot sweep",        cat:"Nage-waza",sub:"Ashi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=gGPXvWL8VbE"},
  {name:"Sasae-tsurikomi-ashi",  en:"Lifting pulling ankle block",       cat:"Nage-waza",sub:"Ashi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=699i--pvYmE"},
  {name:"Hiza-guruma",           en:"Knee wheel",                        cat:"Nage-waza",sub:"Ashi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=JPJx9-oAVns"},
  {name:"Uchi-mata",             en:"Inner thigh throw",                 cat:"Nage-waza",sub:"Ashi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=iUpSu5J-bgw"},
  {name:"Ouchi-gari",            en:"Major inner reap",                  cat:"Nage-waza",sub:"Ashi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=0itJFhV9pDQ"},
  {name:"Ko-uchi-gari",          en:"Minor inner reap",                  cat:"Nage-waza",sub:"Ashi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=3Jb3tZvr9Ng"},
  {name:"Ko-uchi-gake",          en:"Minor inner hook",                  cat:"Nage-waza",sub:"Ashi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=v-bPmFsDU7A"},
  {name:"O-soto-gari",           en:"Major outer reap",                  cat:"Nage-waza",sub:"Ashi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=c-A_nP7mKAc"},
  {name:"Ko-soto-gari",          en:"Minor outer reap",                  cat:"Nage-waza",sub:"Ashi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=jeQ541ScLB4"},
  {name:"Ko-soto-gake",          en:"Minor outer hook",                  cat:"Nage-waza",sub:"Ashi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=8b6kY4s4zH4"},
  {name:"O-soto-otoshi",         en:"Major outer drop",                  cat:"Nage-waza",sub:"Ashi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=2DsVvDw7b8g"},
  {name:"O-soto-guruma",         en:"Major outer wheel",                 cat:"Nage-waza",sub:"Ashi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=92KbCm6pQeI"},
  {name:"O-uchi-barai",          en:"Major inner sweep",                 cat:"Nage-waza",sub:"Ashi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=g6N0ua1tV74"},
  {name:"Ashi-guruma",           en:"Leg wheel",                         cat:"Nage-waza",sub:"Ashi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=ROeayhvom9U"},
  {name:"O-uchi-gaeshi",         en:"Major inner reap counter",          cat:"Nage-waza",sub:"Ashi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=dCyZTXyjIXE"},
  {name:"Ko-uchi-gaeshi",        en:"Minor inner reap counter",          cat:"Nage-waza",sub:"Ashi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=_MWAdYi_LC4"},
  {name:"Hane-goshi-gaeshi",     en:"Spring hip throw counter",          cat:"Nage-waza",sub:"Ashi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=9bZAZSBtnGs"},
  {name:"Tai-otoshi-gaeshi",     en:"Body drop counter",                 cat:"Nage-waza",sub:"Ashi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=imECTzUV-vY"},

  // ── MA-SUTEMI-WAZA ──────────────────────────────────────────────────────────
  {name:"Tomoe-nage",            en:"Circle throw",                      cat:"Nage-waza",sub:"Ma-sutemi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=TON-fQk3aTc"},
  {name:"Hikikomi-gaeshi",       en:"Pulling sacrifice throw",           cat:"Nage-waza",sub:"Ma-sutemi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=92zUYWBp5N8"},
  {name:"Sumi-gaeshi",           en:"Corner reversal",                   cat:"Nage-waza",sub:"Ma-sutemi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=5VhduA5xkbA"},
  {name:"Tawara-gaeshi",         en:"Rice bag reversal",                 cat:"Nage-waza",sub:"Ma-sutemi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=TmTWgrmViZc"},
  {name:"Ura-nage",              en:"Rear throw",                        cat:"Nage-waza",sub:"Ma-sutemi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=Fgi9b8DJ5sQ"},
  {name:"Ko-uchi-makikomi",      en:"Small inner wrap-around throw",     cat:"Nage-waza",sub:"Ma-sutemi-waza",ko:"No", url:"https://www.youtube.com/watch?v=_1eygIXLD_w"},

  // ── YOKO-SUTEMI-WAZA ────────────────────────────────────────────────────────
  {name:"Yoko-otoshi",           en:"Side drop",                         cat:"Nage-waza",sub:"Yoko-sutemi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=MnNG67pF_a0"},
  {name:"Tani-otoshi",           en:"Valley drop",                       cat:"Nage-waza",sub:"Yoko-sutemi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=3b9Me3Fohpk"},
  {name:"Yoko-gake",             en:"Side hook",                         cat:"Nage-waza",sub:"Yoko-sutemi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=tP1Sj1uDfSo"},
  {name:"Yoko-guruma",           en:"Side wheel",                        cat:"Nage-waza",sub:"Yoko-sutemi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=MehP6I5cY2c"},
  {name:"Yoko-wakare",           en:"Side separation",                   cat:"Nage-waza",sub:"Yoko-sutemi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=bp1tscHlePI"},
  {name:"Uki-waza",              en:"Floating technique",                cat:"Nage-waza",sub:"Yoko-sutemi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=weVOpJ63gII"},
  {name:"Yoko-tomoe-nage",       en:"Side circle throw",                 cat:"Nage-waza",sub:"Yoko-sutemi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=9-byceOifXo"},
  {name:"Soto-makikomi",         en:"Outer wraparound",                  cat:"Nage-waza",sub:"Yoko-sutemi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=bWG9O1BVKtQ"},
  {name:"Kawazu-gake",           en:"One-leg entanglement",              cat:"Nage-waza",sub:"Yoko-sutemi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=-SQCIZFscNs"},
  {name:"Kani-basami",           en:"Crab scissors",                     cat:"Nage-waza",sub:"Yoko-sutemi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=OR-HGHnarYc"},
  {name:"Obi-tori-gaeshi",       en:"Belt grab reversal",                cat:"Nage-waza",sub:"Yoko-sutemi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=bpc82SrunUU"},
  {name:"Daki-wakare",           en:"Hug split (side sacrifice)",        cat:"Nage-waza",sub:"Yoko-sutemi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=Hr0cOMGBDYo"},
  {name:"Yoko-sumi-gaeshi",      en:"Side corner reversal",              cat:"Nage-waza",sub:"Yoko-sutemi-waza",ko:"No", url:"https://www.youtube.com/watch?v=TnvdcBbB0sA"},

  // ── MAKIKOMI-WAZA ───────────────────────────────────────────────────────────
  {name:"Harai-makikomi",        en:"Sweeping wraparound throw",         cat:"Nage-waza",sub:"Makikomi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=VBaHzKaCXss"},
  {name:"Hane-makikomi",         en:"Spring wraparound throw",           cat:"Nage-waza",sub:"Makikomi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=6CRBGLGz9j8"},
  {name:"Uchi-mata-makikomi",    en:"Inner thigh wraparound throw",      cat:"Nage-waza",sub:"Makikomi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=jZXENTLpJCI"},
  {name:"O-soto-makikomi",       en:"Major outer reap wraparound",       cat:"Nage-waza",sub:"Makikomi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=DGDv2oMwmas"},

  // ── KAESHI-WAZA (COUNTERS) ───────────────────────────────────────────────────
  {name:"O-soto-gaeshi",         en:"Major outer reap counter",          cat:"Nage-waza",sub:"Kaeshi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=8ZjM3X_EANo"},
  {name:"Ko-soto-gaeshi",        en:"Minor outer reap counter",          cat:"Nage-waza",sub:"Kaeshi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=8ZjM3X_EANo"},
  {name:"Harai-goshi-gaeshi",    en:"Sweeping hip throw counter",        cat:"Nage-waza",sub:"Kaeshi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=4U3It-7PPsc"},
  {name:"Uchi-mata-gaeshi",      en:"Inner thigh throw counter",         cat:"Nage-waza",sub:"Kaeshi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=Sy6sLWxkWYw"},
  {name:"Uchi-mata-sukashi",     en:"Inner thigh void (slip counter)",   cat:"Nage-waza",sub:"Kaeshi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=V-RS3uhtVWM"},
  {name:"Uki-goshi-gaeshi",      en:"Floating hip counter",              cat:"Nage-waza",sub:"Kaeshi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=H_LVaa0t0DY"},

  // ── OSAEKOMI-WAZA (HOLDS) ───────────────────────────────────────────────────
  {name:"Kesa-gatame",           en:"Scarf hold",                        cat:"Katame-waza",sub:"Osaekomi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=NDaQuJOFBYk"},
  {name:"Hon-kesa-gatame",       en:"Main scarf hold",                   cat:"Katame-waza",sub:"Osaekomi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=Hqt_qagQWQw"},
  {name:"Kuzure-kesa-gatame",    en:"Broken scarf hold",                 cat:"Katame-waza",sub:"Osaekomi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=Q2fb9jaoUFQ"},
  {name:"Ushiro-kesa-gatame",    en:"Reverse scarf hold",                cat:"Katame-waza",sub:"Osaekomi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=SBapox2M2dE"},
  {name:"Kata-gatame",           en:"Shoulder hold",                     cat:"Katame-waza",sub:"Osaekomi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=zQR3IOXxO_Q"},
  {name:"Mune-gatame",           en:"Chest hold",                        cat:"Katame-waza",sub:"Osaekomi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=lIt5vywPBF0"},
  {name:"Kami-shiho-gatame",     en:"Upper four-corner hold",            cat:"Katame-waza",sub:"Osaekomi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=HFuMjOv0WN8"},
  {name:"Kuzure-kami-shiho-gatame",en:"Broken upper four-corner hold",  cat:"Katame-waza",sub:"Osaekomi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=YUrogQWdwiY"},
  {name:"Yoko-shiho-gatame",     en:"Side four-corner hold",             cat:"Katame-waza",sub:"Osaekomi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=TT7XJVSEQxA"},
  {name:"Kuzure-yoko-shiho-gatame",en:"Broken side four-corner hold",   cat:"Katame-waza",sub:"Osaekomi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=54fQM7dYz0M"},
  {name:"Tate-shiho-gatame",     en:"Vertical four-corner hold",         cat:"Katame-waza",sub:"Osaekomi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=XjWzNxlKH1M"},
  {name:"Sankaku-gatame",        en:"Triangular hold",                   cat:"Katame-waza",sub:"Osaekomi-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=Sh01Hgobdgw"},

  // ── SHIME-WAZA (STRANGLES) ───────────────────────────────────────────────────
  {name:"Nami-juji-jime",        en:"Normal cross choke",                cat:"Katame-waza",sub:"Shime-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=k2cHry9HByQ"},
  {name:"Gyaku-juji-jime",       en:"Reverse cross choke",               cat:"Katame-waza",sub:"Shime-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=t3tQriIPdlI"},
  {name:"Kata-juji-jime",        en:"Half cross choke",                  cat:"Katame-waza",sub:"Shime-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=3VZVUAmiMD8"},
  {name:"Hadaka-jime",           en:"Naked choke (rear naked choke)",    cat:"Katame-waza",sub:"Shime-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=9f0n8jez7iA"},
  {name:"Okuri-eri-jime",        en:"Sliding collar choke",              cat:"Katame-waza",sub:"Shime-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=EiqyoVcIAi8"},
  {name:"Kata-ha-jime",          en:"Single wing choke",                 cat:"Katame-waza",sub:"Shime-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=yaTGgRjnwB8"},
  {name:"Sankaku-jime",          en:"Triangle choke",                    cat:"Katame-waza",sub:"Shime-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=lq1CUBRAm7s"},
  {name:"Sode-guruma-jime",      en:"Sleeve wheel choke",                cat:"Katame-waza",sub:"Shime-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=E3nvQzClcAU"},
  {name:"Tsukkomi-jime",         en:"Thrust choke",                      cat:"Katame-waza",sub:"Shime-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=dKKpnD3eLcY"},
  {name:"Ryote-jime",            en:"Two-hand choke",                    cat:"Katame-waza",sub:"Shime-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=-RHC4V7TQiY"},
  {name:"Morote-jime",           en:"Two-handed collar choke",           cat:"Katame-waza",sub:"Shime-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=VbW71vPdZmg"},
  {name:"Ashi-jime",             en:"Leg choke",                         cat:"Katame-waza",sub:"Shime-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=fuDCkSjCON8"},

  // ── KANSETSU-WAZA (ARM LOCKS) ────────────────────────────────────────────────
  {name:"Juji-gatame",                   en:"Cross arm lock",            cat:"Katame-waza",sub:"Kansetsu-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=jOp5XyPd59M"},
  {name:"Ude-garami",                    en:"Entangled arm lock",        cat:"Katame-waza",sub:"Kansetsu-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=AIlTvZb4RlE"},
  {name:"Ude-hishigi-ude-gatame",        en:"Straight arm lock",         cat:"Katame-waza",sub:"Kansetsu-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=SBf0aTma1VI"},
  {name:"Ude-hishigi-hiza-gatame",       en:"Knee arm lock",             cat:"Katame-waza",sub:"Kansetsu-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=H2HtAJdiJcE"},
  {name:"Ude-hishigi-waki-gatame",       en:"Armpit arm lock",           cat:"Katame-waza",sub:"Kansetsu-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=8F5p1zuJRG0"},
  {name:"Ude-hishigi-hara-gatame",       en:"Stomach arm lock",          cat:"Katame-waza",sub:"Kansetsu-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=ZzEycg8R_9M"},
  {name:"Ude-hishigi-ashi-gatame",       en:"Leg arm lock",              cat:"Katame-waza",sub:"Kansetsu-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=ClY7g_pX-4s"},
  {name:"Ude-hishigi-te-gatame",         en:"Hand arm lock",             cat:"Katame-waza",sub:"Kansetsu-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=6DnvhY0tQVM"},
  {name:"Ude-hishigi-sankaku-gatame",    en:"Triangle arm lock",         cat:"Katame-waza",sub:"Kansetsu-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=WefAmW4azhk"},
  {name:"Ashi-garami",                   en:"Leg entanglement lock",     cat:"Katame-waza",sub:"Kansetsu-waza",ko:"Historically",url:"https://www.youtube.com/watch?v=BWWb0GoAtZw"},
  {name:"Waki-gatame",                   en:"Armpit arm lock (standing)", cat:"Katame-waza",sub:"Kansetsu-waza",ko:"Yes",url:"https://www.youtube.com/watch?v=OtqfF2D8kIc"},
  {name:"Kansetsu-waza overview",        en:"Complete arm lock guide",    cat:"Katame-waza",sub:"Kansetsu-waza",ko:"",  url:"https://www.youtube.com/watch?v=QtVipMcTsdw"},

  // ── COMBINATIONS (THROW → HOLD) ──────────────────────────────────────────────
  {name:"Tai-otoshi → Yoko-shiho-gatame",       en:"Body drop into side hold",          cat:"Combination",sub:"",ko:"",url:"https://www.youtube.com/watch?v=caXBWqLeW6I"},
  {name:"Ippon-seoi-nage → Kami-shiho-gatame",  en:"Shoulder throw into upper hold",    cat:"Combination",sub:"",ko:"",url:"https://www.youtube.com/watch?v=jBl0Q-Egbdg"},
  {name:"Ouchi-gari → Tate-shiho-gatame",       en:"Inner reap into vertical hold",     cat:"Combination",sub:"",ko:"",url:"https://www.youtube.com/watch?v=OH8PgkWGxQU"},

  // ── NE-WAZA — ESCAPES ─────────────────────────────────────────────────────────
  {name:"Escape from Kami-shiho-gatame (action & reaction)",   en:"Ne-waza escape",cat:"Ne-waza",sub:"Escape",ko:"",url:"https://www.youtube.com/watch?v=Hl0C4RRavHo"},
  {name:"Escape from Tate-shiho-gatame (clamp & roll)",        en:"Ne-waza escape",cat:"Ne-waza",sub:"Escape",ko:"",url:"https://www.youtube.com/watch?v=PV_anL347rw"},
  {name:"Escape from Yoko-shiho-gatame (trap, bridge & roll)", en:"Ne-waza escape",cat:"Ne-waza",sub:"Escape",ko:"",url:"https://www.youtube.com/watch?v=yK_GSamSPko"},

  // ── NE-WAZA — TURNOVERS ───────────────────────────────────────────────────────
  {name:"Turnover into Kesa-gatame (uke all fours)",        en:"Ne-waza turnover",cat:"Ne-waza",sub:"Turnover",ko:"",url:"https://www.youtube.com/watch?v=r-ODhj19vL0"},
  {name:"Turnover into Yoko-shiho-gatame (uke face-down)",  en:"Ne-waza turnover",cat:"Ne-waza",sub:"Turnover",ko:"",url:"https://www.youtube.com/watch?v=19TTB0bdL7w"},

  // ── KUMI-KATA (GRIPPING) ──────────────────────────────────────────────────────
  {name:"Standard grips — right and left",                  en:"Kumi-kata: right lapel, left sleeve standard",     cat:"Ne-waza",sub:"Gripping",ko:"",url:"https://www.youtube.com/watch?v=T6c_FpfVZy4"},
  {name:"Right vs left, double lapel, high collar grips",   en:"Kumi-kata: grip variations in contest",            cat:"Ne-waza",sub:"Gripping",ko:"",url:"https://www.youtube.com/watch?v=97djf2GY6I0"},

  // ── RANDORI ───────────────────────────────────────────────────────────────────
  {name:"Nage-komi in light randori",     en:"Repetitive throwing with cooperative partner",              cat:"Randori",sub:"Drills",ko:"",url:"https://www.youtube.com/watch?v=QUKkd08DT9M"},
  {name:"Randori — how to improve",       en:"Key principles for getting better in free practice",        cat:"Randori",sub:"Tips",  ko:"",url:"https://www.youtube.com/watch?v=wsDFpn_Yol0"},
  {name:"Randori highlights",             en:"Competition-level randori examples to study",               cat:"Randori",sub:"Drills",ko:"",url:"https://www.youtube.com/watch?v=6t3fTUPSxvQ"},
  {name:"Randori mistakes to avoid",      en:"Common errors in free practice — what not to do",          cat:"Randori",sub:"Tips",  ko:"",url:"https://www.youtube.com/watch?v=68a6896ZhOo"},
  {name:"Relaxing in randori",            en:"Stay loose — tension kills technique and speed",            cat:"Randori",sub:"Tips",  ko:"",url:"https://www.youtube.com/shorts/gIqNLmF09Mo"},
  {name:"Randori tips — short",           en:"Quick tactical tips for free practice",                    cat:"Randori",sub:"Tips",  ko:"",url:"https://www.youtube.com/shorts/zUidSlnJktk"},
  {name:"Footsweeps in randori",          en:"Using ashi-waza effectively in free practice",             cat:"Randori",sub:"Tips",  ko:"",url:"https://www.youtube.com/watch?v=73ym6D0MdpE"},
  {name:"Randori tips — tactical",        en:"Tactical awareness and strategy in free practice",         cat:"Randori",sub:"Tips",  ko:"",url:"https://www.youtube.com/watch?v=ndaPVAgFo-0"},
  {name:"Randori demonstration",          en:"Full randori demo — watch the timing and kuzushi",         cat:"Randori",sub:"Drills",ko:"",url:"https://www.youtube.com/watch?v=JCFO2BeL1oU"},
  {name:"Attack-first principle",              en:"Always be the initiator — passive judo earns shido",         cat:"Randori",sub:"Tips",  ko:"",url:"https://www.youtube.com/watch?v=RxWxPp-wTfw"},
  {name:"Kuzushi before everything",           en:"Break balance first, every time — strength follows timing",   cat:"Randori",sub:"Tips",  ko:"",url:"https://www.youtube.com/watch?v=luK9Eklbn78"},
  {name:"5 basic combination setups",          en:"Core combination patterns every judoka should drill",         cat:"Randori",sub:"Tips",  ko:"",url:"https://www.youtube.com/watch?v=VFOUp-nQpqM"},
  {name:"Tai-otoshi combination setup",        en:"Setting up tai-otoshi with feints and foot movement",         cat:"Randori",sub:"Tips",  ko:"",url:"https://www.youtube.com/watch?v=u34wRSY-suM"},
  {name:"O-soto-gari combination setup",       en:"Building combos around the major outer reap",                cat:"Randori",sub:"Tips",  ko:"",url:"https://www.youtube.com/watch?v=BIrhmaUkB_8"},
  {name:"Seoi-nage combination setup",         en:"Entering seoi-nage from combination attacks",                 cat:"Randori",sub:"Tips",  ko:"",url:"https://www.youtube.com/watch?v=uPXB-60B7f0"},
  {name:"O-goshi competition variations",      en:"How top players adapt o-goshi in contest",                   cat:"Randori",sub:"Tips",  ko:"",url:"https://www.youtube.com/watch?v=oXTwNVxaka8"},
  {name:"Seoi-nage competition variations",    en:"Competition entries and grips for seoi-nage",                cat:"Randori",sub:"Tips",  ko:"",url:"https://www.youtube.com/watch?v=qo-3PNAIaPQ"},
  {name:"O-soto-gari competition variations",  en:"How elite judoka score with o-soto-gari",                   cat:"Randori",sub:"Tips",  ko:"",url:"https://www.youtube.com/watch?v=wm1n4c9d1pE"},
  {name:"O-soto-gari combos",                  en:"Combination sequences built around o-soto-gari",             cat:"Randori",sub:"Tips",  ko:"",url:"https://www.youtube.com/watch?v=OHMgiC3taZA"},
  {name:"Setting up throws in competition",    en:"Tactical tips for landing throws on resisting opponents",    cat:"Randori",sub:"Tips",  ko:"",url:"https://www.youtube.com/watch?v=dpPfPnjJUQ4"},
  {name:"Epic judo combinations",              en:"High-level combination sequences to study and copy",         cat:"Randori",sub:"Drills",ko:"",url:"https://www.youtube.com/watch?v=gud7OWhiF5k"},
  {name:"Technical gripping",                  en:"How to grip efficiently and control the contest from kumi-kata",cat:"Randori",sub:"Tips",ko:"",url:"https://www.youtube.com/watch?v=6xBOG8Y-V04"},
  {name:"Moving in randori",                   en:"Footwork patterns — how to move to create throwing opportunities",cat:"Randori",sub:"Tips",ko:"",url:"https://www.youtube.com/watch?v=j-WQ4c7EQW0"},
  {name:"Orange belt grading demo",            en:"Full orange belt grading — techniques and performance standard",cat:"Randori",sub:"Grading",ko:"",url:"https://www.youtube.com/watch?v=1Bi6nDBdWr0"},
  {name:"5 basic throws everyone should know", en:"The five fundamental throws for any beginner to master",     cat:"Randori",sub:"Tips",  ko:"",url:"https://www.youtube.com/watch?v=KFhiz7dcEkM"},
  {name:"Real ippons in competition",          en:"Full ippon scores — study the timing, kuzushi and commitment",cat:"Randori",sub:"Drills",ko:"",url:"https://www.youtube.com/watch?v=UfbCwy7-CgQ"},

  // ── UKEMI (BREAKFALLS) ───────────────────────────────────────────────────────
  {name:"Mae-ukemi",             en:"Front breakfall",                   cat:"Ukemi",sub:"Ukemi",ko:"Yes",url:"https://www.youtube.com/watch?v=veM5RFdjo0U"},
  {name:"Ushiro-ukemi",         en:"Back breakfall",                    cat:"Ukemi",sub:"Ukemi",ko:"Yes",url:"https://www.youtube.com/watch?v=_g7rvsxTkz8"},
  {name:"Yoko-ukemi",           en:"Side breakfall",                    cat:"Ukemi",sub:"Ukemi",ko:"Yes",url:"https://www.youtube.com/watch?v=JCwK1Ia4jsc"},
  {name:"Mae-mawari-ukemi",     en:"Forward rolling breakfall",         cat:"Ukemi",sub:"Ukemi",ko:"Yes",url:"https://www.youtube.com/watch?v=kbiLot6laks"},
  {name:"Ukemi overview",       en:"All breakfalls — beginner guide",   cat:"Ukemi",sub:"Ukemi",ko:"",  url:"https://www.youtube.com/watch?v=LhU8Dpu9aTE"},

  // ── EXERCISE VIDEOS ───────────────────────────────────────────────────────────
  {name:"Speed & agility for judo",       en:"Speed-focused training session",                           cat:"Exercise",sub:"Speed",   ko:"",url:"https://www.youtube.com/shorts/gIqNLmF09Mo"},
  {name:"Weight training for judo",       en:"Judo-specific weight exercises — short",                   cat:"Exercise",sub:"Weights", ko:"",url:"https://www.youtube.com/shorts/8AJc_8y_r8Y"},
  {name:"Judo strength program",          en:"Full weight training program for judo athletes",           cat:"Exercise",sub:"Weights", ko:"",url:"https://www.youtube.com/watch?v=uBy2yLDhSKY"},
  {name:"Uchi-komi partner drilling",     en:"Partner uchikomi session — entries and timing",            cat:"Exercise",sub:"Uchi-komi",ko:"",url:"https://www.youtube.com/watch?v=oBVMQRLv4dw"},
  {name:"Uchi-mata drilling",             en:"Uchi-mata specific drill session — entries and variations", cat:"Exercise",sub:"Uchi-komi",ko:"",url:"https://www.youtube.com/watch?v=eVcitLTY604"},
  {name:"HIIT for judo",                  en:"High intensity interval training — judo-focused",          cat:"Exercise",sub:"HIT",     ko:"",url:"https://www.youtube.com/watch?v=sJMy8XjVl6c"},
  {name:"Solo judo training",             en:"Judo movements you can train alone at home",               cat:"Exercise",sub:"Solo",    ko:"",url:"https://www.youtube.com/watch?v=eyeRo00P2pI"},
  {name:"Solo judo throw practice",       en:"Solo throw entry and movement drills",                     cat:"Exercise",sub:"Solo",    ko:"",url:"https://www.youtube.com/watch?v=ArleC9QIcOc"},
  {name:"Judo footwork drills",           en:"Foot movement patterns and agility for judo",              cat:"Exercise",sub:"Solo",    ko:"",url:"https://www.youtube.com/watch?v=87Ox-dF9X4Y"},
];

const BELT_DATA = [
  {
    id:"toRed",label:"Novice → 6th Kyu",from:"White",to:"Red",
    fromColor:"belt-color-white",toColor:"belt-color-red",duration:"Typically 2–4 months",
    groups:[
      {title:"Fundamental — Ukemi",items:["Ushiro Ukemi","Yoko Ukemi","Mae Mawari Ukemi (3 Versions)"]},
      {title:"Fundamental — Tachi-waza",items:["Osoto-otoshi","Deashi-barai","Uki-goshi"]},
      {title:"Fundamental — Osaekomi-waza",items:["Kesa-gatame","Mune-gatame","Kuzure-kesa-gatame"]},
      {title:"Performance — Transitions into Ne-waza",items:["Osoto-otoshi into Kesa-gatame","Deashi-barai into Mune-gatame","Uki-goshi into Kuzure-kesa-gatame"]},
      {title:"Performance — Ne-waza",items:["Escape from Kesa-gatame by trapping Uke's leg","Escape from Mune-gatame using a bridge and roll action","Escape from Kuzure-kesa-gatame using sit up and push"]},
      {title:"Personal Choice",items:["One additional tachi-waza of choice","One additional ne-waza of choice"]},
      {title:"Knowledge — Terminology",items:["Dojo","Judogi","Zori","Hajime","Mate","Osae-komi","Rei","Randori","Toketa","Tori","Uke"]},
      {title:"Knowledge — Judo Basics",items:["Correct wearing of judogi and tying of belt","Correct procedure for standing and kneeling bows","In which country was Judo devised?","Who was the founder of modern Judo?","What is the Judo Moral Code?"]}
    ]
  },
  {
    id:"toYellow",label:"6th Kyu → 5th Kyu",from:"Red",to:"Yellow",
    fromColor:"belt-color-red",toColor:"belt-color-yellow",duration:"Typically 3–6 months",
    groups:[
      {title:"Fundamental — Ukemi",items:["Mae-ukemi"]},
      {title:"Fundamental — Tachi-waza",items:["Tai-otoshi","Ippon-seoi-nage","Ouchi-gari"]},
      {title:"Fundamental — Osaekomi-waza",items:["Yoko-shiho-gatame","Tate-shiho-gatame","Kami-shiho-gatame"]},
      {title:"Performance — Transitions",items:["Tai-otoshi → Yoko-shiho-gatame","Ippon-seoi-nage → Kami-shiho-gatame","Ouchi-gari → Tate-shiho-gatame"]},
      {title:"Performance — Ne-waza",items:["Escape from Kami-shiho-gatame (action & reaction)","Escape from Tate-shiho-gatame (clamp & roll)","Escape from Yoko-shiho-gatame (trap, bridge & roll)","Turnover into Kesa-gatame (uke all fours)","Turnover into Mune-gatame (uke all fours)","Turnover into Yoko-shiho-gatame (uke face-down)"]},
      {title:"Performance — Kumi-kata",items:["Standard grips — right and left","Right vs left, double lapel, high collar grips"]},
      {title:"Performance — Nage-komi & Randori",items:["Nage-komi in light randori"]},
      {title:"Personal Choice",items:["One additional tachi-waza of choice","One additional ne-waza of choice"]},
      {title:"Knowledge — Terminology",items:["Ippon-seoi-nage — One Arm Shoulder Throw","Kami-shiho-gatame — Upper Four Quarters Hold","Kumi-kata — Engagement Position","Mae Ukemi — Front Breakfall","Mune-gatame — Chest Hold","Nage-komi — Repetitive Throwing","Ouchi-gari — Major Inner Reaping Throw","Randori — Free Practice","Tai-otoshi — Body Drop Throw","Tate-shiho-gatame — Lengthwise Four Quarters Hold","Yoko-shiho-gatame — Side Four Quarters Hold"]},
      {title:"Knowledge — Contest Rules",items:["Give two examples of actions against the contest rules"]},
      {title:"Moral Code",items:["Courtesy","Courage","Honesty","Honour","Modesty","Respect","Self-control","Friendship"]}
    ]
  },
  {
    id:"toOrange",label:"5th Kyu → 4th Kyu",from:"Yellow",to:"Orange",
    fromColor:"belt-color-yellow",toColor:"belt-color-orange",duration:"Typically 6–12 months",
    groups:[
      {title:"Fundamental — Tachi-waza",items:["Tsurikomi-goshi","O-goshi","Seoi-otoshi","Morote-seoi-nage","Ko-uchi-gari","Ko-soto-gake","Ko-soto-gari","O-soto-gari"]},
      {title:"Performance — Combinations",items:["Ouchi-gari → Ko-uchi-gari","Ko-uchi-gari → O-soto-gari or O-soto-gake","Ko-uchi-gari → Morote-seoi-nage","Ippon-seoi-nage → Ko-uchi-gari","Any technique combined with Seoi-otoshi or Ko-uchi-gari"]},
      {title:"Performance — Counters",items:["Ouchi-gari countered by Tsurikomi-goshi","Tai-otoshi countered by Ko-soto-gari or Ko-soto-gake"]},
      {title:"Performance — Ne-waza",items:["Escape from Kesa-gatame (bridge & roll)","Move into Kesa-gatame from between uke's legs","Move into Yoko-shiho-gatame from between uke's legs","Arm roll — uke approaching from front","Arm roll — uke approaching from behind","Turnover from underneath into Tate-shiho-gatame"]},
      {title:"Performance — Randori",items:["Randori demonstration"]},
      {title:"Personal Choice",items:["Two tachi-waza of choice","One ne-waza of choice"]},
      {title:"Knowledge — Terminology",items:["Ko-soto-gake — Minor Outer Hook Throw","Ko-soto-gari — Minor Outer Reaping Throw","Ko-uchi-gari — Minor Inner Reaping Throw","Morote-seoi-nage — Two-Handed Shoulder Throw","O-goshi — Major Hip Throw","O-soto-gari — Major Outer Reaping Throw","Seoi-otoshi — Shoulder Drop Throw","Tai-otoshi — Body Drop Throw","Tsurikomi-goshi — Drawing Hip Throw","Yoko-shiho-gatame — Side Four Quarters Hold","Shido — Official Warning","Hansoku-make — Disqualification"]},
      {title:"Knowledge — Referee Signals",items:["Mate","Osaekomi","Toketa","Adjusting the judogi"]},
      {title:"Knowledge — Moral Code",items:["Name three items from the Judo Moral Code"]},
      {title:"Knowledge — Contest Rules",items:["Give two examples of actions (not grips) against the contest rules for negative or safety reasons","Demonstrate the proper procedures for coming onto and leaving the mat for a contest"]}
    ]
  },
  {
    id:"toGreen",label:"4th Kyu → 3rd Kyu",from:"Orange",to:"Green",
    fromColor:"belt-color-orange",toColor:"belt-color-green",duration:"Typically 12–18 months",
    groups:[
      {title:"Fundamental — Tachi-waza",items:["Harai-goshi","Uchi-mata","Hiza-guruma","Sasae-tsuri-komi-ashi","Hane-goshi","Okuri-ashi-barai","Morote-eri-seoi-nage"]},
      {title:"Fundamental — Kansetsu-waza",items:["Ude-gatame","Waki-gatame","Hiza-gatame","Juji-gatame"]},
      {title:"Performance — Juji-gatame entries",items:["Juji-gatame — sit-back entry","Juji-gatame — rollover entry","Juji-gatame — over-the-shoulder entry","Juji-gatame — entry from beneath"]},
      {title:"Performance — Randori",items:["Randori demonstration"]},
      {title:"Personal Choice",items:["Four techniques — 2 combinations, 2 counters, 2 ne-waza transitions"]},
      {title:"Knowledge — Terminology",items:["Hane-goshi — Spring Hip","Harai-goshi — Sweeping Hip","Hiza-gatame — Armlock applied with the knee","Hiza-guruma — Knee Wheel","Juji-gatame — Cross Armlock","Kansetsu-waza — Joint Techniques","Morote-eri-seoi-nage — Two-Handed Lapel Shoulder","Okuri-ashi-barai — Foot Sweep","Renraku-waza — Combination techniques (opposite direction)","Renzoku-waza — Combination techniques (same direction)","Sasae-tsuri-komi-ashi — Propping Drawing Ankle","Uchi-mata — Inner Thigh","Ude-gatame — Straight Armlock","Waki-gatame — Armlock applied with the armpit"]}
    ]
  },
  {
    id:"toBlue",label:"3rd Kyu → 2nd Kyu",from:"Green",to:"Blue",
    fromColor:"belt-color-green",toColor:"belt-color-blue",duration:"Typically 18–24 months",
    groups:[
      {title:"Fundamental — Tachi-waza",items:["Soto-maki-komi","Tani-otoshi","Yoko-guruma","Tomoe-nage","Yoko-tomoe-nage","Uki-waza"]},
      {title:"Fundamental — Shime-waza",items:["Okuri-eri-jime","Nami-juji-jime","Gyaku-juji-jime","Kata-juji-jime","Koshi-jime","Kata-te-jime"]},
      {title:"Fundamental — Kansetsu-waza",items:["Ude-garami"]},
      {title:"Performance — Combination",items:["Ude-garami from Kuzure-kesa-gatame"]},
      {title:"Performance — Ne-waza",items:["Koshi-jime — Uke attempts Seoi-otoshi","Kata-te-jime — Uke in all fours position","Nami-juji-jime — Uke underneath (between Tori's legs)","Gyaku-juji-jime — Uke on top (between Tori's legs)","Okuri-eri-jime — Uke makes Seoi-otoshi"]},
      {title:"Performance — Randori",items:["Randori demonstration"]},
      {title:"Personal Choice",items:["Four techniques — 2 combinations, 2 counters, 2 ne-waza transitions"]},
      {title:"Knowledge — Terminology",items:["Gyaku-juji-jime — Reverse Cross Strangle","Kaeshi-waza — Counter Techniques","Kata-te-jime — Strangle with One Hand","Kata-juji-jime — Half Cross Handed Strangle","Koshi-jime — Strangle using the hip","Kuzure-kesa-gatame — Broken scarf hold","Nami-juji-jime — Normal Cross Strangle","Okuri-eri-jime — Sliding Collar Strangle","Seoi-otoshi — Shoulder drop","Shime-waza — Strangle Techniques","Soto-maki-komi — Outside Winding","Tani-otoshi — Valley Drop Throw","Tomoe-nage — Circle Throw","Ude-garami — Entangled Armlock","Uki-waza — Floating Throw","Yoko-guruma — Side Wheel Throw","Yoko-tomoe-nage — Side Circle Throw"]}
    ]
  },
  {
    id:"toBrown",label:"2nd Kyu → 1st Kyu",from:"Blue",to:"Brown",
    fromColor:"belt-color-blue",toColor:"belt-color-brown",duration:"Typically 24–36 months",
    groups:[
      {title:"Fundamental — Tachi-waza",items:["Sode-tsuri-komi-goshi","Sumi-gaeshi","Yoko-gake","Ko-uchi-gake-maki-komi","Ushiro-goshi","Ura-nage","Uki-otoshi","Koshi-guruma"]},
      {title:"Fundamental — Shime-waza",items:["Kata-ha-jime","Hadaka-jime","San-gaku-jime","San-gaku-gatame","San-gaku-osae-gatame"]},
      {title:"Performance — Tachi-waza",items:["Sumi-gaeshi — two variations","Ushiro-goshi as counter to Harai-goshi","Sumi-gaeshi as combination with Uchi-mata","Counter Koshi-guruma with Ura-nage"]},
      {title:"Performance — Ne-waza",items:["San-gaku-jime — complex entry","San-gaku-gatame — complex entry","San-gaku-osae-gatame — turnover and hold","Hadaka-jime — Uke prone position","Kata-ha-jime — Uke all fours position"]},
      {title:"Performance — Randori",items:["Randori demonstration"]},
      {title:"Personal Choice",items:["Four techniques — 2 combinations, 2 counters, 2 ne-waza transitions","OR: One set of Nage-no-kata or Katame-no-kata"]},
      {title:"Knowledge — Terminology",items:["Hadaka-jime — Naked Strangle","Kata — Forms","Kata-ha-jime — Single Collar Strangle","Katame-no-kata — Grappling Forms","Koshi-guruma — Hip Wheel Throw","Ko-uchi-gake-maki-komi — Minor Inner Hook Thigh Winding","Nage-no-kata — Throwing Forms","San-gaku-gatame — Triangular Hold Down","San-gaku-jime — Triangular Strangle","San-gaku-osae-gatame — Triangular Strangle and Hold Down","Sode-tsuri-komi-goshi — Sleeve Lift Pull Hip Throw","Sumi-gaeshi — Corner Throw","Uki-otoshi — Floating Drop","Ura-nage — Rear Throw","Ushiro-goshi — Rear Hip Throw","Yoko-gake — Side Hook Throw"]},
      {title:"Knowledge — Contest Rules",items:["Give three examples of penalties in competition rules"]}
    ]
  }
];

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

// ── EXERCISE LIBRARY ───────────────────────────────
const EXERCISES = [
  // UCHI-KOMI
  { name: 'Shadow Uchikomi',        cat: 'Uchi-komi',    note: 'Full entry movement solo — both sides. Perfect reps build the reflex.' },
  { name: 'Band Uchikomi',          cat: 'Uchi-komi',    note: 'Loop resistance band at lapel height on door. Drive through the full entry.' },
  { name: 'Moving Uchikomi',        cat: 'Uchi-komi',    note: 'Attack while stepping — never throw from standing still. Step in, step in, attack.' },
  { name: 'Ko-uchi Uchikomi',       cat: 'Uchi-komi',    note: 'Isolate the minor reap entry. Load the step, not just the foot.' },
  { name: 'Seoi-nage Uchikomi',     cat: 'Uchi-komi',    note: 'Hip height. Elbows tight. Turn fully. Feel the load before you stop.' },
  { name: 'O-soto Uchikomi',        cat: 'Uchi-komi',    note: 'Pull the sleeve hard before the reap — kuzushi first, leg second.' },
  { name: 'Combo Uchikomi',         cat: 'Uchi-komi',    note: 'Two-throw combo entries. Ko-uchi → O-soto, or Ko-uchi → Seoi. First attack creates the reaction.' },
  { name: 'Nagekomi (partner)',      cat: 'Uchi-komi',    note: 'Full throw with a partner. Crash mat or tatami. Commit — no half-throws.' },

  // GRIP STRENGTH
  { name: 'Towel Pull-ups',         cat: 'Grip Strength', note: 'Drape towel over bar, grip each end. Brutal on grip endurance — the judo standard.' },
  { name: 'Dead Hang',              cat: 'Grip Strength', note: 'Hang from bar, arms straight, full bodyweight. Hold for time. Builds grip endurance fast.' },
  { name: 'Isometric Gi Hold',      cat: 'Grip Strength', note: 'Grip belt or rolled towel, squeeze max for 30s. Don\'t let go — simulate contest grip.' },
  { name: 'Plate Pinch',            cat: 'Grip Strength', note: 'Pinch two plates between fingers and thumb, carry or hold. Trains the pinch used in sleeve grip.' },
  { name: 'Wrist Roller',           cat: 'Grip Strength', note: 'Roll weight up, lower slow. Both directions. Hits wrist flexors and extensors.' },
  { name: 'Rice Bucket',            cat: 'Grip Strength', note: 'Plunge hand in rice, open and close. 2–3 min continuous. Rehab and strength combined.' },
  { name: 'Gi Pull-ups',            cat: 'Grip Strength', note: 'Grip actual gi jacket draped over bar. Replicates exact contest grip demands on fingers.' },
  { name: 'Finger Extension Band',  cat: 'Grip Strength', note: 'Loop band around fingers, extend outward. Balances grip muscles — prevents injury.' },
  { name: 'Rope Climb (arms only)', cat: 'Grip Strength', note: 'Climb using arms only, no legs. If no rope, towel over pull-up bar. Ultimate grip builder.' },

  // JUDO STRENGTH
  { name: 'Judo Squats',            cat: 'Strength',      note: 'Shoulder-width, judo stance. Explosive up, controlled down. Builds throw drive.' },
  { name: 'Explosive Pushups',      cat: 'Strength',      note: 'Chest to floor, fast off the ground. Hands leave the floor at the top.' },
  { name: 'Bent-over Rows',         cat: 'Strength',      note: 'Drive elbow back hard. Mimics the sleeve/lapel pull needed for throws.' },
  { name: 'Romanian Deadlift',      cat: 'Strength',      note: 'Hip hinge, hamstrings loaded. Translates directly to hip drive in throws.' },
  { name: 'Kettlebell Swing',       cat: 'Strength',      note: 'Hip snap — same explosive pattern as throw entry. Keep back flat.' },
  { name: 'Turkish Get-up',         cat: 'Strength',      note: 'Floor to standing, controlled. Builds ne-waza transition strength and stability.' },
  { name: 'Pull-ups',               cat: 'Strength',      note: 'Full range, dead hang start. Core and lats — essential for pinning and throwing.' },
  { name: 'Single-leg Deadlift',    cat: 'Strength',      note: 'Balance and hip stability. Helps planted foot in ashi-waza throws.' },

  // CONDITIONING
  { name: 'Sprawls',                cat: 'Conditioning',  note: 'Drop hips fast and low. React immediately — don\'t pause to think.' },
  { name: 'Burpee + Shadow Throw',  cat: 'Conditioning',  note: 'Up from burpee, straight into shadow entry. Simulates randori scramble pace.' },
  { name: 'Fast Footwork',          cat: 'Conditioning',  note: 'Light on toes, quick short steps, stay in judo stance the whole time.' },
  { name: 'Shuttle Sprints',        cat: 'Conditioning',  note: '5m out and back × 6. Short explosive efforts — matches randori energy system.' },
  { name: '30s On / 15s Off',       cat: 'Conditioning',  note: 'Max effort shadow uchikomi ON, recovery walk OFF. Repeat × 6–8 rounds.' },
  { name: 'Bear Crawl',             cat: 'Conditioning',  note: 'Hips low, move fluidly. Builds ne-waza movement patterns and core stability.' },
  { name: 'Jump Squats',            cat: 'Conditioning',  note: 'Explosive — land soft and absorb. Builds ashi-waza snap.' },

  // MOBILITY
  { name: 'Hip Circles',            cat: 'Mobility',      note: 'Large, slow circles both ways. Open the hips — essential before any throwing work.' },
  { name: 'Deep Squat Hold',        cat: 'Mobility',      note: 'Hold the bottom position, chest up. Grip a doorframe for support if needed.' },
  { name: 'Shoulder CARs',          cat: 'Mobility',      note: 'Controlled full-range shoulder rotations — slow. Prevents the rotator damage judo causes.' },
  { name: 'Thoracic Rotation',      cat: 'Mobility',      note: 'Thread the needle or seated twist. Keeps throw entry rotation sharp.' },
  { name: 'Neck Rolls',             cat: 'Mobility',      note: 'Slow, full range. Judo puts huge demand on the neck — keep it mobile and strong.' },
  { name: 'Hip Flexor Stretch',     cat: 'Mobility',      note: 'Deep lunge, tuck pelvis under. Essential for full extension in throws.' },
  { name: 'Shoulder Dislocates',    cat: 'Mobility',      note: 'Band or stick overhead and behind. Opens thoracic spine and shoulders.' },

  // RANDORI PRACTICE
  { name: 'Light Randori (3 min)',   cat: 'Randori',      note: 'Full pace but controlled — attack every 30s minimum. No passive gripping allowed.' },
  { name: 'Ne-waza Randori',         cat: 'Randori',      note: 'Ground only from seated position. Work turnovers, pins, escapes. 2–3 min each way.' },
  { name: 'Grip Fighting Randori',   cat: 'Randori',      note: 'Focus entirely on grip — establish yours, break theirs, repeat. No throws, just gripping.' },
  { name: 'Combination Randori',     cat: 'Randori',      note: 'Every attack must be part of a 2-throw combo. First attack creates the reaction — commit to the second.' },
  { name: 'Positional Drilling',     cat: 'Randori',      note: 'Attacker tries to hold for 10s, defender escapes. Switch roles each round. Sharp ne-waza builder.' },
  { name: '1-Minute Blasts',         cat: 'Randori',      note: 'Maximum effort randori for 60s, full recovery, repeat × 5. Builds the randori-specific gas tank.' },
  { name: 'Shadow Randori',          cat: 'Randori',      note: 'Solo: visualise an opponent, move and attack. Work your best combinations. 3â5 min.' },
  { name: 'Situational Randori',     cat: 'Randori',      note: 'Start from a specific grip or position each time. Drill the entry from that exact situation.' },
];

// ── TERMINOLOGY ENGLISH MEANINGS ────────────────────────────────
const TERMS_EN = {
  // White → Red
  'Dojo':                   'Judo Hall',
  'Judogi':                 'Judo Uniform',
  'Zori':                   'Judo Footwear / Sandals',
  'Hajime':                 'Begin',
  'Mate':                   'Wait / Stop',
  'Osae-komi':              'Hold Down',
  'Rei':                    'Standing Bow',
  'Randori':                'Free Practice',
  'Toketa':                 'Hold Broken',
  'Tori':                   'The Attacking Judoka',
  'Uke':                    'The Defending Judoka',
  // Red → Yellow (6th Kyu → 5th Kyu)
  'Ippon-seoi-nage':        'One Arm Shoulder Throw',
  'Kami-shiho-gatame':      'Upper Four Quarters Hold',
  'Kumi-kata':              'Engagement Position',
  'Mae Ukemi':              'Front Breakfall',
  'Mune-gatame':            'Chest Hold',
  'Nage-komi':              'Repetitive Throwing',
  'Ouchi-gari':             'Major Inner Reaping Throw',
  'Tai-otoshi':             'Body Drop Throw',
  'Tate-shiho-gatame':      'Lengthwise Four Quarters Hold',
  'Yoko-shiho-gatame':      'Side Four Quarters Hold',
  // Yellow → Orange
  'Ippon':                  'Full Point — immediate win',
  'Waza-ari':               'Half Point',
  'Shido':                  'Minor Penalty',
  // Orange → Green (kansetsu-waza)
  'Hane-goshi':             'Spring Hip',
  'Harai-goshi':            'Sweeping Hip',
  'Hiza-gatame':            'Armlock applied with the knee',
  'Hiza-guruma':            'Knee Wheel',
  'Juji-gatame':            'Cross Armlock',
  'Kansetsu-waza':          'Joint Techniques',
  'Morote-eri-seoi-nage':   'Two-Handed Lapel Shoulder',
  'Okuri-ashi-barai':       'Foot Sweep',
  'Renraku-waza':           'Combination techniques (opposite direction)',
  'Renzoku-waza':           'Combination techniques (same direction)',
  'Sasae-tsuri-komi-ashi':  'Propping Drawing Ankle',
  'Uchi-mata':              'Inner Thigh',
  'Ude-gatame':             'Straight Armlock',
  'Waki-gatame':            'Armlock applied with the armpit',
  // Green → Blue (shime-waza)
  'Gyaku-juji-jime':        'Reverse Cross Strangle',
  'Kaeshi-waza':            'Counter Techniques',
  'Kata-te-jime':           'Strangle with One Hand',
  'Kata-juji-jime':         'Half Cross Handed Strangle',
  'Koshi-jime':             'Strangle using the hip',
  'Kuzure-kesa-gatame':     'Broken scarf hold',
  'Nami-juji-jime':         'Normal Cross Strangle',
  'Okuri-eri-jime':         'Sliding Collar Strangle',
  'Seoi-otoshi':            'Shoulder drop',
  'Shime-waza':             'Strangle Techniques',
  'Soto-maki-komi':         'Outside Winding',
  'Tani-otoshi':            'Valley Drop Throw',
  'Tomoe-nage':             'Circle Throw',
  'Ude-garami':             'Entangled Armlock',
  'Uki-waza':               'Floating Throw',
  'Yoko-guruma':            'Side Wheel Throw',
  'Yoko-tomoe-nage':        'Side Circle Throw',
  // Blue → Brown
  'Hadaka-jime':            'Naked Strangle',
  'Kata':                   'Forms',
  'Kata-ha-jime':           'Single Collar Strangle',
  'Katame-no-kata':         'Grappling Forms',
  'Koshi-guruma':           'Hip Wheel Throw',
  'Ko-uchi-gake-maki-komi': 'Minor Inner Hook Thigh Winding',
  'Nage-no-kata':           'Throwing Forms',
  'San-gaku-gatame':        'Triangular Hold Down',
  'San-gaku-jime':          'Triangular Strangle',
  'San-gaku-osae-gatame':   'Triangular Strangle and Hold Down',
  'Sode-tsuri-komi-goshi':  'Sleeve Lift Pull Hip Throw',
  'Sumi-gaeshi':            'Corner Throw',
  'Uki-otoshi':             'Floating Drop',
  'Ura-nage':               'Rear Throw',
  'Ushiro-goshi':           'Rear Hip Throw',
  'Yoko-gake':              'Side Hook Throw',
};


// ── BELT KNOWLEDGE ANSWERS ─────────────────────────────────────────
// Maps checklist item strings → example answers/hints shown in the checklist
const BELT_KNOWLEDGE_ANSWERS = {

  // ══ NOVICE → 6TH KYU (White → Red) ══════════════════════════════

  'Mae Mawari Ukemi (3 Versions)': [
    'Version 1: From standing — step forward, tuck chin, roll diagonally across the shoulder',
    'Version 2: From kneeling — same rolling action at lower height',
    'Version 3: From a throw — performed as a breakfall when thrown forward'
  ],
  'Osoto-otoshi into Kesa-gatame': [
    'Drive Uke backward with Osoto-otoshi, land alongside them as they hit the mat',
    'Immediately slide your hips close to Uke\'s head and establish Kesa-gatame',
    'Control: arm under their neck, near arm gripped close to your body, your weight low'
  ],
  'Deashi-barai into Mune-gatame': [
    'Sweep Uke\'s lead foot as weight transfers onto it, breaking them sideways',
    'Follow Uke to the ground and move quickly to chest-to-chest position',
    'Mune-gatame: chest on chest, both arms controlling, hips low and spread wide'
  ],
  'Uki-goshi into Kuzure-kesa-gatame': [
    'Break Uke\'s balance forward, wheel them over your hip with Uki-goshi',
    'As Uke lands, maintain grip and slide into Kuzure-kesa-gatame',
    'Kuzure-kesa-gatame: arm goes under Uke\'s arm (not neck), control their body tightly'
  ],
  'Escape from Kesa-gatame by trapping Uke\'s leg': [
    'Trap Uke\'s near knee with your far hand to stop them moving away',
    'Bridge explosively upward and turn into Uke to break their weight off you',
    'Use the momentum to roll Uke over and come out on top or to the side'
  ],
  'Escape from Mune-gatame using a bridge and roll action': [
    'Feet flat on the mat, hips high — bridge sharply toward Uke\'s head',
    'As Uke reacts to stabilise, roll hard into them in the direction of the bridge',
    'Aim to end up in a controlling position on top of Uke'
  ],
  'Escape from Kuzure-kesa-gatame using sit up and push': [
    'Post your inside elbow on the mat for base, then sit up sharply',
    'Push Uke\'s hip or head away with your free arm as you sit',
    'Create enough space to bring your legs in and establish a guard or come to knees'
  ],
  'In which country was Judo devised?': ['Japan'],
  'Who was the founder of modern Judo?': [
    'Professor Jigoro Kano — founded Judo in 1882 at the Kodokan, Tokyo'
  ],
  'What is the Judo Moral Code?': [
    'Courtesy · Courage · Honesty · Honour · Modesty · Respect · Self-control · Friendship'
  ],
  'Correct wearing of judogi and tying of belt': [
    'Left lapel over right (right side goes on first)',
    'Belt: wrap around twice, tie a flat reef knot at the front, equal ends'
  ],
  'Correct procedure for standing and kneeling bows': [
    'Ritsurei (standing bow): feet together, bow from the waist approximately 30°',
    'Zarei (kneeling bow): kneel left knee first, hands flat on mat in front, bow forward'
  ],

  // ══ 6TH KYU → 5TH KYU (Red → Yellow) ═══════════════════════════

  'Tai-otoshi → Yoko-shiho-gatame': [
    'Attack with Tai-otoshi — as Uke lands, pivot to their side',
    'Lay across Uke\'s body chest-to-chest and establish Yoko-shiho-gatame',
    'Pin both shoulders and hips — keep your weight central and low'
  ],
  'Ippon-seoi-nage → Kami-shiho-gatame': [
    'Throw with Ippon-seoi-nage — maintain grip through the throw',
    'Step around to Uke\'s head as they land, lie flat and reach under both armpits',
    'Kami-shiho-gatame: chest on Uke\'s chest, both arms controlling, legs spread for base'
  ],
  'Ouchi-gari → Tate-shiho-gatame': [
    'Reap Uke\'s leg with Ouchi-gari to bring them straight down',
    'Land directly between their legs and establish Tate-shiho-gatame (straddle)',
    'Control both shoulders with your chest, hook their legs with your feet'
  ],
  'Escape from Kami-shiho-gatame (action & reaction)': [
    'Uke adjusts to your first movement — use that reaction to escape the other way',
    'e.g. push Uke\'s hip to the left → as Uke resists pushing back right → roll right to escape',
    'Bridge and turn into any gap Uke creates when correcting their position'
  ],
  'Escape from Tate-shiho-gatame (clamp & roll)': [
    'Clamp one of Uke\'s legs to your body with both arms',
    'Bridge and roll hard toward the clamped-leg side — Uke cannot post that leg',
    'Follow through to come on top of Uke or to your knees'
  ],
  'Escape from Yoko-shiho-gatame (trap, bridge & roll)': [
    'Trap Uke\'s near arm against their body with your near arm',
    'Bridge up sharply and roll into Uke (toward their head) to break the hold',
    'Use your legs to help push and create momentum into the roll'
  ],
  'Turnover into Kesa-gatame (uke all fours)': [
    'Approach from the side — reach one arm under Uke\'s chest, other over their back',
    'Pull Uke\'s near arm out while pushing their shoulder down to collapse them',
    'Roll them onto their back and settle into Kesa-gatame immediately'
  ],
  'Turnover into Mune-gatame (uke all fours)': [
    'Approach from the side, drive your chest down onto Uke\'s back',
    'Thread one arm under their near arm, push their far shoulder down',
    'As they collapse, swing into position for Mune-gatame across their chest'
  ],
  'Turnover into Yoko-shiho-gatame (uke face-down)': [
    'Approach from the side — reach under Uke\'s near hip and near shoulder',
    'Rock Uke up and over onto their back with a scooping motion',
    'Immediately settle into Yoko-shiho-gatame — pin both their shoulders and hips'
  ],
  'Standard grips — right and left': [
    'Right grip: right hand grips Uke\'s left lapel at chest height, left hand grips their right sleeve at elbow',
    'Left grip (mirror): left hand on Uke\'s right lapel, right hand on their left sleeve',
    'Elbows slightly bent, grips firm but not tense — posture upright'
  ],
  'Right vs left, double lapel, high collar grips': [
    'Right vs Left: orthodox vs southpaw — adjust footwork and entry angle accordingly',
    'Double lapel: both hands on lapels — useful for forward throws like Morote-seoi-nage',
    'High collar: grip near the back of Uke\'s collar — control their posture for forward throws'
  ],
  'Nage-komi in light randori': [
    'Both players alternate attacking — one throws, then the other throws',
    'Show a variety of techniques, not just your favourite',
    'Aim to attempt throws on both right and left sides where possible'
  ],
  'Alternating throws both sides with partner': [
    'e.g. throw Ouchi-gari to the right, then try the same on the left',
    'Assessor looks for balance between right and left side attacks',
    'Full commitment on each throw — no half-entries'
  ],
  'Give two examples of actions against the contest rules': [
    'Intentional avoidance of gripping the opponent (passivity)',
    'Executing a false attack with no real commitment to throw'
  ],

  // ══ 5TH KYU → 4TH KYU (Yellow → Orange) ════════════════════════

  'Ouchi-gari → Ko-uchi-gari': [
    'Attack Ouchi-gari to Uke\'s right leg — Uke steps back with that leg to avoid',
    'Immediately switch attack to Uke\'s left leg with Ko-uchi-gari',
    'Same direction combo (renzoku-waza) — second attack exploits the evasion'
  ],
  'Ko-uchi-gari → O-soto-gari or O-soto-gake': [
    'Attack Ko-uchi-gari inside Uke\'s leg — Uke pushes back or steps out wide',
    'Instantly pivot and drive into O-soto-gari/gake on the outside of Uke\'s leg',
    'Renraku-waza (opposite direction) — Ko-uchi pulls Uke forward, O-soto attacks from behind'
  ],
  'Ko-uchi-gari → Morote-seoi-nage': [
    'Threaten Ko-uchi-gari at Uke\'s foot to pull their weight forward',
    'As Uke steps back to evade, step in under them for Morote-seoi-nage',
    'Their forward lean loads perfectly onto your back — commit fully to the entry'
  ],
  'Ippon-seoi-nage → Ko-uchi-gari': [
    'Attack Ippon-seoi-nage — Uke defends by stepping back and pushing down on you',
    'As Uke pushes their hips back, immediately attack the near foot with Ko-uchi-gari',
    'Uke\'s defensive posture (bent forward, weight on heels) makes them vulnerable to the reap'
  ],
  'Any technique combined with Seoi-otoshi or Ko-uchi-gari': [
    'e.g. Tai-otoshi → Ko-uchi-gari (if Uke steps back to avoid the drop)',
    'e.g. Ko-uchi-gari → Seoi-otoshi (reap to load forward, then drop entry)',
    'The second technique exploits the reaction to the first attack'
  ],
  'Ouchi-gari countered by Tsurikomi-goshi': [
    'Uke attacks Ouchi-gari — their body comes close to yours as they reap',
    'Use their forward momentum — pivot and load them onto your hip for Tsurikomi-goshi',
    'Pull up on the lapel (tsuri) and drive your hip back and around to execute the throw'
  ],
  'Tai-otoshi countered by Ko-soto-gari or Ko-soto-gake': [
    'Uke attempts Tai-otoshi — step your front foot back over their blocking leg',
    'As you step out, attack Uke\'s near outside leg with Ko-soto-gari or Ko-soto-gake',
    'Their extended attack position leaves their supporting leg exposed'
  ],
  'Escape from Kesa-gatame (bridge & roll)': [
    'Shoot your far arm under Uke\'s near arm to create leverage',
    'Bridge explosively upward, pulling Uke\'s arm toward your body as you roll',
    'Roll into Uke — their arm grip pulls them with you and breaks the hold'
  ],
  'Move into Kesa-gatame from between uke\'s legs': [
    'From between Uke\'s legs (guard position) — push one knee down to the mat',
    'Slide out to the side, maintaining chest contact, and reach for the neck position',
    'Settle your weight low next to Uke\'s head and establish Kesa-gatame'
  ],
  'Move into Yoko-shiho-gatame from between uke\'s legs': [
    'From guard — post one hand on the mat for base, pass to the side',
    'Drive past Uke\'s knee and swing your hips to lie across their body',
    'Pin with Yoko-shiho-gatame — one arm under the neck, one under the hip'
  ],
  'Arm roll — uke approaching from front': [
    'Uke is on all fours approaching you — grip their near wrist and the back of their elbow',
    'Rotate their arm palm-up and roll it across their own body',
    'Their shoulder collapses and they roll onto their back — follow immediately to control'
  ],
  'Arm roll — uke approaching from behind': [
    'Uke behind you on all fours — reach back, grip their wrist and collar',
    'Pull their arm through and forward while driving their shoulder down',
    'Roll them over to your side and take a hold-down position'
  ],
  'Turnover from underneath into Tate-shiho-gatame': [
    'You are underneath Uke (turtle position on you) — one arm around their waist',
    'Bridge and roll sideways, pulling Uke over you with the waist grip',
    'As they land on their back, ride on top and establish Tate-shiho-gatame'
  ],
  'Randori demonstration': [
    'Show attacking intent — attempt techniques, don\'t just grip and push',
    'Demonstrate kumi-kata (gripping), footwork, and entry attempts',
    'Respond to Uke\'s attacks with avoidance or counter-attacks'
  ],
  'Variety of techniques & kumi-kata': [
    'e.g. mix hip throws (O-goshi), leg trips (Ko-uchi-gari) and foot sweeps (Ko-soto-gari)',
    'Show gripping variations — standard, high collar, double lapel',
    'Avoid repeating the same single technique — assessors look for range'
  ],
  'Throws to both sides where possible': [
    'e.g. attempt Ko-uchi-gari on right side, then try Ouchi-gari on the left',
    'Even a single attempt to the weaker side demonstrates awareness',
    'Shows you are not one-dimensional and can adapt your grip'
  ],
  'Two tachi-waza of choice': [
    'Pick techniques you can demonstrate with good kuzushi, entry, and execution',
    'Show them first individually then as a combination AND as a counter',
    'e.g. Morote-seoi-nage + Ko-uchi-gari — demonstrate as a combo and as a counter to Ouchi-gari'
  ],
  'One ne-waza of choice': [
    'Pick a hold-down or turnover you can demonstrate cleanly',
    'Show it in a realistic situation — from a throw follow-up or from guard',
    'e.g. demonstrate Tate-shiho-gatame following a Ko-uchi-gari trip'
  ],
  'Show as combination, counter, and ne-waza transition': [
    'Combination: your chosen throw flows into a second attack',
    'Counter: use your chosen throw to beat Uke\'s attack',
    'Ne-waza transition: the throw leads directly into a hold-down without breaking'
  ],
  'Name three items from the Judo Moral Code': [
    'Any three of: Courtesy, Courage, Honesty, Honour, Modesty, Respect, Self-control, Friendship'
  ],
  'Give two examples of actions (not grips) against the contest rules for negative or safety reasons': [
    'Stepping out of the contest area to avoid being thrown',
    'Performing a diving or head-first drop throw (dangerous technique)'
  ],
  'Demonstrate the proper procedures for coming onto and leaving the mat for a contest': [
    'Remove footwear before stepping onto the mat edge',
    'Bow (Ritsurei) when stepping on — and again when stepping off — the mat',
    'Bow to opponent at the start and end of the contest'
  ],
  "Demonstrate the Referee\'s signals for: Mate Osaekomi Toketa Adjusting the judogi": [
    'Mate — one arm raised vertically, palm forward (stop)',
    'Osaekomi — arm extended downward, pointing toward athletes (hold is on)',
    'Toketa — both hands waved horizontally in front of body (hold broken)',
    'Adjusting judogi — both hands mime straightening a lapel at chest height'
  ],

  // ══ 4TH KYU → 3RD KYU (Orange → Green) ════════════════════════

  'Juji-gatame — sit-back entry': [
    'Control Uke\'s arm with both hands, place your hip across their shoulder',
    'Sit back pulling their arm with you — bring your legs across their body',
    'Legs pinch the arm at the shoulder — extend hips upward to apply lock'
  ],
  'Juji-gatame — rollover entry': [
    'Start with Uke on their back, you at their side controlling one arm',
    'Step over their head, then roll backward pulling their arm as you go',
    'End in standard Juji-gatame position — arm straight, wrist toward ceiling'
  ],
  'Juji-gatame — over-the-shoulder entry': [
    'Uke attempts Seoi-nage — as they pull you forward, grip their far arm',
    'Step over their shoulder and roll back to apply Juji-gatame',
    'Used to counter shoulder throws — exploits Uke\'s bent-over position'
  ],
  'Juji-gatame — entry from beneath': [
    'You are on your back with Uke between your legs (guard position)',
    'Control one arm, swing your body 90°, place leg across their face/neck',
    'Use both legs and hip extension to apply the cross armlock from underneath'
  ],
  'Four techniques — 2 combinations, 2 counters, 2 ne-waza transitions': [
    'Choose 4 techniques you are confident performing in both attack and defence',
    '2 combinations: e.g. Harai-goshi → Ouchi-gari, Uchi-mata → Ko-uchi-gari',
    '2 counters: e.g. counter Ouchi-gari with Uchi-mata, counter Harai-goshi with Ko-soto-gari',
    '2 ne-waza transitions: each tachi-waza throw flows directly into a hold without breaking'
  ],

  // ══ 3RD KYU → 2ND KYU (Green → Blue) ══════════════════════════

  'Ude-garami from Kuzure-kesa-gatame': [
    'From Kuzure-kesa-gatame, thread your arm under Uke\'s near arm',
    'Grip your own wrist (figure-4 lock) and rotate Uke\'s elbow upward',
    'Apply slowly and with control — this is a submission technique, tap immediately'
  ],
  'Koshi-jime — Uke attempts Seoi-otoshi': [
    'Uke drops for Seoi-otoshi — as they bend forward, step over their back',
    'Sit across their back and apply Koshi-jime using your hip against their neck',
    'Strangle applied with the hip bone against the carotid — control carefully'
  ],
  'Kata-te-jime — Uke in all fours position': [
    'Uke is on hands and knees — approach from behind or the side',
    'Reach one hand under their chin, grip their collar, apply single-hand strangle',
    'Use your body weight and the collar to create pressure across the neck'
  ],
  'Nami-juji-jime — Uke underneath (between Tori\'s legs)': [
    'You are on top of Uke in guard — Uke\'s legs around your waist',
    'Reach across and grip both lapels with palms facing upward (normal cross)',
    'Drive your knuckles into the sides of Uke\'s neck and extend forward'
  ],
  'Gyaku-juji-jime — Uke on top (between Tori\'s legs)': [
    'You are on your back with Uke in your guard — grip both lapels palms facing down (reverse cross)',
    'Pull Uke\'s lapels apart across their own neck applying the strangle',
    'Cross your wrists as you pull — the X shape creates the choking pressure'
  ],
  'Okuri-eri-jime — Uke makes Seoi-otoshi': [
    'Uke drops for Seoi-otoshi — thread your arm over their shoulder from behind',
    'Grip deep on the collar with your choke arm, other hand pulls for control',
    'Their bent-forward posture stretches their collar — apply the sliding strangle'
  ],

  // ══ 2ND KYU → 1ST KYU (Blue → Brown) ══════════════════════════

  'Sumi-gaeshi — two variations': [
    'Variation 1: Classic — pull Uke forward and over you with a sacrifice backwards',
    'Variation 2: From a grip fight — use when Uke is pulling you into them, redirect their energy'
  ],
  'Ushiro-goshi as counter to Harai-goshi': [
    'Uke attacks Harai-goshi — let them begin their sweep but lower your hips beneath them',
    'Grip around Uke\'s waist as they come up, straighten your legs and lift',
    'Drive Uke backward and down behind you — rear hip throw as counter'
  ],
  'Sumi-gaeshi as combination with Uchi-mata': [
    'Attack Uchi-mata — Uke defends by stepping back and spreading their legs',
    'Their wide, low stance is perfect for Sumi-gaeshi — drop, hook the leg and roll back',
    'The combination works because Uchi-mata defence creates the exact opening for Sumi-gaeshi'
  ],
  'Counter Koshi-guruma with Ura-nage': [
    'Uke attacks Koshi-guruma — they pull you over their hip from the front',
    'Reach around Uke\'s waist from behind as they turn in, straighten and arch back',
    'Ura-nage throws Uke backward over your head — use landing mat, prioritise safety'
  ],
  'San-gaku-jime — complex entry': [
    'e.g. Entry from guard — one arm controlled, leg swings over their neck',
    'e.g. Entry from turtle — roll Uke onto their back and lock triangle mid-roll',
    'Complex entry = not a static setup — must show dynamic transition into the triangle'
  ],
  'San-gaku-gatame — complex entry': [
    'Triangle hold (not strangle) — trap Uke\'s arm and head with your legs',
    'Entry: from side control, swing legs up and lock around Uke\'s head and near arm',
    'Hold them down in the triangle position — no submission, just control for 25 seconds'
  ],
  'San-gaku-osae-gatame — turnover and hold': [
    'Uke is on all fours or their side — apply triangle around neck and one arm',
    'Roll Uke onto their back while maintaining the triangle lock',
    'Hold down = San-gaku-osae-gatame — the triangle acts as both strangle and pin'
  ],
  'Hadaka-jime — Uke prone position': [
    'Uke is face-down — straddle or lie across their back',
    'Reach under Uke\'s chin with your forearm, other hand grips your own bicep (sleeper position)',
    'Drive your forearm into the front of the neck — apply slow and with control'
  ],
  'Kata-ha-jime — Uke all fours position': [
    'Uke is on all fours — approach from behind',
    'Thread one arm under their armpit and over their shoulder (arm bar), other arm goes across neck gripping collar',
    'Squeeze the two arm actions together — Uke\'s own shoulder assists the choke'
  ],
  'Give three examples of penalties in competition rules': [
    'Shido — minor penalty for passivity, false attacks, or minor rule infringement',
    'Accumulation of two Shido = Hansoku-make (disqualification)',
    'Direct Hansoku-make for serious, dangerous, or intentional forbidden techniques'
  ],
  'OR: One set of Nage-no-kata or Katame-no-kata': [
    'Nage-no-kata: 15 throws in 5 groups (Te-waza, Koshi-waza, Ashi-waza, Ma-sutemi, Yoko-sutemi)',
    'Katame-no-kata: 15 techniques in 3 groups (Osaekomi, Shime-waza, Kansetsu-waza)',
    'Must include formal opening and closing bowing procedures (Ritsurei and Zarei)'
  ],
};

// ── GRADING VIDEOS ──────────────────────────────────────
// Maps grading checklist item names -> video URLs
// Used as fallback in buildAdultRequirements for items not in TECHNIQUES
const GRADING_VIDEOS = {
  // ── White → Red belt ──────────────────────────────
  'Ushiro Ukemi':                                        'https://www.youtube.com/watch?v=_g7rvsxTkz8',
  'Yoko Ukemi':                                          'https://www.youtube.com/watch?v=JCwK1Ia4jsc',
  'Mae Mawari Ukemi (3 Versions)':                       'https://www.youtube.com/watch?v=kbiLot6laks',
  'Osoto-otoshi':                                        'https://www.youtube.com/watch?v=2DsVvDw7b8g',
  'Deashi-barai':                                        'https://www.youtube.com/watch?v=gW9LEvVmG2o',
  'Uki-goshi':                                           'https://www.youtube.com/watch?v=bPKwtB4lyOQ',
  'Kesa-gatame':                                         'https://www.youtube.com/watch?v=NDaQuJOFBYk',
  'Mune-gatame':                                         'https://www.youtube.com/watch?v=lIt5vywPBF0',
  'Kuzure-kesa-gatame':                                  'https://www.youtube.com/watch?v=Q2fb9jaoUFQ',
  'Osoto-otoshi into Kesa-gatame':                       'https://www.youtube.com/watch?v=aLpqnPTHpRk',
  'Deashi-barai into Mune-gatame':                       'https://www.youtube.com/watch?v=4dNBRCUGXQQ',
  'Uki-goshi into Kuzure-kesa-gatame':                   'https://www.youtube.com/watch?v=BaxDK6pljFU',
  "Escape from Kesa-gatame by trapping Uke's leg":       'https://youtu.be/5_TS0YHdxcQ?t=38',
  'Escape from Mune-gatame using a bridge and roll action': 'https://www.youtube.com/watch?v=yOHj5FQCCQM',
  'Escape from Kuzure-kesa-gatame using sit up and push':'https://youtu.be/-zFQ6h4yKT4?t=38',
  // ── Orange → Green belt ───────────────────────────
  // Orange belt — combinations
  'Ouchi-gari → Ko-uchi-gari':                           'https://www.youtube.com/watch?v=pJdSJRWI0oE',
  'Ko-uchi-gari → O-soto-gari or O-soto-gake':          'https://www.youtube.com/watch?v=Ti7tOtj5IwU',
  'Ko-uchi-gari → Morote-seoi-nage':                    'https://www.youtube.com/watch?v=glO4xOKWrq8',
  'Ippon-seoi-nage → Ko-uchi-gari':                     'https://www.youtube.com/watch?v=r1zGVN_S0IU',
  'Any technique combined with Seoi-otoshi or Ko-uchi-gari': 'https://www.youtube.com/watch?v=b0yLt7UHGZQ',
  // Orange belt — counters
  'Ouchi-gari countered by Tsurikomi-goshi':               'https://www.youtube.com/watch?v=EeEiF6rnoQs',
  'Tai-otoshi countered by Ko-soto-gari or Ko-soto-gake':  'https://www.youtube.com/watch?v=DAVeI6trzy4',
  // Orange belt — ne-waza
  'Escape from Kesa-gatame (bridge & roll)':               'https://www.youtube.com/watch?v=FuMecdRPD_0',
  'Move into Kesa-gatame from between uke\'s legs':        'https://www.youtube.com/watch?v=jo8GzB1PXaw',
  'Move into Yoko-shiho-gatame from between uke\'s legs':  'https://www.youtube.com/watch?v=XdGZ3-z-pPo',
  'Arm roll — uke approaching from front':              'https://youtu.be/D7cx9Dp_Ssk?t=216',
  'Arm roll — uke approaching from behind':             'https://youtu.be/D7cx9Dp_Ssk?t=246',
  'Turnover from underneath into Tate-shiho-gatame':       'https://youtu.be/D7cx9Dp_Ssk?t=269',
  // ── Orange → Green belt ───────────────────────────
  'Sasae-tsuri-komi-ashi':                               'https://www.youtube.com/watch?v=699i--pvYmE',
  'Okuri-ashi-barai':                                    'https://www.youtube.com/watch?v=nw1ZdRjrdRI',
  'Ude-gatame':                                          'https://www.youtube.com/watch?v=BnTsCwHEO_w',
  'Juji-gatame — sit-back entry':                        'https://youtu.be/pyuLU_zyZyk?t=233',
  'Juji-gatame — rollover entry':                        'https://youtu.be/pyuLU_zyZyk?t=281',
  'Juji-gatame — over-the-shoulder entry':               'https://youtu.be/pyuLU_zyZyk?t=310',
  'Juji-gatame — entry from beneath':                    'https://youtu.be/pyuLU_zyZyk?t=333',
  'Four techniques — 2 combinations, 2 counters, 2 ne-waza transitions': 'https://youtu.be/pyuLU_zyZyk?t=381',
  // ── Green → Blue belt ─────────────────────────────
  'Soto-maki-komi':                                      'https://www.youtube.com/watch?v=bWG9O1BVKtQ',
  'Koshi-jime':                                          'https://www.youtube.com/shorts/heeAEfp4MNQ',
  'Kata-te-jime':                                        'https://www.youtube.com/watch?v=cHeIs-fSqwE',
  'Ude-garami from Kuzure-kesa-gatame':                  'https://www.youtube.com/watch?v=0Ux5wWA3WZg',
  'Koshi-jime — Uke attempts Seoi-otoshi':         'https://youtu.be/Ttf_uj2m1TY?t=324',
  'Kata-te-jime — Uke in all fours position':      'https://youtu.be/Ttf_uj2m1TY?t=390',
  "Nami-juji-jime — Uke underneath (between Tori\'s legs)": 'https://www.youtube.com/watch?v=k2cHry9HByQ',
  "Gyaku-juji-jime — Uke on top (between Tori\'s legs)":   'https://www.youtube.com/watch?v=t3tQriIPdlI',
  'Okuri-eri-jime — Uke makes Seoi-otoshi':        'https://youtu.be/Ttf_uj2m1TY?t=444',
  // ── Blue → Brown belt ─────────────────────────────
  'Sode-tsuri-komi-goshi':                               'https://www.youtube.com/watch?v=QsmAxpmYLOI',
  'Ko-uchi-gake-maki-komi':                              'https://www.youtube.com/watch?v=_1eygIXLD_w',
  'San-gaku-jime':                                       'https://www.youtube.com/watch?v=lq1CUBRAm7s',
  'San-gaku-gatame':                                     'https://www.youtube.com/watch?v=zQg6zaL09aI',
  'San-gaku-osae-gatame':                                'https://www.youtube.com/watch?v=JIulw4NgRvo&t=2s',
  'Sumi-gaeshi — two variations':                  'https://www.youtube.com/watch?v=y_73gsi1V00',
  'Ushiro-goshi as counter to Harai-goshi':              'https://www.youtube.com/watch?v=8XGiwPodgls',
  'Sumi-gaeshi as combination with Uchi-mata':           'https://www.youtube.com/watch?v=Xx6HJ4Mfvfk',
  'Counter Koshi-guruma with Ura-nage':                  'https://youtu.be/2qdE8x2CwDo?t=375',
  'San-gaku-jime — complex entry':                 'https://youtu.be/2qdE8x2CwDo?t=522',
  'San-gaku-gatame — complex entry':               'https://www.youtube.com/shorts/q3RpzHYhFX4',
  'San-gaku-osae-gatame — turnover and hold':      'https://www.youtube.com/watch?v=JIulw4NgRvo',
  'Hadaka-jime — Uke prone position':              'https://www.youtube.com/shorts/OdCMntXQH7Q',
  'Kata-ha-jime — Uke all fours position':         'https://www.youtube.com/watch?v=BXa5NFIuCyk',

  // ── White → Yellow belt ───────────────────────────
  'Mae-ukemi':                                               'https://www.youtube.com/watch?v=veM5RFdjo0U',
  'Tai-otoshi':                                              'https://www.youtube.com/watch?v=DUiZ8JZkGx8',
  'Ippon-seoi-nage':                                         'https://www.youtube.com/watch?v=OmKfUXAAdZ0',
  'Ouchi-gari':                                              'https://www.youtube.com/watch?v=0itJFhV9pDQ',
  'Yoko-shiho-gatame':                                       'https://www.youtube.com/watch?v=TT7XJVSEQxA',
  'Tate-shiho-gatame':                                       'https://www.youtube.com/watch?v=XjWzNxlKH1M',
  'Kami-shiho-gatame':                                       'https://www.youtube.com/watch?v=HFuMjOv0WN8',
  'Tai-otoshi \u2192 Yoko-shiho-gatame':                    'https://www.youtube.com/watch?v=caXBWqLeW6I',
  'Ippon-seoi-nage \u2192 Kami-shiho-gatame':               'https://www.youtube.com/watch?v=jBl0Q-Egbdg',
  'Ouchi-gari \u2192 Tate-shiho-gatame':                    'https://www.youtube.com/watch?v=OH8PgkWGxQU',
  'Escape from Kami-shiho-gatame (action & reaction)':       'https://www.youtube.com/watch?v=Hl0C4RRavHo',
  'Escape from Tate-shiho-gatame (clamp & roll)':            'https://www.youtube.com/watch?v=PV_anL347rw',
  'Escape from Yoko-shiho-gatame (trap, bridge & roll)':     'https://www.youtube.com/watch?v=yK_GSamSPko',
  'Turnover into Kesa-gatame (uke all fours)':               'https://www.youtube.com/watch?v=r-ODhj19vL0',
  'Turnover into Mune-gatame (uke all fours)':               'https://www.youtube.com/watch?v=T3dPwpO_ttQ',
  'Turnover into Yoko-shiho-gatame (uke face-down)':         'https://www.youtube.com/watch?v=19TTB0bdL7w',
  'Standard grips \u2014 right and left':                   'https://www.youtube.com/watch?v=T6c_FpfVZy4',
  'Right vs left, double lapel, high collar grips':          'https://www.youtube.com/watch?v=97djf2GY6I0',
  'Nage-komi in light randori':                              'https://www.youtube.com/watch?v=QUKkd08DT9M',
  // ── Yellow → Orange belt ──────────────────────────
  'Tsurikomi-goshi':                                         'https://www.youtube.com/watch?v=McfzA0yRVt4',
  'O-goshi':                                                 'https://www.youtube.com/watch?v=yhu1mfy2vJ4',
  'Seoi-otoshi':                                             'https://www.youtube.com/watch?v=vu1TMVNnq34',
  'Morote-seoi-nage':                                        'https://www.youtube.com/watch?v=UjtL1h9htb8',
  'Ko-uchi-gari':                                            'https://www.youtube.com/watch?v=3Jb3tZvr9Ng',
  'Ko-soto-gake':                                            'https://www.youtube.com/watch?v=8b6kY4s4zH4',
  'Ko-soto-gari':                                            'https://www.youtube.com/watch?v=jeQ541ScLB4',
  'O-soto-gari':                                             'https://www.youtube.com/watch?v=c-A_nP7mKAc',
  'Randori demonstration':                                   'https://www.youtube.com/watch?v=JCFO2BeL1oU',
  // ── Orange → Green belt ───────────────────────────
  'Harai-goshi':                                             'https://www.youtube.com/watch?v=qTo8HlAAkOo',
  'Uchi-mata':                                               'https://www.youtube.com/watch?v=iUpSu5J-bgw',
  'Hiza-guruma':                                             'https://www.youtube.com/watch?v=JPJx9-oAVns',
  'Hane-goshi':                                              'https://www.youtube.com/watch?v=M9_7De6A1kk',
  'Morote-eri-seoi-nage':                                    'https://www.youtube.com/watch?v=NfkQ3qb4pZ4',
  'Waki-gatame':                                             'https://www.youtube.com/watch?v=OtqfF2D8kIc',
  'Hiza-gatame':                                             'https://www.youtube.com/watch?v=i6NFihgG4PE',
  'Juji-gatame':                                             'https://www.youtube.com/watch?v=jOp5XyPd59M',
  // ── Green → Blue belt ─────────────────────────────
  'Tani-otoshi':                                             'https://www.youtube.com/watch?v=3b9Me3Fohpk',
  'Yoko-guruma':                                             'https://www.youtube.com/watch?v=MehP6I5cY2c',
  'Tomoe-nage':                                              'https://www.youtube.com/watch?v=TON-fQk3aTc',
  'Yoko-tomoe-nage':                                         'https://www.youtube.com/watch?v=9-byceOifXo',
  'Uki-waza':                                                'https://www.youtube.com/watch?v=weVOpJ63gII',
  'Okuri-eri-jime':                                          'https://www.youtube.com/watch?v=EiqyoVcIAi8',
  'Nami-juji-jime':                                          'https://www.youtube.com/watch?v=k2cHry9HByQ',
  'Gyaku-juji-jime':                                         'https://www.youtube.com/watch?v=t3tQriIPdlI',
  'Kata-juji-jime':                                          'https://www.youtube.com/watch?v=3VZVUAmiMD8',
  'Ude-garami':                                              'https://www.youtube.com/watch?v=AIlTvZb4RlE',
  // ── Blue → Brown belt ─────────────────────────────
  'Sumi-gaeshi':                                             'https://www.youtube.com/watch?v=5VhduA5xkbA',
  'Yoko-gake':                                               'https://www.youtube.com/watch?v=tP1Sj1uDfSo',
  'Ushiro-goshi':                                            'https://www.youtube.com/watch?v=ORIYstuxYT8',
  'Ura-nage':                                                'https://www.youtube.com/watch?v=Fgi9b8DJ5sQ',
  'Uki-otoshi':                                              'https://www.youtube.com/watch?v=6H5tmncOY4Q',
  'Koshi-guruma':                                            'https://www.youtube.com/watch?v=SU7Id6uVJ44',
  'Kata-ha-jime':                                            'https://www.youtube.com/watch?v=yaTGgRjnwB8',
  'Hadaka-jime':                                             'https://www.youtube.com/watch?v=9f0n8jez7iA',
};

// ══════════════════════════════════════════════════════════════════
//  TECHNIQUE_DATA — Rich lesson content for all belt path techniques
//  Each entry: { cat, steps: [[icon,label,text]×3], mistakes: [[title,text]×2], tip }
//  cat: 'ukemi' | 'throw' | 'hold' | 'lock' | 'strangle'
// ══════════════════════════════════════════════════════════════════
const TECHNIQUE_DATA = {

  // ── UKEMI ──────────────────────────────────────────────────────
  'Ushiro Ukemi': {
    cat: 'ukemi',
    steps: [
      ['self_improvement','Tuck','Tuck your chin firmly to your chest — protect your head throughout.'],
      ['pan_tool','Slap','Both arms at 45° — slap the mat hard just before your back lands.'],
      ['expand_more','Land','Roll through your spine diagonally — never land flat and rigid.']
    ],
    mistakes: [
      ['Head goes back','Chin must stay tucked — a head impact on the mat is dangerous.'],
      ['Weak slap','The mat slap absorbs the impact — make it loud and firm.']
    ],
    tip: 'Practise the slap alone first — a strong mat slap is more important than the roll itself.'
  },
  'Yoko Ukemi': {
    cat: 'ukemi',
    steps: [
      ['self_improvement','Tuck','Keep chin tucked, feet together as you go down.'],
      ['pan_tool','Arm Out','Extend the lower arm and slap the mat firmly at 45°.'],
      ['expand_more','Land','Land on thigh → hip → lat — never on the shoulder point.']
    ],
    mistakes: [
      ['Landing on the shoulder','Shoulder impacts cause injury — land on the lat and side of the body.'],
      ['Skipping the slap','Without the slap, full force travels to your ribs and arm.']
    ],
    tip: 'Think "thigh → hip → lat" — those three points hit in rapid sequence, spreading the impact.'
  },
  'Mae Mawari Ukemi (3 Versions)': {
    cat: 'ukemi',
    steps: [
      ['directions_run','Step','Step forward and place one hand on the mat, fingers pointing inward.'],
      ['rotate_right','Roll','Roll diagonally across your arm, shoulder, and back — not the spine.'],
      ['expand_more','Rise','Come up smoothly to standing or a defensive groundwork position.']
    ],
    mistakes: [
      ['Rolling over the spine','The roll travels diagonally — spine impact causes injury.'],
      ['Straight arm','A stiff arm will buckle — soften the elbow and roll through it.']
    ],
    tip: 'Draw a diagonal line from your hand to the opposite hip — that is your roll path.'
  },
  'Mae-ukemi': {
    cat: 'ukemi',
    steps: [
      ['front_hand','Arms','Extend both arms in front at 45°, wrists slightly bent.'],
      ['pan_tool','Slap','As you fall forward, slap both forearms simultaneously on the mat.'],
      ['check_circle','Land','Land on forearms and toes — chest stays clear of the mat.']
    ],
    mistakes: [
      ['Palms only','Use the full forearm — palms alone cannot absorb the shock.'],
      ['Chin not tucked','Keep your chin up and away from the mat to protect your face.']
    ],
    tip: 'Both forearms hit at exactly the same moment — simultaneous contact distributes the impact evenly.'
  },

  // ── WHITE → RED: FUNDAMENTAL TACHI-WAZA ───────────────────────
  'Osoto-otoshi': {
    cat: 'throw',
    steps: [
      ['front_hand','Kuzushi','Drive uke\'s weight directly backward onto their heel.'],
      ['directions_run','Entry','Step outside uke\'s lead leg — shoulder-to-shoulder contact.'],
      ['trending_up','Drop','Sit them straight down — this is a drop, not a reap.']
    ],
    mistakes: [
      ['Trying to sweep','Osoto-otoshi is a drop, not a reap — don\'t swing the leg.'],
      ['Losing chest drive','You must maintain forward body pressure to take uke\'s balance.']
    ],
    tip: 'Imagine sitting uke into a chair directly behind them — drive back and down, not sideways.'
  },
  'Deashi-barai': {
    cat: 'throw',
    steps: [
      ['front_hand','Kuzushi','Draw uke forward as their weight transfers to the target foot.'],
      ['directions_run','Timing','Sweep at the exact moment the foot touches the mat.'],
      ['trending_up','Sweep','Flat brushing action — use the sole, stay low, sweep away.']
    ],
    mistakes: [
      ['Too late','Once weight is loaded the foot cannot be swept — catch it as it lands.'],
      ['Kicking not sweeping','A sweep is a brushing motion, not a kick — use the sole, stay flat.']
    ],
    tip: 'Timing is everything — practise reading uke\'s steps until you feel the moment naturally.'
  },
  'Uki-goshi': {
    cat: 'throw',
    steps: [
      ['front_hand','Kuzushi','Pull uke forward and across their front.'],
      ['rotate_right','Entry','Pivot in — hip slides to touch uke\'s hip, not deep, just contact.'],
      ['trending_up','Kake','Pull with both arms and unwind the hips to swing uke over.']
    ],
    mistakes: [
      ['Hip too deep','Uki-goshi is a floating hip — deep contact becomes O-goshi. Keep it light.'],
      ['Pulling down','Pull forward and across, never downward — downward kills the float.']
    ],
    tip: 'The "floating" in the name is literal — uke\'s hip barely touches yours as they go over.'
  },

  // ── WHITE → RED: OSAEKOMI-WAZA ─────────────────────────────────
  'Kesa-gatame': {
    cat: 'hold',
    steps: [
      ['front_hand','Position','Sit tight to uke\'s side — your hip connected to their ribs.'],
      ['lock','Arms','One arm under uke\'s neck gripping the collar. Other arm traps their arm tightly.'],
      ['check_circle','Hold','Spread your legs wide for base, keep weight low — do not rise up.']
    ],
    mistakes: [
      ['Sitting upright','A high centre of gravity makes you easy to roll — stay low.'],
      ['Loose arm trap','Uke\'s arm must be clamped tight — loose grip allows them to free it.']
    ],
    tip: 'Make yourself heavy — sink your hips and imagine pressing uke through the mat.'
  },
  'Mune-gatame': {
    cat: 'hold',
    steps: [
      ['front_hand','Position','Lie chest-to-chest across uke, perpendicular to their body.'],
      ['lock','Arms','Reach under both armpits and grip the judogi behind their shoulders.'],
      ['check_circle','Control','Drive your chest into theirs — spread your legs wide for stability.']
    ],
    mistakes: [
      ['Head too close','Head should be to the side — if uke bridges, you won\'t clash heads.'],
      ['Arms too shallow','Shallow arm position lets uke turn into you and escape.']
    ],
    tip: 'Drive your sternum into their chest — pressure is central, not on one shoulder.'
  },
  'Kuzure-kesa-gatame': {
    cat: 'hold',
    steps: [
      ['front_hand','Position','Sit beside uke — near hip on mat, tucked to their side.'],
      ['lock','Arms','Thread your near arm under uke\'s arm, gripping behind the shoulder or lat.'],
      ['check_circle','Control','Other arm controls the neck — weight low, legs wide.']
    ],
    mistakes: [
      ['Sitting on top','You sit beside them, not on top — sitting on them lets them bridge you off.'],
      ['Forgetting the arm trap','The trapped arm is key — if it\'s free, uke can turn in and escape.']
    ],
    tip: 'The "kuzure" (broken) position gives you more control — your arm wraps deeper around the shoulder.'
  },

  // ── RED → YELLOW: TACHI-WAZA ───────────────────────────────────
  'Tai-otoshi': {
    cat: 'throw',
    steps: [
      ['front_hand','Kuzushi','Pull uke diagonally forward off their toes.'],
      ['directions_run','Entry','Drop to squat — blocking leg extends flat across uke\'s shins.'],
      ['trending_up','Kake','Drive arms forward and down, rotating uke over the leg block.']
    ],
    mistakes: [
      ['Block too wide','The block must be tight across the shins, not extended out in front.'],
      ['Body pulls away','Pulling back creates space for uke to step over your leg.']
    ],
    tip: 'The block is a wall — plant it low and firm, then drive uke over it with your whole body.'
  },
  'Ippon-seoi-nage': {
    cat: 'throw',
    steps: [
      ['front_hand','Kuzushi','Pull uke sharply forward and upward.'],
      ['rotate_right','Entry','Drop to one knee — arm threads under uke\'s armpit to the shoulder.'],
      ['trending_up','Kake','Extend legs, pull arms down, rotate uke over your shoulder.']
    ],
    mistakes: [
      ['Hip too high','High hips mean uke crashes onto your back — drop low so they go over the shoulder.'],
      ['Half turn','Half-pivots give uke time to block — commit to the full 180°.']
    ],
    tip: 'Your back must be flat when you turn in — any bend lets uke land on top of you.'
  },
  'Ouchi-gari': {
    cat: 'throw',
    steps: [
      ['front_hand','Kuzushi','Drive uke\'s weight back and onto the target leg.'],
      ['directions_run','Entry','Step between uke\'s legs with your reaping leg.'],
      ['trending_up','Reap','Drive the reap through uke\'s inner thigh — project them backward.']
    ],
    mistakes: [
      ['Reaping too early','Commit uke\'s weight backward first — early reap has nothing to catch.'],
      ['Leaning back','You must stay upright and drive forward as the leg reaps.']
    ],
    tip: 'Push and reap simultaneously — upper body drives back as the leg sweeps through.'
  },

  // ── RED → YELLOW: OSAEKOMI-WAZA ────────────────────────────────
  'Yoko-shiho-gatame': {
    cat: 'hold',
    steps: [
      ['front_hand','Approach','Come from uke\'s side — lie alongside them at 90°.'],
      ['lock','Arms','One arm under neck over far shoulder. Other arm between uke\'s legs gripping belt or gi.'],
      ['check_circle','Pin','Chest on their chest, legs spread wide, hips low.']
    ],
    mistakes: [
      ['Gap between bodies','Any space lets uke bridge and roll — stay chest-to-chest.'],
      ['Legs together','Wide legs give stability — narrow stance makes you easy to roll.']
    ],
    tip: 'The arm between the legs is your anchor — a firm grip here makes the pin very hard to break.'
  },
  'Tate-shiho-gatame': {
    cat: 'hold',
    steps: [
      ['front_hand','Mount','Straddle uke — sit on their lower chest, knees down either side.'],
      ['lock','Arms','Hands under uke\'s head gripping the collar behind their neck.'],
      ['check_circle','Control','Hook your feet under uke\'s legs — sink your weight down.']
    ],
    mistakes: [
      ['Too far back','Sitting too far back lets uke sit up into you — stay on the chest.'],
      ['No leg hooks','Leg hooks prevent the bridge-and-roll escape.']
    ],
    tip: 'Relax your upper body weight downward — fighting bridges wastes energy, just stay heavy.'
  },
  'Kami-shiho-gatame': {
    cat: 'hold',
    steps: [
      ['front_hand','Position','Kneel at uke\'s head — lie flat, chest to chest.'],
      ['lock','Arms','Reach under both armpits and grip their belt or the back of their gi.'],
      ['check_circle','Control','Spread your legs wide, toes on the mat — hips low.']
    ],
    mistakes: [
      ['Elbows flaring','Wide elbows let uke trap them and turn in — keep elbows tight.'],
      ['Hips too high','High hips let uke bridge and throw you over their head.']
    ],
    tip: 'Pull uke\'s arms tight to their sides with your elbows — this removes most escape options.'
  },

  // ── YELLOW → ORANGE: TACHI-WAZA ───────────────────────────────
  'Tsurikomi-goshi': {
    cat: 'throw',
    steps: [
      ['front_hand','Kuzushi','Pull up on the collar (tsuri) and out on the sleeve simultaneously.'],
      ['rotate_right','Entry','Pivot in deeply — hip to hip, feet inside uke\'s feet.'],
      ['trending_up','Kake','Pull up and around while extending hips — rotate uke over your hip.']
    ],
    mistakes: [
      ['No upward lift','The collar lift creates the entry — without it the throw stalls immediately.'],
      ['Shallow hip entry','Your hip must be in front of uke\'s — shallow entry means no throw.']
    ],
    tip: 'The collar pull is vertical — lift uke\'s chin up as you enter, then rotate over.'
  },
  'O-goshi': {
    cat: 'throw',
    steps: [
      ['front_hand','Kuzushi','Pull uke forward onto the balls of their feet.'],
      ['rotate_right','Entry','Wrap your arm around uke\'s waist — pivot in, hip to hip.'],
      ['trending_up','Kake','Bend forward, pull up and over — uke rotates over your hip.']
    ],
    mistakes: [
      ['Arm too high','Grip the waist, not the shoulder — high arm lifts uke off the hip.'],
      ['Not bending forward','Staying upright means uke goes sideways, not over. Bow forward to load them.']
    ],
    tip: 'O-goshi rewards commitment — once you\'re in, bend hard and pull their body over yours.'
  },
  'Seoi-otoshi': {
    cat: 'throw',
    steps: [
      ['front_hand','Kuzushi','Pull uke sharply forward and across.'],
      ['rotate_right','Entry','Drop to both knees — arm under uke\'s armpit at the shoulder.'],
      ['trending_up','Kake','Drive uke forward over your shoulder from the kneeling position.']
    ],
    mistakes: [
      ['Not dropping low','Stay upright and uke lands on you rather than going over.'],
      ['Hesitating in entry','Hesitation telegraphs the throw — commit from start to finish.']
    ],
    tip: 'Use the ground as your power base — push up from your knees to launch uke forward.'
  },
  'Morote-seoi-nage': {
    cat: 'throw',
    steps: [
      ['front_hand','Kuzushi','Two-handed pull — both arms draw uke forward simultaneously.'],
      ['rotate_right','Entry','Deep hip pivot, both arms pulling sleeve and collar.'],
      ['trending_up','Kake','Extend legs — both arms rotate uke off both shoulders together.']
    ],
    mistakes: [
      ['One arm dominant','Both arms must pull equally — one arm alone kills the rotation.'],
      ['Shallow entry','Both hips must be in front of uke\'s — stay shallow and the throw stalls.']
    ],
    tip: 'Think two-wheel drive — both arms load and pull at the same moment for maximum rotation.'
  },
  'Ko-uchi-gari': {
    cat: 'throw',
    steps: [
      ['front_hand','Kuzushi','Subtle forward-diagonal break as uke steps.'],
      ['directions_run','Timing','Reap as uke\'s foot lands — use their own step against them.'],
      ['trending_up','Reap','Small inner reap of the near ankle — precise, not forceful.']
    ],
    mistakes: [
      ['Over-committing','Ko-uchi is small and precise — a big swing gives nothing.'],
      ['Wrong timing','Miss the step and you lift their loaded leg — they step straight over.']
    ],
    tip: 'Ko-uchi is about timing and precision — a small, well-timed reap beats a big, mistimed one every time.'
  },
  'Ko-soto-gake': {
    cat: 'throw',
    steps: [
      ['front_hand','Kuzushi','Push uke\'s weight backward onto the target leg.'],
      ['directions_run','Hook','Hook your foot behind uke\'s near ankle from the outside.'],
      ['trending_up','Drive','Drive your whole body forward — the hook takes the base.']
    ],
    mistakes: [
      ['Hook on the calf','The hook must be at the ankle — calf hook lets uke step over it.'],
      ['No forward drive','The hook alone won\'t score — your body must drive through uke.']
    ],
    tip: 'The hook is a stationary anchor — your body drives forward through uke to make the throw work.'
  },
  'Ko-soto-gari': {
    cat: 'throw',
    steps: [
      ['front_hand','Kuzushi','Push uke\'s weight onto the target leg.'],
      ['directions_run','Entry','Small step to the outside of uke\'s near foot.'],
      ['trending_up','Reap','Light outer reap of the ankle — small and sharp.']
    ],
    mistakes: [
      ['Reaping the calf','Target the ankle — ankle reap removes the base cleanly.'],
      ['Unloaded target','Load uke\'s weight onto the foot first — reaping an unloaded foot fails.']
    ],
    tip: 'Ko-soto-gari is most effective when uke squares up and transfers weight forward — attack that moment.'
  },
  'O-soto-gari': {
    cat: 'throw',
    steps: [
      ['front_hand','Kuzushi','Drive uke\'s weight onto the target leg with shoulder pressure.'],
      ['directions_run','Entry','Step alongside uke, shoulder-to-shoulder, outside their leg.'],
      ['trending_up','Reap','Large powerful backward reap — drive through and past the leg.']
    ],
    mistakes: [
      ['Reap stops at contact','The reap must drive through and past the leg, not swing to it.'],
      ['No shoulder connection','Shoulder drives weight onto the leg — no contact, no kuzushi.']
    ],
    tip: 'Shoulder loads the weight, reap removes the leg — both must happen at the same instant.'
  },

  // ── ORANGE → GREEN: TACHI-WAZA ────────────────────────────────
  'Harai-goshi': {
    cat: 'throw',
    steps: [
      ['front_hand','Kuzushi','Pull up and forward — lift uke onto their toes.'],
      ['rotate_right','Entry','Pivot in, hip past uke\'s hip, sweeping leg cocked high.'],
      ['trending_up','Sweep','Drive the straight leg fully through uke\'s hips — full commitment.']
    ],
    mistakes: [
      ['Short sweep','Half-swing only bumps uke — the leg must drive all the way through.'],
      ['Bent sweeping leg','Straight leg = maximum force. Bent leg = weak and ineffective.']
    ],
    tip: 'The sweep starts from the hip, not the knee — generate rotation first, then release the leg.'
  },
  'Uchi-mata': {
    cat: 'throw',
    steps: [
      ['front_hand','Kuzushi','Draw uke forward and up onto their toes.'],
      ['directions_run','Entry','Deep pivot in — foot planted between uke\'s feet.'],
      ['trending_up','Reap','Inner thigh reap driving upward between uke\'s legs.']
    ],
    mistakes: [
      ['Shallow entry','Foot must land between uke\'s feet — shallow entry and the reap misses.'],
      ['Reaping the knee','Target the inner thigh, not the knee — knee contact risks injury.']
    ],
    tip: 'Deeper entry = more powerful reap — commit to going between uke\'s legs, not around them.'
  },
  'Hiza-guruma': {
    cat: 'throw',
    steps: [
      ['front_hand','Kuzushi','Move uke with circular footwork — step sideways to load one knee.'],
      ['directions_run','Contact','Place the sole of your foot flat against uke\'s knee from the outside.'],
      ['trending_up','Rotate','Rotate uke around the blocked knee with both hands — circular motion.']
    ],
    mistakes: [
      ['Kicking the knee','Contact is light — you\'re blocking, not kicking. Hands do the rotation.'],
      ['Static footwork','This throw needs movement — circular pull dictates the rotation.']
    ],
    tip: 'Think of the knee contact as a pivot point — your hands rotate uke around it like a wheel.'
  },
  'Sasae-tsuri-komi-ashi': {
    cat: 'throw',
    steps: [
      ['front_hand','Kuzushi','Draw uke forward and off balance with a lifting collar grip.'],
      ['directions_run','Block','Place the sole of your foot against uke\'s ankle — block it.'],
      ['trending_up','Rotate','Arms rotate uke forward over the blocked ankle.']
    ],
    mistakes: [
      ['Contact too high','Block the ankle, not the shin — higher contact doesn\'t stop the foot.'],
      ['No upward pull','The collar lift commits uke\'s weight forward onto the block.']
    ],
    tip: 'The ankle block is static — all the energy comes from your arms pulling uke forward and over.'
  },
  'Hane-goshi': {
    cat: 'throw',
    steps: [
      ['front_hand','Kuzushi','Pull uke forward and upward — lift them onto their toes.'],
      ['rotate_right','Entry','Pivot in deep, knee bent, coiling the spring.'],
      ['trending_up','Spring','Extend the bent leg explosively under uke\'s thighs.']
    ],
    mistakes: [
      ['Entering straight-legged','The bent knee is the spring — no bend means no power.'],
      ['Sweeping not springing','Hane = spring, not sweep — drive the knee up and out.']
    ],
    tip: 'Coil before you spring — the deeper the knee bend on entry, the more explosive the throw.'
  },
  'Okuri-ashi-barai': {
    cat: 'throw',
    steps: [
      ['front_hand','Movement','Create lateral movement — step uke sideways with footwork.'],
      ['directions_run','Timing','Sweep as uke\'s feet come together — both feet swept at once.'],
      ['trending_up','Sweep','Flat sweep across both ankles as they momentarily converge.']
    ],
    mistakes: [
      ['Sweeping one foot','Both feet must be swept when close together — targeting one misses entirely.'],
      ['Wrong timing','Too early or too late = feet are apart. Hit the moment of convergence.']
    ],
    tip: 'Watch uke\'s shoulders, not their feet — the shoulder dip tells you when the feet are close.'
  },
  'Morote-eri-seoi-nage': {
    cat: 'throw',
    steps: [
      ['front_hand','Kuzushi','Both hands grip the lapels — pull uke sharply forward.'],
      ['rotate_right','Entry','Pivot in — both elbows drive upward under uke\'s armpits at the collar.'],
      ['trending_up','Kake','Extend legs and rotate uke over both shoulders simultaneously.']
    ],
    mistakes: [
      ['Elbows too low','Drive elbows into the armpits — low elbows means uke doesn\'t go over.'],
      ['Half pivot','The collar grip limits rotation — commit to the full 180° turn.']
    ],
    tip: 'Compensate for the restricted shoulder rotation by driving elbows high and forward.'
  },

  // ── ORANGE → GREEN: KANSETSU-WAZA ─────────────────────────────
  'Juji-gatame': {
    cat: 'lock',
    steps: [
      ['front_hand','Control','Secure uke\'s arm with both hands — thumb side pointing up.'],
      ['lock','Position','Legs cross over uke\'s chest, pinching the upper arm between your thighs.'],
      ['trending_up','Extension','Lift hips upward — hip extension applies the armlock.']
    ],
    mistakes: [
      ['Thumb pointing down','Thumb must point up — thumb down rotates the elbow the wrong way.'],
      ['Pulling the arm','The lock comes from hip extension, not arm pulling — hips up.']
    ],
    tip: 'Squeeze knees together first to trap the arm, then extend the hips — the order matters.'
  },
  'Ude-gatame': {
    cat: 'lock',
    steps: [
      ['front_hand','Grip','Control uke\'s wrist with both hands, palm down.'],
      ['lock','Lever','Press down on the back of uke\'s elbow with your forearm or chest.'],
      ['trending_up','Apply','Straighten uke\'s arm fully while the lever pushes down.']
    ],
    mistakes: [
      ['Bending uke\'s arm','The lock requires a straight arm — any bend removes the lever action.'],
      ['Arm strength only','Use body weight to push the elbow down, not just arm force.']
    ],
    tip: 'Control the wrist first — the wrist controls the elbow, which controls the shoulder.'
  },
  'Waki-gatame': {
    cat: 'lock',
    steps: [
      ['front_hand','Trap','Grip uke\'s wrist and clamp their arm under your armpit tightly.'],
      ['lock','Step In','Step into uke — keep their arm straight and trapped.'],
      ['trending_up','Pressure','Drive your body weight down and forward — the armpit is the lever.']
    ],
    mistakes: [
      ['Loose armpit','The arm must be clamped tight — any gap removes the lock.'],
      ['Standing upright','Stay low and drive forward — standing releases the pressure.']
    ],
    tip: 'Apply decisively before uke can bend their elbow — hesitation lets them escape.'
  },
  'Hiza-gatame': {
    cat: 'lock',
    steps: [
      ['front_hand','Control','Sit back pulling uke\'s arm toward you — grip the wrist firmly.'],
      ['lock','Knee on arm','Place your knee on uke\'s upper arm just above the elbow.'],
      ['trending_up','Apply','Straighten uke\'s arm and press your knee down — lock engages.']
    ],
    mistakes: [
      ['Knee on the joint','Aim just above the elbow, not on the joint itself.'],
      ['Bent arm','Arm must be straight — bent arm means no lock, uke can resist.']
    ],
    tip: 'Control the wrist angle — wrist direction determines how effective the knee lever is.'
  },

  // ── GREEN → BLUE: TACHI-WAZA ───────────────────────────────────
  'Soto-maki-komi': {
    cat: 'throw',
    steps: [
      ['front_hand','Kuzushi','Pull uke forward and off their near side.'],
      ['rotate_right','Wrap','Pivot in and wrap your arm over uke\'s arm, trapping it to your side.'],
      ['trending_up','Sacrifice','Fall to your side — body weight takes uke in a rolling motion.']
    ],
    mistakes: [
      ['Loose arm wrap','The trapped arm must be clamped tight — loose wrap and uke steps out.'],
      ['Hesitating mid-roll','Hesitate and uke lands on top of you — commit fully through the technique.']
    ],
    tip: 'The winding is a sacrifice — fall decisively and trust the arm wrap to take uke down.'
  },
  'Tani-otoshi': {
    cat: 'throw',
    steps: [
      ['front_hand','Kuzushi','Draw uke forward as they load on one leg.'],
      ['directions_run','Sit-out','Step behind uke and sit your body down to the mat beside them.'],
      ['trending_up','Drop','Take uke backward and sideways over your extended leg.']
    ],
    mistakes: [
      ['Too far from uke','Your body must be tight to uke — sitting away means no transfer of force.'],
      ['Drop without pull','The arm pull must coordinate with the drop — drop alone scores nothing.']
    ],
    tip: 'Think "valley drop" — collapse uke into the valley between your legs and body.'
  },
  'Yoko-guruma': {
    cat: 'throw',
    steps: [
      ['front_hand','Kuzushi','Draw uke forward and to the side with a strong arm pull.'],
      ['rotate_right','Wrap','Drop to your side, wrapping your arm around uke\'s near hip or leg.'],
      ['trending_up','Roll','Roll uke over your body using the hip wrap and arm pull.']
    ],
    mistakes: [
      ['Half-hearted sacrifice','Commit fully — going halfway leaves both of you down with no score.'],
      ['Losing head control','The arm pull must control uke\'s upper body throughout the roll.']
    ],
    tip: 'Explosive commitment wins this throw — hesitation lets uke post a hand and block the roll.'
  },
  'Tomoe-nage': {
    cat: 'throw',
    steps: [
      ['front_hand','Kuzushi','Pull uke sharply forward and off balance.'],
      ['directions_run','Foot plant','Drop to your back — place one foot on uke\'s hip or lower abdomen.'],
      ['trending_up','Launch','Extend your leg to project uke over and beyond your head.']
    ],
    mistakes: [
      ['Foot too low','Foot must be on the hip, not the thigh — thigh placement sends uke sideways.'],
      ['Pulling before foot is set','Set the foot first, then straighten the leg — reverse order stalls the throw.']
    ],
    tip: 'The foot is a launch pad — place it firmly on the hip before you extend and uke will fly.'
  },
  'Yoko-tomoe-nage': {
    cat: 'throw',
    steps: [
      ['front_hand','Kuzushi','Pull uke diagonally forward to the side.'],
      ['directions_run','Foot plant','Drop to your side — near foot plants on uke\'s hip.'],
      ['trending_up','Rotate','Extend and rotate — uke goes sideways over you.']
    ],
    mistakes: [
      ['Treating it like front Tomoe','The diagonal pull is the difference — the angle dictates the throw direction.'],
      ['No hip rotation','Hip rotation during extension determines the side — don\'t stay static.']
    ],
    tip: 'Commit to the diagonal angle in your pull before you drop — everything follows from the kuzushi direction.'
  },
  'Uki-waza': {
    cat: 'throw',
    steps: [
      ['front_hand','Kuzushi','Lead uke diagonally forward with a circular pull.'],
      ['directions_run','Float','As uke steps in, step across them and begin to fall to your side.'],
      ['trending_up','Use momentum','Don\'t force it — let uke\'s forward energy carry them over.']
    ],
    mistakes: [
      ['Forcing the throw','Uki-waza is a floating throw — fighting uke kills it. Use their energy.'],
      ['Too early','The throw only works when uke is fully committed forward — wait for the step.']
    ],
    tip: 'Uki-waza works best when uke is attacking — redirect their forward energy sideways and over.'
  },

  // ── GREEN → BLUE: SHIME-WAZA ───────────────────────────────────
  'Okuri-eri-jime': {
    cat: 'strangle',
    steps: [
      ['front_hand','Grip','From behind: one hand grips deep on the near collar, palm in.'],
      ['lock','Cross','Slide the other hand across to grip the far collar.'],
      ['trending_up','Apply','Pull both elbows back and down — forearms press the carotids.']
    ],
    mistakes: [
      ['Shallow grips','Both hands need deep collar grips — shallow grips slide off under pressure.'],
      ['Pulling straight back','Pull back AND down simultaneously — back alone lifts the chin.']
    ],
    tip: 'Both forearms press the sides of the neck — compression, not choking, is the mechanism.'
  },
  'Nami-juji-jime': {
    cat: 'strangle',
    steps: [
      ['front_hand','Grip','Both thumbs inside the collar — cross your arms.'],
      ['lock','Knuckles','As you tighten, rotate knuckles inward to press the carotids.'],
      ['trending_up','Apply','Pull elbows outward in a scissors action — knuckles press in.']
    ],
    mistakes: [
      ['Grips too wide','Hands near the lapel edges miss the carotids with the knuckles.'],
      ['Pulling straight back','The action is outward scissors — spread the elbows.']
    ],
    tip: 'Think of squeezing two points on the neck at once — the cross grip is what makes the scissors work.'
  },
  'Gyaku-juji-jime': {
    cat: 'strangle',
    steps: [
      ['front_hand','Grip','Both hands grip collars with fingers inside — reverse cross.'],
      ['lock','Position','Apply from guard or side control.'],
      ['trending_up','Apply','Pull elbows down and out — wrists press into the neck.']
    ],
    mistakes: [
      ['Fingers outside','Fingers must be inside the collar — outside grip has no leverage.'],
      ['One hand only','One hand alone won\'t finish — both must pull equally.']
    ],
    tip: 'Set up Gyaku-juji with a feint — make uke defend one collar, then attack the other.'
  },
  'Kata-juji-jime': {
    cat: 'strangle',
    steps: [
      ['front_hand','Grip','One thumb-in on the near collar, other fingers-in on the far collar.'],
      ['lock','Half-cross','The asymmetric grip creates compression on one carotid.'],
      ['trending_up','Apply','Elbows pull outward — wrists cross against the throat.']
    ],
    mistakes: [
      ['Both thumbs or both fingers','Kata-juji needs one thumb-in, one fingers-in — the mixed grip creates the scissors.'],
      ['Same-side grips','Cross to the opposite collar — same side compresses front, not carotids.']
    ],
    tip: 'One thumb in, one fingers in — the asymmetry is the mechanism. Don\'t match the grip style.'
  },
  'Koshi-jime': {
    cat: 'strangle',
    steps: [
      ['front_hand','Setup','One forearm across uke\'s throat from behind.'],
      ['lock','Hip lever','Drive your hip into uke\'s back as you pull the choke arm in.'],
      ['trending_up','Apply','Pull the arm tight while pushing the hip forward — hip is the fulcrum.']
    ],
    mistakes: [
      ['Hip not engaged','The hip pressure makes Koshi-jime work — without it, it\'s just arm pressure.'],
      ['Forearm on windpipe','Press the carotid arteries on the side, not the windpipe directly.']
    ],
    tip: 'Think hip as fulcrum, arm as lever — more hip pressure means less arm effort needed.'
  },
  'Kata-te-jime': {
    cat: 'strangle',
    steps: [
      ['front_hand','Grip','One hand deep on the collar, thumb inside.'],
      ['lock','Secure body','Control uke\'s body with your weight — single hand means less grip.'],
      ['trending_up','Drive','Drive the knuckle into the carotid while pressing uke down.']
    ],
    mistakes: [
      ['Not securing uke','Pin their body first — a still uke makes a one-hand strangle far more effective.'],
      ['Windpipe pressure','Carotid pressure finishes — windpipe pressure just causes pain.']
    ],
    tip: 'Body weight does the work — immobilise uke fully before committing the single hand.'
  },

  // ── GREEN → BLUE: KANSETSU-WAZA ───────────────────────────────
  'Ude-garami': {
    cat: 'lock',
    steps: [
      ['front_hand','Grip','Grip uke\'s wrist with one hand, thread your other arm under theirs.'],
      ['lock','Figure-four','Form the figure-four — forearm under uke\'s upper arm, grip your own wrist.'],
      ['trending_up','Rotate','Rotate uke\'s arm inward and upward — shoulder joint engages.']
    ],
    mistakes: [
      ['Arm not at 90°','The elbow must be at approximately 90° — straighten it and the lock fails.'],
      ['Rotating outward','Inward rotation engages the lock — outward rotation does nothing.']
    ],
    tip: 'The name "entangled armlock" describes the figure-four — weave your arms together for an unbreakable grip.'
  },

  // ── BLUE → BROWN: TACHI-WAZA ──────────────────────────────────
  'Sode-tsuri-komi-goshi': {
    cat: 'throw',
    steps: [
      ['front_hand','Kuzushi','Grip both sleeves at the elbow — pull up and forward together.'],
      ['rotate_right','Entry','Pivot in, hip to hip, both arms driving upward from the sleeves.'],
      ['trending_up','Kake','Uncoil hips and pull both elbows — uke rotates over both arms.']
    ],
    mistakes: [
      ['Grips at the wrist','Grip the elbow area, not the wrist — wrist grips lose pulling leverage.'],
      ['Arms pulling down','Both arms pull upward and forward — pulling down stalls completely.']
    ],
    tip: 'The sleeve grips are lifting handles — pull them upward as you pivot, not forward.'
  },
  'Sumi-gaeshi': {
    cat: 'throw',
    steps: [
      ['front_hand','Kuzushi','Draw uke strongly forward — commit them over their toes.'],
      ['directions_run','Drop','Drop to your back, placing your foot on uke\'s inner thigh.'],
      ['trending_up','Extend','Extend your leg to throw uke over in a somersault arc.']
    ],
    mistakes: [
      ['Foot on the knee','The foot must go on the inner thigh — knee contact risks injury.'],
      ['Holding both hands','As uke goes over, one hand may need to release to protect your shoulder.']
    ],
    tip: 'Sumi-gaeshi works best combined with Uchi-mata — make uke defend the reap, then sacrifice.'
  },
  'Yoko-gake': {
    cat: 'throw',
    steps: [
      ['front_hand','Kuzushi','Pull uke laterally with a strong sideways arm movement.'],
      ['directions_run','Hook','Hook your near foot behind uke\'s near ankle from outside.'],
      ['trending_up','Fall','Fall into uke — body weight sweeps them sideways.']
    ],
    mistakes: [
      ['Hook on calf','Hook the ankle — calf hook lets uke step over it.'],
      ['Falling away','Fall into uke, not away — falling away removes the sweeping force.']
    ],
    tip: 'Yoko-gake is a hip sacrifice — your falling weight generates the sweep, not the foot alone.'
  },
  'Ko-uchi-gake-maki-komi': {
    cat: 'throw',
    steps: [
      ['front_hand','Kuzushi','Pull uke forward to load their near leg.'],
      ['directions_run','Hook and wrap','Hook the inner ankle (Ko-uchi) while simultaneously wrapping the arm (maki-komi).'],
      ['trending_up','Sacrifice','Fall to the side — hook and wrap combine to take uke down.']
    ],
    mistakes: [
      ['Sequential not simultaneous','The hook and wrap must happen together — delay either one and uke defends both.'],
      ['Loose arm wrap','The winding arm must be tight — loose wrap loses the binding effect.']
    ],
    tip: 'One combined action — hook-AND-wrap at the exact same instant, then fall.'
  },
  'Ushiro-goshi': {
    cat: 'throw',
    steps: [
      ['front_hand','Counter','As uke loads a hip throw, sink your hips below theirs.'],
      ['rotate_right','Lift','Reach around uke\'s waist from behind — straighten your legs.'],
      ['trending_up','Throw','Drive forward and down — throw uke forward over your hip.']
    ],
    mistakes: [
      ['Hips too high','You must get under uke\'s hips — if yours are above, lifting is impossible.'],
      ['Lift without forward drive','Lifting alone takes uke off the mat but doesn\'t score — drive forward.']
    ],
    tip: 'Ushiro-goshi punishes hip throws — the moment uke loads their hip, sink, wrap, and explode.'
  },
  'Ura-nage': {
    cat: 'throw',
    steps: [
      ['front_hand','Wrap','As uke attacks forward, wrap both arms around their waist from behind.'],
      ['rotate_right','Arch','Arch your back explosively — lift uke off the mat, arching overhead.'],
      ['trending_up','Drive','Drive uke onto their back behind you — commit with your hips.']
    ],
    mistakes: [
      ['Timid arch','Half-hearted arch lands uke on top of you — commit fully.'],
      ['Arms only','The arch uses your entire body — hips drive forward, back extends.']
    ],
    tip: 'Ura-nage demands full commitment — once you wrap, there is no half measure. Arch fully.'
  },
  'Uki-otoshi': {
    cat: 'throw',
    steps: [
      ['front_hand','Kuzushi','Pull uke forward in a large, continuous circular arc.'],
      ['directions_run','Drop','Drop to one knee in the direction of the pull.'],
      ['trending_up','Float','Use pure momentum — uke floats over the drop without body contact.']
    ],
    mistakes: [
      ['Body contact','This is an arm-pull throw only — body contact changes it to O-goshi.'],
      ['Stopping the pull','The circular motion must be continuous — stopping kills uke\'s momentum.']
    ],
    tip: 'Strong enough circular kuzushi makes the throw almost happen by itself — it\'s all in the pull.'
  },
  'Koshi-guruma': {
    cat: 'throw',
    steps: [
      ['front_hand','Kuzushi','Pull uke forward and across with both arms.'],
      ['rotate_right','Entry','Pivot in — arm wraps around the back of uke\'s neck (not the shoulder).'],
      ['trending_up','Kake','Rotate uke\'s body around your hip using the neck grip.']
    ],
    mistakes: [
      ['Arm on the shoulder','The arm goes around the neck — shoulder grip loses the rotation.'],
      ['Shallow entry','Hip must be in front of uke\'s — shallow entry stalls.']
    ],
    tip: 'The neck grip locks uke\'s upper body tightly — it\'s the key difference from O-goshi.'
  },

  // ── BLUE → BROWN: SHIME-WAZA ──────────────────────────────────
  'Kata-ha-jime': {
    cat: 'strangle',
    steps: [
      ['front_hand','Setup','From behind uke — thread one arm under their arm from below.'],
      ['lock','Wing','Thread the under-arm hand behind uke\'s neck — creating a single wing.'],
      ['trending_up','Apply','Other arm grips deep on the collar — pull collar arm back, push wing forward.']
    ],
    mistakes: [
      ['Under-arm not high enough','The threading arm must go behind the neck — under the armpit only creates a pin.'],
      ['Releasing the collar grip','The collar grip drives the force — releasing it gives uke an escape window.']
    ],
    tip: 'Kata-ha-jime catches uke reaching out of Kesa-gatame — trap the arm the moment it lifts.'
  },
  'Hadaka-jime': {
    cat: 'strangle',
    steps: [
      ['front_hand','Position','From behind uke — one forearm across the throat.'],
      ['lock','Figure-four','Choking hand grips the other forearm — figure-four at the throat.'],
      ['trending_up','Apply','Pull elbow back and down while the support hand pushes the choke arm in.']
    ],
    mistakes: [
      ['Forearm on windpipe','Press the carotids on the side — windpipe pressure causes pain but not finish.'],
      ['Chin tucked by uke','Control the head first — tucked chin blocks the choke.']
    ],
    tip: 'Use rear mount hooks to control uke\'s posture before applying — posture control makes it effortless.'
  },
  'San-gaku-jime': {
    cat: 'strangle',
    steps: [
      ['front_hand','Triangle','Throw your legs around uke\'s neck and one arm — forming a triangle.'],
      ['lock','Lock','Place the back of one knee in the crook of the other — triangle locked.'],
      ['trending_up','Finish','Squeeze the knees, pull the head down, angle hips for pressure.']
    ],
    mistakes: [
      ['Wrong arm inside','The trapped arm must be inside with the neck — neck only means no strangle.'],
      ['Legs not locked','The knee-in-crook lock is essential — unlocked legs open and uke escapes.']
    ],
    tip: 'Angle your hips 30–45° away from uke once locked — this cuts off blood flow far more effectively.'
  },
  'San-gaku-gatame': {
    cat: 'hold',
    steps: [
      ['front_hand','Triangle','Secure the triangle position — neck and arm inside.'],
      ['lock','Arm control','Pull the trapped arm across your chest — elbow hyperextension threat.'],
      ['check_circle','Double threat','Maintain both strangle AND armlock simultaneously.']
    ],
    mistakes: [
      ['Only one attack','San-gaku-gatame threatens both — use both to create a dilemma.'],
      ['Losing the triangle lock','Keep the knee locked throughout — open triangle loses both attacks.']
    ],
    tip: 'Attack both targets — uke defends the choke, the elbow becomes exposed, and vice versa.'
  },
  'San-gaku-osae-gatame': {
    cat: 'hold',
    steps: [
      ['front_hand','Triangle','Form the locked triangle around uke\'s neck and arm.'],
      ['lock','Roll','Roll uke onto their back from the triangle position.'],
      ['check_circle','Pin','Use the triangle as a hold-down — uke is pinned on their back.']
    ],
    mistakes: [
      ['Rolling without locked triangle','Lock must be secure before rolling — open triangle during roll is lost.'],
      ['Forgetting the legs','After rolling, use your free leg to control uke\'s legs.']
    ],
    tip: 'The san-gaku-osae is a pin AND a threat — uke knows you can squeeze at any moment.'
  },
};
