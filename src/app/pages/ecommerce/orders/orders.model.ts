 

export interface OrdersModel {
  id: any;
  user_Identifier: string;
  created_On: string;
 
  isSelected:boolean;
}


export interface DocumentList {
  data:OrdersModel[]
}

export interface Search_Model {

  text:string;
 isExact:boolean;
 isAll:boolean;
 isPhrase:boolean;
 page:any;
 pagesize:any;


}
