export const menuItems = [
  {
    isHeadr: true,
    title: "menu",
  },

  {
    title: "Dashboard",
    icon: "heroicons-outline:home",
    isOpen: true,
    isHide: true,
    child: [
      {
        childtitle: "Ecommerce Dashboard",
        childlink: "ecommerce",
      },

      // {
      //   childtitle: " CRM Dashbaord",
      //   childlink: "crm",
      // },
      {
        childtitle: "Banking Dashboard",
        childlink: "banking",
      },
      // {
      //   childtitle: "Project  Dashbaord",
      //   childlink: "project",
      // },
      // {
      //   childtitle: "Analytics Dashboard",
      //   childlink: "analytics",
      // },
    ],
  },

  {
    isHeadr: true,
    title: "Business",
  },
  {
    title: "Businesses",
    icon: "ion:business-outline",
    link: "#",
    child: [
      {
        childtitle: " All Businesses",
        childlink: "all_business",
        icon: "ic:outline-add-business",
      },
      {
        childtitle: "Pay Business",
        childlink: "pay_business",
        icon: "arcticons:amazon-business",
      },
    ],
  },

  // {
  //   title: "changelog",
  //   icon: "heroicons:arrow-trending-up",
  //   link: "changelog",
  //   isHide: false,
  //   badge: "1.0.0",
  // },
  {
    isHeadr: true,
    title: "customers",
  },

  {
    title: "Genesis Customers",
    isHide: true,
    icon: "solar:cart-2-bold",
    link: "all_customers",
    badge: "All",
  },

  {
    title: "Available Loans",
    isHide: true,
    icon: "eos-icons:subscriptions-created-outlined",
    link: "loans",
    badge: "All",
  },
  {
    title: "All Kyc",
    isHide: true,
    icon: "heroicons-outline:collection",
    link: "kycs",
    badge: "All",
  },
  // {
  //   title: "All Kyc",
  //   isHide: true,
  //   icon: "emojione-monotone:package",
  //   link: "packages",
  //   badge: "All",
  // },

  {
    isHeadr: true,
    title: "apps",
  },

  {
    title: "Products",
    isHide: true,
    icon: "dashicons:products",
    link: "products",
    badge: "All",
  },

  {
    title: "Customer Orders",
    isHide: true,
    icon: "solar:cart-2-bold",
    link: "customer_orders",
    badge: "All",
  },

  {
    title: "Transactions",
    isHide: true,
    icon: "tdesign:undertake-transaction",
    link: "transactions",
    badge: "All",
  },
  // {
  //   title: "Subscriptionbyid",
  //   isHide: true,
  //   icon: "eos-icons:subscriptions-created-outlined",
  //   link: "subscriptionbyid",
  //   badge: "All",
  // },

  // {
  //   title: "Chat",
  //   isHide: true,
  //   icon: "heroicons-outline:chat",
  //   link: "chat",
  // },

  // {
  //   title: "Email",
  //   isHide: true,
  //   icon: "heroicons-outline:mail",
  //   link: "email",
  // },

  // {
  //   title: "Kanban",
  //   isHide: true,
  //   icon: "heroicons-outline:view-boards",
  //   link: "kanban",
  // },

  // {
  //   title: "Calender",
  //   isHide: true,
  //   icon: "heroicons-outline:calendar",
  //   link: "calender",
  // },

  // {
  //   title: "Todo",
  //   isHide: true,
  //   icon: "heroicons-outline:clipboard-check",
  //   link: "todo",
  // },

  // {
  //   title: "Projects",
  //   icon: "heroicons-outline:document",
  //   link: "#",
  //   isHide: true,
  //   child: [
  //     {
  //       childtitle: "Projects",
  //       childlink: "projects",
  //     },
  //     {
  //       childtitle: "Project Details",
  //       childlink: "project-details",
  //     },
  //   ],
  // },
  {
    isHeadr: true,
    title: "Pages",
  },
  {
    title: "Authentication",
    icon: "mdi:account-edit-outline",
    link: "#",
    child: [
      {
        childtitle: "Create Account",
        childlink: "account",
        badge: "User Account",
      },
      // {
      //   childtitle: "Recover Password",
      //   childlink: "forgetpassword",
      // },
    ],
  },
  // {
  //   isHeadr: true,
  //   title: "Pages",
  // },
  // {
  //   title: "Authentication",
  //   icon: "heroicons-outline:lock-closed",
  //   link: "#",
  //   child: [
  //     {
  //       childtitle: "Signin One",
  //       childlink: "/",
  //     },
  //     {
  //       childtitle: "Signin Two",
  //       childlink: "/login2",
  //     },
  //     {
  //       childtitle: "Signin Three",
  //       childlink: "/login3",
  //     },
  //     {
  //       childtitle: "Signup One",
  //       childlink: "/reg",
  //     },
  //     {
  //       childtitle: "Signup Two",
  //       childlink: "/reg2",
  //     },
  //     {
  //       childtitle: "Signup Three",
  //       childlink: "/reg3",
  //     },
  //     {
  //       childtitle: "Forget Password One",
  //       childlink: "/forgot-password",
  //     },
  //     {
  //       childtitle: "Forget Password Two",
  //       childlink: "/forgot-password2",
  //     },
  //     {
  //       childtitle: "Forget Password Three",
  //       childlink: "/forgot-password3",
  //     },
  //     {
  //       childtitle: "Lock Screen One",
  //       childlink: "/lock-screen",
  //     },
  //     {
  //       childtitle: "Lock Screen Two",
  //       childlink: "/lock-screen2",
  //     },
  //     {
  //       childtitle: "Lock Screen Three",
  //       childlink: "/lock-screen3",
  //     },
  //   ],
  // },

  {
    title: "Utility",
    icon: "heroicons-outline:view-boards",
    link: "#",
    isHide: false,
    child: [
      {
        childtitle: "Profile",
        childlink: "profile",
      },
      {
        childtitle: "Shipping Address",
        childlink: "shipping-address",
      },
      {
        childtitle: "Settings",
        childlink: "settings",
      },

      // {
      //   childtitle: "Pricing",
      //   childlink: "pricing",
      // },

      // {
      //   childtitle: "Invoice",
      //   childlink: "invoice",
      // },

      // {
      //   childtitle: "Testimonial",
      //   childlink: "testimonial",
      // },
      // {
      //   childtitle: "FAQ",
      //   childlink: "faq",
      // },
      // {
      //   childtitle: "Blog",
      //   childlink: "blog",
      // },
      // {
      //   childtitle: "Blank page",
      //   childlink: "blank-page",
      // },

      //   {
      //     childtitle: "404 page",
      //     childlink: "error-page",
      //   },

      //   {
      //     childtitle: "Coming Soon",
      //     childlink: "coming-soon",
      //   },
      //   {
      //     childtitle: "Under Maintanance page",
      //     childlink: "under-construction",
      //   },
    ],
  },

  {
    isHeadr: true,
    title: "AI Assistance",
  },
  {
    title: "Blog",
    isHide: true,
    icon: "eos-icons:subscriptions-created-outlined",
    link: "blog",
  },
  {
    title: "Contact Us",
    isHide: true,
    icon: "heroicons-outline:table",
    link: "contact",
  },

  // {
  //   isHeadr: true,
  //   title: "Elements",
  // },
  // {
  //   title: "Widgets",
  //   icon: "heroicons-outline:view-grid-add",
  //   link: "#",
  //   child: [
  //     {
  //       childtitle: "Basic",
  //       childlink: "basic",
  //     },
  //     {
  //       childtitle: "Statistic",
  //       childlink: "statistic",
  //     },
  //   ],
  // },
  // {
  //   title: "Components",
  //   icon: "heroicons-outline:collection",
  //   link: "#",
  //   child: [
  //     {
  //       childtitle: "Typography",
  //       childlink: "typography",
  //     },
  //     {
  //       childtitle: "Colors",
  //       childlink: "colors",
  //     },
  //     {
  //       childtitle: "Alert",
  //       childlink: "alert",
  //     },
  //     {
  //       childtitle: "Button",
  //       childlink: "button",
  //     },
  //     {
  //       childtitle: "Card",
  //       childlink: "card",
  //     },
  //     {
  //       childtitle: "Carousel",
  //       childlink: "carousel",
  //     },
  //     {
  //       childtitle: "Dropdown",
  //       childlink: "dropdown",
  //     },

  //     {
  //       childtitle: "Modal",
  //       childlink: "modal",
  //     },
  //     {
  //       childtitle: "Progress bar",
  //       childlink: "progress-bar",
  //     },
  //     {
  //       childtitle: "Placeholder",
  //       childlink: "placeholder",
  //     },
  //     {
  //       childtitle: "Tab & Accordion",
  //       childlink: "tab-accordion",
  //     },
  //     {
  //       childtitle: "Badges",
  //       childlink: "badges",
  //     },
  //     {
  //       childtitle: "Paginatins",
  //       childlink: "paginations",
  //     },
  //     {
  //       childtitle: "Video",
  //       childlink: "video",
  //     },
  //     {
  //       childtitle: "Tooltip & Popover",
  //       childlink: "tooltip-popover",
  //     },
  //   ],
  // },
  // {
  //   title: "Forms",
  //   icon: "heroicons-outline:clipboard-list",
  //   link: "#",
  //   child: [
  //     {
  //       childtitle: "Input",
  //       childlink: "input",
  //     },
  //     {
  //       childtitle: "Input group",
  //       childlink: "input-group",
  //     },
  //     {
  //       childtitle: "Input layout",
  //       childlink: "input-layout",
  //     },
  //     {
  //       childtitle: "Form validation",
  //       childlink: "form-validation",
  //     },
  //     {
  //       childtitle: "Wizard",
  //       childlink: "form-wizard",
  //     },
  //     {
  //       childtitle: "Input mask",
  //       childlink: "input-mask",
  //     },
  //     {
  //       childtitle: "File input",
  //       childlink: "file-input",
  //     },
  //     {
  //       childtitle: "Form repeater",
  //       childlink: "form-repeater",
  //     },
  //     {
  //       childtitle: "Textarea",
  //       childlink: "textarea",
  //     },
  //     {
  //       childtitle: "Checkbox",
  //       childlink: "checkbox",
  //     },
  //     {
  //       childtitle: "Radio button",
  //       childlink: "radio-button",
  //     },
  //     {
  //       childtitle: "Switch",
  //       childlink: "switch",
  //     },
  //     {
  //       childtitle: "Select & Vue select",
  //       childlink: "select",
  //     },
  //     {
  //       childtitle: "Date time picker",
  //       childlink: "date-time-picker",
  //     },
  //   ],
  // },
  // {
  //   title: "Table",
  //   icon: "heroicons-outline:table",
  //   link: "#",
  //   child: [
  //     {
  //       childtitle: "Basic Table",
  //       childlink: "table-basic",
  //     },
  //     {
  //       childtitle: "React Table",
  //       childlink: "react-table",
  //     },
  //   ],
  // },
  // {
  //   title: "Chart",
  //   icon: "heroicons-outline:chart-bar",
  //   link: "#",
  //   child: [
  //     {
  //       childtitle: "Apex chart",
  //       childlink: "appex-chart",
  //     },
  //     {
  //       childtitle: "Chart js",
  //       childlink: "chartjs",
  //     },
  //     {
  //       childtitle: "Recharts",
  //       childlink: "recharts",
  //     },
  //   ],
  // },
  // {
  //   title: "Map",
  //   icon: "heroicons-outline:map",
  //   link: "map",
  // },
  // {
  //   title: "Icons",
  //   icon: "heroicons-outline:emoji-happy",
  //   link: "icons",
  // },
  // {
  //   title: "Multi Level",
  //   icon: "heroicons:share",
  //   link: "#",
  //   child: [
  //     {
  //       childtitle: "Level 1.1",
  //       childlink: "icons",
  //     },
  //     {
  //       childtitle: "Level 1.2",
  //       childlink: "Level-1",
  //       multi_menu: [
  //         {
  //           multiTitle: "Level 2.1",
  //           multiLink: "Level-2",
  //         },
  //         {
  //           multiTitle: "Level 2.2",
  //           multiLink: "Level-2.3",
  //         },
  //       ],
  //     },
  //   ],
  // },
];

