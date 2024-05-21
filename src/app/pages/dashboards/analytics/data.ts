import { ChartOptions } from './analytics.model';

// Default Function

/**
 * Stat Counder Data
 */
 const statData = [{
    title: 'الملفات',
    value: 165.89,
    icon: 'bx-wallet',
    persantage: '2.00',
    profit: 'equal',
    icon_bg_color:'bg-primary',
    link: 'Withdraw money',
    
  }, {
      title: 'اصول الكالمات',
      value: 97.66,
      icon: 'activity',
      persantage: '3.96',
      profit: 'down',
      icon_bg_color: 'bg-danger'
  }, {
      title: 'ملفات اليوم',
      value: 33.48,
  
      icon: 'bx-wallet',
      persantage: '0.00',
      profit: 'equal',
      icon_bg_color:'bg-danger',
      link: 'Withdraw money'
  }
];

/**
 * Top Selleing
 */
 const TopPages = [
    {
        page: "/themesbrand/skote-25867",
        active: '99',
        users: '25.3',
    },
    {
        page: "/dashonic/chat-24518",
        active: '86',
        users: '22.7',
    },
    {
        page: "/skote/timeline-27391",
        active: '64',
        users: '18.7',
    },
    {
        page: "/themesbrand/minia-26441",
        active: '53',
        users: '14.2',
    },
    {
        page: "/dashon/dashboard-29873",
        active: '33',
        users: '12.6',
    },
    {
        page: "/doot/chats-29964",
        active: '20',
        users: '10.9',
    },
    {
        page: "/minton/pages-29739",
        active: '10',
        users: '07.3',
    }
];

export { statData, TopPages };
