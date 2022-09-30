import React from "react";
import { PureComponent } from "react";
import { Routes,Route,Link, json } from "react-router-dom";
import "./index.css"
import ItemPage from "./ItemPage";
import CartPage from "./CartPage";
import Page from "./Components/Page";
import navDropDown from "./Images/vectorDown.png"
import cartIcon from "./Images/Vector.png"
import reloadIcon from "./Images/navReload.png"

const filter =`{
  category{
    name
    products{
      brand
      name
      inStock
      description
      inStock
      category
      gallery
      prices{
        amount
        currency{
          symbol
          label
        }
      }
      attributes{
        name
        type
        items{
          displayValue
          value
        }
      }
    }
  }
}`



export default class App extends PureComponent {
    state={
      categoriesList:[],
      currentCurr: "$",
      cartItems:JSON.parse(localStorage.getItem("cart-items")) || [],
      total:0,
      clickedItem: JSON.parse(localStorage.getItem("selected")),
      itemsCounter: 0,
      focusedPage:"all",
    }


    //calculate quantity 
    calculateItems(array){
      const itemsCountArray = array.map(item => item.count)
      const itemsCount = itemsCountArray.length >0 ?  itemsCountArray.reduce((prev,next) => prev +next) : 0
      this.setState({itemsCounter:itemsCount})
    }    

    currencyRef = React.createRef(null)
    changeCurr = () => {
      this.currencyRef.current.classList.toggle("display-block")
    }
    currencyClickOutside = (event) => {
      if (this.currencyRef && !this.currencyRef.current.contains(event.target)) {
        this.currencyRef.current.classList.remove("display-block")
      }
    }

    toggleMiniCart(){
      const cartElement = document.getElementById("mini-cart")
      cartElement.classList.toggle("display-block")
      const buffer = document.getElementById("buffer")
      buffer.classList.toggle("display-block")
    }

 

    setCartItems = (selectedItem) => {
      //item has no attributes here cause this function only used on quickadd
      const itemName = selectedItem.name
      const sameItem = this.state.cartItems.map((item,id) =>{
        if(item.itemObject.name == itemName){
          return true
        }
      })
      const sameItemIndex = sameItem.indexOf(true)
      try{
        const copyArray = this.state.cartItems
        const sameItem = this.state.cartItems[sameItemIndex]
        const addCount = {...sameItem,count:sameItem.count + 1}
        copyArray[sameItemIndex] = addCount
        this.setState(prev =>({
          cartItems:[...copyArray]
        }))
      }catch{
        this.setState(prev =>({
          cartItems:[...prev.cartItems,{itemObject:selectedItem,count:1}]
        }))
      }
    }

    clearCartItems = () =>{
      // console.log("CLEAR")
      this.setState({
        cartItems:[]
      })
    }

    setCartItemsPDP = (selectedItem) => {
      const copyArray= this.state.cartItems
      //checking if item with same attributes already exist
      const compareList = copyArray.map((item,id) =>{
        const objectProperties = Object.keys(item)
        //itemObject is object so it will always return false in comparing,changing it to item name
        //also need to remove count cuase by default it has 1, but same item might be more than 1 already in cart
        const indexCount = objectProperties.findIndex(item => item == "count")
        objectProperties.splice(indexCount,1)
        const trueOr = objectProperties.map(item2 =>{
          if(item2 == "itemObject"){
            if(item[item2].name == selectedItem[item2].name){
              return true
            }else{
              return false
            }
          }else{
            if(item[item2] == selectedItem[item2]){
              return true
            }else{
              return false
            }
          }
        })
        if(trueOr.every(bool => bool == true)){
          return true
        }else{
          return false
        }
    })
    // console.log(compareList)
    const same = compareList.map((item,id) => {
      if(item == true){
        return true
      }else{
        return false
      }
    })
    try{
      const indexOfSame = same.indexOf(true)
      const copyCartItems = this.state.cartItems
      copyCartItems[indexOfSame] = {...copyCartItems[indexOfSame],count:copyCartItems[indexOfSame].count + 1}
      this.setState(prev =>({
        cartItems:[...copyCartItems]
      }))
    }catch{
      this.setState(prev =>({
        cartItems:[...prev.cartItems,selectedItem]
      }))
    }
    
    }
   
    setTotal = (totalMoney) =>{
      this.setState({
        total:totalMoney
      })
    }

    //data for PDP
    setClickedItem = (clickedObject) =>{
      this.setState({
        clickedItem:clickedObject
      })
    }

    //ading item and its count value to state
    setItemCount = (number,id) =>{
      this.setState(prev =>{
        const copyArray = prev.cartItems

        //prevent error when there is no item in array
        try{
          if(copyArray[id].count + number == 0){
            copyArray.splice(id,1)
          }else{
            copyArray[id] = {...copyArray[id],count: copyArray[id].count + number > 0 ? copyArray[id].count + number : 0}
          }
        }catch{
          console.log("NO ITEMS")
        }
        return (
          {
            cartItems: [...copyArray]
          }
        )
      })
    }

    setAttributes = (attribute,id,value) =>{
      this.setState(prev =>{
        const copyArray = prev.cartItems
        copyArray[id] = {...copyArray[id],[attribute] : value}
        return(
          {
            cartItems:[...copyArray]
          }
        )
      })

    }
    
