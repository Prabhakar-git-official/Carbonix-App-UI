import { useEffect } from "react";
import { useState } from "react";
import web3 from "../web3";
//import busd from "./busdAbi";
//import cbusd from "./cbusdAbi";
import { Link, useHistory } from "react-router-dom";
import { Button, Dropdown, Card, Col, Container, DropdownItem, DropdownMenu, DropdownToggle, Input, InputGroup, InputGroupAddon, InputGroupButtonDropdown, InputGroupText, Row } from "reactstrap";
//import CFI from "./carbonFinanceAbi";
import { useDebugValue } from "react";
import Popup from "../Popup";
import Modald from "../ModalD";
import FolowStepsd from "../FolowStepsd";
import BigNumber from 'bignumber.js';

import { contracts } from './contractAddress';
import {busd,cbusd,carbonfinance} from './abi';

const Vault = () => {
    // window.onbeforeunload = () => {
	// 	sessionStorage.removeItem('wallet');
	//   }
    let [activeTab, setActiveTab] = useState("Deposit");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownOpen1, setDropdownOpen1] = useState(false);
    const [multiple, setMultiple] = useState(false);
    const [selectedDropdown, setSelectedDropdown] = useState("cBUSD");
    const [selectedDropdown1, setSelectedDropdown1] = useState("NO TRANCHE");
    const toggleDropDown = () => setDropdownOpen(!dropdownOpen);
    const toggle1 = () => setDropdownOpen1(!dropdownOpen1);

    const [avatokentowithdraw,setAvalwithdraw] = useState("");
    const [totaldep,setTotaldeposit] = useState("");
    const [totaldebt,setTotaldebt] = useState("");
    const[avaltoborrow,setAvalborrow] = useState("");
    const[busdbalance,setbusdbalance] = useState("");
    const[depositpercent,setdepositpercent] = useState("");
    const[withdrawpercent,setwithdrawpercent] = useState(""); 
    const[borrowpercent,setborrowpercent] = useState(""); 
    const[repaypercent,setrepaypercent] = useState(""); 
    const[liquidatepercent,setliquidatepercent] = useState("");
    var[app1,setApp] = useState("");
    var[ap1,setAP] = useState(""); 
    const [isOpen, setIsOpen] = useState(false);
    var[dis,setDis] = useState("");
    

    var[cbusdbalance,setcbusdbalance] = useState("");
    var[cbusdtotalsupply,setcbusdtotalsupply] = useState("");

    let history = useHistory();
    const walletsession=async()=>{
        const display =sessionStorage.getItem("wallet");
        console.log("check1session",display)
    }
    useEffect(()=>{walletsession()},[])
    useEffect(() => {
        document.getElementById("header-title").innerText = "Vault";
    })

    const busdcontract = new web3.eth.Contract(busd, contracts.busd.address);
    const cbusdcontract = new web3.eth.Contract(cbusd, contracts.cbusd.address);
    const carbonfinancecontract = new web3.eth.Contract(carbonfinance, contracts.carbonfinance.address);

    const overall = async() =>{
        if(localStorage.getItem("wallet")>0){
        const accounts =  await web3.eth.getAccounts();
        var totaldeposit = await carbonfinancecontract.methods.getCdpTotalDeposited(accounts[0]).call();
        setTotaldeposit(totaldeposit);
        var totaldebited = await carbonfinancecontract.methods.getCdpTotalDebt(accounts[0]).call();
        setTotaldebt(totaldebited);
        var collaterallimit=await carbonfinancecontract.methods.collateralizationLimit().call();
        setAvalwithdraw(totaldep - (totaldebt * collaterallimit)/1000000000000000000);
        var av = (totaldep * 50)/100;
        var bb = av - totaldebt;
        setAvalborrow(bb);
        setbusdbalance(await busdcontract.methods.balanceOf(accounts[0]).call());
        setcbusdbalance(await cbusdcontract.methods.balanceOf(accounts[0]).call());
  
       setcbusdtotalsupply(await cbusdcontract.methods.totalSupply().call());
       
        let a = await busdcontract.methods.allowance(accounts[0],contracts.carbonfinance.address).call();
       if(a>0){
        setApp(true);
       }
       else{
        setApp(false);
       }
      
      let b= await cbusdcontract.methods.allowance(accounts[0],contracts.carbonfinance.address).call();
      if(b>0){
        setAP(true);
      }
      else{
        setAP(false);
      }
    }
    }
    useEffect(()=>{overall()},[app1,avaltoborrow,totaldebt,totaldep,avatokentowithdraw])

    const deposit = async(event) => {
        event.preventDefault();
        const accounts =  await web3.eth.getAccounts();
        var valu = document.getElementById("tid1").value;
        console.log("valueget",valu);
        var val = valu * 1000000000;
        var value = val * 1000000000;
        //let x = new BigNumber(valu).times(1000000000000000000);
        //console.log("value",x.toNumber());
        //var value = x.toNumber();
        if(parseInt(value)<=parseInt(busdbalance)){
        await carbonfinancecontract.methods.deposit(web3.utils.toBN(value)).send({from:accounts[0]});
        overall()
        setIsOpen(true);
        
        setDis("Deposited Succesfully!")
        }
        else{
            setIsOpen(true);
            setDis("You Are  Trying To Deposit More Than Your Wallet Balance")   
        }
      }
    const withdraw = async(event) => {
        event.preventDefault();
        const accounts =  await web3.eth.getAccounts();
        var valu = document.getElementById("tid2").value;
        var val = valu * 1000000000;
        var value = val * 1000000000;
        // let x = new BigNumber(valu).times(1000000000000000000);
        // console.log("value",x.toNumber());
        // var value = x.toNumber();
        if(parseInt(value)<=parseInt(avatokentowithdraw)){
        await carbonfinancecontract.methods.withdraw(web3.utils.toBN(value)).send({from:accounts[0]});
        overall()
        setIsOpen(true);
        setDis("Withdrawn Succesfully!")
        }
        else{
            setIsOpen(true);
            setDis("You Are Trying To Withdraw More Than You Deposited")   
        }
    }
    const borrow = async(event) => {
        event.preventDefault();
        const accounts =  await web3.eth.getAccounts();
        var valu = document.getElementById("tid3").value;
        var val = valu * 1000000000;
        var value = val * 1000000000;
    //    let x = new BigNumber(valu).times(1000000000000000000);
    //    console.log("value",x.toNumber());
    //    var value = x.toNumber();

       if(parseInt(value)<=parseInt(avaltoborrow)){
        await carbonfinancecontract.methods.mint(web3.utils.toBN(value)).send({from:accounts[0]});
        overall()
        setIsOpen(true);       
        setDis("Borrowed Succesfully!");
       }
       else{
        setIsOpen(true);
        setDis("You Are Trying To Borrow More Than Your Borrow Limit")   
       }
    }
    const repayborrow = async(event) => {
        event.preventDefault();
        const accounts =  await web3.eth.getAccounts();
        var valu = document.getElementById("tid4").value;
       console.log("valuepre",valu);
        if(selectedDropdown == "cBUSD"){
        var val = valu * 1000000000;
        var value = val * 1000000000;
        console.log("valuecheck",value);
        //let x = new BigNumber(valu).times(1000000000000000000);
       //console.log("value",x.toNumber());
       //var value = x.toNumber();
        if(parseInt(value)>parseInt(totaldebt))
        {  overall()
            setIsOpen(true);
            setDis("You are trying to repay more than your debt ")   
        }
        else{
        
        if(parseInt(value)<=parseInt(cbusdbalance)){
            await carbonfinancecontract.methods.repay(0,web3.utils.toBN(value)).send({from:accounts[0]});
            overall()
            setIsOpen(true);
            setDis("Borrowed amount is repayed By using CBUSD")
        }
        else{
            setIsOpen(true);
            setDis("You Don't Have Enough cBUSD To Repay Your Debt")
        }
    }
       }
       else{
        var val = valu * 1000000000;
        var value = val * 1000000000;
    //     let x = new BigNumber(valu).times(1000000000000000000);
    //    console.log("value",x.toNumber());
    //    var value = x.toNumber();
        if(parseInt(value)>parseInt(totaldebt))
        {  overall()
            setIsOpen(true);
            setDis("You are trying to repay more than your debt ")   
        }
        else{
          
            if(parseInt(value)<=parseInt(busdbalance)){
        await carbonfinancecontract.methods.repay(web3.utils.toBN(value),0).send({from:accounts[0]});
        overall()
        setIsOpen(true);
        setDis("Borrowed amount is repayed By using BUSD")
        }
        else{
            setIsOpen(true);
            setDis("You Don't Have Enough BUSD To Repay Your Debt")
        }
    }
       }
        
       
      }
      const liquidate = async(event) => {
        event.preventDefault();
        const accounts =  await web3.eth.getAccounts();
        var valu = document.getElementById("tid5").value;
        var val = valu * 1000000000;
        var value = val * 1000000000;
    //    let x = new BigNumber(valu).times(1000000000000000000);
    //    console.log("value",x.toNumber());
    //    var value = x.toNumber();
        if(parseInt(value)<=parseInt(totaldep)){
            await carbonfinancecontract.methods.liquidate(web3.utils.toBN(value)).send({from:accounts[0]});
            overall()
            setIsOpen(true);
            setDis("Liquidated Succesfully!")
        }
         else{
            setIsOpen(true);
            setDis("You Don't Have Enough BUSD In Collateral Balance To Liquidate")
         }
       
      }
      const balancepercent = async(event) => {
        event.preventDefault();
        const accounts =  await web3.eth.getAccounts(); 
        document.getElementById("tid1").value = false;  
        var twentyfive=(busdbalance * 25)/100;
        const y = web3.utils.fromWei((twentyfive.toString()), "ether" ) ;
    //     var printtwenty = ((twentyfive/1000000000000000000));
    //    console.log("printtwentycheck",Math.floor((printtwenty)));
   // const x = new BigNumber(twentyfive/1000000000000000000).toFormat();
    //const y = BigNumber(x).dp(3,1);
    console.log("rounded", y);
    setdepositpercent(y);
       document.getElementById("tid1").value = (y);
        
      }
       const balancepercent1 = async(event) => {
        event.preventDefault();
        const accounts =  await web3.eth.getAccounts(); 
        document.getElementById("tid1").value = false;    
        var fifty=(busdbalance * 50)/100;
        const y = web3.utils.fromWei((fifty.toString()), "ether" ) ;
        //const x = new BigNumber(fifty/1000000000000000000).toFormat();
        //const y = BigNumber(x).dp(3,1);
        console.log("rounded", y);
        setdepositpercent(y);
        document.getElementById("tid1").value = (y);         
        
      }
      const balancepercent2 = async(event) => {
        event.preventDefault();
        const accounts =  await web3.eth.getAccounts(); 
        document.getElementById("tid1").value = false;    
        var seventyfive=(busdbalance * 75)/100;
        const y = web3.utils.fromWei((seventyfive.toString()), "ether" ) ;
        //const x = new BigNumber(seventyfive/1000000000000000000).toFormat();
        //const y = BigNumber(x).dp(3,1);
        console.log("rounded", y);
        setdepositpercent(y);
        document.getElementById("tid1").value =(y);           
        
      }
      const balancepercent3 = async(event) => {
        event.preventDefault();
        const accounts =  await web3.eth.getAccounts(); 
        document.getElementById("tid1").value = false;    
        //var hundred=(busdbalance * 100)/100;
        //const x = new BigNumber(hundred/1000000000000000000).toFormat();
        //const y = BigNumber(x).dp(3,1);
        const y = web3.utils.fromWei((busdbalance.toString()), "ether" ) ;
        console.log("rounded", y);
        setdepositpercent(y); 
        document.getElementById("tid1").value = (y);           
        
      }
      const withdrawbalancepercent = async(event) => {
        event.preventDefault();
        const accounts =  await web3.eth.getAccounts(); 
        document.getElementById("tid2").value = false;    
        var twentyfive=(avatokentowithdraw * 25)/100;
        //const x = new BigNumber(twentyfive/1000000000000000000).toFormat();
        //const y = BigNumber(x).dp(3,1);
        const y = web3.utils.fromWei((twentyfive.toString()), "ether" ) ;
        console.log("rounded", y);
        setwithdrawpercent(y); 
        document.getElementById("tid2").value = (y);   
        
      }
      const withdrawbalancepercent1 = async(event) => {
        event.preventDefault();
        const accounts =  await web3.eth.getAccounts(); 
        document.getElementById("tid2").value = false;   
        var fifty=(avatokentowithdraw * 50)/100;
        const y = web3.utils.fromWei((fifty.toString()), "ether" ) ;
        //const x = new BigNumber(fifty/1000000000000000000).toFormat();
        //const y = BigNumber(x).dp(3,1);
        console.log("rounded", y);
        setwithdrawpercent(y); 
        document.getElementById("tid2").value = (y); 
        
      }
      const withdrawbalancepercent2 = async(event) => {
        event.preventDefault();
        const accounts =  await web3.eth.getAccounts();
        document.getElementById("tid2").value = false;    
        var seventyfive=(avatokentowithdraw * 75)/100;
        const y = web3.utils.fromWei((seventyfive.toString()), "ether" ) ;
        //const x = new BigNumber(seventyfive/1000000000000000000).toFormat();
        //const y = BigNumber(x).dp(3,1);
        console.log("rounded", y);
        setwithdrawpercent(y); 
        document.getElementById("tid2").value = (y);  
        
      }
      const withdrawbalancepercent3 = async(event) => {
        event.preventDefault();
        const accounts =  await web3.eth.getAccounts(); 
        document.getElementById("tid2").value = false;   
       // var hundred=(avatokentowithdraw);
        const y = web3.utils.fromWei((avatokentowithdraw.toString()), "ether" ) ;
        //const x = new BigNumber(hundred/1000000000000000000).toFormat();
        //const y = BigNumber(x).dp(3,1);
        console.log("rounded", y);
        setwithdrawpercent(y); 
        document.getElementById("tid2").value = (y); 
        
      }

      const borrowbalancepercent = async(event) => {
        event.preventDefault();
        const accounts =  await web3.eth.getAccounts(); 
        document.getElementById("tid3").value = false;   
        var twentyfive=(avaltoborrow * 25)/100;
       // const x = new BigNumber(twentyfive/1000000000000000000).toFormat();
        //const y = BigNumber(x).dp(3,1);
        const y = web3.utils.fromWei((twentyfive.toString()), "ether" ) ;
        console.log("rounded", y);
        setborrowpercent(y); 
        document.getElementById("tid3").value =(y);       
        
      }
      const borrowbalancepercent1 = async(event) => {
        event.preventDefault();
        const accounts =  await web3.eth.getAccounts();
        document.getElementById("tid3").value = false;           
        var fifty=(avaltoborrow * 50)/100;
        //const x = new BigNumber(fifty/1000000000000000000).toFormat();
        //const y = BigNumber(x).dp(3,1);
        const y = web3.utils.fromWei((fifty.toString()), "ether" ) ;
        console.log("rounded", y);
        setborrowpercent(y);   
        document.getElementById("tid3").value = (y);      
       
        
      }

      const borrowbalancepercent2 = async(event) => {
        event.preventDefault();
        const accounts =  await web3.eth.getAccounts();
        document.getElementById("tid3").value = false;           
        var seventyfive=(avaltoborrow * 75)/100;
        //const x = new BigNumber(seventyfive/1000000000000000000).toFormat();
        //const y = BigNumber(x).dp(3,1);
        const y = web3.utils.fromWei((seventyfive.toString()), "ether" ) ;
        console.log("rounded", y);
        setborrowpercent(y);     
        document.getElementById("tid3").value = (y);  
       
        
      }

      const borrowbalancepercent3 = async(event) => {
        event.preventDefault();
        const accounts =  await web3.eth.getAccounts();
        document.getElementById("tid3").value = false;     
        //var hundred=(avaltoborrow * 100)/100;
        //const x = new BigNumber(hundred/1000000000000000000).toFormat();
        //const y = BigNumber(x).dp(3,1);
        const y = web3.utils.fromWei((avaltoborrow.toString()), "ether" ) ;
        console.log("rounded", y);
        setborrowpercent(y);    
        document.getElementById("tid3").value =(y);        
   
        
      }

      const repaybalancepercent = async(event) => {
        event.preventDefault();
        const accounts =  await web3.eth.getAccounts(); 
        document.getElementById("tid4").value = false;          
        var twentyfive=(totaldebt * 25)/100;        
        //const x = new BigNumber(twentyfive/1000000000000000000).toFormat();
        //const y = BigNumber(x).dp(3,1);
        const y = web3.utils.fromWei((twentyfive.toString()), "ether" ) ;
        console.log("rounded", y);
        setrepaypercent(y);   
        document.getElementById("tid4").value = (y);        
       
        
      }

      const repaybalancepercent1 = async(event) => {
        event.preventDefault();
        const accounts =  await web3.eth.getAccounts();
        document.getElementById("tid4").value = false;    
        var fifty=(totaldebt * 50)/100;
        //const x = new BigNumber(fifty/1000000000000000000).toFormat();
        //const y = BigNumber(x).dp(3,1);
        const y = web3.utils.fromWei((fifty.toString()), "ether" ) ;
        console.log("rounded", y);
        setrepaypercent(y);   
        document.getElementById("tid4").value = (y);        
        
      }

      const repaybalancepercent2 = async(event) => {
        event.preventDefault();
        const accounts =  await web3.eth.getAccounts();   
        document.getElementById("tid4").value = false; 
        var seventyfive=(totaldebt * 75)/100;
        const y = web3.utils.fromWei((seventyfive.toString()), "ether" ) ;
        console.log("rounded", y);
        setrepaypercent(y);   
        document.getElementById("tid4").value = (y); 
      }
      const repaybalancepercent3 = async(event) => {
        event.preventDefault();
        const accounts =  await web3.eth.getAccounts(); 
        document.getElementById("tid4").value = false;   
        console.log("totaldebt",totaldebt);
       // var hundred=(totaldebt );    
        //const y = new BigNumber(hundred/1000000000000000000).toFormat();
        const y = web3.utils.fromWei((totaldebt.toString()), "ether" ) ;

       // const y = BigNumber(x).dp(3,1);
        //const y = (hundred/1000000000000000000).toFormat();
        console.log("rounded", y);
        
        setrepaypercent(y);
        
        document.getElementById("tid4").value =(y);         
      
      }

     
      const liquidatebalancepercent = async(event) => {
        event.preventDefault();
        const accounts =  await web3.eth.getAccounts();  
        document.getElementById("tid5").value = false;  
        var twentyfive=(totaldebt * 25)/100;
        //const x = new BigNumber(twentyfive/1000000000000000000).toFormat();
        //const y = BigNumber(x).dp(3,1);
        const y = web3.utils.fromWei((twentyfive.toString()), "ether" ) ;
        console.log("rounded", y);
        setliquidatepercent(y);
        document.getElementById("tid5").value = (y);  
        
      }

      const liquidatebalancepercent1 = async(event) => {
        event.preventDefault();
        const accounts =  await web3.eth.getAccounts(); 
        document.getElementById("tid5").value = false;   
        var fifty=(totaldebt * 50)/100;
        //const x = new BigNumber(fifty/1000000000000000000).toFormat();
        //const y = BigNumber(x).dp(3,1);
        const y = web3.utils.fromWei((fifty.toString()), "ether" ) ;
        console.log("rounded", y);
        setliquidatepercent(y);
        document.getElementById("tid5").value = (y);  
        
      }
      
      const liquidatebalancepercent2 = async(event) => {
        event.preventDefault();
        const accounts =  await web3.eth.getAccounts();  
        document.getElementById("tid5").value = false;  
        var seventyfive=(totaldebt * 75)/100;
        //const x = new BigNumber(seventyfive/1000000000000000000).toFormat();
        //const y = BigNumber(x).dp(3,1);
        const y = web3.utils.fromWei((seventyfive.toString()), "ether" ) ;
        console.log("rounded", y);
        setliquidatepercent(y);
        document.getElementById("tid5").value = (y);        
        
      }
      const liquidatebalancepercent3 = async(event) => {
        event.preventDefault();
        const accounts =  await web3.eth.getAccounts(); 
        document.getElementById("tid5").value = false;   
        //var hundred=(totaldebt * 100)/100;
        //const x = new BigNumber(hundred/1000000000000000000).toFormat();
        //const y = BigNumber(x).dp(3,1);
        const y = web3.utils.fromWei((totaldebt), "ether" ) ;
        console.log("rounded", y);
        setliquidatepercent(y);
        document.getElementById("tid5").value = (y);
        
      }
      const approve = async() => {
        let account = await web3.eth.getAccounts();
        let amount = 1000000000000000000 +"0000000000"; 
        await busdcontract.methods.approve(contracts.carbonfinance.address,amount).send({from:account[0]});
        //bal()
        overall();
        setIsOpen(true);
        setDis("Approved Succesfully!");
        
      }
      const approv = async() => {
        let account = await web3.eth.getAccounts();
        let amount =  1000000000000000000 +"000000000000000000"; 
        await cbusdcontract.methods.approve(contracts.carbonfinance.address,amount).send({from:account[0]});
        //bal()
        overall();
        setIsOpen(true);
        setDis("Approved Succesfully!");
       
      }
      const togglePopup = () => {
        setIsOpen(false);
      }



      
    return (
       
        <section className="p-0 my-5">
           <Modald visible={isOpen} onClose={() => setIsOpen(false)}>
        <FolowStepsd viewhistory={dis}  />
      </Modald>
            <Container fluid>
            {
            localStorage.getItem("wallet")===null || localStorage.getItem("wallet")===""?(<>
                   <Row className="justify-content-center">
                    <Col xl="7" lg="9" md="10" sm="12">
                        <Card className="custom-card">
                            <div className="bar-items-wrapper">
                                <div
                                    className="bar-items bg-site-secondary pl-3"
                                    style={{ minWidth: "470px" }}
                                >
                                    <Link
                                        to="#"
                                        className={`bar-item text-uppercase ml-0 ${activeTab == "Deposit" ? "active" : ""
                                            }`}
                                        onClick={(e) => setActiveTab("Deposit")}
                                    >
                                        <span>Deposit</span>
                                    </Link>
                                    <Link
                                        to="#"
                                        className={`bar-item text-uppercase ${activeTab == "Withdraw" ? "active" : ""
                                            }`}
                                        onClick={(e) => setActiveTab("Withdraw")}
                                    >
                                        <span>Withdraw</span>
                                    </Link>
                                    <Link
                                        to="#"
                                        className={`bar-item text-uppercase ${activeTab == "Borrow" ? "active" : ""
                                            }`}
                                        onClick={(e) => setActiveTab("Borrow")}
                                    >
                                        <span>Borrow</span>
                                    </Link>
                                    <Link
                                        to="#"
                                        className={`bar-item text-uppercase ${activeTab == "Repay" ? "active" : ""
                                            }`}
                                        onClick={(e) => setActiveTab("Repay")}
                                    >
                                        <span>Repay</span>
                                    </Link>
                                    <Link
                                        to="#"
                                        className={`bar-item text-uppercase ${activeTab == "Liquidate" ? "active" : ""
                                            }`}
                                        onClick={(e) => setActiveTab("Liquidate")}
                                    >
                                        <span>Liquidate</span>
                                    </Link>
                                </div>
                            </div>

                            {activeTab == "Deposit" && (
                                <div className=" p-3">
                                    
                                           

    <div>
                                <h6>Deposit BUSD in order to borrow cBUSD</h6>
                                    <InputGroup className="mt-3">
                                        {/* <Input placeholder={depositpercent} style={{ height: "auto" }} type = "number" name="tid1"  onChange={event => setId1( event.target.value)}  ></Input> */}
                                        <Input placeholder={{depositpercent},"0.00" }style={{ height: "auto" }} type = "number" id="tid1"  ></Input>
                                        
                                        <InputGroupAddon addonType="append"><Button color="site-primary" >Deposit</Button></InputGroupAddon>
                                     
                                    </InputGroup>
                                    <div className="percentage">
                                        <div className="percentage-item" onClick={balancepercent}>25%</div>
                                        <div className="percentage-item" onClick={balancepercent1}>50%</div>
                                        <div className="percentage-item"onClick={balancepercent2}>75%</div>
                                        <div className="percentage-item"onClick={balancepercent3}>100%</div>
                                    </div>
                                    </div>
                                 
                                    <div className="mt-4">
                                        <h5>Deposits</h5>
                                        <div className="d-flex larger">
                                            <span>Your wallet balance:</span>
                                            <span className="ml-auto">0.00 BUSD</span>
                                        </div>
                                        <div className="d-flex">
                                            <span>Your collateral balance:</span>
                                            <span className="ml-auto">0.00 BUSD</span>
                                        </div>
                                        <div className="d-flex">
                                            <span>Available to withdraw:</span>
                                            <span className="ml-auto">0.00 BUSD</span>
                                        </div>
                                        {/* <div className="d-flex">
                                            <span>BUSD APY:</span>
                                            <span className="ml-auto">0.000%</span>
                                        </div> */}
                                    </div>
                                    <div className="mt-4">
                                        <h5>Borrows</h5>
                                        <div className="d-flex">
                                            <span>Remaining cBUSD debt:</span>
                                            <span className="ml-auto">0.00 cBUSD</span>
                                        </div>
                                        <div className="d-flex">
                                            <span>Available to borrow:</span>
                                            <span className="ml-auto">0.00 cBUSD</span>
                                        </div>
                                        <div className="d-flex">
                                            <span>Your wallet balance:</span>
                                            <span className="ml-auto">0.00 cBUSD</span>
                                        </div>
                                        {/* <div className="d-flex">
                                            <span>Est. Date of Maturity:</span>
                                            <span className="ml-auto">...</span>
                                        </div> */}
                                        <div className="d-flex">
                                            <span>Global Mintable cBUSD:</span>
                                            <span className="ml-auto">0.00 cBUSD</span>
                                        </div>
                                    </div>

                                </div>
                            )}
                            {activeTab == "Withdraw" && (
                                <div className="p-3">
                                    <h6>Withdraw your deposited BUSD</h6>
                                    <InputGroup className="mt-3">
                                        <Input placeholder={{withdrawpercent},"0.00"} style={{ height: "auto" }} type = "number" id="tid2" />
                                        <InputGroupAddon addonType="append"><Button color="site-primary" >Withdraw</Button></InputGroupAddon>
                                    </InputGroup>
                                    <div className="percentage">
                                        <div className="percentage-item" onClick={withdrawbalancepercent}>25%</div>
                                        <div className="percentage-item"onClick={withdrawbalancepercent1}>50%</div>
                                        <div className="percentage-item"onClick={withdrawbalancepercent2}>75%</div>
                                        <div className="percentage-item"onClick={withdrawbalancepercent3}>100%</div>
                                    </div>
                                    <div className="mt-4">
                                        <h5>Deposits</h5>
                                        <div className="d-flex">
                                            <span>Your wallet balance:</span>
                                            <span className="ml-auto">0.00 BUSD</span>
                                        </div>
                                        <div className="d-flex">
                                            <span>Your collateral balance:</span>
                                            <span className="ml-auto">0.00 BUSD</span>
                                        </div>
                                        <div className="d-flex larger">
                                            <span>Available to withdraw:</span>
                                            <span className="ml-auto">0.00 BUSD</span>
                                        </div>
                                        {/* <div className="d-flex">
                                            <span>BUSD APY:</span>
                                            <span className="ml-auto">0.000%</span>
                                        </div> */}
                                    </div>
                                    <div className="mt-4">
                                        <h5>Borrows</h5>
                                        <div className="d-flex">
                                            <span>Remaining cBUSD debt:</span>
                                            <span className="ml-auto">0.00 cBUSD</span>
                                        </div>
                                        <div className="d-flex">
                                            <span>Available to borrow:</span>
                                            <span className="ml-auto">0.00 cBUSD</span>
                                        </div>
                                        <div className="d-flex">
                                            <span>Your wallet balance:</span>
                                            <span className="ml-auto">0.00 cBUSD</span>
                                        </div>
                                        {/* <div className="d-flex">
                                            <span>Est. Date of Maturity:</span>
                                            <span className="ml-auto">...</span>
                                        </div> */}
                                        <div className="d-flex">
                                            <span>Global Mintable cBUSD:</span>
                                            <span className="ml-auto">0.00 cBUSD</span>
                                        </div>
                                    </div>

                                </div>
                            )}
                            {activeTab == "Borrow" && (
                                <div className="p-3">
                                    <Dropdown isOpen={dropdownOpen1} className="d-block" toggle={toggle1}>
                                        <DropdownToggle color="site-primary" className="d-block w-100" caret>
                                            {selectedDropdown1}
                                        </DropdownToggle>
                                        <DropdownMenu className="w-100">
                                        <DropdownItem onClick={e => setSelectedDropdown1("NO TRANCHE")}>NO TRANCHE</DropdownItem>
                                            <DropdownItem onClick={e => { setSelectedDropdown1("FIXED TRANCHE"); history.push("/carbon-yield")}}>FIXED TRANCHE(UPCOMING)</DropdownItem>
                                           
                                            <DropdownItem onClick={e => { setSelectedDropdown1("VARIABLE TRANCHE"); history.push("/carbon-yield")}}>VARIABLE TRANCHE</DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                    <h6 className="mt-3">Borrow up to 50% the value of your collateral in cbUSD. Your debt will be automatically paid down by yield from Alpaca finance</h6>
                                    <InputGroup className="mt-3">
                                    <Input placeholder={{borrowpercent},"0.00"} style={{ height: "auto" }} type = "number" id="tid3" />
                                        <InputGroupAddon addonType="append"><Button color="site-primary" >Borrow</Button></InputGroupAddon>
                                    </InputGroup>
                                    <div className="percentage">
                                        <div className="percentage-item" onClick={borrowbalancepercent}>25%</div>
                                        <div className="percentage-item"onClick={borrowbalancepercent1}>50%</div>
                                        <div className="percentage-item"onClick={borrowbalancepercent2}>75%</div>
                                        <div className="percentage-item"onClick={borrowbalancepercent3}>100%</div>
                                    </div>
                                    <div className="mt-4">
                                        <h5>Deposits</h5>
                                        <div className="d-flex">
                                            <span>Your wallet balance:</span>
                                            <span className="ml-auto">0.00 BUSD</span>
                                        </div>
                                        <div className="d-flex">
                                            <span>Your collateral balance:</span>
                                            <span className="ml-auto">0.00 BUSD</span>
                                        </div>
                                        <div className="d-flex">
                                            <span>Available to withdraw:</span>
                                            <span className="ml-auto">0.00 BUSD</span>
                                        </div>
                                        {/* <div className="d-flex">
                                            <span>BUSD APY:</span>
                                            <span className="ml-auto">0.000%</span>
                                        </div> */}
                                        
                                    </div>
                                    <div className="mt-4">
                                        <h5>Borrows</h5>
                                        <div className="d-flex">
                                            <span>Remaining cbUSD debt:</span>
                                            <span className="ml-auto">0.00 cbUSD</span>
                                        </div>
                                        <div className="d-flex larger">
                                            <span>Available to borrow:</span>
                                            <span className="ml-auto">0.00 cbUSD</span>
                                        </div>
                                        <div className="d-flex">
                                            <span>Your wallet balance:</span>
                                            <span className="ml-auto">0.00 cbUSD</span>
                                        </div>
                                        {/* <div className="d-flex">
                                            <span>Est. Date of Maturity:</span>
                                            <span className="ml-auto">...</span>
                                        </div> */}
                                        <div className="d-flex larger">
                                            <span>Global Mintable cbUSD:</span>
                                            <span className="ml-auto">0.00 cbUSD</span>
                                        </div>
                                    </div>

                                </div>
                            )}
                            {activeTab == "Repay" && (
                                <div className="p-3">
                                    <div>         

{ ap1 === true ? 
(
(
<div>
                                    <h6>Repay the remaining 0.00 cbUSD debt from your wallet using cbUSD and/or BUSD</h6>
                                    {!multiple ?
                                        <InputGroup className="mt-3">
                                        <Input placeholder={{repaypercent},"0.00"} style={{ height: "auto" }} type = "number" id="tid4" />
                                            <InputGroupButtonDropdown addonType="append" isOpen={dropdownOpen} toggle={toggleDropDown}>
                                                <DropdownToggle caret style={{ width: 130 }} color="site-primary">
                                                    {selectedDropdown}
                                                </DropdownToggle>
                                                <DropdownMenu>
                                                    <DropdownItem onClick={e => setSelectedDropdown("cbUSD")}>cbUSD</DropdownItem>
                                                    <DropdownItem onClick={e => setSelectedDropdown("BUSD")}>BUSD</DropdownItem>
                                                </DropdownMenu>
                                            </InputGroupButtonDropdown>
                                            {/* <InputGroupAddon addonType="append"><Button onClick={e => setMultiple(!multiple)} color="outline-site-primary"><i className="fa fa-plus"></i></Button></InputGroupAddon> */}
                                        </InputGroup>
                                        : <>
                                            <InputGroup className="mt-3">
                                                <Input placeholder="0.00" style={{ height: "auto" }}  />
                                                <InputGroupAddon addonType="append">
                                                    <InputGroupText className="bg-site-primary text-white font-weight-bold">cbUSD</InputGroupText>
                                                </InputGroupAddon>
                                                <InputGroupAddon addonType="append">
                                                    <Button size="sm" onClick={e => setMultiple(!multiple)} color="outline-site-primary"><i className="fa fa-minus"></i></Button></InputGroupAddon>
                                            </InputGroup>
                                            {/* <InputGroup className="mt-3">
                                                <Input placeholder="0.00" style={{ height: "auto" }}  />
                                                <InputGroupAddon addonType="append">
                                                    <InputGroupText className="bg-site-primary text-white font-weight-bold">BUSD</InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup> */}
                                            {/* <div className="mt-3 d-flex flex-column mx-auto">
                                                <div className="d-inline-flex mx-auto">
                                                    <div style={{ width: 70 }}>
                                                        Min
                                                    </div>
                                                    <input type="range" min="1" max="100" defaultValue="0"></input>
                                                    <div style={{ width: 70 }} className="text-right">
                                                        Max
                                                    </div>
                                                </div>
                                                <div className="d-inline-flex mx-auto">
                                                    <div style={{ width: 70 }}>
                                                        cbUSD
                                                    </div>
                                                    <input type="range" min="1" max="100" defaultValue="0"></input>
                                                    <div style={{ width: 70 }} className="text-right">
                                                        BUSD
                                                    </div>
                                                </div>
                                            </div> */}
                                        </>}
                                    <div className="percentage">
                                        <div className="percentage-item" onClick={repaybalancepercent}>25%</div>
                                        <div className="percentage-item"onClick={repaybalancepercent1}>50%</div>
                                        <div className="percentage-item"onClick={repaybalancepercent2}>75%</div>
                                        <div className="percentage-item"onClick={repaybalancepercent3}>100%</div>
                                    </div>
                                    <div style={{ maxWidth: 300 }} className="mx-auto">
                                        <Button color="outline-site-primary" className="mt-3" block >Repay</Button>
                                    </div>
                                    </div>
)
):
(
(
<div>
<h6>Before Repay you want to approve First</h6>
<Button color="outline-site-primary" className="mt-3" block >Approve</Button>
</div>
)
)}
    </div> 
                                    <div className="mt-4">
                                        <h5>Deposits</h5>
                                        <div className="d-flex larger">
                                            <span>Your wallet balance:</span>
                                            <span className="ml-auto">0.00 BUSD</span>
                                        </div>
                                        <div className="d-flex">
                                            <span>Your collateral balance:</span>
                                            <span className="ml-auto">0.00 BUSD</span>
                                        </div>
                                        <div className="d-flex">
                                            <span>Available to withdraw:</span>
                                            <span className="ml-auto">0.00 BUSD</span>
                                        </div>
                                        {/* <div className="d-flex">
                                            <span>BUSD APY:</span>
                                            <span className="ml-auto">0.000%</span>
                                        </div> */}
                                    </div>
                                    <div className="mt-4">
                                        <h5>Borrows</h5>
                                        <div className="d-flex larger">
                                            <span>Remaining cbUSD debt:</span>
                                            <span className="ml-auto">0.00 cbUSD</span>
                                        </div>
                                        <div className="d-flex">
                                            <span>Available to borrow:</span>
                                            <span className="ml-auto">0.00 cbUSD</span>
                                        </div>
                                        <div className="d-flex larger">
                                            <span>Your wallet balance:</span>
                                            <span className="ml-auto">0.00 cbUSD</span>
                                        </div>
                                        {/* <div className="d-flex">
                                            <span>Est. Date of Maturity:</span>
                                            <span className="ml-auto">...</span>
                                        </div> */}
                                        <div className="d-flex">
                                            <span>Global Mintable cbUSD:</span>
                                            <span className="ml-auto">0.00 cbUSD</span>
                                        </div>
                                    </div>

                                </div>
                            )}
                            {activeTab == "Liquidate" && (
                                <div className="p-3">
                                    <h6>Repay the remaining 0.00 cbUSD debt by liquidating your BUSD collateral.</h6>
                                    <small className="text-danger">WARNING: this will use your collateral to repay your cbUSD debt.</small>
                                    <InputGroup className="mt-3">
                                    <Input placeholder={{liquidatepercent},"0.00"} style={{ height: "auto" }} type = "number" id="tid5" />
                                        <InputGroupAddon addonType="append"><Button color="site-primary" >Liquidate</Button></InputGroupAddon>
                                    </InputGroup>
                                    <div className="percentage">
                                        <div className="percentage-item" onClick={liquidatebalancepercent}>25%</div>
                                        <div className="percentage-item"onClick={liquidatebalancepercent1}>50%</div>
                                        <div className="percentage-item"onClick={liquidatebalancepercent2}>75%</div>
                                        <div className="percentage-item"onClick={liquidatebalancepercent3}>100%</div>
                                    </div>
                                    <div className="mt-4">
                                        <h5>Deposits</h5>
                                        <div className="d-flex">
                                            <span>Your wallet balance:</span>
                                            <span className="ml-auto">0.00 BUSD</span>
                                        </div>
                                        <div className="d-flex larger">
                                            <span>Your collateral balance:</span>
                                            <span className="ml-auto">0.00 BUSD</span>
                                        </div>
                                        <div className="d-flex">
                                            <span>Available to withdraw:</span>
                                            <span className="ml-auto">0.00 BUSD</span>
                                        </div>
                                        {/* <div className="d-flex">
                                            <span>BUSD APY:</span>
                                            <span className="ml-auto">0.000%</span>
                                        </div> */}
                                    </div>
                                    <div className="mt-4">
                                        <h5>Borrows</h5>
                                        <div className="d-flex larger">
                                            <span>Remaining cbUSD debt:</span>
                                            <span className="ml-auto">0.00 cbUSD</span>
                                        </div>
                                        <div className="d-flex">
                                            <span>Available to borrow:</span>
                                            <span className="ml-auto">0.00 cbUSD</span>
                                        </div>
                                        <div className="d-flex">
                                            <span>Your wallet balance:</span>
                                            <span className="ml-auto">0.00 cbUSD</span>
                                        </div>
                                        {/* <div className="d-flex">
                                            <span>Est. Date of Maturity:</span>
                                            <span className="ml-auto">...</span>
                                        </div> */}
                                        <div className="d-flex">
                                            <span>Global Mintable cbUSD:</span>
                                            <span className="ml-auto">0.00 cbUSD</span>
                                        </div>
                                    </div>

                                </div>
                            )}
                        </Card>
                    </Col>
                </Row>  

                
                </>):
                (<>
                          <Row className="justify-content-center">
                    <Col xl="7" lg="9" md="10" sm="12">
                        <Card className="custom-card">
                            <div className="bar-items-wrapper">
                                <div
                                    className="bar-items bg-site-secondary pl-3"
                                    style={{ minWidth: "470px" }}
                                >
                                    <Link
                                        to="#"
                                        className={`bar-item text-uppercase ml-0 ${activeTab == "Deposit" ? "active" : ""
                                            }`}
                                        onClick={(e) => setActiveTab("Deposit")}
                                    >
                                        <span>Deposit</span>
                                    </Link>
                                    <Link
                                        to="#"
                                        className={`bar-item text-uppercase ${activeTab == "Withdraw" ? "active" : ""
                                            }`}
                                        onClick={(e) => setActiveTab("Withdraw")}
                                    >
                                        <span>Withdraw</span>
                                    </Link>
                                    <Link
                                        to="#"
                                        className={`bar-item text-uppercase ${activeTab == "Borrow" ? "active" : ""
                                            }`}
                                        onClick={(e) => setActiveTab("Borrow")}
                                    >
                                        <span>Borrow</span>
                                    </Link>
                                    <Link
                                        to="#"
                                        className={`bar-item text-uppercase ${activeTab == "Repay" ? "active" : ""
                                            }`}
                                        onClick={(e) => setActiveTab("Repay")}
                                    >
                                        <span>Repay</span>
                                    </Link>
                                    <Link
                                        to="#"
                                        className={`bar-item text-uppercase ${activeTab == "Liquidate" ? "active" : ""
                                            }`}
                                        onClick={(e) => setActiveTab("Liquidate")}
                                    >
                                        <span>Liquidate</span>
                                    </Link>
                                </div>
                            </div>

                            {activeTab == "Deposit" && (
                                <div className="p-3">
                                    
                                    <div>         

{ app1 === true ? 
(
(
    <div>
                                <h6>Deposit BUSD in order to borrow cbUSD</h6>
                                    <InputGroup className="mt-3">
                                        {/* <Input placeholder={depositpercent} style={{ height: "auto" }} type = "number" name="tid1"  onChange={event => setId1( event.target.value)}  ></Input> */}
                                        <Input placeholder={{depositpercent},"0.00" }style={{ height: "auto" }} type = "number" id="tid1"  ></Input>
                                        
                                        <InputGroupAddon addonType="append"><Button color="site-primary" onClick={deposit}>Deposit</Button></InputGroupAddon>
                                     
                                    </InputGroup>
                                    <div className="percentage">
                                        <div className="percentage-item" onClick={balancepercent}>25%</div>
                                        <div className="percentage-item" onClick={balancepercent1}>50%</div>
                                        <div className="percentage-item"onClick={balancepercent2}>75%</div>
                                        <div className="percentage-item"onClick={balancepercent3}>100%</div>
                                    </div>
                                    </div>
)
):
(
    (
    <div>
        <center>
             <h6>Before Deposit BUSD ,Approve First</h6>
             <Button color="site-primary"   onClick={approve}>Approve</Button></center>

              
    </div>
    )
    )}
</div>                                 
                                    <div className="mt-4">
                                        <h5>Deposits</h5>
                                        <div className="d-flex larger">
                                            <span>Your wallet balance:</span>
                                            
                                            <span className="ml-auto">{((BigNumber((busdbalance/1000000000000000000)).decimalPlaces(3,1))).toNumber()} BUSD</span>
                                        </div>
                                        <div className="d-flex">
                                            <span>Your collateral balance:</span>
                                            <span className="ml-auto">{ ((BigNumber((totaldep/1000000000000000000)).decimalPlaces(3,1))).toNumber()} BUSD</span>
                                        </div>
                                        <div className="d-flex">
                                            <span>Available to withdraw:</span>
                                            
                                            <span className="ml-auto">{((BigNumber((avatokentowithdraw/1000000000000000000)).decimalPlaces(3,1))).toNumber()} BUSD</span>
                                        </div>
                                        {/* <div className="d-flex">
                                            <span>BUSD APY:</span>
                                            <span className="ml-auto">0.000%</span>
                                        </div> */}
                                    </div>
                                    <div className="mt-4">
                                        <h5>Borrows</h5>
                                        <div className="d-flex">
                                            <span>Remaining cbUSD debt:</span>
                                            
                                            <span className="ml-auto">{((BigNumber((totaldebt/1000000000000000000)).decimalPlaces(3,1))).toNumber()} cbUSD</span>
                                        </div>
                                        <div className="d-flex">
                                            <span>Available to borrow:</span>
                                            <span className="ml-auto">{((BigNumber((avaltoborrow/1000000000000000000)).decimalPlaces(3,1))).toNumber()} cbUSD</span>
                                        </div>
                                        <div className="d-flex">
                                            <span>Your wallet balance:</span>
                                            <span className="ml-auto">{((BigNumber((cbusdbalance/1000000000000000000)).decimalPlaces(3,1))).toNumber()} cbUSD</span>
                                        </div>
                                        {/* <div className="d-flex">
                                            <span>Est. Date of Maturity:</span>
                                            <span className="ml-auto">...</span>
                                        </div> */}
                                        <div className="d-flex">
                                            <span>Global Mintable cbUSD:</span>
                                            <span className="ml-auto">{((BigNumber((cbusdtotalsupply/1000000000000000000)).decimalPlaces(3,1))).toNumber()}cbUSD</span>
                                        </div>
                                    </div>

                                </div>
                            )}
                            {activeTab == "Withdraw" && (
                                <div className="p-3">
                                    <h6>Withdraw your deposited BUSD</h6>
                                    <InputGroup className="mt-3">
                                        <Input placeholder={{withdrawpercent},"0.00"} style={{ height: "auto" }} type = "number" id="tid2" />
                                        <InputGroupAddon addonType="append"><Button color="site-primary" onClick = {withdraw}>Withdraw</Button></InputGroupAddon>
                                    </InputGroup>
                                    <div className="percentage">
                                        <div className="percentage-item" onClick={withdrawbalancepercent}>25%</div>
                                        <div className="percentage-item"onClick={withdrawbalancepercent1}>50%</div>
                                        <div className="percentage-item"onClick={withdrawbalancepercent2}>75%</div>
                                        <div className="percentage-item"onClick={withdrawbalancepercent3}>100%</div>
                                    </div>
                                    <div className="mt-4">
                                        <h5>Deposits</h5>
                                        <div className="d-flex">
                                            <span>Your wallet balance:</span>
                                            <span className="ml-auto">{((BigNumber((busdbalance/1000000000000000000)).decimalPlaces(3,1))).toNumber()} BUSD</span>
                                        </div>
                                        <div className="d-flex">
                                            <span>Your collateral balance:</span>
                                            <span className="ml-auto">{((BigNumber((totaldep/1000000000000000000)).decimalPlaces(3,1))).toNumber()} BUSD</span>
                                        </div>
                                        <div className="d-flex larger">
                                            <span>Available to withdraw:</span>
                                            <span className="ml-auto">{((BigNumber((avatokentowithdraw/1000000000000000000)).decimalPlaces(3,1))).toNumber()} BUSD</span>
                                        </div>
                                        {/* <div className="d-flex">
                                            <span>BUSD APY:</span>
                                            <span className="ml-auto">0.000%</span>
                                        </div> */}
                                    </div>
                                    <div className="mt-4">
                                        <h5>Borrows</h5>
                                        <div className="d-flex">
                                            <span>Remaining cbUSD debt:</span>
                                            <span className="ml-auto">{((BigNumber((totaldebt/1000000000000000000)).decimalPlaces(3,1))).toNumber()} cbUSD</span>
                                        </div>
                                        <div className="d-flex">
                                            <span>Available to borrow:</span>
                                            <span className="ml-auto">{((BigNumber((avaltoborrow/1000000000000000000)).decimalPlaces(3,1))).toNumber()} cbUSD</span>
                                        </div>
                                        <div className="d-flex">
                                            <span>Your wallet balance:</span>
                                            <span className="ml-auto">{((BigNumber((cbusdbalance/1000000000000000000)).decimalPlaces(3,1))).toNumber()} cbUSD</span>
                                        </div>
                                        {/* <div className="d-flex">
                                            <span>Est. Date of Maturity:</span>
                                            <span className="ml-auto">...</span>
                                        </div> */}
                                        <div className="d-flex">
                                            <span>Global Mintable cbUSD:</span>
                                            <span className="ml-auto">{((BigNumber((cbusdtotalsupply/1000000000000000000)).decimalPlaces(3,1))).toNumber()} cbUSD</span>
                                        </div>
                                    </div>

                                </div>
                            )}
                            {activeTab == "Borrow" && (
                                <div className="p-3">
                                    <Dropdown isOpen={dropdownOpen1} className="d-block" toggle={toggle1}>
                                        <DropdownToggle color="site-primary" className="d-block w-100" caret>
                                            {selectedDropdown1}
                                        </DropdownToggle>
                                        <DropdownMenu className="w-100">
                                        <DropdownItem onClick={e => setSelectedDropdown1("NO TRANCHE")}>NO TRANCHE</DropdownItem>
                                            <DropdownItem onClick={e => { setSelectedDropdown1("FIXED TRANCHE"); history.push("/carbon-yield")}}>FIXED TRANCHE(UPCOMING)</DropdownItem>
                                           
                                            <DropdownItem onClick={e => { setSelectedDropdown1("VARIABLE TRANCHE"); history.push("/carbon-yield")}}>VARIABLE TRANCHE(UPCOMING)</DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                    <h6 className="mt-3">Borrow up to 50% the value of your collateral in cbUSD. Your debt will be automatically paid down by yield from Alpaca finance</h6>
                                    <InputGroup className="mt-3">
                                    <Input placeholder={{borrowpercent},"0.00"} style={{ height: "auto" }} type = "number" id="tid3" />
                                        <InputGroupAddon addonType="append"><Button color="site-primary" onClick={borrow}>Borrow</Button></InputGroupAddon>
                                    </InputGroup>
                                    <div className="percentage">
                                        <div className="percentage-item" onClick={borrowbalancepercent}>25%</div>
                                        <div className="percentage-item"onClick={borrowbalancepercent1}>50%</div>
                                        <div className="percentage-item"onClick={borrowbalancepercent2}>75%</div>
                                        <div className="percentage-item"onClick={borrowbalancepercent3}>100%</div>
                                    </div>
                                    <div className="mt-4">
                                        <h5>Deposits</h5>
                                        <div className="d-flex">
                                            <span>Your wallet balance:</span>
                                            <span className="ml-auto">{((BigNumber((busdbalance/1000000000000000000)).decimalPlaces(3,1))).toNumber()} BUSD</span>
                                        </div>
                                        <div className="d-flex">
                                            <span>Your collateral balance:</span>
                                            <span className="ml-auto">{((BigNumber((totaldep/1000000000000000000)).decimalPlaces(3,1))).toNumber()} BUSD</span>
                                        </div>
                                        <div className="d-flex">
                                            <span>Available to withdraw:</span>
                                            <span className="ml-auto">{((BigNumber((avatokentowithdraw/1000000000000000000)).decimalPlaces(3,1))).toNumber()} BUSD</span>
                                        </div>
                                        {/* <div className="d-flex">
                                            <span>BUSD APY:</span>
                                            <span className="ml-auto">0.000%</span>
                                        </div> */}
                                    </div>
                                    <div className="mt-4">
                                        <h5>Borrows</h5>
                                        <div className="d-flex">
                                            <span>Remaining cbUSD debt:</span>
                                            <span className="ml-auto">{((BigNumber((totaldebt/1000000000000000000)).decimalPlaces(3,1))).toNumber()} cbUSD</span>
                                        </div>
                                        <div className="d-flex larger">
                                            <span>Available to borrow:</span>
                                            <span className="ml-auto">{((BigNumber((avaltoborrow/1000000000000000000)).decimalPlaces(3,1))).toNumber()} cbUSD</span>
                                        </div>
                                        <div className="d-flex">
                                            <span>Your wallet balance:</span>
                                            <span className="ml-auto">{((BigNumber((cbusdbalance/1000000000000000000)).decimalPlaces(3,1))).toNumber()} cbUSD</span>
                                        </div>
                                        {/* <div className="d-flex">
                                            <span>Est. Date of Maturity:</span>
                                            <span className="ml-auto">...</span>
                                        </div> */}
                                        <div className="d-flex larger">
                                            <span>Global Mintable cbUSD:</span>
                                            <span className="ml-auto">{((BigNumber((cbusdtotalsupply/1000000000000000000)).decimalPlaces(3,1))).toNumber()} cbUSD</span>
                                        </div>
                                    </div>

                                </div>
                            )}
                            {activeTab == "Repay" && (
                                <div className="p-3">
                                    <div>         

{ ap1 === true ? 
(
(
<div>
                                    <h6>Repay the remaining {((BigNumber((totaldebt/1000000000000000000)).decimalPlaces(3,1))).toNumber()} cbUSD debt from your wallet using cbUSD and/or BUSD</h6>
                                    {!multiple ?
                                        <InputGroup className="mt-3">
                                        <Input placeholder={{repaypercent},"0.00"} style={{ height: "auto" }} type = "number" id="tid4" />
                                            <InputGroupButtonDropdown addonType="append" isOpen={dropdownOpen} toggle={toggleDropDown}>
                                                <DropdownToggle caret style={{ width: 130 }} color="site-primary">
                                                    {selectedDropdown}
                                                </DropdownToggle>
                                                <DropdownMenu>
                                                    <DropdownItem onClick={e => setSelectedDropdown("cbUSD")}>cbUSD</DropdownItem>
                                                    <DropdownItem onClick={e => setSelectedDropdown("BUSD")}>BUSD</DropdownItem>
                                                </DropdownMenu>
                                            </InputGroupButtonDropdown>
                                            {/* <InputGroupAddon addonType="append"><Button onClick={e => setMultiple(!multiple)} color="outline-site-primary"><i className="fa fa-plus"></i></Button></InputGroupAddon> */}
                                        </InputGroup>
                                        : <>
                                            <InputGroup className="mt-3">
                                                <Input placeholder="0.00" style={{ height: "auto" }}  />
                                                <InputGroupAddon addonType="append">
                                                    <InputGroupText className="bg-site-primary text-white font-weight-bold">cbUSD</InputGroupText>
                                                </InputGroupAddon>
                                                <InputGroupAddon addonType="append">
                                                    <Button size="sm" onClick={e => setMultiple(!multiple)} color="outline-site-primary"><i className="fa fa-minus"></i></Button></InputGroupAddon>
                                            </InputGroup>
                                            {/* <InputGroup className="mt-3">
                                                <Input placeholder="0.00" style={{ height: "auto" }}  />
                                                <InputGroupAddon addonType="append">
                                                    <InputGroupText className="bg-site-primary text-white font-weight-bold">BUSD</InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup> */}
                                            {/* <div className="mt-3 d-flex flex-column mx-auto">
                                                <div className="d-inline-flex mx-auto">
                                                    <div style={{ width: 70 }}>
                                                        Min
                                                    </div>
                                                    <input type="range" min="1" max="100" defaultValue="0"></input>
                                                    <div style={{ width: 70 }} className="text-right">
                                                        Max
                                                    </div>
                                                </div>
                                                <div className="d-inline-flex mx-auto">
                                                    <div style={{ width: 70 }}>
                                                        cbUSD
                                                    </div>
                                                    <input type="range" min="1" max="100" defaultValue="0"></input>
                                                    <div style={{ width: 70 }} className="text-right">
                                                        BUSD
                                                    </div>
                                                </div>
                                            </div> */}
                                        </>}
                                    <div className="percentage">
                                        <div className="percentage-item" onClick={repaybalancepercent}>25%</div>
                                        <div className="percentage-item"onClick={repaybalancepercent1}>50%</div>
                                        <div className="percentage-item"onClick={repaybalancepercent2}>75%</div>
                                        <div className="percentage-item"onClick={repaybalancepercent3}>100%</div>
                                    </div>
                                    <div style={{ maxWidth: 300 }} className="mx-auto">
                                        <Button color="outline-site-primary" className="mt-3" block onClick={repayborrow}>Repay</Button>
                                    </div>
                                    </div>
)
):
(
(
<div>
<h6>Before Repay you want to approve First</h6>
<Button color="outline-site-primary" className="mt-3" block onClick={approv}>Approve</Button>
</div>
)
)}
    </div> 
                                    <div className="mt-4">
                                        <h5>Deposits</h5>
                                        <div className="d-flex larger">
                                            <span>Your wallet balance:</span>
                                            <span className="ml-auto">{((BigNumber((busdbalance/1000000000000000000)).decimalPlaces(3,1))).toNumber()} BUSD</span>
                                        </div>
                                        <div className="d-flex">
                                            <span>Your collateral balance:</span>
                                            <span className="ml-auto">{((BigNumber((totaldep/1000000000000000000)).decimalPlaces(3,1))).toNumber()} BUSD</span>
                                        </div>
                                        <div className="d-flex">
                                            <span>Available to withdraw:</span>
                                            <span className="ml-auto">{((BigNumber((avatokentowithdraw/1000000000000000000)).decimalPlaces(3,1))).toNumber()} BUSD</span>
                                        </div>
                                        {/* <div className="d-flex">
                                            <span>BUSD APY:</span>
                                            <span className="ml-auto">0.000%</span>
                                        </div> */}
                                    </div>
                                    <div className="mt-4">
                                        <h5>Borrows</h5>
                                        <div className="d-flex larger">
                                            <span>Remaining cbUSD debt:</span>
                                            <span className="ml-auto">{((BigNumber((totaldebt/1000000000000000000)).decimalPlaces(3,1))).toNumber()} cbUSD</span>
                                        </div>
                                        <div className="d-flex">
                                            <span>Available to borrow:</span>
                                            <span className="ml-auto">{((BigNumber((avaltoborrow/1000000000000000000)).decimalPlaces(3,1))).toNumber()} cbUSD</span>
                                        </div>
                                        <div className="d-flex larger">
                                            <span>Your wallet balance:</span>
                                            <span className="ml-auto">{((BigNumber((cbusdbalance/1000000000000000000)).decimalPlaces(3,1))).toNumber()} cbUSD</span>
                                        </div>
                                        {/* <div className="d-flex">
                                            <span>Est. Date of Maturity:</span>
                                            <span className="ml-auto">...</span>
                                        </div> */}
                                        <div className="d-flex">
                                            <span>Global Mintable cbUSD:</span>
                                            <span className="ml-auto">{((BigNumber((cbusdtotalsupply/1000000000000000000)).decimalPlaces(3,1))).toNumber()} cbUSD</span>
                                        </div>
                                    </div>

                                </div>
                            )}
                            {activeTab == "Liquidate" && (
                                <div className="p-3">
                                    <h6>Repay the remaining {((BigNumber((totaldebt/1000000000000000000)).decimalPlaces(3,1))).toNumber()} cbUSD debt by liquidating your BUSD collateral.</h6>
                                    <small className="text-danger">WARNING: this will use your collateral to repay your cbUSD debt.</small>
                                    <InputGroup className="mt-3">
                                    <Input placeholder={{liquidatepercent},"0.00"} style={{ height: "auto" }} type = "number" id="tid5" />
                                        <InputGroupAddon addonType="append"><Button color="site-primary" onClick={liquidate}>Liquidate</Button></InputGroupAddon>
                                    </InputGroup>
                                    <div className="percentage">
                                        <div className="percentage-item" onClick={liquidatebalancepercent}>25%</div>
                                        <div className="percentage-item"onClick={liquidatebalancepercent1}>50%</div>
                                        <div className="percentage-item"onClick={liquidatebalancepercent2}>75%</div>
                                        <div className="percentage-item"onClick={liquidatebalancepercent3}>100%</div>
                                    </div>
                                    <div className="mt-4">
                                        <h5>Deposits</h5>
                                        <div className="d-flex">
                                            <span>Your wallet balance:</span>
                                            <span className="ml-auto">{((BigNumber((busdbalance/1000000000000000000)).decimalPlaces(3,1))).toNumber()} BUSD</span>
                                        </div>
                                        <div className="d-flex larger">
                                            <span>Your collateral balance:</span>
                                            <span className="ml-auto">{((BigNumber((totaldep/1000000000000000000)).decimalPlaces(3,1))).toNumber()} BUSD</span>
                                        </div>
                                        <div className="d-flex">
                                            <span>Available to withdraw:</span>
                                            <span className="ml-auto">{((BigNumber((avatokentowithdraw/1000000000000000000)).decimalPlaces(3,1))).toNumber()} BUSD</span>
                                        </div>
                                        {/* <div className="d-flex">
                                            <span>BUSD APY:</span>
                                            <span className="ml-auto">0.000%</span>
                                        </div> */}
                                    </div>
                                    <div className="mt-4">
                                        <h5>Borrows</h5>
                                        <div className="d-flex larger">
                                            <span>Remaining cbUSD debt:</span>
                                            <span className="ml-auto">{((BigNumber((totaldebt/1000000000000000000)).decimalPlaces(3,1))).toNumber()} cbUSD</span>
                                        </div>
                                        <div className="d-flex">
                                            <span>Available to borrow:</span>
                                            <span className="ml-auto">{((BigNumber((avaltoborrow/1000000000000000000)).decimalPlaces(3,1))).toNumber()} cbUSD</span>
                                        </div>
                                        <div className="d-flex">
                                            <span>Your wallet balance:</span>
                                            <span className="ml-auto">{((BigNumber((cbusdbalance/1000000000000000000)).decimalPlaces(3,1))).toNumber()} cbUSD</span>
                                        </div>
                                        {/* <div className="d-flex">
                                            <span>Est. Date of Maturity:</span>
                                            <span className="ml-auto">...</span>
                                        </div> */}
                                        <div className="d-flex">
                                            <span>Global Mintable cbUSD:</span>
                                            <span className="ml-auto">{((BigNumber((cbusdtotalsupply/1000000000000000000)).decimalPlaces(3,1))).toNumber()} cbUSD</span>
                                        </div>
                                    </div>

                                </div>
                            )}
                        </Card>
                    </Col>
                </Row>  
                    
                    
                    </>)
        }
            
            </Container>
           
        </section>
    );
}

export default Vault;