export const topMenu = [
 

  {
    title: "Dashboard",
    icon: "heroicons-outline:home",
    isOpen: true,
    isHide: true,
    child: [
      {
        childtitle: "Ecommerce Dashboard",
        link: "ecommerce",
      },
      {
        childtitle: "Banking Dashboard",
        link: "banking",
      },
    ],
  },

  {
    title: "Customers",
    icon: "solar:cart-2-bold",
    link: "#",
    child: [
      {
        childtitle: " Genesis Customers",
        link: "all_customers",
        icon: "solar:cart-2-bold",
      },
      {
        childtitle: "Available Loans",
        link: "loans",
        icon: "eos-icons:subscriptions-created-outlined",
      },
      {
        childtitle: "All Kyc",
        link: "kycs",
        icon: "heroicons-outline:collection",
      },
    ],
  },

  {
    title: "Businesses",
    icon: "ion:business-outline",
    link: "#",
    child: [
      {
        childtitle: " All Businesses",
        link: "all_business",
        icon: "ic:outline-add-business",
      },
      {
        childtitle: "Pay Business",
        link: "pay_business",
        icon: "arcticons:amazon-business",
      },
    ],
  },



  {
    title: "Apps",
    icon: "eos-icons:subscriptions-created-outlined",
    link: "form-elements",
    child: [
      {
        childtitle: "Products",
        link: "products",
        childicon: "dashicons:products",
      },
      {
        childtitle: "Customer Orders",
        link: "customer_orders",
        childicon: "solar:cart-2-bold",
      },
      {
        childtitle: "Transactions",
        link: "transactions",
        childicon: "tdesign:undertake-transaction",
      },
    ],
  },

  {
    title: "Pages",
    icon: "heroicons-outline:view-grid-add",
    link: "form-elements",
    child: [
      {
        childtitle: "Create Account",
        link: "account",
        childicon: "mdi:account-edit-outline",
      },
      {
        childtitle: "Profile",
        link: "profile",
        childicon: "heroicons-outline:view-boards",
      },
    ],
  },

  {
    title: "Utility",
    icon: "heroicons-outline:template",

    child: [
      {
        childtitle: "Shipping Address",
        link: "shipping-address",
        childicon: "heroicons-outline:table",
      },
      {
        childtitle: "Settings",
        link: "settings",
        childicon: "heroicons-outline:view-boards",
      },
    ],
  },
  {
    title: "AI Assistance",
    icon: "heroicons-outline:template",

    child: [
      {
        childtitle: "Blog",
        link: "blog",
        childicon: "eos-icons:subscriptions-created-outlined",
      },
      {
        childtitle: "Contact Us",
        link: "contact",
        childicon: "heroicons-outline:table",
      },
    ],
  },
];

