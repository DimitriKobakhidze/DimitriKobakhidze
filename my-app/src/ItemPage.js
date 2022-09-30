import React, { PureComponent } from "react";
import { json } from "react-router-dom";
import MiniCart from "./Components/MiniCart";



export default class ItemPage extends PureComponent{
    state={
        mainPic:0,
        selectedItem:{itemObject:this.props.data,count:1}
    }

    swapPics(clickedId){
        this.setState(prev =>({
            mainPic:clickedId,
        }))
    }
    addInCart = () =>{
        const selectedObjProps = Object.keys(this.state.selectedItem)
        const recievedObjProps = Object.keys(this.props.data.attributes)
        //taking recieved object attributes list length to see how many attrs are there
        //also taking object that we get after user interactions with attributes on PDP
        // we know that final object will have 2 properties itemObject and Count
        // and rest of the properties will be selected attributes
        // if recieved object attributes list length equals interacted object properties legnth - 2
        // cause 2 of them are ItemObject and Count, this means user selected all attributes and should be able to add item in cart
        const attributesCompare = recievedObjProps.length - (selectedObjProps.length-2)
        if(this.props.data.inStock && attributesCompare ==0){
            this.props.setCartItemsPDP(this.state.selectedItem)
        }else if(attributesCompare !=0){
            window.alert("Please select all attribute values")
        }
        else{
            window.alert("Item out of stock")
        }
    }
    componentDidMount(){
        window.scrollTo(0,0)
    }
    render(){

        const attributes = this.props.data.attributes.map((item,id) =>{
           
            const differenceElements = item.items.map((item2,id2) => {
                if(item.type == "swatch"){
                    let style = {
                        backgroundColor:item2.value
                    }
                    try{
                        if(this.state.selectedItem[item.name] == item2.displayValue){
                            style={
                                ...style,
                                border:"double #5ECE7B 2px",
                                boxSizing: "initial"
                            }
                        }
                    }catch{
                        style={}
                    }
                    return <div className="difference-item-color bigger-colors" key={id2} style={style} onClick={() => this.setState(prev =>({selectedItem:{...prev.selectedItem,[item.name]:item2.displayValue}}))}><div style={{width:"100%",height:"100%",border:"white solid 1px"}}></div></div>
                }else{
                    let style
                    try{
                        if(this.state.selectedItem[item.name] == item2.value){
                            style={
                                ...style,
                                backgroundColor:"#1D1F22",
                                color:"#FFFFFF"
                            }
                        }
                    }catch{
                        style={}
                    }
                    return <div style={style} className="difference-item-size bigger-sizes" key={id2} onClick={() => this.setState(prev => ({selectedItem:{...prev.selectedItem,[item.name]:item2.value}}))}>{item2.value}</div>
                }
            })
            return(
                <div key={id} id={id}>
                    <h3 className="item-name bigger-name">{item.name}</h3>
                    <div className="item-attributes attr-onpage">
                        {differenceElements}
                    </div>
                </div>
            )
        })
        const pictureElements = this.props.data.gallery.map((item,id) =>{
            return(<img className="side-pic-item" src={item} onClick={e => this.swapPics(e.target.id)} key={id} id={id} />)
        })
        const currFilter = this.props.data.prices.filter(item => item.currency.symbol == this.props.curr)
        const priceAmount = `${currFilter[0].currency.symbol}${currFilter[0].amount}`
        
        
     
        return(
            <>
            <MiniCart
                cartItems ={this.props.cartItems} 
                curr = {this.props.curr}
                setTotal={this.props.setTotal}
                total = {this.props.total}
                setItemCount = {this.props.setItemCount}
                setAttributes={this.props.setAttributes}
                clearCartItems = {this.props.clearCartItems}
            />
            <div id="buffer"></div>
            <div className="selected-item-div">
                <div className="pics-div">
                    <div className="side-pics">
                        {pictureElements}
                    </div>
                    <div className="main-picture">
                        <img src={this.props.data.gallery[this.state.mainPic]} className="main-pic-onpage" />
                    </div>
                </div>
                <div className="desc-div">
                    <h3 className="selected-brand">{this.props.data.brand}</h3>
                    <h3 className="selected-name">{this.props.data.name}</h3>
                    <h3>{attributes}</h3>
                    <h3 className="price-onpage">PRICE</h3>
                    <h3 className="amount-onpage">{priceAmount}</h3>
                    <button className="add-onpage" onClick={this.addInCart}>ADD TO CART</button>
                    <h3 className="desc-onpage" dangerouslySetInnerHTML={{__html:this.props.data.description}}></h3>
                </div>
            </div>
            </>
        )
    }
}