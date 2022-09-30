import React, { PureComponent } from "react"
import addToCart from "../Images/addToCart.png"
import MiniCart from "./MiniCart"
import { Link } from "react-router-dom";


export default class Page extends PureComponent{
    addToCart(e){
        const target = e.target
        //cart icon is inside item-div and they all have different ids that match their index in props array so we get whole object of item from props
        const itemId =  target.parentNode.id
        const targetObject = this.props.data[itemId]
        this.props.setCartItems(targetObject)
    }
    addClickedItem(itemObject){
        this.props.setClickedItem(itemObject)
        localStorage.setItem("selected",JSON.stringify(itemObject))
    }
    
    render(){
        const elementsArray = this.props.data.map((item,id) =>{
            const currFilter = item.prices.filter(item => item.currency.symbol == this.props.curr)
            const priceAmount = `${currFilter[0].currency.symbol}${currFilter[0].amount}`
            return(
                <div className="item-div" key={id} id={id}>
                    <Link to="/item-page" style={{position:"relative",marginBottom:"24px"}}  onClick={() => this.addClickedItem(item)}>
                        <img style={!item.inStock ? {opacity: "0.5"} : {}} src={item.gallery[0]} className="item-main-photo" />
                        {!item.inStock && <h3 className="out-of-stock">OUT OF STOCK</h3>}
                    </Link>
                    {item.inStock && 
                        <img 
                            src={addToCart} 
                            className="item-add-icon" 
                            onClick={e =>{
                                if(item.attributes.length == 0){
                                  this.addToCart(e)
                                }else{
                                    window.alert("Item has attributes,go to PDP and select before adding")
                                }
                            }}
                        />   
                    }
                    <h3 className="item-name">{item.name}</h3>
                    <h3 className="item-price">{priceAmount}</h3>
                </div>
            )
        })
        return(
            <>
                <MiniCart
                    cartItems ={this.props.cartItems} 
                    curr = {this.props.curr}
                    setTotal={this.props.setTotal}
                    total = {this.props.total}
                    setItemCount = {this.props.setItemCount}
                    itemsCounter = {this.props.itemsCounter}
                    setAttributes = {this.props.setAttributes}
                    clearCartItems = {this.props.clearCartItems}
                />
                <div id="buffer"></div>
                <h1 className="page-header">{this.props.data.length > 0 && this.props.pageName}</h1>
                <div className="items-div">
                    {elementsArray}
                </div>
            </>
        )
    }
}