/* -------------------------------------------------------------------
   RAHEEM DESIGN - Central CMS & Data Storage Engine (js/cms.js)
   ------------------------------------------------------------------- */

const CMS_STORAGE_KEY = 'raheemdesign_cms_data';
const CMS_INBOX_KEY = 'raheemdesign_inbox_messages';
const CMS_PASSCODE_KEY = 'raheemdesign_passcode';

// Default Passcode: 123456
if (!localStorage.getItem(CMS_PASSCODE_KEY)) {
  localStorage.setItem(CMS_PASSCODE_KEY, '123456');
}

// Default Initial Website Data
const DEFAULT_CMS_DATA = {
  themeColor: "#82C22B", // Vibrant Lime Green Default
  hero: {
    tag: "RaheemDesign",
    headlineMain: "I Design",
    headlineGradient: "Modern Websites",
    headlineEnd: "That Grow Your Business.",
    subtext: "Professional, responsive and modern websites designed to help businesses build a strong online presence and attract more customers.",
    primaryBtnText: "Get Started",
    secondaryBtnText: "View My Work",
    stats: [
      { number: "100+", label: "Websites Designed" },
      { number: "99%", label: "Client Satisfaction" },
      { number: "100%", label: "Responsive Layouts" }
    ],
    badge1Title: "100% Mobile Ready",
    badge1Desc: "Seamless across all devices",
    badge2Title: "Ultra Fast Load",
    badge2Desc: "SEO & Speed Optimized"
  },
  about: {
    tag: "Who I Am",
    title: "About Raheem",
    text: "I am a passionate website designer focused on creating modern, responsive and user-friendly websites. I help businesses, brands, academies, shops and individuals build a professional online presence with attractive and functional websites.",
    whatsappBtnText: "Chat on WhatsApp",
    emailBtnText: "Send Email"
  },
  services: [
    {
      id: 1,
      title: "Website Design",
      desc: "Modern and attractive website designs for businesses and personal brands.",
      iconSvg: `<i class="fa-solid fa-paintbrush"></i>`
    },
    {
      id: 2,
      title: "Responsive Website Development",
      desc: "Websites that work smoothly on mobile, tablet and desktop.",
      iconSvg: `<i class="fa-solid fa-mobile-screen-button"></i>`
    },
    {
      id: 3,
      title: "Business Websites",
      desc: "Professional websites designed specifically for businesses and companies.",
      iconSvg: `<i class="fa-solid fa-building"></i>`
    },
    {
      id: 4,
      title: "Portfolio Websites",
      desc: "Modern portfolio websites for freelancers, designers, students and professionals.",
      iconSvg: `<i class="fa-solid fa-user-tie"></i>`
    },
    {
      id: 5,
      title: "E-Commerce Websites",
      desc: "Attractive online stores with product sections and user-friendly layouts.",
      iconSvg: `<i class="fa-solid fa-cart-shopping"></i>`
    },
    {
      id: 6,
      title: "WordPress Websites",
      desc: "Professional and easy-to-manage WordPress websites.",
      iconSvg: `<i class="fa-brands fa-wordpress"></i>`
    },
    {
      id: 7,
      title: "Landing Pages",
      desc: "High-converting landing pages for products, services and marketing campaigns.",
      iconSvg: `<i class="fa-solid fa-arrow-pointer"></i>`
    },
    {
      id: 8,
      title: "Website Redesign",
      desc: "Transform outdated websites into modern and professional websites.",
      iconSvg: `<i class="fa-solid fa-arrows-rotate"></i>`
    }
  ],
  packages: [
    {
      id: 1,
      name: "Silver",
      tag: "STARTER",
      isPopular: false,
      features: [
        "1-3 Pages Professional Website",
        "100% Mobile Responsive Layout",
        "Contact Form & WhatsApp Integration",
        "Free Basic SEO & Fast Load Speed"
      ],
      btnText: "Choose Silver"
    },
    {
      id: 2,
      name: "Golden",
      tag: "MOST POPULAR",
      isPopular: true,
      popularBadge: "POPULAR",
      features: [
        "5-10 Pages Premium Website",
        "Custom UI/UX & Responsive Design",
        "Interactive Portfolio & Services Grid",
        "WhatsApp Direct Chat & Email Lead Setup"
      ],
      btnText: "Choose Golden"
    },
    {
      id: 3,
      name: "Diamond",
      tag: "ENTERPRISE",
      isPopular: false,
      features: [
        "Unlimited Pages / Full E-Commerce Store",
        "Custom Dynamic Web Apps & WordPress",
        "Full SEO, Security & Ultra Speed Boost",
        "Priority VIP Support & Free Maintenance"
      ],
      btnText: "Choose Diamond"
    }
  ],
  projects: [
    {
      id: 1,
      title: "MFIT Gym & Fitness Club",
      category: "Landing Pages",
      imgUrl: "images/portfolio/mfit-gym.png",
      cleanSlug: "mfitgym",
      desc: "High-impact fitness club landing page featuring workout programs, video tours, wellness solutions, and interactive membership packages.",
      features: [
        "Workout & Fitness Programs",
        "Interactive Membership Packages",
        "Trainer & Facility Showcase",
        "Mobile Responsive & Fast Load"
      ]
    },
    {
      id: 2,
      title: "Makeen Tailors & Textile",
      category: "Business Websites",
      imgUrl: "images/portfolio/makeen-tailors.png",
      cleanSlug: "makeentailors",
      desc: "Luxury bespoke tailoring & textile brand website with suiting gallery, fabric catalog, 5-step tailoring process, and booking.",
      features: [
        "Bespoke Suiting Gallery",
        "Textile & Fabric Catalog",
        "Tailoring Process Guide",
        "WhatsApp Direct Appointment"
      ]
    },
    {
      id: 3,
      title: "Natalie Watson Web Developer",
      category: "Portfolio Websites",
      imgUrl: "images/portfolio/developer-portfolio.png",
      cleanSlug: "nataliedev",
      desc: "Creative web developer personal portfolio & resume showcase with service breakdown, working process, projects gallery, and reviews.",
      features: [
        "Personal Developer Branding",
        "Interactive Project Showcase",
        "Client Testimonial Reviews",
        "Working Process & Experience"
      ]
    },
    {
      id: 4,
      title: "Organic Store & Fresh Grocery",
      category: "E-Commerce",
      imgUrl: "images/portfolio/organic-store.png",
      cleanSlug: "organicstore",
      desc: "Modern organic grocery e-commerce storefront with product collections, seasonal discount deals, cart drawer, and user reviews.",
      features: [
        "Organic Products Catalog",
        "Daily Deals & Discounts",
        "Customer Reviews Section",
        "Seamless Mobile Shopping"
      ]
    },
    {
      id: 5,
      title: "Karachi Goods Transport Company",
      category: "Business Websites",
      imgUrl: "images/portfolio/goods-transport.png",
      cleanSlug: "goodstransport",
      desc: "Comprehensive logistics & cargo transportation portal with all-Pakistan fleet container rates, route coverage, and quick dispatch.",
      features: [
        "All-Pakistan Freight Rates",
        "Fleet & Container Specifications",
        "Nationwide Route Coverage",
        "Direct Phone & WhatsApp Booking"
      ]
    },
    {
      id: 6,
      title: "Web Designer Portfolio Site",
      category: "Portfolio Websites",
      imgUrl: "images/portfolio/designer-portfolio.png",
      cleanSlug: "webdesignerportfolio",
      desc: "Sleek dark-themed web designer personal portfolio featuring services, skills, tools, portfolio gallery, pricing table, FAQs, and blog.",
      features: [
        "Dark Green Professional Theme",
        "Services & Tools Showcase",
        "Portfolio Gallery & Pricing",
        "Blog & FAQ Sections"
      ]
    }
  ],
  reviews: [
    {
      id: 1,
      clientName: "Shahzaib Khan",
      clientRole: "CEO, Apex Trading",
      rating: 5,
      text: "Raheem designed an exceptional website for our business! The design is ultra modern, fast loading, and our clients love it."
    },
    {
      id: 2,
      clientName: "Fatima Noor",
      clientRole: "Founder, Luxe Fashion Store",
      rating: 5,
      text: "Extremely professional service! He built our e-commerce store with smooth WhatsApp checkout integration. Highly recommended."
    },
    {
      id: 3,
      clientName: "Tariq Ahmed",
      clientRole: "Director, Alfunun Academy",
      rating: 5,
      text: "Outstanding work on our academy website! Mobile responsive, beautiful layout, and completed right on schedule."
    }
  ],
  contact: {
    whatsappNumber: "03012455577",
    whatsappClean: "923012455577",
    email: "raheemdesign804@gmail.com",
    address: "Alfunun Academy, Hawksbay Rd, Musharraf Colony Sector 6, Hawkes Bay Town, Karachi, 74200, Pakistan",
    mapEmbedUrl: "https://maps.google.com/maps?q=Alfunun+Academy,+Hawksbay+Rd,+Musharraf+Colony+Sector+6,+Hawkes+Bay+Town,+Karachi,+74200,+Pakistan&t=&z=15&ie=UTF8&iwloc=&output=embed"
  }
};

