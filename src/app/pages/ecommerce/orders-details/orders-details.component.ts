import { Component, OnInit } from '@angular/core';
import { restApiService } from "../../../core/services/rest-api.service";
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { dE } from '@fullcalendar/core/internal-common';
import { DatePipe } from '@angular/common';

import {HighlightModel} from './Highlight.model';
import { ViewEncapsulation } from '@angular/core';
import {Location} from '@angular/common';



@Component({
  selector: 'app-orders-details',
  templateUrl: './orders-details.component.html',
  styleUrls: ['./orders-details.component.scss'],
  encapsulation: ViewEncapsulation.None // Disable view encapsulation

})

/**
 * OrdersDetails Component
 */
export class OrdersDetailsComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  docId?: number;
  text:any;
  docData: any;
  isExact?:boolean;
  isAll?:boolean;
  ispharse?:boolean;



  constructor(private _location: Location, private route: ActivatedRoute, 
    private http: HttpClient,private ApiService: restApiService, 
    private datePipe: DatePipe ) {

   }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
     this.breadCrumbItems = [
    
      { label: 'تفاصيل الملف', active: true },
      // { label: 'الملفات' , link: '/ecommerce/orders'}
    ];

    this.getDoc();

  }

  
  getDoc(){
    debugger

    this.route.params.subscribe(params => {
      debugger
      this.docId = +params['id']; // (+) converts string 'id' to a number
    });

      this.route.queryParams.subscribe(params => {
        debugger
        this.text= params['text'];

        this.isExact= params['isExact'] === 'true';
        this.isAll= params['isAll'] === 'true';
        this.ispharse= params['ispharse'] === 'true';

      });

     if(this.text!=null){
      const HighlightData: any = {
        text:this.text,
        isPhrase:this.ispharse,
        isExact:this.isExact,
        doc_id:this.docId,
         
        
  
      };

     
       // Fetch data using itemId
       this.ApiService.documentHighlight(HighlightData).subscribe(data => {
        debugger
        const doc = JSON.parse(data);

        this.docData = doc.data;
        this.docData.created_On = this.datePipe.transform(this.docData.created_On, 'mediumDate', 'ar');
        
        
        
      this.docData.text= this.highlightSubstrings(this.docData.text, this.docData.indexes)

      });

     }
     else{
      // Fetch data using itemId
      this.ApiService.getSingleDocData(this.docId).subscribe(data => {
        debugger
        const doc = JSON.parse(data);

        this.docData = doc.data;
        this.docData.created_On = this.datePipe.transform(this.docData.created_On, 'mediumDate', 'ar');

      });
    }
   


    }



    highlightSubstrings(text: string, indexPairs: []): string {
      debugger
      let result = '';
      let lastIndex = 0;
  
      // Loop through each index pair
      for (const pair of indexPairs) {
        // Append the text before the current index pair
        result += text.slice(lastIndex, pair[0]);
        // Append the highlighted substring
        result += '<span class="highlight" style="background-color: yellow";>' + text.slice(pair[0], pair[1] +1 ) + '</span>';
        lastIndex = pair[1] + 1;
      }
  
      // Append the remaining text after the last index pair
      result += text.slice(lastIndex);
  
      return result;
    }
   

    backClicked() {
      this._location.back();
    }
  

}
