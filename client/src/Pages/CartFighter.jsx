import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { useLoading } from "../features/loadingHooks";
import { cartApi } from "../config/axiosUtils";
import useAuth from "../services/useAuth";
import TermsConditionForCheckout from "../components/TermsConditionForCheckout";
import FighterDetailsForCart from "../components/FighterDetailsForCart";
import { toast } from "react-toastify";
import CartGoalDetails from "../components/CartGoalDetails";
import TotalPrice from "../components/TotalPrice";
import TopSection from "../components/TopSection";
import { setCart } from "../features/cartSlice";
import { useDispatch } from "react-redux";
const CartFighter = () => {
  const { globalLoading, startGloablLoading, stopGlobalLoading } = useLoading();
  const dispatch = useDispatch();
  const [refresh, setRefresh] = useState(false);
  const [cartData, setCartData] = useState({
    data: [],
    status: "",
    message: "",
  });
  const token = JSON.parse(useAuth()?.token);

  //function to get the cart item

  async function getCartItem() {
    startGloablLoading();
    try {
      const res = await cartApi.getCart(token);
      console.log(res);
      let cart = [];
      if (res.status === 200) {
        res?.data?.cart?.forEach((element) => {
          if (element?.cartItems?.length > 0) {
            element?.cartItems?.forEach((cartItem) => {
              cart.push(cartItem);
            });
          }
        });
        dispatch(
          setCart({
            cart: cart,
          })
        );
        // console.log("Number of cart", cart);
      }
      setCartData({
        data: res?.data?.cart,
        message: "Data Fetched successfully",
        status: "Success",
      });
      // console.log("This is response", res?.data?.cart);
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.response?.data?.error);
    } finally {
      stopGlobalLoading();
    }
  }

  const updateCart = async (_id, quantity, amount, message) => {
    // return;
    startGloablLoading();
    const data = {
      quantity: quantity,
      amount: amount,
      senderMessage: message,
    };

    try {
      const res = await cartApi.updateCart(token, _id, data);
      // console.log(res);
      if (res?.status === 200) {
        toast.success(res?.data?.message);
        setRefresh((val) => !val);
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.response?.data?.error);
    } finally {
      stopGlobalLoading();
    }
  };

  useEffect(() => {
    getCartItem();
  }, [refresh]);

  return (
    <main className="main-content">
      <TopSection title={"Cart"} />

      {cartData?.data?.length === 0 && cartData?.status === "Success" && (
        <div>
          <h3 className="text-center">You don't have any cart please add !</h3>
        </div>
      )}
      {cartData?.data?.map((cartItem) => (
        <div
          key={cartItem?.wisher?.fighterId}
          style={{
            textAlign: "unset",
          }}
        >
          <section className="fighter-cart-item">
            <FighterDetailsForCart wisher={cartItem?.wisher} />
            <div className="row justify-content-center">
              <div className="col-md-12 col-sm-12 col-xs-12 col-lg-12">
                <div className="cart-table">
                  <Table responsive className="cart-product-table">
                    <thead className="cart-product-head">
                      <tr>
                        <th className="text-left">Goals</th>
                        <th>Type/Qty</th>
                        <th>Amount</th>
                        <th>Message</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody className="cart-product-body">
                      {cartItem?.cartItems?.map((cart) => (
                        <CartGoalDetails
                          key={cart._id}
                          cart={cart}
                          updateCart={updateCart}
                          globalLoading={globalLoading}
                          setRefresh={setRefresh}
                        />
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>
          </section>
          <TotalPrice cartItem={cartItem} />
          <TermsConditionForCheckout
            id={cartItem?.wisher?.fighterId}
            token={token}
            setRefresh={setRefresh}
          />
        </div>
      ))}
    </main>
  );
};

export default CartFighter;
