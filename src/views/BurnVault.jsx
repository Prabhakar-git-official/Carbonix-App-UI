import { Card, Col, Container, Row,Button } from "reactstrap";
import CustomCard from "../components/global/CustomCard";
//import burnvault from "./burnVaultAbi";
import web3 from "../web3";
//import black from "./blackAbi";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Modal,InputGroup,FormControl } from "react-bootstrap";
import Popup from "../Popup";
import Modald from "../ModalD";
import FolowStepsd from "../FolowStepsd";


import { contracts } from './contractAddress';
import {blackabi ,burnvault} from './abi';

const BurnVault = () => {
    const [modalShow1, setModalShow1] = React.useState(false);
    const [tid1,setId1] = useState([]);
    var [maxta,setmaxt] = useState([]);
    const [tid2,setId2] = useState([]);
    const [tid3,setId3] = useState([]);
    const [tid4,setId4] = useState([]);
    const [burn,setburn] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    var[dis,setDis] = useState("");
    const[t11,setTim11 ] = useState("");
    const[t21,setTim21] = useState("");
    const[t31,setTim31 ] = useState("");
    const[t41,setTime41] = useState("");
    var [lct,setlct] = useState([]);
    var [date1, setdate1]=useState("");
    var [time1, settime1]=useState("");
    const [lock1 ,setlock1]=useState("");

    const blackcontract = new web3.eth.Contract(blackabi, contracts.black.address);
    const burnvaultcontract = new web3.eth.Contract(burnvault, contracts.burnvault.address);


    const bvb = async() => {
        if(localStorage.getItem("wallet")>0){
        let account = await web3.eth.getAccounts();
        
        setId1(await blackcontract.methods.balanceOf(account[0]).call());
        var maxtx  = await burnvaultcontract.methods.maxTxAmount().call();
        setmaxt(maxtx);
        var circulate = await burnvaultcontract.methods.getCirculatingSupply().call();
        var balance = await burnvaultcontract.methods.getBurnVaultBNBBalance().call();
        setId2(circulate/(balance/1000000000000000000));
        setId3(await burnvaultcontract.methods.getBurnVaultBLACKBalance().call());
        var burnbalan  = await burnvaultcontract.methods.senderBurnBalance(account[0]).call();
        var bb = maxta - burnbalan;
        setburn(bb/1000000000);
        const checklock = await burnvaultcontract.methods.lock(account[0]).call();
        setlct(checklock);
        //var loc = await burnvault.methods.secondsLeft(account[0]).call();
//var now = new Date().getTime();
        // if(loc<=now){
        //   setlct(true);
        //   }
        //   else{
        //     setlct(false);
        //   }
        var loc = await burnvaultcontract.methods.secondsLeft(account[0]).call();
        // var ff=new Date(loc*1000);
        // setdate1(ff.toDateString());
        // var hours = ff.getHours();
        // var minutes = ff.getMinutes();
        // var ampm = hours >= 12 ? 'PM' : 'AM';
        // hours = hours % 12;
        // hours = hours ? hours : 12; // the hour '0' should be '12'
        // minutes = minutes < 10 ? '0'+minutes : minutes;
        // settime1( hours + ':' + minutes + ' ' + ampm);
        // //settime(lock);
         var countDowndate   = new Date().getTime()+ loc*1000;
        //console.log(countDowndate);
        // var countDownDate = new Date().getTime() + (lock * 1000) ;
        //alert(time);
        var x = setInterval(function() {
           var now = new Date().getTime();
          var distance = countDowndate - now ;
         // console.log(now);
          // Time calculations for days, hours, minutes and seconds
         var days = Math.floor(distance / (1000 * 60 * 60 * 24));
          var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          var seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
          // Output the result in an element with id="demo"
         // document.getElementById("demo").innerHTML = hours + "h "
         // + minutes + "m " + seconds + "s ";
        setTime41(days);
        setTim11(hours);
        setTim21(minutes);
        setTim31(seconds);
        
        
        
        
          // If the count down is over, write some text 
          if (distance < 0) {
                clearInterval(x);
                
                console.log('CountDown Finished');
            }
           
        
            var count=`Starts in : ${t41}:${t11}:${t21}:${t31}`;
            console.log("count",count);
          
        }, 1000);

      

        var allowan = await blackcontract.methods.allowance(account[0],contracts.burnvault.address).call();
       if(allowan == 0){
        setId4(true);
        }
       else{
        var btn = document.getElementById('tid');
       setId4(false);
      }
    }
    }
    useEffect(() => {
      document.getElementById("header-title").innerText = "Burn Vault";
  } )
    useEffect(()=>{bvb()},[tid1,maxta,tid2])
    useEffect(()=>{bvb()},[tid3,burn,tid4])
    useEffect(() =>{bvb()},[date1,lock1,time1,t41,t11,t21,t31])
    const approve = async() => {
        let account = await web3.eth.getAccounts();
        let amount = 1000000000000000000 +"000000000000000000";
        await blackcontract.methods.approve(contracts.burnvault.address,amount).send({from:account[0]});
        bvb();
        setIsOpen(true); 
        setDis("Approved successfully");
      }
      const togglePopup = () => {
        setIsOpen(false);
      }


      function MyVerticallyCenteredModal1(props) {
 
        var [tid6,setId6] = useState([]);



        var myfunct=async()=>{
            var circulate = await burnvaultcontract.methods.getCirculatingSupply().call();
            var balance = await burnvaultcontract.methods.getBurnVaultBNBBalance().call();         
          // setId6(circulate/(balance/1000000000000000000));         
            var a = document.getElementById("tid5").value;            
            var b =   (a * 1000000000) / (circulate/(balance/1000000000000000000));
            document.getElementById("idprint").innerHTML = b.toFixed(15) ;
            
         }
         
         
         const swap = async() => {
            document.getElementById("mymodal").style.visibility="hidden";
         
            let account = await web3.eth.getAccounts();
         
            var maxtx  = await burnvaultcontract.methods.maxTxAmount().call();
            
             var burnbalan  = await burnvaultcontract.methods.senderBurnBalance(account[0]).call();
              var bb = maxtx - burnbalan;
             console.log(bb);
             var burnab1=(bb/1000000000);                
             var a = document.getElementById("tid5").value;
         //alert(maxtx);
         if(a<=  100000){
            if( a <= burnab1){
                let amount = a * 1000000000;
             
             await burnvaultcontract.methods.swap(amount).send({from:account[0]});
             setModalShow1(false);
             setIsOpen(true); 
             setDis("Successfully Swapped");
             bvb();
            }
            else{
                setIsOpen(true); 
                setDis("The amount you entered must be less than the Availabe limit ");
              }
            }
          
          
          else{
              setIsOpen(true); 
              setDis("The amount you entered must be less than the Maximum Transcation amount");
          }
      
         
        }
         
        return (
 
 
     
            <Modal
              {...props}
              style={{width:"500px" , marginLeft:"400px",}}
        
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              id="mymodal"
              centered
            >
              <Modal.Header className="myModal" style={{backgroundColor:"#f5584b",color:"white"}} closeButton>
                 
                <Modal.Title id="contained-modal-title-vcenter" >
                  Swap
                </Modal.Title><br/><br/>
               
              </Modal.Header>
              
              <Modal.Body style={{backgroundColor:"#f5584b", color:"white"}}  className="myModal">
                <InputGroup>
          <InputGroup.Prepend>
           <h5>Black : </h5>&nbsp;
          </InputGroup.Prepend>
          <FormControl className="myInput" onChange={myfunct} id="tid5" aria-label="Amount (to the nearest dollar)" /><br/>
          <InputGroup.Append>
          
       
          </InputGroup.Append>
        </InputGroup><br/>
        <InputGroup>
        <InputGroup.Prepend>
           <h5 > BNB : &nbsp;&nbsp; </h5>
           <h5 id="idprint">0.00</h5>
          </InputGroup.Prepend>
        </InputGroup>
              </Modal.Body>
              <Modal.Footer style={{backgroundColor:"#f5584b"}}  className="myModal">
                <Button variant="primary" onClick={swap} style={{backgroundColor:"#e3e4e6", color:"#ff0083"}}>Swap</Button>
              </Modal.Footer>
            </Modal>
          );
        } 
       
      
          
       
      
    return (<>
    
    {/* {isOpen && <Popup
      content={<>
       <center> <b >{dis}</b><br/>
        <button onClick={togglePopup}>OK</button></center>
      </>}
      handleClose={togglePopup}
    />} */}
     <Modald visible={isOpen} onClose={() => setIsOpen(false)}>
        <FolowStepsd viewhistory={dis}  />
      </Modald>
  
        <Row className="m-5">
        {
            localStorage.getItem("wallet")===null || localStorage.getItem("wallet")===""?(<>
           
            <Col xl="4" lg="6" md="6" className="mb-4">
                <CustomCard title=" YOUR BLACK BALANCE" text="0.00" />
            </Col>
            <Col xl="4" lg="6" md="6" className="mb-4">
                <CustomCard title="BLACK PRICE IN BNB" text="0.00"/>
            </Col>
            <Col xl="4" lg="6" md="6" className="mb-4">
                <CustomCard title="BLACK TOKEN BALANCE  IN BURNVAULT" text="0.00" />
            </Col>
            <Col xl="4" lg="6" md="6" className="mb-4">
                <CustomCard title="MAXIMUM TRANSACTION LIMIT" text= "0.00"/>
            </Col>
            <Col xl="4" lg="6" md="6" className="mb-4">
                <Card className="custom-card p-24 text-white" color="site-primary">
                
                    <p><center><b>Approve Before Swap</b></center></p>
                    <div className="text-center text-Black">
                        <Button color="dark">Approve</Button>
                    </div>
                    
 
                </Card>
            </Col>
            <Col xl="4" lg="6" md="6" className="mb-4">
               
            
                <CustomCard title="YOUR AVAILABLE SWAP LIMIT" text= {burn}/>
          
                {/* <Button color="outline-site-primary" className="align-self-end" id = "tid"  disabled ={tid4} block  onClick={() => setModalShow1(true)}>Swap</Button> */}
                <MyVerticallyCenteredModal1
                show={modalShow1}
                onHide={() => setModalShow1(false)}
        /><br/>
                </Col>
                </>):
                (<>
                 <Col xl="4" lg="6" md="6" className="mb-4">
                <CustomCard title="YOUR BLACK BALANCE" text={parseFloat(tid1/1000000000).toFixed(3)} />
            </Col>
            <Col xl="4" lg="6" md="6" className="mb-4">
                <CustomCard title="BLACK PRICE IN BNB" text={ parseFloat(1000000000/tid2).toFixed(3)} />
            </Col>
            <Col xl="4" lg="6" md="6" className="mb-4">
                <CustomCard title="BLACK TOKEN BALANCE IN BURNVAULT" text={parseFloat(tid3/1000000000).toFixed(3)} />
            </Col>
            <Col xl="4" lg="6" md="6" className="mb-4">
                <CustomCard title="MAXIMUM TRANSACTION LIMIT" text= {parseFloat(maxta/1000000000).toFixed(3)}/>
            </Col>
            <Col xl="4" lg="6" md="6" className="mb-4">
                <Card className="custom-card p-24 text-black" color="site-primary">
                <div>         



{lct===false?((<div>

  { tid4 === true ? 
(
(
<div>
                    <p><center><b>Approve Before Swap</b></center></p>
                    <div className="text-center text-Black">
                        <Button color="dark" onClick={approve}>Approve</Button>
                    </div>
                    </div>
                    
) 

):

(
(
 
<div>
                    <p><b><center>CONVERT YOUR BLACK TO BNB</center></b></p>
                    <div className="text-center text-Black">
                    {/* <Button color="dark" >Approved successfully</Button> */}
                    <Button color="dark"  id = "tid"     onClick={() => setModalShow1(true)}>Swap</Button>
                <MyVerticallyCenteredModal1
                show={modalShow1}
                onHide={() => setModalShow1(false)}
        /><br/>
                    </div>
                   
</div>
)
)}

</div>)):((<div>

  <text className="mt-3"  >You Need to wait for deposit till this time </text><br/><br/>
  <center><Button color="dark"  className="text-center">{t41} Day : {t11} Hrs : {t21} Min : {t31} Sec</Button></center>


</div>))
}


  </div> 
                </Card>
            </Col>
            <Col xl="4" lg="6" md="6" className="mb-4">
                <CustomCard title="YOUR AVAILABLE SWAP LIMIT" text= {burn}/>
            </Col>
            {/* <Col xl="4" lg="6" md="6" className="mb-4">
                <div className="h-200 d-flex flex-column">
                    <div className="border rounded border-site-primary py-2 px-4 mb-4">
                        Available limit for User to Swap {burn}
                    </div>
                {/* <Button color="outline-site-primary" className="align-self-end" id = "tid"  disabled ={tid4} block  onClick={() => setModalShow1(true)}>Swap</Button>
                <MyVerticallyCenteredModal1
                show={modalShow1}
                onHide={() => setModalShow1(false)}
        /><br/>
                </div>
                </Col>
               */}
                 </>)
        }
        </Row>
    </>);
}

export default BurnVault;