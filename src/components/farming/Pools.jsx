import { Card, Col, Row, Button } from "reactstrap";
import PoolCardTabs from "./PoolCardTabs";
import icon from "../../assets/img/icon.PNG";

import icon1 from "../../assets/img/icon1.PNG";
//import carbonstake from "../../views/carbonStake";
import { Link,useHistory } from "react-router-dom";
//import cbusd from "../../views/cbusdAbi";
//import busd from "../../views/busdAbi";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
//import black from "../../views/blackAbi";
//import carbonoracle from "../../views/carbonOracleAbi";
//import blackoracle from "../../views/blackOracleAbi";
//import lptokenstake from "../../views/lpStakingAbi";
//import lptokenpair from "../../views/lptokenAbi";
//import cbusdstake  from "../../views/carbonStakeAbi";
//import blackstake from "../../views/blackStakeAbi";

import { contracts } from '../../views/contractAddress';
import { wbnbAbi,blackabi,cbusd,carbonstake,busd,lpstake,cbusdbusdpair,blackstake} from '../../views/abi';

import web3 from "../../web3";
import BigNumber from "bignumber.js";
const Pools = () => {
    const [balance,setbalan] = useState([]);
    const[balanceblack,setBalanceblack]=useState([]);
    const[balancepair,setBalancepair]=useState([]);
    const [communitybalance,setcommunitybalan] = useState([]);
    const [aprcarbon,setAprcarbon]= useState('');
    const [aprblack,setAprblack]=useState('');
    const [aprlp,setAprlp]=useState('');
    const [blackprice,setBlackprice]=useState([]);
    const[carbonprice,setCarbonprice]=useState([]);
    const [blackperblock,setBlackperblock]=useState([]);
    const[blackdailyreward,setBlackDailyreward]=useState([]);
    const[carbonstaked,setCarbonStaked] = useState([]);
    const[lpstaked,setLpStaked] = useState([]);
    const[blackstaked,setBlackStaked] = useState([]);
    const[stakeenddate,setStakeendDate]=useState('');
    
    const bvb = async() => {
        if(localStorage.getItem("wallet")>0){

        const cbusdcontract = new web3.eth.Contract(cbusd, contracts.cbusd.address);
        const carbonstakecontract = new web3.eth.Contract(carbonstake, contracts.carbonstake.address);
        const busdcontract = new web3.eth.Contract(busd, contracts.busd.address);
        const blackcontract = new web3.eth.Contract(blackabi, contracts.black.address);
        const lpstakecontract = new web3.eth.Contract(lpstake, contracts.lpstake.address);
        const lptokencontract = new web3.eth.Contract(cbusdbusdpair, contracts.cbusdbusdpair.address);
        const blackstakecontract = new web3.eth.Contract(blackstake, contracts.blackstake.address);
        const wbnbcontract = new web3.eth.Contract(wbnbAbi, contracts.wbnb.address);

        const accounts =  await web3.eth.getAccounts();
        setbalan(await cbusdcontract.methods.balanceOf(contracts.carbonstake.address).call());       
        setBalanceblack(await blackcontract.methods.balanceOf(contracts.blackstake.address).call());       
        console.log("balanblack",balanceblack);
        setBalancepair(await lptokencontract.methods.balanceOf(contracts.lpstake.address).call());       
        console.log("balancepair",balancepair);
        
        
        var tokenPerBlock = 128.600823045;
        var BLOCKS_PER_YEAR =10512000;
                            
        const blackdailyreward =1000000/90 ;
        console.log("dailyreward",blackdailyreward);
        setBlackDailyreward(blackdailyreward);
    
       const priceofbusd= await busdcontract.methods.balanceOf(contracts.cbusdbusdpair.address).call();
       const priceofcbusd= await cbusdcontract.methods.balanceOf(contracts.cbusdbusdpair.address).call();
       const carbonprice1= (priceofbusd)/(priceofcbusd);
       const carbonprice=(parseFloat(carbonprice1).toFixed(3));
        setCarbonprice(carbonprice);
        console.log("carbonprice",carbonprice)

        const priceofwbnb= await wbnbcontract.methods.balanceOf(contracts.blackBnbLp.address).call();
        console.log("import working",priceofwbnb);
        const priceofblack= await blackcontract.methods.balanceOf(contracts.blackBnbLp.address).call();
        
        const blackprice1= (priceofwbnb)/(priceofblack);
        const blackprices=(parseFloat(blackprice1/1000000000).toFixed(5));

        // const blackprice1=await  blackoracle.methods.getDittoBnbRate().call();       
        // const blackprices=(parseFloat((blackprice1[3])/1000000000000000000).toFixed(13)); 
        setBlackprice(blackprices)      
        console.log("blackprice3",blackprice);
        //var price=1.157407407 *blackprice *BLOCKS_PER_YEAR;
        //console.log("pricenew",price);
        setcommunitybalan(await blackcontract.methods.balanceOf(contracts.sentinel.address).call());
        const totalRewardPricePerYearcarbon = (blackprice) * (tokenPerBlock)*(BLOCKS_PER_YEAR);
        const totalStakingTokenInPoolcarbon = (carbonprice)*((balance)/1000000000000000000);
        console.log("carbon balance",balance);
        setAprcarbon(((totalRewardPricePerYearcarbon)/(totalStakingTokenInPoolcarbon))*(100));
        console.log("aprvaluecarbon",aprcarbon);
        const totalRewardPricePerYearblack = (blackprice) * (tokenPerBlock)*(BLOCKS_PER_YEAR);
        const  totalStakingTokenInPoolblack = (blackprice)*((balanceblack)/1000000000);
        setAprblack(((totalRewardPricePerYearblack)/(totalStakingTokenInPoolblack))*(100));
        console.log("aprvalue",aprblack);
        
        const totalRewardPricePerYearlp = (blackprice) * (tokenPerBlock)*(BLOCKS_PER_YEAR);
        console.log("totalRewardPricePerYearlp",totalRewardPricePerYearlp)
        const totalStakingTokenInPoollp = (carbonprice)*((balancepair)/1000000000000000000); 
        console.log("totalStakingTokenInPoollp",carbonprice)
        const aprlp = ((totalRewardPricePerYearlp)/(totalStakingTokenInPoollp))*(100);     
        setAprlp(aprlp);
        console.log("aprvaluelp",((totalRewardPricePerYearlp)/(totalStakingTokenInPoollp))*(100));
        var  currentdate=(new Date().getTime())/1000;
        var enddatediff =1632491910-currentdate;
        if(enddatediff>0){
            setStakeendDate(1);

        }
        else{
            setStakeendDate(0);
            console.log("enddate",stakeenddate);
        }
        setCarbonStaked(await carbonstakecontract.methods.userInfo(accounts[0]).call());
        setLpStaked(await lpstakecontract.methods.userInfo(accounts[0]).call());
        setBlackStaked(await blackstakecontract.methods.userInfo(accounts[0]).call());
    }
     }
     useEffect(()=>{bvb()},[balance,balanceblack,carbonprice,blackprice,stakeenddate,carbonstaked])
  
    let history=useHistory();
    return (
        <Row className="m-3 m-md-5">
            {stakeenddate===1 ? (
                <>
                          <Col xl="4" md="6" className="mb-4">

<Card className="custom-card mt-2 mb-2 ml-0 mr-0 p-2">
    <div className="d-flex" style={{ padding: "12px" }}>
        <img
            className="pool-card-image"
            src={icon}
            alt="Card image cap"
        />
        {/* <small className="text-site-primary font-weight-semi-bold text-uppercase">bond staked</small> */}
        <div
            className=" pl-2 pr-2 align-item-center"
            style={{
                marginRight: "10px",
                marginTop: "auto",
                marginBottom: "auto",
            }}
        >
            <p style={{ fontWeight: "600", margin: "auto" }}>
                cbUSD
            </p>
        </div>
    </div>
    <div style={{ padding: "12px" }}>
        <PoolCardTabs />
    </div>
    <div className="d-flex pl-3 pr-3 mt-2 mb-2">
        <div
            style={{
                marginRight: "auto",
                marginTop: "auto",
                marginBottom: "auto",
            }}
        >
            <p
                style={{ fontWeight: "600", fontSize: "12px" }}
                className="text-muted"
            >
                APR
            </p>
        </div>
        {/* <small className="text-site-primary font-weight-semi-bold text-uppercase">bond staked</small> */}
        <div style={{ marginLeft: "auto" }}>
            <p>
                <img
                    left
                    width="15px"
                    style={{
                        marginTop: "auto",
                        marginBottom: "auto",
                        marginLeft: "10px",
                        marginRight: "10px",
                    }}
                    //   style={{ marginButtom: "auto" }}
                    src={icon}
                    alt="Card image cap"
                />
                <b>{parseFloat(aprcarbon).toFixed(5)}%</b>
            </p>
        </div>
    </div>
    <div className="d-flex  pl-3 pr-3 mt-2 mb-2">
        <div
            style={{
                marginRight: "auto",
                marginTop: "auto",
                marginBottom: "auto",
            }}
        >
            <p
                style={{ fontWeight: "600", fontSize: "12px" }}
                className="text-muted"
            >
                BLACK daily rewards
            </p>
        </div>
        {/* <small className="text-site-primary font-weight-semi-bold text-uppercase">bond staked</small> */}
        <div style={{ marginLeft: "auto" }}>
            <p style={{ fontWeight: "600", textAlign: "center" }}>
                <img
                    left
                    width="15px"
                    //   style={{ marginTop:'auto' , marginBottom:'auto',marginLeft:'10px',marginRight:'10px' }}
                    //   style={{ marginButtom: "auto" }}
                    src={"https://blackcollateral.com/wp-content/uploads//2021/05/logo-svg.svg"}
                    alt="Card image cap"
                />
               {parseFloat(blackdailyreward).toFixed(5)}
               
            </p>
        </div>
    </div>
    <div className="d-flex  pl-3 pr-3 mt-2 mb-2">
        <div
            style={{
                marginRight: "auto",
                marginTop: "auto",
                marginBottom: "auto",
            }}
        >
            <p
                style={{ fontWeight: "600", fontSize: "12px" }}
                className="text-muted"
            >
                BLACK rewards left
            </p>
        </div>
        {/* <small className="text-site-primary font-weight-semi-bold text-uppercase">bond staked</small> */}
        <div style={{ marginLeft: "auto" }}>
            <p style={{ fontWeight: "600", textAlign: "center" }}>
                <img
                    left
                    width="15px"
                    //   style={{ marginTop:'auto' , marginBottom:'auto',marginLeft:'10px',marginRight:'10px' }}
                    //   style={{ marginButtom: "auto" }}
                    src={"https://blackcollateral.com/wp-content/uploads//2021/05/logo-svg.svg"}
                    alt="Card image cap"
                />
                 {parseFloat(communitybalance/1000000000).toFixed(3)}
            </p>
        </div>
    </div>
    <div className="d-flex  pl-3 pr-3 mt-2 mb-2">
        <div
            style={{
                marginRight: "auto",
                marginTop: "auto",
                marginBottom: "auto",
            }}
        >
            <p
                style={{ fontWeight: "600", fontSize: "12px" }}
                className="text-muted"
            >
                Pool balance
            </p>
        </div>
        {/* <small className="text-site-primary font-weight-semi-bold text-uppercase">bond staked</small> */}
        <div style={{ marginLeft: "auto" }}>
            <p style={{ fontWeight: "600", textAlign: "center" }}>
                <img
                    left
                    width="15px"
                    //   style={{ marginTop:'auto' , marginBottom:'auto',marginLeft:'10px',marginRight:'10px' }}
                    //   style={{ marginButtom: "auto" }}
                    src={icon}
                    alt="Card image cap"
                />
               {parseFloat(balance/1000000000000000000).toFixed(3)}
            </p>
        </div>
    </div>
       
    <Button  className={`ml-3 mr-3 pb-0 mb-0 mt-2 mb-2
        `} color="site-primary" width="full" onClick={e => {history.push("/carbon-stake")}}><b>View pool</b></Button> 
</Card>
</Col>
                
                </>
            ):(
             <>
                      <Col xl="4" md="6" className="mb-4">
            <Card className="custom-card mt-2 mb-2 ml-0 mr-0 p-2">
                <div className="d-flex" style={{ padding: "12px" }}>
                    <img
                        className="pool-card-image"
                        src={icon}
                        alt="Card image cap"
                    />
                    {/* <small className="text-site-primary font-weight-semi-bold text-uppercase">bond staked</small> */}
                    <div
                        className=" pl-2 pr-2 align-item-center"
                        style={{
                            marginRight: "10px",
                            marginTop: "auto",
                            marginBottom: "auto",
                        }}
                    >
                        <p style={{ fontWeight: "600", margin: "auto" }}>
                            cbUSD
                        </p>
                        <p className="text-danger mb-0 font-weight-bold" style={{ fontSize: '12px' }}>Epoch 25 / 25</p>
                    </div>
                    <div className="ml-auto mt-auto mb-auto"
                        style={{
                            backgroundColor: "#f8f8f9",
                            borderRadius: "20px",
                            fontWeight: "600",
                            fontSize: "14px",
                        }}><p className="font-weight-bold text-muted pt-1 pb-1 pl-3 pr-3 mb-0">ENDED</p></div>
                </div>
                <div style={{ padding: "12px" }}>
                    <PoolCardTabs />
                </div>
                <div
                    className="d-flex align-items-center m-3 p-3 "
                    style={{
                        backgroundColor: "#f8f8f9",
                        borderRadius: "5px",
                        border: "1px solid rgba(6, 10, 13, 0.1) ",
                        color: "#4f6ae6",
                        fontWeight: "600",
                        fontSize: "14px",
                    }}
                >
                    <p className="m-0 text-muted">
                        The cbUSD staking pool ended.  Deposits are now disabled but you can still withdraw your tokens and collect any unclaimed rewards.
                    </p>
                </div>
                <div className="d-flex  pl-3 pr-3 mt-2 mb-2">
                    <div
                        style={{
                            marginRight: "auto",
                            marginTop: "auto",
                            marginBottom: "auto",
                        }}
                    >
                        <p
                            style={{ fontWeight: "600", fontSize: "12px" }}
                            className="text-muted"
                        >
                            Your balance
                        </p>
                    </div>
                    {/* <small className="text-site-primary font-weight-semi-bold text-uppercase">bond staked</small> */}
                    <div style={{ marginLeft: "auto" }}>
                        <p style={{ fontWeight: "600", textAlign: "center" }}>
                        {((BigNumber((carbonstaked[0]/1000000000000000000)).decimalPlaces(3,1))).toNumber()}
                        </p>
                    </div>
                </div>
                <Button className={`ml-3 mr-3 pb-0 mb-0 mt-2 mb-2`}
                    color="site-primary" width="full"  onClick={e => {history.push("/carbon-stake")}}><b>View pool</b></Button>
            </Card>
        </Col>
        
             </>
            ) }
  
           {stakeenddate===1 ? (
              <>
                   <Col xl="4" md="6" className="mb-4">
                <Card className="custom-card mt-2 mb-2 ml-0 mr-0 p-2">
                    <div className="d-flex" style={{ padding: "12px" }}>
                        <img
                            className="pool-card-image"
                            src={icon1}
                            alt="Card image cap"
                        />
                        {/* <small className="text-site-primary font-weight-semi-bold text-uppercase">bond staked</small> */}
                        <div
                            className=" pl-2 pr-2 align-item-center"
                            style={{
                                marginRight: "10px",
                                marginTop: "auto",
                                marginBottom: "auto",
                            }}
                        >
                            <p style={{ fontWeight: "600", margin: "auto" }}>
                                cbUSD/BUSD
                            </p>
                        </div>
                    </div>
                    <div style={{ padding: "12px" }}>
                        <PoolCardTabs />
                    </div>
                    <div className="d-flex pl-3 pr-3 mt-2 mb-2">
                        <div
                            style={{
                                marginRight: "auto",
                                marginTop: "auto",
                                marginBottom: "auto",
                            }}
                        >
                            <p
                                style={{ fontWeight: "600", fontSize: "12px" }}
                                className="text-muted"
                            >
                                APR
                            </p>
                        </div>
                        {/* <small className="text-site-primary font-weight-semi-bold text-uppercase">bond staked</small> */}
                        <div style={{ marginLeft: "auto" }}>
                            <p>
                                <img
                                    left
                                    width="15px"
                                    style={{
                                        marginTop: "auto",
                                        marginBottom: "auto",
                                        marginLeft: "10px",
                                        marginRight: "10px",
                                    }}
                                    //   style={{ marginButtom: "auto" }}
                                    src={icon}
                                    alt="Card image cap"
                                />
                                <b>{parseFloat(aprlp).toFixed(5)}%</b>
                            </p>
                        </div>
                    </div>
                    <div className="d-flex  pl-3 pr-3 mt-2 mb-2">
                        <div
                            style={{
                                marginRight: "auto",
                                marginTop: "auto",
                                marginBottom: "auto",
                            }}
                        >
                            <p
                                style={{ fontWeight: "600", fontSize: "12px" }}
                                className="text-muted"
                            >
                                BLACK daily rewards
                            </p>
                        </div>
                        {/* <small className="text-site-primary font-weight-semi-bold text-uppercase">bond staked</small> */}
                        <div style={{ marginLeft: "auto" }}>
                            <p style={{ fontWeight: "600", textAlign: "center" }}>
                                <img
                                    left
                                    width="15px"
                                    //   style={{ marginTop:'auto' , marginBottom:'auto',marginLeft:'10px',marginRight:'10px' }}
                                    //   style={{ marginButtom: "auto" }}
                                    src={"https://blackcollateral.com/wp-content/uploads//2021/05/logo-svg.svg"}
                                    alt="Card image cap"
                                />
                                {parseFloat(blackdailyreward).toFixed(5)}
                            </p>
                        </div>
                    </div>
                    <div className="d-flex  pl-3 pr-3 mt-2 mb-2">
                        <div
                            style={{
                                marginRight: "auto",
                                marginTop: "auto",
                                marginBottom: "auto",
                            }}
                        >
                            <p
                                style={{ fontWeight: "600", fontSize: "12px" }}
                                className="text-muted"
                            >
                                BLACK rewards left
                            </p>
                        </div>
                        {/* <small className="text-site-primary font-weight-semi-bold text-uppercase">bond staked</small> */}
                        <div style={{ marginLeft: "auto" }}>
                            <p style={{ fontWeight: "600", textAlign: "center" }}>
                                <img
                                    left
                                    width="15px"
                                    //   style={{ marginTop:'auto' , marginBottom:'auto',marginLeft:'10px',marginRight:'10px' }}
                                    //   style={{ marginButtom: "auto" }}
                                    src={"https://blackcollateral.com/wp-content/uploads//2021/05/logo-svg.svg"}
                                    alt="Card image cap"
                                />
                                 {parseFloat(communitybalance/1000000000).toFixed(3)}
                            </p>
                        </div>
                    </div>
                    <div className="d-flex  pl-3 pr-3 mt-2 mb-2">
                        <div
                            style={{
                                marginRight: "auto",
                                marginTop: "auto",
                                marginBottom: "auto",
                            }}
                        >
                            <p
                                style={{ fontWeight: "600", fontSize: "12px" }}
                                className="text-muted"
                            >
                                Pool balance
                            </p>
                        </div>
                        {/* <small className="text-site-primary font-weight-semi-bold text-uppercase">bond staked</small> */}
                        <div style={{ marginLeft: "auto" }}>
                            <p style={{ fontWeight: "600", textAlign: "center" }}>
                                <img
                                    left
                                    width="15px"
                                    //   style={{ marginTop:'auto' , marginBottom:'auto',marginLeft:'10px',marginRight:'10px' }}
                                    //   style={{ marginButtom: "auto" }}
                                    src={icon1}
                                    alt="Card image cap"
                                />
                               {parseFloat(balancepair/1000000000000000000).toFixed(3)}
                            </p>
                        </div>
                    </div>
                       
                    <Button  className={`ml-3 mr-3 pb-0 mb-0 mt-2 mb-2
                        `} color="site-primary" width="full" onClick={e => {history.push("/lp-stake")}}><b>View pool</b></Button> 
                </Card>
            </Col>
              </>
           ):(
               <>
               
            <Col xl="4" md="6" className="mb-4">
            <Card className="custom-card mt-2 mb-2 ml-0 mr-0 p-2">
                <div className="d-flex" style={{ padding: "12px" }}>
                    <img
                        className="pool-card-image"
                        src={icon1}
                        alt="Card image cap"
                    />
                    {/* <small className="text-site-primary font-weight-semi-bold text-uppercase">bond staked</small> */}
                    <div
                        className=" pl-2 pr-2 align-item-center"
                        style={{
                            marginRight: "10px",
                            marginTop: "auto",
                            marginBottom: "auto",
                        }}
                    >
                        <p style={{ fontWeight: "600", margin: "auto" }}>
                            cbUSD/BUSD
                        </p>
                        <p className="text-danger mb-0 font-weight-bold" style={{ fontSize: '12px' }}>Epoch 25 / 25</p>
                    </div>
                    <div className="ml-auto mt-auto mb-auto"
                        style={{
                            backgroundColor: "#f8f8f9",
                            borderRadius: "20px",
                            fontWeight: "600",
                            fontSize: "14px",
                        }}><p className="font-weight-bold text-muted pt-1 pb-1 pl-3 pr-3 mb-0">ENDED</p></div>
                </div>
                <div style={{ padding: "12px" }}>
                    <PoolCardTabs />
                </div>
                <div
                    className="d-flex align-items-center m-3 p-3 "
                    style={{
                        backgroundColor: "#f8f8f9",
                        borderRadius: "5px",
                        border: "1px solid rgba(6, 10, 13, 0.1) ",
                        color: "#4f6ae6",
                        fontWeight: "600",
                        fontSize: "14px",
                    }}
                >
                    <p className="m-0 text-muted">
                        The cbUSD/BUSD staking pool ended.  Deposits are now disabled but you can still withdraw your tokens and collect any unclaimed rewards.
                    </p>
                </div>
                <div className="d-flex  pl-3 pr-3 mt-2 mb-2">
                    <div
                        style={{
                            marginRight: "auto",
                            marginTop: "auto",
                            marginBottom: "auto",
                        }}
                    >
                        <p
                            style={{ fontWeight: "600", fontSize: "12px" }}
                            className="text-muted"
                        >
                            Your balance
                        </p>
                    </div>
                    {/* <small className="text-site-primary font-weight-semi-bold text-uppercase">bond staked</small> */}
                    <div style={{ marginLeft: "auto" }}>
                        <p style={{ fontWeight: "600", textAlign: "center" }}>
                        {((BigNumber((lpstaked[0]/1000000000000000000)).decimalPlaces(3,1))).toNumber()}
                        </p>
                    </div>
                </div>
                <Button className={`ml-3 mr-3 pb-0 mb-0 mt-2 mb-2`}
                    color="site-primary" width="full"  onClick={e => {history.push("/lp-stake")}}><b>View pool</b></Button>
            </Card>
        </Col>
        </>
           )}
           {stakeenddate===1 ? (
                <>
  <Col xl="4" md="6" className="mb-4">
                <Card className="custom-card mt-2 mb-2 ml-0 mr-0 p-2">
                    <div className="d-flex" style={{ padding: "12px" }}>
                        <img
                            className="pool-card-image"
                            src={"https://blackcollateral.com/wp-content/uploads//2021/05/logo-svg.svg"}
                            alt="Card image cap"
                        />
                        {/* <small className="text-site-primary font-weight-semi-bold text-uppercase">bond staked</small> */}
                        <div
                            className=" pl-2 pr-2 align-item-center"
                            style={{
                                marginRight: "10px",
                                marginTop: "auto",
                                marginBottom: "auto",
                            }}
                        >
                            <p style={{ fontWeight: "600", margin: "auto" }}>
                                Black
                            </p>
                        </div>
                    </div>
                    <div style={{ padding: "12px" }}>
                        <PoolCardTabs />
                    </div>
                    <div className="d-flex pl-3 pr-3 mt-2 mb-2">
                        <div
                            style={{
                                marginRight: "auto",
                                marginTop: "auto",
                                marginBottom: "auto",
                            }}
                        >
                            <p
                                style={{ fontWeight: "600", fontSize: "12px" }}
                                className="text-muted"
                            >
                                APR
                            </p>
                        </div>
                        {/* <small className="text-site-primary font-weight-semi-bold text-uppercase">bond staked</small> */}
                        <div style={{ marginLeft: "auto" }}>
                            <p>
                                <img
                                    left
                                    width="15px"
                                    style={{
                                        marginTop: "auto",
                                        marginBottom: "auto",
                                        marginLeft: "10px",
                                        marginRight: "10px",
                                    }}
                                    //   style={{ marginButtom: "auto" }}
                                    src={"https://blackcollateral.com/wp-content/uploads//2021/05/logo-svg.svg"}
                                    alt="Card image cap"
                                />
                                <b>{parseFloat(aprblack).toFixed(9)} %</b>
                            </p>
                        </div>
                    </div>
                    <div className="d-flex  pl-3 pr-3 mt-2 mb-2">
                        <div
                            style={{
                                marginRight: "auto",
                                marginTop: "auto",
                                marginBottom: "auto",
                            }}
                        >
                            <p
                                style={{ fontWeight: "600", fontSize: "12px" }}
                                className="text-muted"
                            >
                                BLACK daily rewards
                            </p>
                        </div>
                        {/* <small className="text-site-primary font-weight-semi-bold text-uppercase">bond staked</small> */}
                        <div style={{ marginLeft: "auto" }}>
                            <p style={{ fontWeight: "600", textAlign: "center" }}>
                                <img
                                    left
                                    width="15px"
                                    //   style={{ marginTop:'auto' , marginBottom:'auto',marginLeft:'10px',marginRight:'10px' }}
                                    //   style={{ marginButtom: "auto" }}
                                    src={"https://blackcollateral.com/wp-content/uploads//2021/05/logo-svg.svg"}
                                    alt="Card image cap"
                                />
                                  {parseFloat(blackdailyreward).toFixed(5)}
                               
                            </p>
                        </div>
                    </div>
                    <div className="d-flex  pl-3 pr-3 mt-2 mb-2">
                        <div
                            style={{
                                marginRight: "auto",
                                marginTop: "auto",
                                marginBottom: "auto",
                            }}
                        >
                            <p
                                style={{ fontWeight: "600", fontSize: "12px" }}
                                className="text-muted"
                            >
                                BLACK rewards left
                            </p>
                        </div>
                        {/* <small className="text-site-primary font-weight-semi-bold text-uppercase">bond staked</small> */}
                        <div style={{ marginLeft: "auto" }}>
                            <p style={{ fontWeight: "600", textAlign: "center" }}>
                                <img
                                    left
                                    width="15px"
                                    //   style={{ marginTop:'auto' , marginBottom:'auto',marginLeft:'10px',marginRight:'10px' }}
                                    //   style={{ marginButtom: "auto" }}
                                    src={"https://blackcollateral.com/wp-content/uploads//2021/05/logo-svg.svg"}
                                    alt="Card image cap"
                                />
                                 {parseFloat(communitybalance/1000000000).toFixed(3)}
                            </p>
                        </div>
                    </div>
                    <div className="d-flex  pl-3 pr-3 mt-2 mb-2">
                        <div
                            style={{
                                marginRight: "auto",
                                marginTop: "auto",
                                marginBottom: "auto",
                            }}
                        >
                            <p
                                style={{ fontWeight: "600", fontSize: "12px" }}
                                className="text-muted"
                            >
                                Pool balance
                            </p>
                        </div>
                        {/* <small className="text-site-primary font-weight-semi-bold text-uppercase">bond staked</small> */}
                        <div style={{ marginLeft: "auto" }}>
                            <p style={{ fontWeight: "600", textAlign: "center" }}>
                                <img
                                    left
                                    width="15px"
                                    //   style={{ marginTop:'auto' , marginBottom:'auto',marginLeft:'10px',marginRight:'10px' }}
                                    //   style={{ marginButtom: "auto" }}
                                    src={"https://blackcollateral.com/wp-content/uploads//2021/05/logo-svg.svg"}
                                    alt="Card image cap"
                                />
                               {parseFloat(balanceblack/1000000000).toFixed(3)}
                            </p>
                        </div>
                    </div>
                       
                    <Button  className={`ml-3 mr-3 pb-0 mb-0 mt-2 mb-2
                        `} color="site-primary" width="full" onClick={e => {history.push("/black-stake")}}><b>View pool</b></Button> 
                </Card>
            </Col>
                </>
              ):(
              <>
                        <Col xl="4" md="6" className="mb-4">
                <Card className="custom-card mt-2 mb-2 ml-0 mr-0 p-2">
                    <div className="d-flex" style={{ padding: "12px" }}>
                        <img
                            className="pool-card-image"
                            src="https://blackcollateral.com/wp-content/uploads//2021/05/logo-svg.svg"
                            alt="Card image cap"
                        />
                        {/* <small className="text-site-primary font-weight-semi-bold text-uppercase">bond staked</small> */}
                        <div
                            className=" pl-2 pr-2 align-item-center"
                            style={{
                                marginRight: "10px",
                                marginTop: "auto",
                                marginBottom: "auto",
                            }}
                        >
                            <p style={{ fontWeight: "600", margin: "auto" }}>
                                BLACK
                            </p>
                            <p className="text-danger mb-0 font-weight-bold" style={{ fontSize: '12px' }}>Epoch 25 / 25</p>
                        </div>
                        <div className="ml-auto mt-auto mb-auto"
                            style={{
                                backgroundColor: "#f8f8f9",
                                borderRadius: "20px",
                                fontWeight: "600",
                                fontSize: "14px",
                            }}><p className="font-weight-bold text-muted pt-1 pb-1 pl-3 pr-3 mb-0">ENDED</p></div>
                    </div>
                    <div style={{ padding: "12px" }}>
                        <PoolCardTabs />
                    </div>
                    <div
                        className="d-flex align-items-center m-3 p-3 "
                        style={{
                            backgroundColor: "#f8f8f9",
                            borderRadius: "5px",
                            border: "1px solid rgba(6, 10, 13, 0.1) ",
                            color: "#4f6ae6",
                            fontWeight: "600",
                            fontSize: "14px",
                        }}
                    >
                        <p className="m-0 text-muted">
                            The BLACK staking pool ended.  Deposits are now disabled but you can still withdraw your tokens and collect any unclaimed rewards.
                        </p>
                    </div>
                    <div className="d-flex  pl-3 pr-3 mt-2 mb-2">
                        <div
                            style={{
                                marginRight: "auto",
                                marginTop: "auto",
                                marginBottom: "auto",
                            }}
                        >
                            <p
                                style={{ fontWeight: "600", fontSize: "12px" }}
                                className="text-muted"
                            >
                                Your balance
                            </p>
                        </div>
                        {/* <small className="text-site-primary font-weight-semi-bold text-uppercase">bond staked</small> */}
                        <div style={{ marginLeft: "auto" }}>
                            <p style={{ fontWeight: "600", textAlign: "center" }}>
                            {((BigNumber((blackstaked[0]/1000000000)).decimalPlaces(3,1))).toNumber()}
                            </p>
                        </div>
                    </div>
                    <Button className={`ml-3 mr-3 pb-0 mb-0 mt-2 mb-2`}
                        color="site-primary" width="full" onClick={e => {history.push("/black-stake")}}><b>View pool</b></Button>
                </Card>
            </Col>
              </>
              )}    
  

        </Row>
    );
}

export default Pools;