import React, { useState, useEffect } from "react";
import Head from "../../../layout/head/Head";
import Content from "../../../layout/content/Content";
import {
  Block,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  BlockDes,
  BackTo,
  PreviewCard,
  CodeBlock,
  Button,

} from "../../../components/Component";
import { Input, Row, Col, Spinner } from "reactstrap";
import axios from "axios";
import { toast } from "react-toastify";

const Settings = () => {
  const [loading, setLoading] = useState(false);

  const [adminWallet, setAdminWallet] = useState({
    address: null,
    privateKey: null,
  });
  const [setting, setSetting] = useState({
    usdtPrice: 1,
    usdtPrice: 1,
    // payment
    usdt: false,
    bank: false,
    npay: false,
    neteller: false,
    skrill: false,
    sticpay: false,
  });
  const save = e => {
    if (loading) {
      return;
    }
    let regex = /^0x[a-fA-F0-9]{40}$/;
    if (adminWallet?.address.match(regex) === null) {
      toast.warn("Invalid BSC address entered!");
      return;
    }
    regex = /^[a-fA-F0-9]{64}$/;
    if (adminWallet?.privateKey.match(regex) === null) {
      toast.warn("Invalid BSC private key entered!");
      return;
    }
    setLoading(true);
    axios.post(`${process.env.REACT_APP_API_SERVER}/api/other/setting`, { setting, adminWallet })
    .then(res => {
        toast.success("Successfully updated!");
      setLoading(false);
    })
    .catch(err => {
      toast.success("Update failed!");
      setLoading(false);
    })
  
  }
  const onChangeRate = e => {
    setSetting({ ...setting, usdtPrice: e.target.value});
  }
  const onChangeAdminWalletAddress = e => {
    setAdminWallet({ ...adminWallet, address: e.target.value});
  }
  const onChangeAdminWalletPrivateKey = e => {
    setAdminWallet({ ...adminWallet, privateKey: e.target.value});
  }
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_SERVER}/api/other/setting`)
    .then(res => {
      let payments = {};
      for (let index = 0; index < res.data.paymentMethods.length; index++) {
        const element = res.data.paymentMethods[index];
        payments = { ...payments, [element["name"]]: element["status"]}
      } 
      console.log(payments)
      let usdtItem = res.data?.cryptoRates?.find(item => item.pair === "usdtPrice");
      setSetting({ usdtPrice: usdtItem.rate, ...payments });
      setAdminWallet({ address: res.data?.adminWallet?.address, privateKey: res.data?.adminWallet?.privateKey });
    })
    .catch(err => {

    })
  }, [])
  return (
    <React.Fragment>
      <Head title="Setting" />
      <Content page="component">
        <Block size="lg">
          <BlockHead>
            <BlockHeadContent>
              <BlockTitle tag="h5">Admin Wallet</BlockTitle>
              <p>
                You will gather all deposits to this wallet.
              </p>
            </BlockHeadContent>
          </BlockHead>
          <PreviewCard>
            <Row className="gy-4">
              <div className="input-group">
                <div className="p-1 col-md-3" >
                  Admin Wallet Address
                </div>
                <input type="text" className="form-control" value={adminWallet.address} onChange={e => onChangeAdminWalletAddress(e)} />
            </div>
            </Row>
            <Row className="gy-4">
              <div className="input-group">
                <div className="p-1 col-md-3" >
                  Admin Wallet PrivateKey
                </div>
                <div className="input-group-append">
                    <span className="input-group-text">0x</span>
                </div>
                <input type="text" className="form-control" value={adminWallet.privateKey} onChange={e => onChangeAdminWalletPrivateKey(e)} />
            </div>
            </Row>
          </PreviewCard>
        </Block>
        <Block size="lg">
          <PreviewCard>
            <Row className="gy-4">
                  <Button type="button"  color="primary" size="lg" className="btn-block" onClick={e => save(e)}>
                    {loading ? <Spinner size="sm" color="light" /> : "Save"}
                  </Button>
            </Row>
          </PreviewCard>
        </Block>

      </Content>
    </React.Fragment>
  );
};

export default Settings;
