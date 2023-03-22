import Table from '../components/Table'
import FormitemDemoIn from '@/components/FormitemDemo'
import FormitemDemo from '@/components/FormInDemo'
import Breadcrumb from '@/components/Breadcrumb'
import Model from '@/components/Model'
import ExportComponents from '@/components/exportComponents'
import ImportComponents from "@/components/ImportComponents"
import permissionButton from "@/components/permissionButton"
// customize
export default (Vue)=>{
    Vue.component("dc-table",Table);
    Vue.component("FormitemDemoIn",FormitemDemoIn); 
    Vue.component("FormitemDemo",FormitemDemo);
    Vue.component("Breadcrumb",Breadcrumb);
    Vue.component("dc-Model",Model);
    Vue.component("ExportComponents",ExportComponents);    
    Vue.component("ImportComponents",ImportComponents); 
    Vue.component("pe-button",permissionButton); 
}