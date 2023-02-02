import React, { Suspense, useLayoutEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { ProductContextProvider } from "../pages/pre-built/products/ProductContext";
import { RedirectAs404 } from "../utils/Utils";
import KycListRegular from "../pages/pre-built/kyc-list-regular/KycListRegular";
import KycDetailsRegular from "../pages/pre-built/kyc-list-regular/kycDetailsRegular";
import ProductCard from "../pages/pre-built/products/ProductCard";
import ProductList from "../pages/pre-built/products/ProductList";
import ProductDetails from "../pages/pre-built/products/ProductDetails";
import Setting from "../pages/pre-built/setting/Settings";
import DepositReport from "../pages/pre-built/deposit/DepositReport";
import Wallet from "../pages/pre-built/wallet/Wallet";

const Pages = () => {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  });

  return (
    <Suspense fallback={<div />}>
      <Switch>
        <Route exact path={`${process.env.PUBLIC_URL}/kyc-list-regular`} component={KycListRegular}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/kyc-details-regular/:id`} component={KycDetailsRegular}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/product-list`} component={ProductList}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/setting`} component={Setting}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/deposit`} component={DepositReport}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/wallet`} component={Wallet}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/`} component={DepositReport}></Route>
        <Route component={RedirectAs404}></Route>
      </Switch>
    </Suspense>
  );
};
export default Pages;