export const notifications = [
  {
    title: "Your order is placed",
    desc: "Amet minim mollit non deser unt ullamco est sit aliqua.",

    image: "/assets/images/all-img/user.png",
    link: "#",
  },
  {
    title: "Congratulations Darlene  🎉",
    desc: "Won the monthly best seller badge",
    unread: true,
    image: "/assets/images/all-img/user2.png",
    link: "#",
  },
  {
    title: "Revised Order 👋",
    desc: "Won the monthly best seller badge",

    image: "/assets/images/all-img/user3.png",
    link: "#",
  },
  {
    title: "Brooklyn Simmons",
    desc: "Added you to Top Secret Project group...",

    image: "/assets/images/all-img/user4.png",
    link: "#",
  },
];

export const message = [
  {
    title: "Wade Warren",
    desc: "Hi! How are you doing?.....",
    active: true,
    hasnotifaction: true,
    notification_count: 1,
    image: "/assets/images/all-img/user1.png",
    link: "#",
  },
  {
    title: "Savannah Nguyen",
    desc: "Hi! How are you doing?.....",
    active: false,
    hasnotifaction: false,
    image: "/assets/images/all-img/user2.png",
    link: "#",
  },
  {
    title: "Ralph Edwards",
    desc: "Hi! How are you doing?.....",
    active: false,
    hasnotifaction: true,
    notification_count: 8,
    image: "/assets/images/all-img/user3.png",
    link: "#",
  },
  {
    title: "Cody Fisher",
    desc: "Hi! How are you doing?.....",
    active: true,
    hasnotifaction: false,
    image: "/assets/images/all-img/user4.png",
    link: "#",
  },
  {
    title: "Savannah Nguyen",
    desc: "Hi! How are you doing?.....",
    active: false,
    hasnotifaction: false,
    image: "/assets/images/all-img/user2.png",
    link: "#",
  },
  {
    title: "Ralph Edwards",
    desc: "Hi! How are you doing?.....",
    active: false,
    hasnotifaction: true,
    notification_count: 8,
    image: "/assets/images/all-img/user3.png",
    link: "#",
  },
  {
    title: "Cody Fisher",
    desc: "Hi! How are you doing?.....",
    active: true,
    hasnotifaction: false,
    image: "/assets/images/all-img/user4.png",
    link: "#",
  },
];

