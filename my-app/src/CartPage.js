import React, { PureComponent } from "react";
import MiniCart from "./Components/MiniCart";
import leftArrow from "./Images/swipeLeft.png"
import rightArrow from "./Images/swipeRight1.png"





export default class CartPage extends PureComponent{
    state = {
        galleryPicuters:this.props.cartItems.map(item => 0)
    }

 
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
        // console.log(this.state.galleryPicuters)
        const elementsArray = this.props.cartItems.map((item,id) =>{
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
                        return <div className="difference-item-color page-color" key={id3} style={style}><div style={{width:"100%",height:"100%",border:"white solid 1px"}}></div></div>
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
                        return <div style={style} className="difference-item-size page-size" key={id3} >{item3.value}</div>
                    }
                })
                return(
                    <div key={id2} id={id2}>
                        <h3 className="card-page-attrname">{item2.name}</h3>
                        <div className="item-attributes">
                            {differenceElements}
                        </div>
                    </div>
                )
            })
     
            const currFilter = item.itemObject.prices.filter(item => item.currency.symbol == this.props.curr)
            const priceAmount = `${currFilter[0].currency.symbol}${currFilter[0].amount}`
            return(
                <div className="cart-item-div" key={id} id={id}>
                    <div className="item-cart-desc">
                    <h3 className="cart-page-brand">{item.itemObject.brand}</h3>
                        <h3 className="cart-page-name">{item.itemObject.name}</h3>
                        <h3 className="card-page-price">{priceAmount}</h3>
                        {attributes}
                    </div>
                        <div style={{marginRight:"24px"}} className="mini-cart-number-div" id={id}>
                            <button className="mini-cart-button1 page-increment" onClick={(e) => this.addItemCount(e,1)}>+</button>
                            <h3 className="item-price page-count">{item.count}</h3>
                            <button className="mini-cart-button2 page-increment" onClick={(e) => this.addItemCount(e,-1)}>-</button>
                        </div>
                    <div style={{position:"relative",width:"fit-content"}} className="page-picture-div">
                        <img src={item.itemObject.gallery[this.state.galleryPicuters[id]]} className="page-img" />
                        {
                            item.itemObject.gallery.length > 1 &&
                            <>
                            <img 
                                src={leftArrow} 
                                style={{width:"24px",height:"24px",position:"absolute",right:"48px",bottom:"16px"}} 
                                onClick={() =>{
                                    if(this.state.galleryPicuters[id] - 1 >= 0){
                                        this.setState(prev =>{
                                            const copyArray = prev.galleryPicuters
                                            copyArray[id] = copyArray[id] - 1
                                            return({
                                                galleryPicuters: [...copyArray]
                                            })
                                        })
                                    }else{
                                        this.setState(prev =>{
                                            const copyArray = prev.galleryPicuters
                                            copyArray[id] = item.itemObject.gallery.length - 1
                                            return({
                                                galleryPicuters: [...copyArray]
                                            })
                                        })
                                    }
                                    // console.log(item.itemObject.gallery.length)
                                }}
                            />
                            <img 
                                src={rightArrow} 
                                style={{width:"24px",height:"24px",position:"absolute",right:"16px",bottom:"16px"}} 
                                onClick={() =>{
                                    if(this.state.galleryPicuters[id] + 1 < item.itemObject.gallery.length){
                                        this.setState(prev =>{
                                            const copyArray = prev.galleryPicuters
                                            copyArray[id] = copyArray[id] + 1
                                            return({
                                                galleryPicuters: [...copyArray]
                                            })
                                        })
                                    }else{
                                        this.setState(prev =>{
                                            const copyArray = prev.galleryPicuters
                                            copyArray[id] = 0
                                            return({
                                                galleryPicuters: [...copyArray]
                                            })
                                        })
                                    }
                                    // console.log(item.itemObject.gallery.length)
                                }}
                            />
                            </>
                    }
                    </div>
                </div>
            )
        })

        // const itemsCount = 0
        
 
        return(
            <>
                <MiniCart
                    cartItems ={this.props.cartItems} 
                    curr = {this.props.curr}
                    setTotal={this.props.setTotal}
                    total = {this.props.total}
                    setItemCount = {this.props.setItemCount}
                    setAttributes = {this.props.setAttributes}
                    clearCartItems = {this.props.clearCartItems}
                    getRef = {this.props.getRef}
                />
                <div id="buffer"></div>
                <div className="mini-cart-container page-cart" style={{display:"block",left:"0px",width:"100%",padding:"0px 101px"}} id="mini-cart">
                    <h3 className="cart-page-header">Cart</h3>
                    <div className="mini-cart-elements-div">
                        {elementsArray}
                    </div>
                    <div className="mini-cart-options">
                        <div className="cart-total-money" style={{width:"70%"}}>
                            <div className="option-names">
                                <h3 className="item-name-element">Tax 21%</h3>
                                <h3 className="item-name-element">Quantity</h3>
                                <h3 className="item-name-element">Total</h3>
                            </div>
                            <div className="option-values">
                                <h3 className="item-value-element">{`${this.props.curr}${Math.round(this.props.total * 0.21 *100) / 100}`}</h3>
                                <h3 className="item-value-element">{this.props.itemsCounter}</h3>
                                <h3 className="item-value-element">{`${this.props.curr}${Math.round(this.props.total * 100) / 100}`}</h3>
                            </div>
                        </div>
                        <div className="cart-buttons-div">
                            <div className="view-bag-button green-button page-order" onClick={() => this.setOrder(this.props.cartItems)}>ORDER</div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}