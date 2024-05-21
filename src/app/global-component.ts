export const GlobalComponent = {
    // Api Calling
    //API_URL : 'http://127.0.0.1:8000/',
    API_URL : 'https://textanalysisapi.onrender.com/',
    headerToken : {'Authorization': `Bearer ${localStorage.getItem('token')}`},

    // Auth Api
    AUTH_API:"https://api-node.themesbrand.website/auth/",

    // Doc 
    AllDocuments:'Document/GetAll',
    DocumentCreate:'Document/Index',
    DocumentGetById:'Document/GetById/',
    DocumentUpdate:'Document/Update',
    DocumentDelete:'Document/Remove/',
    DocumentSearch:'Document/Search',
    DocumentHighlight:'Document/Highlight',

    DocumentConvertPDFToText: '/Document/ConvertPDFToText/',

    // Products Api
    product:'apps/product',
    productDelete:'apps/product/',

    //Index/
    // Orders Api
    order:'apps/order',
    orderId:'apps/order/',

    // Customers Api
    customer:'apps/customer',
   
}