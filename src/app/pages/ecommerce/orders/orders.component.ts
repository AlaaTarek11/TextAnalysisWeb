import { Component, QueryList,ViewChild,ElementRef, ViewChildren } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { NgbModal, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormBuilder, UntypedFormGroup, FormArray, Validators } from '@angular/forms';

// Sweet Alert
import Swal from 'sweetalert2';

// Csv File Export
import { ngxCsv } from 'ngx-csv/ngx-csv';

// Date Format
import { DatePipe } from '@angular/common';

import { OrdersModel } from './orders.model';
import { Orders } from './data';
import { Search_Model } from './orders.model';
import { OrdersService } from './orders.service';
import { NgbdOrdersSortableHeader, orderSortEvent } from './orders-sortable.directive';
import { Router } from '@angular/router';


// Rest Api Service
import { restApiService } from "../../../core/services/rest-api.service";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  providers: [OrdersService, DecimalPipe]
})

/**
 * Orders Component
 */
export class OrdersComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  ordersForm!: UntypedFormGroup;
  submitted = false;
  CustomersData!: any;
  masterSelected!: boolean;
  checkedList: any;
  // Api Data
  content?: any;
  econtent?: any;
  orderes?: any;

  // Table data
  ordersList!: Observable<OrdersModel[]>;
  total: Observable<number>;

  //Search
  @ViewChild('searchText') searchText!: ElementRef<HTMLInputElement>;

  // radio data
  selectedOption!: string;


  @ViewChild('forAll') forAll!: ElementRef<HTMLInputElement>; // Using non-null assertion operator
  @ViewChild('forAny') forAny!: ElementRef<HTMLInputElement>;
  @ViewChild('forExact') forExact!: ElementRef<HTMLInputElement>; // Using non-null assertion operator
  @ViewChild('forStem') forStem!: ElementRef<HTMLInputElement>;
  @ViewChild('forpharse') forpharse!: ElementRef<HTMLInputElement>;

  @ViewChildren(NgbdOrdersSortableHeader) headers!: QueryList<NgbdOrdersSortableHeader>;

  constructor(private router: Router,
    private modalService: NgbModal, 
    public service: OrdersService, 
    private formBuilder: UntypedFormBuilder, 
    private ApiService: restApiService, private datePipe: DatePipe) {

      
    this.ordersList = service.countries$;
    this.total = service.total$;
    this.selectedOption = ''; // Initialize selectedOption

  }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: "" },
      { label: 'بحث', active: true }
    ];

    this.getAllDoc();

    /**
     * Form Validation
     */
    this.ordersForm = this.formBuilder.group({
      id:[],
      equivalent_id: ['', [Validators.required]],
      file: [null, [Validators.required]],
     
    });

    /**
     * fetches data
     */
    setTimeout(() => {
      this.ordersList.subscribe(x => {
        this.content = this.orderes;
        this.orderes = Object.assign([], x);
      });
      document.getElementById('elmLoader')?.classList.add('d-none')
    }, 1200)
  }

  search():void{
    debugger
    const ispharse=this.forpharse.nativeElement.checked;
    const isAll=this.forAll.nativeElement.checked;
    const isExact=this.forExact.nativeElement.checked;
    const text=this.searchText.nativeElement.value;
    const searchData: Search_Model = {
      isPhrase:ispharse,
      isAll:isAll==true?true:false,
      isExact:isExact==true?true:false,
      text:text,
      page: 1,
      pagesize: 10

    };

    this.ApiService.documentsSearch(searchData).subscribe(
      data => {        
        debugger
        const docs =  JSON.parse(data);
        this.CustomersData = docs.data;
        this.service.totalRecords = 100;
        this.service.startIndex = 1;
        this.service.endIndex = 5;
        if (this.service.endIndex > this.service.totalRecords) {
            this.service.endIndex = this.service.totalRecords;
        }
        this.service.page=1;
        this.service.pageSize=10;
     



    });


  }

  disableOtherRadio(): void {
    debugger
    if (this.forpharse.nativeElement.checked === true && this.selectedOption=="" ) {
      this.forAll.nativeElement.disabled = true;
      this.forAny.nativeElement.disabled = true;
      this.forExact.nativeElement.disabled = true;
      this.forStem.nativeElement.disabled = true;
      this.forpharse.nativeElement.checked=true;
      this.selectedOption="ok"

    } else {
      this.forAll.nativeElement.disabled = false;
      this.forAny.nativeElement.disabled = false;
      this.forExact.nativeElement.disabled = false;
      this.forStem.nativeElement.disabled = false;
      this.forpharse.nativeElement.checked=false;
      this.selectedOption=""
    }
  }

  
  

  /**
 * Delete Model Open
 */
  deleteId: any;
  confirm(content: any, id: any) {
    this.deleteId = id;
    this.modalService.open(content, { centered: true });
  }

  /**
  * Multiple Delete
  */
  checkedValGet: any[] = [];
  deleteMultiple(content: any) {
    var checkboxes: any = document.getElementsByName('checkAll');
    var result
    var checkedVal: any[] = [];
    for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        result = checkboxes[i].value;
        checkedVal.push(result);
      }
    }
    if (checkedVal.length > 0) {
      this.modalService.open(content, { centered: true });
    }
    else {
      Swal.fire({ text: 'Please select at least one checkbox', confirmButtonColor: '#239eba', });
    }
    this.checkedValGet = checkedVal;
  }

  // Delete Data
  deleteData(id: any) {
    if (id) {
      this.ApiService.deleteDoc(id).subscribe({
        
        next: data => { },
        error: err => {
          this.content = JSON.parse(err.error).message;
        }
      });
      document.getElementById('o_' + id)?.remove();
    }
    else {
      this.checkedValGet.forEach((item: any) => {
        document.getElementById('o_' + item)?.remove();
      });
    }
  }

  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any) {
    this.submitted = false;
    this.modalService.open(content, { size: 'md', centered: true });
  }

  /**
  * Form data get
  */
  get form() {
    return this.ordersForm.controls;
  }

  /**
   * Open Edit modal
   * @param content modal content
   */
  editDataGet(id: any, content: any) {
    debugger
    this.submitted = false;
    this.modalService.open(content, { size: 'md', centered: true });
    var modelTitle = document.querySelector('.modal-title') as HTMLAreaElement;
    modelTitle.innerHTML = ' تعديل الملف';
    var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
    updateBtn.innerHTML = "تعديل";

    this.ApiService.getSingleDocData(id).subscribe({
      next: data => {
        debugger
        const users = JSON.parse(data);
        this.econtent = users.data;

        this.ordersForm.controls['equivalent_id'].setValue(this.econtent.equivalent_id);
        this.ordersForm.controls['id'].setValue(this.econtent.id);
      },
      error: err => {
        this.content = JSON.parse(err.error).message;
      }
    });

  }

  onFileSelected(event: any) {
    debugger
    const file: File = event.target.files[0];
    this.ordersForm?.get('file')?.setValue(file);
  }

  disapleOtherRadio(){

  }
  
  highlght(id:any){
    debugger
    const ispharse=this.forpharse.nativeElement.checked;
    const isAll=this.forAll.nativeElement.checked;
    const isExact=this.forExact.nativeElement.checked;
    const text=this.searchText.nativeElement.value;
  

     // Define the parameters to send
  const navigationExtras = {
    queryParams: {
      text: text,
      isExact:isExact,
      isAll:isAll,
      ispharse:ispharse,

      // Add any other parameters here if needed
    },
    // This option will replace the current state in the history stack
    replaceUrl: true
  };

  // Navigate to the route with the parameters
  this.router.navigate(['/ecommerce/order-details/'+id], navigationExtras);

  }
  getAllDoc(){
    this.ApiService.getDocsData().subscribe(
      data => {        
        debugger
        const docs =  JSON.parse(data);
        this.CustomersData = docs.data;
        this.service.totalRecords = 100;
        this.service.startIndex = 1;
        this.service.endIndex = 5;
        if (this.service.endIndex > this.service.totalRecords) {
            this.service.endIndex = this.service.totalRecords;
        }
        this.service.page=1;
        this.service.pageSize=10;
     



    });
  }
  /**
  * Save user
  */
  saveUser() {
    if (this.ordersForm.valid) {
      debugger
      document.getElementById('elmLoader')?.classList.remove('d-none')
      this.modalService.dismissAll();

      const formData = new FormData();
      const id = this.ordersForm.get('id')!.value
      const equivalentId =  this.ordersForm.get('equivalent_id')!.value
      const file = this.ordersForm.get('file')!.value

      
      formData.append('equivalent_id', equivalentId);
      formData.append('file', file,file.name);

      if(id ==null)
        {
  
        this.ApiService.postDocData(formData).subscribe(
          
          (data: any) => {
            
            document.getElementById('elmLoader')?.classList.add('d-none')
            this.CustomersData.unshift(data.data);

            this.modalService.dismissAll();
            let timerInterval: any;
            Swal.fire({
              title: 'تم اضافه الملف بنجاح',
              icon: 'success',
              timer: 2000,
              timerProgressBar: true,
              willClose: () => {
                clearInterval(timerInterval);
              },
            }).then((result) => {
              /* Read more about handling dismissals below */
              if (result.dismiss === Swal.DismissReason.timer) {
              }
            });
          },)
        }
        else{

          formData.append('id', id);
          this.ApiService.postEditDocData(formData).subscribe(
          
            (data: any) => {
              debugger
              document.getElementById('elmLoader')?.classList.add('d-none')

              document.getElementById('o_' + id)?.classList.add('d-none')
              this.CustomersData.unshift(data.data);

              this.modalService.dismissAll();
              let timerInterval: any;
              Swal.fire({
                title: 'تم تعديل الملف بنجاح',
                icon: 'success',
                timer: 2000,
                timerProgressBar: true,
                willClose: () => {
                  clearInterval(timerInterval);
                },
              }).then((result) => {
                /* Read more about handling dismissals below */
                if (result.dismiss === Swal.DismissReason.timer) {
                }
              });
            },)

        }
      
    }
    setTimeout(() => {
      this.ordersForm.reset();
      
    }, 2000);

    this.submitted = true
  }

  // The master checkbox will check/ uncheck all items
  checkUncheckAll(ev: any) {
    this.CustomersData.forEach((x: { state: any; }) => x.state = ev.target.checked)
    var checkedVal: any[] = [];
    var result
    for (var i = 0; i < this.CustomersData.length; i++) {
      if (this.CustomersData[i].isSelected == true) {
        result = this.CustomersData[i];
        checkedVal.push(result);
      }
    }
    this.checkedValGet = checkedVal
    checkedVal.length > 0 ? (document.getElementById("remove-actions") as HTMLElement).style.display = "block" : (document.getElementById("remove-actions") as HTMLElement).style.display = "none";
  }


  // Select Checkbox value Get
  onCheckboxChange(e: any) {
    var checkedVal: any[] = [];
    var result
    for (var i = 0; i < this.orderes.length; i++) {
      if (this.orderes[i].state == true) {
        result = this.orderes[i];
        checkedVal.push(result);
      }
    }
    this.checkedValGet = checkedVal
    checkedVal.length > 0 ? (document.getElementById("remove-actions") as HTMLElement).style.display = "block" : (document.getElementById("remove-actions") as HTMLElement).style.display = "none";
  }

  // Get List of Checked Items
  getCheckedItemList() {
    this.checkedList = [];
    for (var i = 0; i < this.CustomersData.length; i++) {
      if (this.CustomersData[i].isSelected)
        this.checkedList.push(this.CustomersData[i]);
    }
    this.checkedList = JSON.stringify(this.checkedList);
  }

  // Csv File Export
  csvFileExport() {
    var orders = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      title: 'Order Data',
      useBom: true,
      noDownload: false,
      headers: ["id", "Label", "uploadedDate"]
    };
    new ngxCsv(this.content, "orders", orders);
  }
  /**
  * Sort table data
  * @param param0 sort the column
  *
  */
  onSort({ column, direction }: orderSortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.ordersortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

}