export const colors = {
  primary: "#4669FA",
  secondary: "#A0AEC0",
  danger: "#F1595C",
  black: "#111112",
  warning: "#FA916B",
  info: "#0CE7FA",
  light: "#425466",
  success: "#50C793",
  "gray-f7": "#F7F8FC",
  dark: "#1E293B",
  "dark-gray": "#0F172A",
  gray: "#68768A",
  gray2: "#EEF1F9",
  "dark-light": "#CBD5E1",
};

export const hexToRGB = (hex, alpha) => {
  var r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);

  if (alpha) {
    return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
  } else {
    return "rgb(" + r + ", " + g + ", " + b + ")";
  }
};

export const topFilterLists = [
  {
    name: "Inbox",
    value: "all",
    icon: "uil:image-v",
  },
  {
    name: "Starred",
    value: "fav",
    icon: "heroicons:star",
  },
  {
    name: "Sent",
    value: "sent",
    icon: "heroicons-outline:paper-airplane",
  },

  {
    name: "Drafts",
    value: "drafts",
    icon: "heroicons-outline:pencil-alt",
  },
  {
    name: "Spam",
    value: "spam",
    icon: "heroicons:information-circle",
  },
  {
    name: "Trash",
    value: "trash",
    icon: "heroicons:trash",
  },
];

