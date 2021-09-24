import { useEffect } from "react";
import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
//import Popup from 'react-popup';
import Popup from "../Popup";
import { Button, Dropdown, Card, Col, Container, DropdownItem, DropdownMenu, DropdownToggle, Input, InputGroup, InputGroupAddon, InputGroupButtonDropdown, InputGroupText, Row, Table } from "reactstrap";
import web3 from "../web3";
//import swap from "./swapAbi";
//import cbusd from "./cbusdAbi";
//import valutadapter from"./vaultAdapterAbi";
//import busd from "./busdAbi";
import Modald from "../ModalD";
import FolowStepsd from "../FolowStepsd";
import BigNumber from 'bignumber.js';
//import styles from ".././FolowSteps.module.sass";

import { contracts } from './contractAddress';
import {swap,cbusd,vaultAdapterAbi,busd} from './abi';

const Swap = () => {
    let [activeTab, setActiveTab] = useState("Deposit");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownOpen1, setDropdownOpen1] = useState(false);
    const [multiple, setMultiple] = useState(false);
    const [selectedDropdown, setSelectedDropdown] = useState("cbUSD");
    const [selectedDropdown1, setSelectedDropdown1] = useState("No Yield");
    const[tid,setId] = useState("");
    const[tid1,setId1] = useState("");
    const[ap1,setAP] = useState("");
    const [totaldep,setTotaldeposit] = useState("");
    var[cbusdbalance,setcbusdbalance] = useState("");
    const[depositpercent,setdepositpercent] = useState("");
    const[values,setValues] = useState([]);
    const[totalvaluelocked,setTotalvalueLocked]=useState([]);
    const[toalcbusddepo,setTotalcbusddepo]=useState([]);
    const[toalbusddepo,setTotalbusddepo]=useState([]);
    const[toalbusdonalpaca,setTotalbusdonalpaca]=useState([]);

    const toggleDropDown = () => setDropdownOpen(!dropdownOpen);
    const toggle1 = () => setDropdownOpen1(!dropdownOpen1);
    let history = useHistory();
    const [isOpen, setIsOpen] = useState(false);
    var[dis,setDis] = useState("");
    
    const swapcontract = new web3.eth.Contract(swap, contracts.swap.address);
    const cbusdcontract = new web3.eth.Contract(cbusd, contracts.cbusd.address);
    const vaaultadaptercontract = new web3.eth.Contract(vaultAdapterAbi, contracts.vaultadapter.address);
    const busdcontract = new web3.eth.Contract(busd, contracts.busd.address);

 const first = async () => {
     if(localStorage.getItem("wallet")>0){
    const accounts =  await web3.eth.getAccounts(); 
    setcbusdbalance(await cbusdcontract.methods.balanceOf(accounts[0]).call());  
    setTotalcbusddepo(await cbusdcontract.methods.balanceOf(contracts.swap.address).call());
    setTotalbusddepo(await busdcontract.methods.balanceOf(contracts.swap.address).call());
    setTotalbusdonalpaca(await swapcontract.methods.getVaultTotalDeposited(0).call());
    let b= await cbusdcontract.methods.allowance(accounts[0],contracts.swap.address).call();
 
    if(b>0){
      setAP(true);
    }
    else{
      setAP(false);
    }
     var depositedcbusd= await swapcontract.methods.depositedCfTokens(accounts[0]).call();
     if(depositedcbusd == 0){
        values[0]=0;
        values[1]=0;
        values[2]=0;
        values[3]=0;
        console.log("values0",values[0]);
        console.log("values1",values[1]);
     }
else{
    var userdetail=[];
    userdetail=await swapcontract.methods.userInfo(accounts[0]).call();
    console.log("displaydetail",userdetail);
   setValues(userdetail);
   console.log("display");
}
   
    setTotalvalueLocked(await vaaultadaptercontract.methods.totalValue().call());
    
    }
   
}      

    useEffect(() => {
        document.getElementById("header-title").innerText = "Stabilizer";
    } )
    useEffect(() =>         
    {first()},[cbusdbalance,values[0],values[1],values[2],values[3],ap1,totalvaluelocked])
    
   
    const deposit = async(event) => {
        event.preventDefault();
        const accounts =  await web3.eth.getAccounts();
        var valu = document.getElementById("tid1").value;
         var val = valu * 1000000000;
         var value = val * 1000000000;
        // let x = new BigNumber(valu).times(1000000000000000000);
        // console.log("value",x.toNumber());
        // var value = x.toNumber();
        if(parseInt(value)<=parseInt(cbusdbalance)){
            await swapcontract.methods.stake(web3.utils.toBN(value)).send({from:accounts[0]});
            first()
            setIsOpen(true);        
            setDis("Deposited succesfully");
        }
        else{
            setIsOpen(true);        
            setDis("You Are Trying To Deposit More Than Your Wallet Balance");
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
        if(parseInt(value)<=parseInt(values[0])){
            await swapcontract.methods.unstake(web3.utils.toBN(value)).send({from:accounts[0]});
            first()
            setIsOpen(true);
            setDis("withdrawn succesfully")
        }

        else{
            setIsOpen(true);
            setDis("You Are Trying To Withdraw More Than You Deposited")
        }
       
        
      }  

      const stabilize = async(event) => {
        event.preventDefault();
        const accounts =  await web3.eth.getAccounts();
        if(parseInt(values[2]) >parseInt(0)){
          await swapcontract.methods.transmute().send({from:accounts[0]});
          first()
          setIsOpen(true);
          setDis("Stabilize succesfully !")
        }
        else{
            first()
            setIsOpen(true);
          setDis("You don't have Stabilizable BUSD ")
        }
       
        
      }
      const stabilizeClaimAndWithdraw = async(event) => {
        event.preventDefault();
        const accounts =  await web3.eth.getAccounts();
        if(parseInt(values[3]) >parseInt(0)){
          await swapcontract.methods.transmuteClaimAndWithdraw().send({from:accounts[0]});
          first()
          setIsOpen(true);
          setDis("Claim and withdraw succesfully")
        }
    
        else{
            first()
            setIsOpen(true);
          setDis("You dont have enough Base Token")
        }
        
        
      }
    
      const balancepercent = async(event) => {
        event.preventDefault();
        const accounts =  await web3.eth.getAccounts(); 
        document.getElementById("tid1").value = false;  
        var twentyfive=(cbusdbalance * 25)/100;
        setdepositpercent(web3.utils.fromWei((twentyfive.toString()), "ether" ));
       
        document.getElementById("tid1").value = web3.utils.fromWei((twentyfive.toString()), "ether" ) ;        
        
      }
       const balancepercent1 = async(event) => {
        event.preventDefault();
        const accounts =  await web3.eth.getAccounts(); 
        document.getElementById("tid1").value = false;    
        const fifty=(cbusdbalance * 50)/100;
        setdepositpercent(web3.utils.fromWei((fifty.toString()), "ether" ) );
        document.getElementById("tid1").value = web3.utils.fromWei((fifty.toString()), "ether" ) ;          
        
      } 


      const balancepercent2 = async(event) => {
        event.preventDefault();
        const accounts =  await web3.eth.getAccounts(); 
        document.getElementById("tid1").value = false;    
        var seventyfive=(cbusdbalance * 75)/100;
        setdepositpercent(web3.utils.fromWei((seventyfive.toString()), "ether" )); 
        document.getElementById("tid1").value =web3.utils.fromWei((seventyfive.toString()), "ether" );         
        
      }
      const balancepercent3 = async(event) => {
        event.preventDefault();
        const accounts =  await web3.eth.getAccounts(); 
        document.getElementById("tid1").value = false;    
        var hundred=(cbusdbalance * 100)/100;
        setdepositpercent(web3.utils.fromWei((hundred.toString()), "ether" )); 
        document.getElementById("tid1").value = web3.utils.fromWei((hundred.toString()), "ether" );         
        
      }


      const withdrawbalancepercent = async(event) => {
        event.preventDefault();
        const accounts =  await web3.eth.getAccounts(); 
        document.getElementById("tid2").value = false;  
        var twentyfive=(values[0] * 25)/100;
        setTotaldeposit(web3.utils.fromWei((twentyfive.toString()), "ether" ));
        document.getElementById("tid2").value =web3.utils.fromWei((twentyfive.toString()), "ether" );        
        
      }
       const withdrawbalancepercent1 = async(event) => {
        event.preventDefault();
        const accounts =  await web3.eth.getAccounts(); 
        document.getElementById("tid2").value = false;    
        var fifty=(values[0] * 50)/100;
        setTotaldeposit(web3.utils.fromWei((fifty.toString()), "ether" ));
        document.getElementById("tid2").value =web3.utils.fromWei((fifty.toString()), "ether" );          
        
      } 


      const withdrawbalancepercent2 = async(event) => {
        event.preventDefault();
        const accounts =  await web3.eth.getAccounts(); 
        document.getElementById("tid2").value = false;    
        var seventyfive=(values[0] * 75)/100;
        setTotaldeposit(web3.utils.fromWei((seventyfive.toString()), "ether" )); 
        document.getElementById("tid2").value =web3.utils.fromWei((seventyfive.toString()), "ether" );         
        
      }
      const withdrawbalancepercent3 = async(event) => {
        event.preventDefault();
        const accounts =  await web3.eth.getAccounts(); 
        document.getElementById("tid2").value = false;    
        var hundred=(values[0] * 100)/100;
        setTotaldeposit(web3.utils.fromWei((hundred.toString()), "ether" )); 
        document.getElementById("tid2").value =web3.utils.fromWei((hundred.toString()), "ether" );         
        
      }
      const approve = async() => {
        let account = await web3.eth.getAccounts();
        let amount = 1000000000000000000 +"000000000000000000"; 
        await cbusdcontract.methods.approve(contracts.swap.address,amount).send({from:account[0]});
        first()
        setIsOpen(true);
        setDis("Approved Succesfully");
    }
    const togglePopup = () => {
        setIsOpen(false);
      }


    return (
        
        <section className="p-0 my-5">
{/* <div>
    {isOpen && <Popup
      content={<>
       <center> <b >{dis}</b><br/>
        <button onClick={togglePopup}>OK</button></center>
      </>}
      handleClose={togglePopup}
    />}
  </div>              */}
  <Modald visible={isOpen} onClose={() => setIsOpen(false)}>
        <FolowStepsd viewhistory={dis}  />
      </Modald>
             {

                 
            localStorage.getItem("wallet")===null || localStorage.getItem("wallet")===""?(<>
            <Container fluid>
           
                <Row className="justify-content-center">
                    <Col xl="8" lg="8" md="10" sm="12">
                        <Card className="custom-card">
                            <div className="p-3">
                                <h4>Stabilize cbUSD to BUSD</h4>
                                <h6>The Stabilizer exists to ensure cbUSD is pegged to the dollar. Depositing your cbUSD will gradually convert it into BUSD. This is only useful if cbUSD is trading under one dollar on Curve.</h6>
                                <Table bordered responsive className="mt-3">
                                    <thead>
                                        <tr>
                                            <th>Your cbUSD</th>
                                            <th>Deposited cbUSD</th>
                                            <th>Stabilizable BUSD</th>
                                            <th>Your BUSD</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-center">
                                        <tr>
                                            <td>0.00</td>
                                            <td>0.00</td>
                                            <td>0.00</td>
                                            <td>0.00</td>
                                        </tr>
                                    </tbody>
                                </Table>
                             
<div>
                                <Container fluid>
                                    <Row>
                                        <Col xl="6" md="12">
                                            <InputGroup className="mt-3">
                                                <Input placeholder={depositpercent} style={{ height: "auto" }}type = "number" id="tid1"  />
                                                <InputGroupAddon addonType="append"><Button color="site-primary" >Deposit</Button></InputGroupAddon>
                                            </InputGroup>
                                            <div className="percentage smaller">
                                                <div className="percentage-item" >25%</div>
                                                <div className="percentage-item" >50%</div>
                                                <div className="percentage-item" >75%</div>
                                                <div className="percentage-item" >100%</div>
                                            </div>
                                        </Col>
                                        <Col xl="6" md="12">
                                            <InputGroup className="mt-3">
                                                <Input placeholder={totaldep} style={{ height: "auto" }}type = "number"  id="tid2"  />
                                                <InputGroupAddon addonType="append"><Button color="site-primary" >Withdraw</Button></InputGroupAddon>
                                            </InputGroup>
                                            <div className="percentage smaller">
                                                <div className="percentage-item" >25%</div>
                                                <div className="percentage-item">50%</div>
                                                <div className="percentage-item">75%</div>
                                                <div className="percentage-item">100%</div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Container>
                                <Container>
                                    <Row className="justify-content-center">
                                        <Col xl="9">
                                            <Row className="mt-4">
                                                <Col xl="6" md="12">
                                                    <Button color="outline-site-primary" block >Stabilize</Button>
                                                </Col>
                                                <Col xl="6" md="12" className='mt-3 mt-xl-0'>
                                                    <Button color="outline-site-primary" block   >Claim & Withdraw</Button>
                                                </Col>
                                            </Row>

                                        </Col>
                                    </Row>
                                </Container>
                                </div>

                            </div>
                        </Card>
                    </Col>
                </Row>
                <Row className="mt-4 justify-content-center">
                    <Col xl="8" lg="8" md="10" sm="12">
                        <Card className="custom-card">
                            <div className="p-3">
                                <h4 className="mb-4">Global Stabilizer Status</h4>
                                <div className="content">
                                    <div className="d-flex">
                                        <span>Total Deposited cbUSD:</span>
                                        <span className="ml-auto">0.00</span>
                                    </div>
                                    <div className="d-flex">
                                        <span>Total BUSD Deposited in alpaca:</span>
                                        <span className="ml-auto">0.00</span>
                                    </div>
                                    {/* <div className="d-flex">
                                        <span>Estimated BUSD Daily Yield:</span>
                                        <span className="ml-auto">0.000</span>
                                    </div> */}
                                    <div className="d-flex">
                                        <span>Total BUSD Available for Stabilization:</span>
                                        <span className="ml-auto" >0.00</span>
                                    </div>
                                    {/* <div className="d-flex">
                                        <span>Yearly Stabilization Rate:</span>
                                        <span className="ml-auto">0.000</span>
                                    </div> */}
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Container>
            </>):
                (<>
 <Container fluid>
           
                <Row className="justify-content-center">
                    <Col xl="8" lg="8" md="10" sm="12">
                        <Card className="custom-card">
                            <div className="p-3">
                                <h4>Stabilize cbUSD to BUSD</h4>
                                <h6>The Stabilizer exists to ensure cbUSD is pegged to the dollar. Depositing your cbUSD will gradually convert it into BUSD. This is only useful if cbUSD is trading under one dollar on Curve.</h6>
                                <Table bordered responsive className="mt-3">
                                    <thead>
                                        <tr>
                                            <th>Your cbUSD</th>
                                            <th>Deposited cbUSD</th>
                                            <th>Stabilizable BUSD</th>
                                            <th>Your BUSD</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-center">
                                        <tr>
                                            <td>{((BigNumber((cbusdbalance/1000000000000000000)).decimalPlaces(3,1))).toNumber()}</td>
                                            <td>{((BigNumber((values[0]/1000000000000000000)).decimalPlaces(3,1))).toNumber()}</td>
                                            <td>{((BigNumber((values[2]/1000000000000000000)).decimalPlaces(3,1))).toNumber()}</td>
                                            <td>{((BigNumber((values[3]/1000000000000000000)).decimalPlaces(3,1))).toNumber()}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                                <div>         

{ ap1 === true ? 
(
(
<div>
                                <Container fluid>
                                    <Row>
                                        <Col xl="6" md="12">
                                            <InputGroup className="mt-3">
                                                <Input placeholder={depositpercent} style={{ height: "auto" }}type = "number" id="tid1"  />
                                                <InputGroupAddon addonType="append"><Button color="site-primary" onClick={deposit}>Deposit</Button></InputGroupAddon>
                                            </InputGroup>
                                            <div className="percentage smaller">
                                                <div className="percentage-item" onClick={balancepercent}>25%</div>
                                                <div className="percentage-item" onClick={balancepercent1}>50%</div>
                                                <div className="percentage-item" onClick={balancepercent2}>75%</div>
                                                <div className="percentage-item" onClick={balancepercent3}>100%</div>
                                            </div>
                                        </Col>
                                        <Col xl="6" md="12">
                                            <InputGroup className="mt-3">
                                                <Input placeholder={totaldep} style={{ height: "auto" }}type = "number"  id="tid2"  />
                                                <InputGroupAddon addonType="append"><Button color="site-primary" onClick={withdraw}>Withdraw</Button></InputGroupAddon>
                                            </InputGroup>
                                            <div className="percentage smaller">
                                                <div className="percentage-item"onClick={withdrawbalancepercent}>25%</div>
                                                <div className="percentage-item"onClick={withdrawbalancepercent1}>50%</div>
                                                <div className="percentage-item"onClick={withdrawbalancepercent2}>75%</div>
                                                <div className="percentage-item"onClick={withdrawbalancepercent3}>100%</div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Container>
                                <Container>
                                    <Row className="justify-content-center">
                                        <Col xl="9">
                                            <Row className="mt-4">
                                                <Col xl="6" md="12">
                                                    <Button color="outline-site-primary" block onClick={stabilize}>Stabilize</Button>
                                                </Col>
                                                <Col xl="6" md="12" className='mt-3 mt-xl-0'>
                                                    <Button color="outline-site-primary" block  onClick={stabilizeClaimAndWithdraw} >Claim & Withdraw</Button>
                                                </Col>
                                            </Row>

                                        </Col>
                                    </Row>
                                </Container>
                                </div>
)
):
(
(
<div><center><Button color="site-primary" onClick={approve}>Approve</Button></center>

</div>
)
)}
  </div> 
                            </div>
                        </Card>
                    </Col>
                </Row>
                <Row className="mt-4 justify-content-center">
                    <Col xl="8" lg="8" md="10" sm="12">
                        <Card className="custom-card">
                            <div className="p-3">
                                <h4 className="mb-4">Global Stabilizer Status</h4>
                                <div className="content">
                                    <div className="d-flex">
                                        <span>Total Deposited cbUSD:</span>
                                        <span className="ml-auto">{((BigNumber((toalcbusddepo/1000000000000000000)).decimalPlaces(3,1))).toNumber()}</span>
                                    </div>
                                    <div className="d-flex">
                                        <span>Total BUSD Deposited in alpaca:</span>
                                        <span className="ml-auto">{((BigNumber((toalbusdonalpaca/1000000000000000000)).decimalPlaces(3,1))).toNumber()}</span>
                                    </div>
                                    {/* <div className="d-flex">
                                        <span>Estimated BUSD Daily Yield:</span>
                                        <span className="ml-auto">0.000</span>
                                    </div> */}
                                    <div className="d-flex">
                                        <span>Total BUSD Available for Stabilization:</span>
                                        <span className="ml-auto" >{((BigNumber((toalbusddepo/1000000000000000000)).decimalPlaces(3,1))).toNumber()}</span>
                                    </div>
                                    {/* <div className="d-flex">
                                        <span>Yearly Stabilization Rate:</span>
                                        <span className="ml-auto">0.000</span>
                                    </div> */}
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Container>
            </>)
        }
        </section>
    );
}

export default Swap;