    componentDidMount(){
      document.addEventListener("mousedown",this.currencyClickOutside)
      fetch(`http://localhost:4000/`,{
            method:"POST",
            headers: { "Content-Type" : "application/json" },
            body: JSON.stringify({ query: filter })
        })
        .then(respone => respone.json())
        .then(data => {
            let categoryArray = []
            this.setState(prev =>(
              {
                [data.data.category.name]:data.data.category.products,
                categoriesList:[data.data.category.name]
              }
            ))
            data.data.category.products.map(item =>{
              if(categoryArray.indexOf(item.category) == -1){
                categoryArray.push(item.category)
              }
              this.setState(prev =>{
                if(prev[item.category]){
                return(
                    {
                      [item.category]: [...prev[item.category],item]
                    }
                  )
                }else{
                  return(
                    {
                      [item.category]: [item],
                      categoriesList:[...prev.categoriesList,item.category]
                    }
                  )
                }
              })
            })
         
        })
    }
    componentDidUpdate(prevProps,prevState){
      if(prevState.cartItems != this.state.cartItems){
        localStorage.setItem("cart-items",JSON.stringify(this.state.cartItems))
      }
      this.calculateItems(this.state.cartItems)    
    }
    render(){
      return(
        <>
          <nav className="main-nav">
            <ul>
              {this.state.categoriesList.map((item,id) =>{
                  const pathString = id == 0 ? "/" : item 
                  return(
                    <li key={id}>
                      <Link to={pathString} style={this.state.focusedPage == item ? {color:"#5ECE7B",borderBottom:"#5ECE7B 2px solid",fontWeight:"600"} : {}} onClick={() =>this.setState({focusedPage:item})} className="nav-link">{item}</Link>
                    </li>
                  )
                })
              }
            </ul>
            <img src={reloadIcon} />
            <div className="nav-icons-div">
                <h4 className="curr-shower">{this.state.currentCurr}</h4>
                <div className="change-curr-div">
                  <img src={navDropDown} className="change-curr"  onClick={this.changeCurr} />
                  <div className="currency-div" ref={this.currencyRef} id="curr">
                    <h4 
                      style={this.state.currentCurr == "$" ? {backgroundColor:"#EEEEEE"} : {}} 
                      onClick={() =>{
                        this.currencyRef.current.classList.remove("display-block")
                        this.setState({currentCurr:"$"})
                      }
                    }>$ USD</h4>
                    <h4
                      style={this.state.currentCurr == "£" ? {backgroundColor:"#EEEEEE"} : {}} 
                      onClick={() =>{
                        this.currencyRef.current.classList.remove("display-block")
                        this.setState({currentCurr:"£"})
                      }}>£ GBP</h4>
                    <h4
                      style={this.state.currentCurr == "¥" ? {backgroundColor:"#EEEEEE"} : {}} 
                      onClick={() =>{
                        this.currencyRef.current.classList.remove("display-block")
                        this.setState({currentCurr:"¥"})
                      }}>¥ JPY</h4>
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",position:"relative",cursor:"pointer"}} onClick={this.toggleMiniCart}>
                  <img src={cartIcon} className="cart-icon" /> 
                  <div className="card-item-counter-icon">{this.state.itemsCounter}</div>
                </div>
     
            </div>
          </nav>
             <Routes>
              {
                this.state.categoriesList.map((item,id) =>{
                  const pagePath = id == 0 ? "/" : item
                  return(
                    <Route 
                      key={id}
                      path={`${pagePath}`}
                      element={
                        <Page
                          pageName={this.state.categoriesList[id]}
                          data={this.state[item]} 
                          curr ={this.state.currentCurr} 
                          cartItems ={this.state.cartItems} 
                          setCartItems={this.setCartItems}
                          setTotal={this.setTotal}
                          total = {this.state.total}
                          setItemCount = {this.setItemCount}
                          setClickedItem = {this.setClickedItem}
                          itemsCounter = {this.state.itemsCounter}
                          setAttributes = {this.setAttributes}
                          clearCartItems = {this.clearCartItems}
                        />
                      }
                    />
                  )
               })
            }
              <Route 
                path="/item-page" 
                element={
                  <ItemPage
                    data = {this.state.clickedItem}
                    curr = {this.state.currentCurr}
                    cartItems ={this.state.cartItems} 
                    setTotal={this.setTotal}
                    total = {this.state.total}
                    setItemCount = {this.setItemCount}
                    setCartItems={this.setCartItems}
                    setAttributes={this.setAttributes}
                    setCartItemsPDP = {this.setCartItemsPDP}
                    clearCartItems = {this.clearCartItems}
                  />
                } 
              />
              <Route 
                path="/cart" 
                element={
                  <CartPage
                    cartItems ={this.state.cartItems} 
                    curr = {this.state.currentCurr}
                    setTotal={this.setTotal}
                    total = {this.state.total}
                    setItemCount = {this.setItemCount}
                    itemsCounter = {this.state.itemsCounter}
                    setAttributes={this.setAttributes}
                    clearCartItems={this.clearCartItems}

                  />
                } 
              />
            </Routes>
        </>
      )
    }
}