export const bottomFilterLists = [
  {
    name: "personal",
    value: "personal",
    icon: "heroicons:chevron-double-right",
  },
  {
    name: "Social",
    value: "social",
    icon: "heroicons:chevron-double-right",
  },
  {
    name: "Promotions",
    value: "promotions",
    icon: "heroicons:chevron-double-right",
  },
  {
    name: "Business",
    value: "business",
    icon: "heroicons:chevron-double-right",
  },
];

export const meets = [
  {
    img: "/assets/images/svg/sk.svg",
    title: "Meeting with client",
    date: "01 Nov 2021",
    meet: "Zoom meeting",
  },
  {
    img: "/assets/images/svg/path.svg",
    title: "Design meeting (team)",
    date: "01 Nov 2021",
    meet: "Skyp meeting",
  },
  {
    img: "/assets/images/svg/dc.svg",
    title: "Background research",
    date: "01 Nov 2021",
    meet: "Google meeting",
  },
  {
    img: "/assets/images/svg/sk.svg",
    title: "Meeting with client",
    date: "01 Nov 2021",
    meet: "Zoom meeting",
  },
];

export const files = [
  {
    img: "/assets/images/icon/file-1.svg",
    title: "Dashboard.fig",
    date: "06 June 2021 / 155MB",
  },
  {
    img: "/assets/images/icon/pdf-1.svg",
    title: "Ecommerce.pdf",
    date: "06 June 2021 / 155MB",
  },
  {
    img: "/assets/images/icon/zip-1.svg",
    title: "Job portal_app.zip",
    date: "06 June 2021 / 155MB",
  },
  {
    img: "/assets/images/icon/pdf-2.svg",
    title: "Ecommerce.pdf",
    date: "06 June 2021 / 155MB",
  },
  {
    img: "/assets/images/icon/scr-1.svg",
    title: "Screenshot.jpg",
    date: "06 June 2021 / 155MB",
  },
];