// Helper: Get CMS Data from LocalStorage or Defaults
function getCMSData() {
  const saved = localStorage.getItem(CMS_STORAGE_KEY);
  if (!saved) {
    saveCMSData(DEFAULT_CMS_DATA);
    return DEFAULT_CMS_DATA;
  }
  try {
    const parsed = JSON.parse(saved);
    if (!parsed.themeColor) parsed.themeColor = "#82C22B";

    // Migrate service icons to FontAwesome icons and fix WordPress icon if old SVG structure was cached
    if (parsed.services && Array.isArray(parsed.services)) {
      let updated = false;
      parsed.services = parsed.services.map((s, idx) => {
        const defaultService = DEFAULT_CMS_DATA.services[idx];
        if (s.title && s.title.toLowerCase().includes('wordpress')) {
          if (!s.iconSvg || s.iconSvg.includes('<svg') || !s.iconSvg.includes('fa-wordpress')) {
            s.iconSvg = '<i class="fa-brands fa-wordpress"></i>';
            updated = true;
          }
        } else if (defaultService && (!s.iconSvg || s.iconSvg.includes('<svg'))) {
          s.iconSvg = defaultService.iconSvg;
          updated = true;
        }
        return s;
      });
      if (updated) {
        saveCMSData(parsed);
      }
    }

    // Sync projects to new real portfolio projects if old defaults or unsplash URLs are found
    const hasOldProjects = !parsed.projects || parsed.projects.length === 0 || parsed.projects.some(p => p.title && (p.title.includes('Apex Global') || p.title.includes('Nova Luxe') || p.title.includes('Alfunun Academy Learning') || p.title.includes('Vanguard Freelance')));
    if (hasOldProjects) {
      parsed.projects = DEFAULT_CMS_DATA.projects;
      saveCMSData(parsed);
    } else if (parsed.projects && Array.isArray(parsed.projects)) {
      let updated = false;
      // Remove Tariq Traders if it was previously cached in localStorage
      if (parsed.projects.some(p => p.title && p.title.includes('Tariq Traders'))) {
        parsed.projects = parsed.projects.filter(p => !p.title || !p.title.includes('Tariq Traders'));
        updated = true;
      }
      parsed.projects = parsed.projects.map(p => {
        const def = DEFAULT_CMS_DATA.projects.find(d => d.id === p.id);
        if (def && (p.imgUrl !== def.imgUrl || !p.cleanSlug)) {
          updated = true;
          return { ...p, imgUrl: def.imgUrl, cleanSlug: def.cleanSlug };
        }
        return p;
      });
      if (updated) {
        saveCMSData(parsed);
      }
    }

    return parsed;
  } catch (e) {
    console.error("Error parsing CMS storage data:", e);
    return DEFAULT_CMS_DATA;
  }
}

// Helper: Save CMS Data to LocalStorage
function saveCMSData(data) {
  localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(data));
}

// Helper: Get Inbox Messages
function getInboxMessages() {
  const saved = localStorage.getItem(CMS_INBOX_KEY);
  return saved ? JSON.parse(saved) : [];
}

// Helper: Save New Message to Inbox
function addInboxMessage(msgObj) {
  const messages = getInboxMessages();
  const newMsg = {
    id: Date.now(),
    date: new Date().toLocaleString(),
    ...msgObj
  };
  messages.unshift(newMsg);
  localStorage.setItem(CMS_INBOX_KEY, JSON.stringify(messages));
}

// Helper: Delete Inbox Message
function deleteInboxMessage(id) {
  const messages = getInboxMessages().filter(m => m.id !== id);
  localStorage.setItem(CMS_INBOX_KEY, JSON.stringify(messages));
}
