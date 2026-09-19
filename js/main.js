/* ============================================================
   雁城衡阳文旅指南 · main.js
   原生 JavaScript，无任何框架依赖
   ============================================================ */
(function () {
  "use strict";

  /* ----------------------------------------------------------
     工具函数
  ---------------------------------------------------------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  function showToast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove("show"), 2200);
  }

  /* ----------------------------------------------------------
     1. 页脚年份
  ---------------------------------------------------------- */
  $("#year").textContent = new Date().getFullYear();

  /* ----------------------------------------------------------
     2. 导航：滚动变色 / 移动端菜单 / Scrollspy
  ---------------------------------------------------------- */
  const header = $("#siteHeader");
  const backTop = $("#backTop");
  const navToggle = $("#navToggle");
  const mainNav = $("#mainNav");

  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle("scrolled", y > 40);
    backTop.classList.toggle("show", y > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  navToggle.addEventListener("click", () => {
    const open = mainNav.classList.toggle("open");
    navToggle.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", String(open));
  });
  $$(".nav-link", mainNav).forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  backTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Scrollspy：滚动时高亮当前板块导航
  const sections = $$("main section[id]");
  const navLinks = $$(".nav-link");
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((a) =>
            a.classList.toggle("active", a.getAttribute("href") === "#" + id)
          );
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => spy.observe(s));

  /* ----------------------------------------------------------
     3. 滚动揭示动画
  ---------------------------------------------------------- */
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  $$(".reveal").forEach((el) => revealObserver.observe(el));

  /* ----------------------------------------------------------
     4. Hero 数字滚动计数
  ---------------------------------------------------------- */
  function animateCount(el) {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const duration = 1600;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  const countObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  $$("[data-count]").forEach((el) => countObserver.observe(el));

  /* ----------------------------------------------------------
     5. 景点数据渲染 + 分类筛选 + 详情模态框
  ---------------------------------------------------------- */
  const SPOTS = [
    {
      id: "hengshan",
      name: "南岳衡山",
      cat: "nature",
      catLabel: "自然风光",
      level: "国家 5A 级景区",
      price: "旺季 ¥110 / 淡季 ¥80",
      free: false,
      img: "assets/img/hero-hengshan.jpg",
      brief: "五岳独秀，祝融峰云海日出与冬季雾凇堪称南岳双绝。",
      desc:
        "南岳衡山为中华五岳之一，七十二峰逶迤八百里，主峰祝融峰海拔约 1300 米，以“祝融峰之高、藏经殿之秀、水帘洞之奇、方广寺之深”并称南岳四绝。景区为国家级风景名胜区、首批 5A 级旅游景区，门票两日有效，可结合环保车与索道轻松登顶。",
      facts: [
        "建议游玩：1–2 天",
        "开放时间：约 7:30–17:30",
        "最佳季节：夏观云海、冬赏雾凇",
        "登山方式：徒步 / 环保车 / 索道",
      ],
    },
    {
      id: "nanyuemiao",
      name: "南岳大庙",
      cat: "culture",
      catLabel: "人文古迹",
      level: "南国故宫 · 江南最大庙宇群",
      price: "¥58（统一票价）",
      free: false,
      img: "assets/img/nanyue-temple.jpg",
      brief: "九进院落、佛道共存，棂星门到圣帝殿绵延近万米。",
      desc:
        "南岳大庙始建于唐，历经重修，是中国南方现存规模最大的庙宇建筑群，有“南国故宫”之誉。建筑群共九进，红墙黄瓦、飞檐鎏金，东侧为八道观、西侧为八佛寺，佛道共存一山共融一庙。2025 年 8 月起取消淡旺季差价，统一门票政府指导价 58 元/人次。",
      facts: [
        "建议游玩：2–3 小时",
        "门票：58 元 / 人次",
        "看点：圣帝殿、御碑亭、棂星门",
        "位置：南岳区古镇，紧邻衡山入口",
      ],
    },
    {
      id: "shigu",
      name: "石鼓书院",
      cat: "culture",
      catLabel: "人文古迹",
      level: "中国古代四大书院之一",
      price: "免费（需预约）",
      free: true,
      img: "assets/img/shigu-aerial.jpg",
      brief: "三江汇流处的千年学府，湖湘学派的重要发源地。",
      desc:
        "石鼓书院位于湘江、蒸水、耒水三江汇流的石鼓山上，唐元和年间李宽在此筑庐读书，北宋景祐年间朝廷赐额“石鼓书院”，与应天、白鹿洞、岳麓并称。书院在 1944 年衡阳保卫战中毁于炮火，2006 年按明清格局重修。登合江亭可俯瞰两江交汇、长桥卧波。",
      facts: [
        "建议游玩：1.5–2 小时",
        "门票：免费开放",
        "看点：禹碑亭、合江亭、武侯祠",
        "别名：湖湘文化重要地标",
      ],
    },
    {
      id: "huiyan",
      name: "回雁峰",
      cat: "culture",
      catLabel: "人文古迹",
      level: "南岳七十二峰之首",
      price: "免费开放",
      free: true,
      img: "assets/img/huiyan-aerial.jpg",
      brief: "“北雁南飞，至此歇翅停回”，雁城之名由此而来。",
      desc:
        "回雁峰居南岳七十二峰之首，号称“南岳第一峰”。相传北雁南飞，到此便歇翅停回、待春北归，衡阳“雁城”的雅称正来源于此。景区地处衡阳老城中心，雁峰寺、回雁阁掩映于古树奇石之间，登顶可眺望湘江与城郭，是读懂城市名字由来的第一站。",
      facts: [
        "建议游玩：1–1.5 小时",
        "门票：免费开放",
        "看点：回雁阁、雁峰寺、烟雨池",
        "位置：雁峰区湘江南路",
      ],
    },
    {
      id: "zhuhai",
      name: "蔡伦竹海",
      cat: "nature",
      catLabel: "自然风光",
      level: "国家 4A 级景区 · 天然氧吧",
      price: "约 ¥50",
      free: false,
      img: "assets/img/zhuhai-aerial.jpg",
      brief: "十六万亩连片楠竹依山起伏，号称“亚洲大竹海”。",
      desc:
        "蔡伦竹海位于耒阳市黄市镇，连片竹海覆盖两百多个山头、面积达 16 万亩，是中国面积最大的连片竹海之一。耒阳是蔡伦故里，相传他在此传授造纸技艺，景区内至今保留古法造纸作坊，还有观海楼、石林、耒水穿林等景观，竹海内负氧离子浓度极高，是天然氧吧。",
      facts: [
        "建议游玩：半天–1 天",
        "位置：耒阳市，距市区约 40 公里",
        "看点：观海楼、古法造纸、水上丹霞",
        "适合：亲子、徒步、避暑",
      ],
    },
    {
      id: "dongzhou",
      name: "东洲岛 · 湘江夜游",
      cat: "city",
      catLabel: "城市休闲",
      level: "湘江三大洲之一",
      price: "免费开放",
      free: true,
      img: "assets/img/dongzhou.jpg",
      brief: "船山书院书声不绝，湘江两岸灯火璀璨。",
      desc:
        "东洲岛横卧湘江之中，与长沙橘子洲、岳阳君山并称湘江流域三大洲，岛上有清代重建的船山书院，是王船山学说传承之地。环岛步道、古樟与沙滩适合傍晚慢游；入夜后两岸高楼与桥梁灯火倒映江面，可乘游船夜游湘江，感受湖南第二大城市的江城夜色。",
      facts: [
        "建议游玩：2–3 小时（含傍晚）",
        "门票：免费登岛",
        "看点：船山书院、望江楼、湘江夜景",
        "联动：距回雁峰、石鼓书院均不远",
      ],
    },
  ];

  const spotGrid = $("#spotGrid");
  spotGrid.innerHTML = SPOTS.map((s, i) => `
    <article class="spot-card reveal" data-cat="${s.cat}" data-id="${s.id}" style="transition-delay:${(i % 3) * 0.08}s">
      <div class="spot-media">
        <img src="${s.img}" alt="${s.name}" loading="lazy">
        <span class="spot-badge">${s.level}</span>
      </div>
      <div class="spot-info">
        <h3>${s.name}</h3>
        <p>${s.brief}</p>
        <div class="spot-meta">
          <span class="spot-price ${s.free ? "free" : ""}">${s.price}</span>
          <span class="spot-more">查看详情</span>
        </div>
      </div>
    </article>`).join("");
  $$(".spot-card", spotGrid).forEach((card) => revealObserver.observe(card));

  // 分类筛选
  $$(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      $$(".filter-btn").forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      const filter = btn.dataset.filter;
      $$(".spot-card", spotGrid).forEach((card) => {
        const show = filter === "all" || card.dataset.cat === filter;
        card.classList.toggle("hidden", !show);
      });
    });
  });

  // 详情模态框
  const modal = $("#spotModal");
  function openModal(spot) {
    $("#modalImg").src = spot.img;
    $("#modalImg").alt = spot.name;
    $("#modalTag").textContent = spot.catLabel;
    $("#modalLevel").textContent = spot.level;
    $("#modalTitle").textContent = spot.name;
    $("#modalDesc").textContent = spot.desc;
    $("#modalFacts").innerHTML = spot.facts.map((f) => `<li>${f}</li>`).join("");
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  spotGrid.addEventListener("click", (e) => {
    const card = e.target.closest(".spot-card");
    if (card) {
      const spot = SPOTS.find((s) => s.id === card.dataset.id);
      if (spot) openModal(spot);
    }
  });
  $$("[data-close]", modal).forEach((el) => el.addEventListener("click", closeModal));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
  });

  /* ----------------------------------------------------------
     6. 四季衡山 Tab 切换
  ---------------------------------------------------------- */
  const SEASONS = {
    spring: {
      label: "SPRING · 三月至五月",
      title: "春赏杜鹃，茶山新绿",
      img: "assets/img/spring-azalea.jpg",
      imgAlt: "衡山春季云锦杜鹃花海",
      text:
        "春回南岳，藏经殿一带的云锦杜鹃次第开放，粉白与玫红漫过山脊；沿途茶园吐新，山间云雾时聚时散。春季多雨，山路湿滑，却也最容易见到云雾在峰峦间流动的写意画面。",
      tips: ["杜鹃盛花期约在 4 月下旬至 5 月", "备薄外套与防滑鞋，山顶温差大", "春雨频繁，随身携带雨具"],
    },
    summer: {
      label: "SUMMER · 六月至八月",
      title: "夏揽云海，避暑听松",
      img: "assets/img/hero-hengshan.jpg",
      imgAlt: "夏季南岳衡山祝融峰云海",
      text:
        "夏季是南岳云海的最佳季节，雨后初晴之时，白云在群峰间翻涌成海，祝融峰如孤舟浮于江上。山中平均气温比市区低 6–8℃，是湖南知名的避暑胜地；日出时分金光破云，最为震撼。",
      tips: ["日出前气温偏低，需备长袖外套", "观日出建议前一晚宿于山顶", "午后多雷阵雨，尽量上午登顶"],
    },
    autumn: {
      label: "AUTUMN · 九月至十一月",
      title: "秋观日出，层林尽染",
      img: "assets/img/zhurong-sunrise.jpg",
      imgAlt: "秋季祝融峰日出",
      text:
        "秋高气爽，南岳能见度达到全年最佳，祝融峰日出与湘江如带的远景最为清晰。11 月前后，半山亭至南天门一路枫叶、乌桕渐次转红，古刹飞檐掩映于彩林之间，是摄影的黄金季节。",
      tips: ["日出时间约 6:00–6:40，提前查好时刻表", "昼夜温差可达 10℃，注意分层穿衣", "秋季周末客流较大，错峰出行"],
    },
    winter: {
      label: "WINTER · 十二月至二月",
      title: "冬遇雾凇，琉璃南国",
      img: "assets/img/zhurong-winter.jpg",
      imgAlt: "冬季南岳衡山祝融峰雾凇",
      text:
        "南岳雾凇是南方罕见的冰雪奇观。寒潮过后，祝融峰至南天门海拔千米以上的林木尽数凝霜挂雪，玉树琼枝、云海铺雪，被誉为“琉璃世界”。冬季登山务必关注景区天气与道路管制公告。",
      tips: ["雾凇多在寒潮后放晴时出现，关注预报", "路面结冰须备冰爪，可在山下购买", "环保车可能因冰雪停运，提前确认"],
    },
  };

  const seasonPanel = $("#seasonPanel");
  function renderSeason(key) {
    const d = SEASONS[key];
    seasonPanel.innerHTML = `
      <div class="season-img season-fade">
        <img src="${d.img}" alt="${d.imgAlt}" loading="lazy">
      </div>
      <div class="season-text season-fade">
        <p class="season-label">${d.label}</p>
        <h3>${d.title}</h3>
        <p>${d.text}</p>
        <ul class="season-tips">${d.tips.map((t) => `<li>${t}</li>`).join("")}</ul>
      </div>`;
  }
  renderSeason("spring");
  $$(".season-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      $$(".season-tab").forEach((t) => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");
      renderSeason(tab.dataset.season);
    });
  });

  /* ----------------------------------------------------------
     7. 推荐行程时间轴
  ---------------------------------------------------------- */
  const PLANS = {
    two: [
      {
        day: "Day 1",
        time: "南岳朝圣线",
        title: "南岳大庙 → 祝融峰",
        desc: "上午先谒南岳大庙，感受九进院落与佛道共存；随后乘环保车上山，经半山亭、南天门徒步登顶祝融峰，傍晚守候云海日落，宿山顶或返回南岳古镇。",
        tags: ["南岳大庙", "环保车", "南天门", "祝融峰日落"],
      },
      {
        day: "Day 2",
        time: "古城文脉线",
        title: "石鼓书院 → 回雁峰 → 东洲岛",
        desc: "上午在三江汇流处的石鼓书院寻访千年学风；午后登回雁峰读懂“雁城”由来；傍晚漫步东洲岛船山书院，入夜乘船或沿江步道欣赏湘江灯火。早餐别忘了一碗衡阳鱼粉。",
        tags: ["石鼓书院", "回雁峰", "东洲岛", "湘江夜景", "衡阳鱼粉"],
      },
    ],
    three: [
      {
        day: "Day 1",
        time: "抵达衡阳 · 城区人文",
        title: "石鼓书院 → 回雁峰 → 东洲岛",
        desc: "抵达后先游石鼓书院，登合江亭看两江交汇；午后到回雁峰寻“雁城”得名由来；傍晚登东洲岛访船山书院，夜赏湘江两岸灯火，宿衡阳市区。",
        tags: ["石鼓书院", "回雁峰", "船山书院", "湘江夜游"],
      },
      {
        day: "Day 2",
        time: "徒步登岳 · 夜宿山巅",
        title: "南岳大庙 → 忠烈祠 → 半山亭 → 南天门",
        desc: "上午谒南岳大庙，再由胜利坊进山，经忠烈祠、穿岩诗林徒步至半山亭；午后继续向南天门、上封寺进发，夜宿山顶，为次日日出做准备。体力有限可乘环保车替代徒步段。",
        tags: ["南岳大庙", "忠烈祠", "半山亭", "南天门", "山顶住宿"],
      },
      {
        day: "Day 3",
        time: "日出下山 · 满载而归",
        title: "祝融峰日出 → 藏经殿 / 水帘洞 → 返程",
        desc: "清晨登祝融峰迎日出，云海金光尽收眼底；下山途中按体力补游藏经殿或水帘洞，回到南岳古镇用素斋、选购酥薄月等伴手礼，结束行程。",
        tags: ["祝融峰日出", "藏经殿", "水帘洞", "南岳古镇", "酥薄月"],
      },
    ],
  };

  const planTimeline = $("#planTimeline");
  function renderPlan(key) {
    planTimeline.innerHTML = PLANS[key]
      .map(
        (item) => `
      <div class="tl-item">
        <div class="tl-day">${item.day}<small>${item.time}</small></div>
        <div class="tl-axis"><span class="tl-dot"></span></div>
        <div class="tl-content">
          <h4>${item.title}</h4>
          <p>${item.desc}</p>
          <div class="tl-tags">${item.tags.map((t) => `<span>${t}</span>`).join("")}</div>
        </div>
      </div>`
      )
      .join("");
  }
  renderPlan("two");
  $$(".plan-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      $$(".plan-tab").forEach((t) => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");
      renderPlan(tab.dataset.plan);
    });
  });

  /* ----------------------------------------------------------
     8. 预算计算器
  ---------------------------------------------------------- */
  const peopleInput = $("#people");
  const daysInput = $("#days");

  function calcBudget() {
    let people = Math.max(1, parseInt(peopleInput.value, 10) || 1);
    let days = Math.max(1, parseInt(daysInput.value, 10) || 1);
    let perCapita = 0;

    $$(".check-line input").forEach((cb) => {
      if (!cb.checked) return;
      const price = Number(cb.dataset.price);
      if (cb.hasAttribute("data-perday")) {
        perCapita += price * days;                 // 餐饮按天
      } else if (cb.hasAttribute("data-pernight")) {
        const rooms = Math.ceil(people / 2);       // 默认两人一间
        const nights = Math.max(0, days - 1);
        perCapita += (price * rooms * nights) / people;
      } else {
        perCapita += price;                        // 门票交通按人
      }
    });

    perCapita = Math.round(perCapita);
    $("#perCapita").textContent = "¥" + perCapita.toLocaleString();
    $("#totalBudget").textContent = "¥" + (perCapita * people).toLocaleString();
  }

  $("#minusBtn").addEventListener("click", () => {
    peopleInput.value = Math.max(1, (parseInt(peopleInput.value, 10) || 1) - 1);
    calcBudget();
  });
  $("#plusBtn").addEventListener("click", () => {
    peopleInput.value = Math.min(20, (parseInt(peopleInput.value, 10) || 1) + 1);
    calcBudget();
  });
  peopleInput.addEventListener("input", calcBudget);
  daysInput.addEventListener("input", calcBudget);
  $$(".check-line input").forEach((cb) => cb.addEventListener("change", calcBudget));
  calcBudget();

  /* ----------------------------------------------------------
     9. 登山装备清单（localStorage 持久化）
  ---------------------------------------------------------- */
  const packBoxes = $$("#packList input");
  const STORE_KEY = "hengyang-packlist-v1";

  function syncPack() {
    const state = packBoxes.map((b) => b.checked);
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
    } catch (err) { /* 隐私模式下静默失败 */ }
    const done = state.filter(Boolean).length;
    const pct = Math.round((done / state.length) * 100);
    $("#packBar").style.width = pct + "%";
    $("#packStatus").textContent = `已准备 ${done} / ${state.length} 项` + (done === state.length ? "，可以出发啦" : "");
  }

  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY) || "[]");
    packBoxes.forEach((b, i) => { if (saved[i] === true) b.checked = true; });
  } catch (err) { /* 无存档时使用默认状态 */ }

  packBoxes.forEach((b) => b.addEventListener("change", syncPack));
  $("#resetPack").addEventListener("click", () => {
    packBoxes.forEach((b) => (b.checked = false));
    syncPack();
    showToast("装备清单已重置");
  });
  syncPack();
})();

