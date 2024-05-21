import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    id: 1,
    label: 'MENUITEMS.MENU.TEXT',
    isTitle: true
  },
  {
    id: 2,
    label: ' لوحات القيادة',
    icon: 'mdi mdi-speedometer',
    link: '/',
   
  },
  {
    id: 3,
    label: 'الملفات',
    icon: 'mdi mdi-view-grid-plus-outline',
    link:'/ecommerce/orders'
  
  },

  // {
  //   id: 4,
  //   label: "convert pdf to txt file",
  //   icon: 'ri-pencil-ruler-2-line',
  //   link:'/forms/file-uploads'
  
  // }
  
 
   

];
