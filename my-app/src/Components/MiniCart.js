import React, { PureComponent } from "react";
import { Link } from "react-router-dom";






export default class MiniCart extends PureComponent{

    addItemCount(e,number){
        const objectId = e.target.parentNode.id
        this.props.setItemCount(number,objectId)
    }

    calculateTotal(){
        const pricesArray = this.props.cartItems.map((item) =>{
            const currFilter = item.itemObject.prices.filter(item => item.currency.symbol == this.props.curr)
            return currFilter[0].amount * item.count
        })
        const totalMoney = pricesArray.length>0 ? pricesArray.reduce((prev,next) => prev + next) : 0
        return totalMoney
    }
    setOrder(orderArray){
        window.alert("Order Placed,View It In Console")
        const newArray = orderArray.map(item => {
            const newObject = {
                ...item,
                brand:item.itemObject.brand,
                name: item.itemObject.name
            }
            delete newObject.itemObject
            return newObject
        })
        console.log(newArray)
        this.props.clearCartItems()
    }


    componentDidUpdate(){
        this.props.setTotal(this.calculateTotal())
    }
    componentDidMount(){
        this.props.setTotal(this.calculateTotal())
    }
    render(){
        const elementsArray = this.props.cartItems.map((item,id) =>{
            // console.log(item)
            const attributes = item.itemObject.attributes.map((item2,id2) =>{
           
                const differenceElements = item2.items.map((item3,id3) => {
                    if(item2.type == "swatch"){
                        let style = {
                            backgroundColor:item3.value
                        }
                        try{
                            if(item[item2.name] == item3.displayValue){
                                style={
                                    ...style,
                                    border:"double #5ECE7B 2px",
                                    boxSizing: "initial"
                                }
                            }
                        }catch{
                            style={}
                        }
                        return <div className="difference-item-color" key={id3} style={style}><div style={{width:"100%",height:"100%",border:"white solid 1px"}}></div></div>
                    }else{
                        let style
                        try{
                            // console.log(item3.displayValue)
                            // console.log(item2.name)
                            // console.log(item)
                            // console.log("------")
                            if(item[item2.name] == item3.value){
                                style={
                                    ...style,
                                    backgroundColor:"#1D1F22",
                                    color:"#FFFFFF"
                                }
                            }
                        }catch{
                            style={}
                        }
                        return <div style={style} className="difference-item-size" key={id3}>{item3.value}</div>
                    }
                })
                return(
                    <div key={id2} id={id2}>
                        <h3 className="item-name">{item2.name}</h3>
                        <div className="item-attributes">
                            {differenceElements}
                        </div>
                    </div>
                )
            })
            // console.log(attributes)
            const currFilter = item.itemObject.prices.filter(item => item.currency.symbol == this.props.curr)
            const priceAmount = `${currFilter[0].currency.symbol}${currFilter[0].amount}`
            return(
                <div className="cart-item-div" key={id} id={id}>
                    <div className="item-cart-desc">
                        <h3 className="item-name">{item.itemObject.name}</h3>
                        <h3 className="item-price">{priceAmount}</h3>
                        {attributes}
                    </div>
                        <div className="mini-cart-number-div" id={id}>
                            <button className="mini-cart-button1" onClick={(e) => this.addItemCount(e,1)}>+</button>
                            <h3 className="item-price">{item.count}</h3>
                            <button className="mini-cart-button2" onClick={(e) => this.addItemCount(e,-1)}>-</button>
                        </div>
                    <img src={item.itemObject.gallery[0]} className="mini-cart-img" />
                </div>
            )
        })

        return(
            <div className="mini-cart-container" id="mini-cart">
                <h3 className="mini-cart-count">My Bag,<span className="mini-cart-count2">{this.props.itemsCounter} items</span></h3>
                <div className="mini-cart-elements-div">
                    {elementsArray}
                </div>
                <div className="mini-cart-options">
                    <div className="cart-total-money">
                        <h3 className="item-price">Total</h3>
                        <h3 className="item-price">{`${this.props.curr}${Math.round(this.props.total * 100) / 100}`}</h3>
                    </div>
                    <div className="cart-buttons-div">
                        <Link to="/cart" style={{textDecoration:"none"}}><div className="view-bag-button">VIEW BAG</div></Link>
                        <div className="view-bag-button green-button"  onClick={() => this.setOrder(this.props.cartItems)}>CHECK OUT</div>
                    </div>
                </div>
            </div>
        )
    }
}