import ServiceStore from "../Stores/ServiceStore";
import api from "../../api/api";

import { addT } from "./date";
import ParcalarStore from "../Stores/ParcalarStore";

export const  UpdateSrv = async(storedService,stadate,currentDateTime, bdowner)=> {

  const updatedTecdate = currentDateTime ? currentDateTime : addT(storedService.TECDATE);

console.log("burası update içi")
console.log(bdowner)
  const xmlbreakdowntmp = [
    {
      company: storedService.COMPANY,
      plant: storedService.PLANT,
      breakdowntype: storedService.BREAKDOWNTYPE,
      breakdownnum: storedService.BREAKDOWNNUM,
      statusdetail: storedService.STATUSDETAIL,
      refbdtype: "",
      //refbdtype: storedService.REFBDTYPE,
      refbdnum: "",
     // refbdnum: storedService.REFBDNUM,
      tecdate: updatedTecdate,
      foldate: addT(storedService.FOLDATE),
      stadate: addT(stadate),
      trgclodate: addT(storedService.TRGCLODATE),
   //   clodate: null,
      bdowner: bdowner,
      status: storedService.STATUS,
      wrncoverage: storedService.WRNCOVERAGE,
      customer: storedService.CUSTOMER,
      custbusarea: storedService.CUSTBUSAREA,
      grccustomer: storedService.GRCCUSTOMER,
      priority: storedService.PRIORITY,
      reportedto: storedService.REPORTEDTO,
      calldept: storedService.CALLDEPT,
      reportedat: addT(storedService.REPORTEDAT),
      probdescrs: storedService.PROBDESCRS,
      createdby: storedService.CREATEDBY,
      createdat: addT(storedService.CREATEDAT),
      changedby: storedService.CHANGEDBY,
      changedat: addT(storedService.CHANGEDAT),
      tree: storedService.TREE,
      isadded: storedService.ISADDED,
      branch: "",
      //branch: storedService.BRANCH,
      arayankisi: storedService.ARAYANKISI,
      arayantelnum: storedService.ARAYANTELNUM,
      garanti: storedService.GARANTI,
      bolge: storedService.BOLGE,
      bdownerdisplay: storedService.BDOWNERDISPLAY,
      cusnamE1: storedService.CUSNAME1,
      cusnamE2: storedService.CUSNAME2,
      grccusnamE1: storedService.GRCCUSNAME1,
      grccusnamE2: storedService.GRCCUSNAME2
    }
  ]


  const test = 
  {
    company: storedService.COMPANY,
    plant: storedService.PLANT,
    breakdowntype: storedService.BREAKDOWNTYPE,
    breakdownnum: storedService.BREAKDOWNNUM,
    xmlbreakdowntmp: xmlbreakdowntmp,
  

  }

//   const handleUpdateSrv = async () => {
//     console.log("sorgu sid0");
    try {
     
      const response = await api
        .post("/UpdateSrv", {
          
            company: storedService.COMPANY,
            plant: storedService.PLANT,
            breakdowntype: storedService.BREAKDOWNTYPE,
            breakdownnum: storedService.BREAKDOWNNUM,
            xmlbreakdowntmp: xmlbreakdowntmp,
           
          
        })
        
      return response
    } catch (err) {

      console.log("Update Srv: ", err);
    }
  

}